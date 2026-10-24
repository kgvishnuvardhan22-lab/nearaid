// Endpoint-level checks in fallback (in-memory) mode - no database needed.
process.env.JWT_SECRET = 'test-secret-for-jest';
const request = require('supertest');
const data = require('../src/data');

let app;
beforeAll(async () => {
  await data.init();
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

describe('admin auth', () => {
  test('rejects admin routes without a token', async () => {
    const res = await request(app).get('/api/admin/pending');
    expect(res.status).toBe(401);
  });
});
