# NearAid deployment guide

Three pieces: hosted Postgres+PostGIS (Supabase or Neon), backend on Render,
frontend on Vercel. Free tiers of all three are enough for a class demo.

## 1. Database - Supabase (recommended: PostGIS is built in)
1. Create a free project at https://supabase.com (region closest to you).
2. In the SQL editor, run `CREATE EXTENSION IF NOT EXISTS postgis;`
   (or enable it under Database -> Extensions).
3. Paste and run the contents of `server/db/schema.sql`.
4. Note the connection details under Project Settings -> Database:
   host, port 5432, database `postgres`, user `postgres`, and the password
   you chose at project creation.

   Alternative: Neon (https://neon.tech) - create a project, enable PostGIS
   with `CREATE EXTENSION postgis;` in its SQL editor, use the same schema.

## 2. Backend - Render
1. Push this project to GitHub, then in Render: New -> Web Service ->
   connect the repo.
2. Settings:
   - Root directory: `server`
   - Build command: `npm install`
   - Start command: `npm start`
3. Environment variables (Render -> Environment):
   - `PGHOST` = your Supabase host (e.g. db.xxxx.supabase.co)
   - `PGPORT` = `5432`
   - `PGDATABASE` = `postgres` (Supabase) or your Neon database name
   - `PGUSER` = `postgres` (Supabase) or your Neon user
   - `PGPASSWORD` = the database password
   - `JWT_SECRET` = a long random string (e.g. `openssl rand -hex 32`)
   - `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` = your admin login
     (strong, unique, quoted if it contains # or spaces)
   - `CORS_ORIGIN` = your Vercel URL (step 3 below), e.g.
     `https://nearaid.vercel.app`
   - `PORT` = leave unset (Render provides it)
4. Deploy. Then run the seed once from Render's Shell:
   `npm run seed` (or run it locally against the hosted DB by pointing your
   local .env at it).
5. Check: `curl https://<your-service>.onrender.com/api/health`
   -> `{"status":"ok","mode":"postgis"}`

## 3. Frontend - Vercel
1. New Project -> import the same GitHub repo.
2. Settings:
   - Root directory: `client`
   - Framework preset: Vite (auto-detected)
   - Build command: `npm run build`, output: `dist`
3. Environment variable:
   - `VITE_API_URL` = your Render URL, e.g. `https://nearaid-api.onrender.com`
4. Deploy. Open the Vercel URL - the site should search the hosted API.
5. Back in Render, set `CORS_ORIGIN` to the exact Vercel URL and redeploy.

## Post-deploy smoke test
- Search near Chennai (13.0827, 80.2707) -> SAMPLE facilities appear.
- Submit a suggestion -> log in at /admin/login -> approve -> it appears.
- `npm test` locally should still pass (16 tests).

## Notes
- Free Render services sleep when idle: the first request after a quiet period
  can take ~30 seconds. Mention this before a live demo.
- Never commit real .env values. Rotate JWT_SECRET and the admin password if
  they are ever exposed.
