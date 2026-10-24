const { haversineKm } = require('../src/utils/haversine');

describe('haversineKm', () => {
  test('returns 0 for the exact same location', () => {
    expect(haversineKm(13.0827, 80.2707, 13.0827, 80.2707)).toBe(0);
  });

  test('matches a known real-world distance (Chennai to Bangalore, ~290 km)', () => {
    const d = haversineKm(13.0827, 80.2707, 12.9716, 77.5946);
    expect(d).toBeGreaterThan(280);
    expect(d).toBeLessThan(300);
  });

  test('is symmetric - A to B equals B to A', () => {
    const ab = haversineKm(13.0827, 80.2707, 11.0168, 76.9558);
    const ba = haversineKm(11.0168, 76.9558, 13.0827, 80.2707);
    expect(ab).toBeCloseTo(ba, 10);
  });

  test('handles antipodal points (~half the Earth circumference)', () => {
    const d = haversineKm(0, 0, 0, 180);
    expect(d).toBeGreaterThan(19900);
    expect(d).toBeLessThan(20100);
  });

  test('throws on out-of-range coordinates', () => {
    expect(() => haversineKm(91, 0, 0, 0)).toThrow('Invalid coordinate');
    expect(() => haversineKm(0, 181, 0, 0)).toThrow('Invalid coordinate');
    expect(() => haversineKm(NaN, 0, 0, 0)).toThrow('Invalid coordinate');
  });
});
