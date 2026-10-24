// Great-circle distance between two lat/lng points, in kilometres.
// Used as the fallback when PostGIS is unavailable, and in unit tests.
const EARTH_RADIUS_KM = 6371;

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

function haversineKm(lat1, lng1, lat2, lng2) {
  for (const [label, v, min, max] of [['lat1', lat1, -90, 90], ['lat2', lat2, -90, 90], ['lng1', lng1, -180, 180], ['lng2', lng2, -180, 180]]) {
    if (typeof v !== 'number' || Number.isNaN(v) || v < min || v > max) {
      throw new Error(`Invalid coordinate: ${label}=${v}`);
    }
  }
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}

module.exports = { haversineKm };
