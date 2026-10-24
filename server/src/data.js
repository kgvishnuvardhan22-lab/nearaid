// Data access layer with two modes:
//   postgis   - PostgreSQL + PostGIS (normal mode; uses ST_DWithin and spatial ordering)
//   fallback  - in-memory copy of the SAMPLE seed data queried with the Haversine formula,
//               used automatically when no database is reachable (local demos, tests).
const bcrypt = require('bcrypt');
const pool = require('./db');
const { nearbyFacilities } = require('./utils/nearby');
const seedData = require('../db/seed-data.json');

let mode = 'fallback';
let mem = null;

async function init() {
  try {
    await pool.query('SELECT 1');
    mode = 'postgis';
    console.log('[data] Connected to PostgreSQL - using PostGIS mode.');
  } catch (err) {
    mode = 'fallback';
    mem = {
      nextId: seedData.length + 1,
      facilities: seedData.map((f, i) => ({
        id: i + 1, ...f, status: 'approved', verified: true, created_at: new Date().toISOString(),
      })),
      admins: [],
    };
    console.warn('[data] WARNING: no database reachable - running in in-memory SAMPLE demo mode.');
    const password = process.env.SEED_ADMIN_PASSWORD || 'sample-admin-password';
    const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
    mem.admins.push({ id: 1, email, password_hash: bcrypt.hashSync(password, 10) });
  }
  return mode;
}

function getMode() {
  return mode;
}

async function findNearby({ lat, lng, type, radiusKm }) {
  if (mode === 'fallback') {
    const approved = mem.facilities.filter((f) => f.status === 'approved');
    return nearbyFacilities(approved, { lat, lng, type, radiusKm }).map((f) => ({
      id: f.id, name: f.name, type: f.type, address: f.address, phone: f.phone,
      distance_km: Math.round(f.distanceKm * 100) / 100, verified: f.verified,
    }));
  }
  const radiusM = radiusKm * 1000;
  const sql = `
    SELECT id, name, type, address, phone, verified,
           ROUND((ST_Distance(geom, ST_MakePoint($1, $2)::geography) / 1000)::numeric, 2) AS distance_km
    FROM facilities
    WHERE status = 'approved'
      AND ST_DWithin(geom, ST_MakePoint($1, $2)::geography, $3)
      AND ($4::text IS NULL OR type = $4)
    ORDER BY geom <-> ST_MakePoint($1, $2)::geography`;
  const { rows } = await pool.query(sql, [lng, lat, radiusM, type && type !== 'all' ? type : null]);
  return rows;
}

async function createFacility({ name, type, address, phone, lat, lng }) {
  if (mode === 'fallback') {
    const row = { id: mem.nextId++, name, type, address, phone: phone || null, lat, lng, status: 'pending', verified: false, created_at: new Date().toISOString() };
    mem.facilities.push(row);
    return { id: row.id, status: 'pending' };
  }
  const { rows } = await pool.query(
    `INSERT INTO facilities (name, type, address, phone, geom, status, verified)
     VALUES ($1, $2, $3, $4, ST_MakePoint($5, $6)::geography, 'pending', false)
     RETURNING id, status`,
    [name, type, address, phone || null, lng, lat]
  );
  return rows[0];
}

async function listByStatus(status) {
  if (mode === 'fallback') {
    return mem.facilities.filter((f) => f.status === status);
  }
  const { rows } = await pool.query(
    `SELECT id, name, type, address, phone, status, verified,
            ST_Y(geom::geometry) AS lat, ST_X(geom::geometry) AS lng, created_at
     FROM facilities WHERE status = $1 ORDER BY created_at DESC`,
    [status]
  );
  return rows;
}

async function approveFacility(id) {
  if (mode === 'fallback') {
    const f = mem.facilities.find((x) => x.id === id);
    if (!f) return null;
    f.status = 'approved'; f.verified = true;
    return f;
  }
  const { rows } = await pool.query(
    `UPDATE facilities SET status = 'approved', verified = true WHERE id = $1 RETURNING id, status, verified`,
    [id]
  );
  return rows[0] || null;
}

async function rejectFacility(id) {
  if (mode === 'fallback') {
    const f = mem.facilities.find((x) => x.id === id);
    if (!f) return null;
    f.status = 'rejected'; f.verified = false;
    return f;
  }
  const { rows } = await pool.query(
    `UPDATE facilities SET status = 'rejected', verified = false WHERE id = $1 RETURNING id, status`,
    [id]
  );
  return rows[0] || null;
}

async function updateFacility(id, { name, type, address, phone, lat, lng }) {
  if (mode === 'fallback') {
    const f = mem.facilities.find((x) => x.id === id);
    if (!f) return null;
    Object.assign(f, { name, type, address, phone: phone || null, lat, lng });
    return f;
  }
  const { rows } = await pool.query(
    `UPDATE facilities
     SET name = $2, type = $3, address = $4, phone = $5, geom = ST_MakePoint($6, $7)::geography
     WHERE id = $1
     RETURNING id, name, type, address, phone, status, verified`,
    [id, name, type, address, phone || null, lng, lat]
  );
  return rows[0] || null;
}

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
