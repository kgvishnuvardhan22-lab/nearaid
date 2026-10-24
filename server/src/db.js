// PostgreSQL connection pool. All queries elsewhere are parameterized ($1, $2, ...).
const { Pool } = require('pg');

const pool = new Pool(process.env.DATABASE_URL ? {
  connectionString: process.env.DATABASE_URL,
  max: 10,
} : {
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  max: 10,
});

module.exports = pool;
