-- NearAid database schema (PostgreSQL + PostGIS)
-- Run with: psql -d nearaid -f db/schema.sql

-- PostGIS adds geographic types, spatial indexes and distance functions.
CREATE EXTENSION IF NOT EXISTS postgis;

-- Facilities shown in search results.
-- status: pending (public suggestion) -> approved or rejected by an admin.
-- Only approved rows are returned by the public nearby API.
CREATE TABLE IF NOT EXISTS facilities (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('hospital', 'blood_bank', 'pharmacy', 'ambulance')),
  address     TEXT NOT NULL,
  phone       TEXT,                                   -- SAMPLE rows use non-callable placeholders
  geom        geometry(Point, 4326) NOT NULL,         -- lon/lat stored as a PostGIS geometry point
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  verified    BOOLEAN NOT NULL DEFAULT FALSE,         -- set true when an admin approves
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- GiST spatial index on the geometry column (required): speeds up spatial lookups.
CREATE INDEX IF NOT EXISTS facilities_geom_gist ON facilities USING GIST (geom);
-- Functional GiST index on the geography cast: lets ST_DWithin / <-> in metres
-- also use an index instead of scanning every row.
CREATE INDEX IF NOT EXISTS facilities_geog_gist ON facilities USING GIST ((geom::geography));
-- Plain indexes for admin filtering.
CREATE INDEX IF NOT EXISTS facilities_status_idx ON facilities (status);
CREATE INDEX IF NOT EXISTS facilities_type_idx ON facilities (type);

-- Admin users for the moderation panel. Passwords are stored as bcrypt hashes only.
CREATE TABLE IF NOT EXISTS admins (
  id            SERIAL PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
