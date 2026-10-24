// Endpoint-level checks in fallback (in-memory, read-only) mode - no database needed.
process.env.JWT_SECRET = 'test-secret-for-jest';
const request = require('supertest');
const data = require('../src/data');

let app;
beforeAll(async () => {
  await data.init(); // no DB available in tests -> read-only fallback mode
  app = require('../src/app');
});

describe('GET /api/facilities/nearby', () => {
  test('returns results ordered by distance', async () => {
    const res = await request(app).get('/api/facilities/nearby?lat=13.0827&lng=80.2707&radius=10');
    expect(res.status).toBe(200);
    expect(res.body.count).toBeGreaterThan(0);
    const distances = res.body.results.map((r) => r.distance_km);
    expect([...distances].sort((a, b) => a - b)).toEqual(distances);
  });

  test('rejects invalid coordinates with 400', async () => {
    const res = await request(app).get('/api/facilities/nearby?lat=999&lng=80');
    expect(res.status).toBe(400);
  });
});

describe('POST /api/facilities in degraded mode', () => {
  test('validation errors still return 400', async () => {
    const res = await request(app).post('/api/facilities').send({ name: 'x', type: 'nope', address: 'x', lat: 0, lng: 0 });
    expect(res.status).toBe(400);
  });

  test('valid submissions are refused with 503 (never fake-saved)', async () => {
    const res = await request(app).post('/api/facilities').send({
      name: 'SAMPLE Jest Pharmacy', type: 'pharmacy', address: '1 Test Lane, Chennai', lat: 13.05, lng: 80.24,
    });
    expect(res.status).toBe(503);
  });
});

describe('admin auth', () => {
  test('rejects admin routes without a token', async () => {
    const res = await request(app).get('/api/admin/pending');
    expect(res.status).toBe(401);
  });

  test('admin login is disabled in demo mode unless explicitly configured', async () => {
    const res = await request(app).post('/api/admin/login').send({ email: 'admin@example.com', password: 'sample-admin-password' });
    expect(res.status).toBe(401);
  });
});
