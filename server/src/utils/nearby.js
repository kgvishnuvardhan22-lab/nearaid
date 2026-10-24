// Pure nearby-search logic, shared by the in-JS fallback mode and the Jest tests.
// The primary mode runs the equivalent query in PostGIS (ST_DWithin + distance order).
const { haversineKm } = require('./haversine');

const VALID_TYPES = ['hospital', 'blood_bank', 'pharmacy', 'ambulance'];

// facilities: array of { id, name, type, address, phone, lat, lng, verified }
// options:    { lat, lng, type?, radiusKm }
// Returns matching facilities sorted by distance, each with distanceKm.
function nearbyFacilities(facilities, { lat, lng, type, radiusKm }) {
  if (typeof lat !== 'number' || Number.isNaN(lat) || lat < -90 || lat > 90) {
    throw new Error('Invalid latitude');
  }
  if (typeof lng !== 'number' || Number.isNaN(lng) || lng < -180 || lng > 180) {
    throw new Error('Invalid longitude');
  }
  if (typeof radiusKm !== 'number' || Number.isNaN(radiusKm) || radiusKm <= 0) {
    throw new Error('Invalid radius');
  }
  if (type && type !== 'all' && !VALID_TYPES.includes(type)) {
    throw new Error('Invalid facility type');
  }

  return facilities
    .filter((f) => !type || type === 'all' || f.type === type)
    .map((f) => ({ ...f, distanceKm: haversineKm(lat, lng, f.lat, f.lng) }))
    .filter((f) => f.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

module.exports = { nearbyFacilities, VALID_TYPES };
