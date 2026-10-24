const { nearbyFacilities } = require('../src/utils/nearby');

// Small fixture set around a reference point in Chennai (13.0827, 80.2707).
const facilities = [
  { id: 1, name: 'Hospital Here', type: 'hospital', address: 'A', lat: 13.0827, lng: 80.2707 },       // same spot
  { id: 2, name: 'Pharmacy Near', type: 'pharmacy', address: 'B', lat: 13.0900, lng: 80.2700 },       // ~0.9 km
  { id: 3, name: 'Blood Bank Mid', type: 'blood_bank', address: 'C', lat: 13.1200, lng: 80.2707 },    // ~4.1 km
  { id: 4, name: 'Ambulance Far', type: 'ambulance', address: 'D', lat: 12.2000, lng: 80.2707 },      // ~98 km
];

describe('nearbyFacilities', () => {
  test('returns an empty list when nothing is in range', () => {
    const results = nearbyFacilities(facilities, { lat: 10.0, lng: 78.0, radiusKm: 5 });
    expect(results).toEqual([]);
  });

  test('reports distance 0 for a facility at the exact same location', () => {
    const results = nearbyFacilities(facilities, { lat: 13.0827, lng: 80.2707, radiusKm: 50 });
    const sameSpot = results.find((r) => r.id === 1);
    expect(sameSpot.distanceKm).toBe(0);
    expect(results[0].id).toBe(1); // closest first
  });

  test('applies the type filter', () => {
    const results = nearbyFacilities(facilities, { lat: 13.0827, lng: 80.2707, type: 'pharmacy', radiusKm: 50 });
    expect(results).toHaveLength(1);
    expect(results[0].type).toBe('pharmacy');
  });

  test('enforces the radius limit', () => {
    const within2 = nearbyFacilities(facilities, { lat: 13.0827, lng: 80.2707, radiusKm: 2 });
    expect(within2.map((r) => r.id)).toEqual([1, 2]); // mid and far excluded
  });

  test('rejects invalid coordinates', () => {
    expect(() => nearbyFacilities(facilities, { lat: 123, lng: 80, radiusKm: 5 })).toThrow('Invalid latitude');
    expect(() => nearbyFacilities(facilities, { lat: 13, lng: 999, radiusKm: 5 })).toThrow('Invalid longitude');
    expect(() => nearbyFacilities(facilities, { lat: 13, lng: 80, radiusKm: 0 })).toThrow('Invalid radius');
  });
});
