// Data access layer with two modes:
//   postgis   - PostgreSQL + PostGIS (normal mode; geometry column queried via
//               geography casts so distances and radius filters work in metres)
//   fallback  - READ-ONLY, in-memory copy of the SAMPLE seed data queried with
//               the Haversine formula, used automatically when no database is
//               reachable. Clearly degraded: searches work, but ALL writes are
//               refused with 503 and admin login only works if a demo admin was
//               explicitly configured via SEED_ADMIN_EMAIL + SEED_ADMIN_PASSWORD.
const bcrypt = require('bcrypt');
const pool = require('./db');
const { nearbyFacilities } = require('./utils/nearby');
const seedData = require('../db/seed-data.json');

let mode = 'fallback';
// In-memory read-only store for fallback mode (deep copy; the seed file is never mutated).
let mem = null;

// Error helper: refused operation in degraded mode.
function degraded() {
  const err = new Error('Database unavailable: running in read-only SAMPLE demo mode. Changes are not saved.');
  err.status = 503;
  return err;
}

async function init() {
  try {
    await pool.query('SELECT 1');
    mode = 'postgis';
    console.log('[data] Connected to PostgreSQL - using PostGIS mode.');
  } catch (err) {
    mode = 'fallback';
    mem = {
      facilities: seedData.map((f, i) => ({
        id: i + 1, ...f, status: 'approved', verified: true, created_at: new Date().toISOString(),
      })),
      admins: [],
    };
    console.warn('[data] WARNING: no database reachable - running in READ-ONLY SAMPLE demo mode.');
    console.warn('[data] Searches work against the sample data; submissions and admin changes are refused (503).');
    // Demo admin exists ONLY when explicitly configured - there is no default password.
    if (process.env.SEED_ADMIN_EMAIL && process.env.SEED_ADMIN_PASSWORD) {
      mem.admins.push({
        id: 1,
        email: process.env.SEED_ADMIN_EMAIL,
        password_hash: bcrypt.hashSync(process.env.SEED_ADMIN_PASSWORD, 10),
      });
      console.warn(`[data] Demo admin enabled for ${process.env.SEED_ADMIN_EMAIL} (view-only; writes are refused in demo mode).`);
    } else {
      console.warn('[data] Admin login disabled in demo mode (SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD not set).');
    }
  }
  return mode;
}

function getMode() {
  return mode;
}

// Public: approved facilities near a point, ordered by distance, distance in km.
async function findNearby({ lat, lng, type, radiusKm }) {
  if (mode === 'fallback') {
    const approved = mem.facilities.filter((f) => f.status === 'approved');
    return nearbyFacilities(approved, { lat, lng, type, radiusKm }).map((f) => ({
      id: f.id, name: f.name, type: f.type, address: f.address, phone: f.phone,
      distance_km: Math.round(f.distanceKm * 100) / 100, verified: f.verified,
    }));
  }
  const radiusM = radiusKm * 1000;
  // The geom column is geometry; casts to geography give metre-accurate
  // ST_DWithin / ST_Distance, served by the functional GiST index.
  // $1=lng $2=lat $3=radius metres $4=type (optional). Parameterized throughout.
  const point = 'ST_SetSRID(ST_MakePoint($1, $2), 4326)';
  const sql = `
    SELECT id, name, type, address, phone, verified,
           ROUND((ST_Distance(geom::geography, ${point}::geography) / 1000)::numeric, 2) AS distance_km
    FROM facilities
    WHERE status = 'approved'
      AND ST_DWithin(geom::geography, ${point}::geography, $3)
      AND ($4::text IS NULL OR type = $4)
    ORDER BY geom::geography <-> ${point}::geography`;
  const { rows } = await pool.query(sql, [lng, lat, radiusM, type && type !== 'all' ? type : null]);
  return rows;
}

// Public: submit a new facility suggestion (status = pending).
async function createFacility({ name, type, address, phone, lat, lng }) {
  if (mode === 'fallback') throw degraded();
  const { rows } = await pool.query(
    `INSERT INTO facilities (name, type, address, phone, geom, status, verified)
     VALUES ($1, $2, $3, $4, ST_SetSRID(ST_MakePoint($5, $6), 4326), 'pending', false)
     RETURNING id, status`,
    [name, type, address, phone || null, lng, lat]
  );
  return rows[0];
}

// Admin: list facilities by status.
async function listByStatus(status) {
  if (mode === 'fallback') {
    if (status === 'approved') return mem.facilities.filter((f) => f.status === 'approved');
    return []; // pending/rejected lists need the database
  }
  const { rows } = await pool.query(
    `SELECT id, name, type, address, phone, status, verified,
            ST_Y(geom) AS lat, ST_X(geom) AS lng, created_at
     FROM facilities WHERE status = $1 ORDER BY created_at DESC`,
    [status]
  );
  return rows;
}

// Admin: approve -> status approved, verified true.
async function approveFacility(id) {
  if (mode === 'fallback') throw degraded();
  const { rows } = await pool.query(
    `UPDATE facilities SET status = 'approved', verified = true WHERE id = $1 RETURNING id, status, verified`,
    [id]
  );
  return rows[0] || null;
}

// Admin: reject -> status rejected.
async function rejectFacility(id) {
  if (mode === 'fallback') throw degraded();
  const { rows } = await pool.query(
    `UPDATE facilities SET status = 'rejected', verified = false WHERE id = $1 RETURNING id, status`,
    [id]
  );
  return rows[0] || null;
}

// Admin: edit facility details.
async function updateFacility(id, { name, type, address, phone, lat, lng }) {
  if (mode === 'fallback') throw degraded();
  const { rows } = await pool.query(
    `UPDATE facilities
     SET name = $2, type = $3, address = $4, phone = $5, geom = ST_SetSRID(ST_MakePoint($6, $7), 4326)
     WHERE id = $1
     RETURNING id, name, type, address, phone, status, verified`,
    [id, name, type, address, phone || null, lng, lat]
  );
  return rows[0] || null;
}

// Admin login: look up admin by email.
async function findAdminByEmail(email) {
  if (mode === 'fallback') {
    return mem.admins.find((a) => a.email === email) || null;
  }
  const { rows } = await pool.query('SELECT id, email, password_hash FROM admins WHERE email = $1', [email]);
  return rows[0] || null;
}

module.exports = {
  init, getMode, findNearby, createFacility,
  listByStatus, approveFacility, rejectFacility, updateFacility, findAdminByEmail,
};
