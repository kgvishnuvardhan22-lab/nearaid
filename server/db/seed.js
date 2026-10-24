// Seed script: loads the 30 SAMPLE facilities and creates the first admin.
// Usage:
//   1. Create the database and schema first:  psql -d nearaid -f db/schema.sql
//   2. Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env (strong, unique values)
//   3. Run:  npm run seed
require('dotenv').config();
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const facilities = require('./seed-data.json');

const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
});

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Facilities: insert only when the table is empty, so re-running is safe.
    const { rows } = await client.query('SELECT COUNT(*)::int AS n FROM facilities');
    if (rows[0].n === 0) {
      for (const f of facilities) {
        // Parameterized query - values are never concatenated into SQL.
        await client.query(
          `INSERT INTO facilities (name, type, address, phone, geom, status, verified)
           VALUES ($1, $2, $3, $4, ST_MakePoint($5, $6)::geography, 'approved', true)`,
          [f.name, f.type, f.address, f.phone, f.lng, f.lat]
        );
      }
      console.log(`Inserted ${facilities.length} SAMPLE facilities.`);
    } else {
      console.log(`Facilities table already has ${rows[0].n} rows - skipping facility seed.`);
    }

    // Admin: create only if no admin exists yet.
    const email = process.env.SEED_ADMIN_EMAIL;
    const password = process.env.SEED_ADMIN_PASSWORD;
    if (!email || !password) throw new Error('SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set in .env');
    const { rows: admins } = await client.query('SELECT COUNT(*)::int AS n FROM admins');
    if (admins[0].n === 0) {
      const hash = await bcrypt.hash(password, 10);
      await client.query('INSERT INTO admins (email, password_hash) VALUES ($1, $2)', [email, hash]);
      console.log(`Created admin ${email}.`);
    } else {
      console.log('An admin already exists - skipping admin seed.');
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().then(() => console.log('Seed complete.')).catch((err) => { console.error(err.message); process.exit(1); });
