// Public facility routes: nearby search and community suggestions.
const express = require('express');
const { query, body, validationResult } = require('express-validator');
const data = require('../data');
const { VALID_TYPES } = require('../utils/nearby');

const router = express.Router();

// Shared validation result check.
function checkValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: errors.array()[0].msg, details: errors.array() });
    return false;
  }
  return true;
}

// GET /api/facilities/nearby?lat=..&lng=..&type=..&radius=..
// radius is in kilometres (default 5, max 50). type is optional (default: all).
router.get(
  '/nearby',
  [
    query('lat').isFloat({ min: -90, max: 90 }).withMessage('lat must be a number between -90 and 90'),
    query('lng').isFloat({ min: -180, max: 180 }).withMessage('lng must be a number between -180 and 180'),
    query('radius').optional().isFloat({ min: 0.1, max: 50 }).withMessage('radius must be between 0.1 and 50 km'),
    query('type').optional().isIn([...VALID_TYPES, 'all']).withMessage('invalid facility type'),
  ],
  async (req, res, next) => {
    if (!checkValidation(req, res)) return;
    try {
      const results = await data.findNearby({
        lat: Number(req.query.lat),
        lng: Number(req.query.lng),
        type: req.query.type,
        radiusKm: req.query.radius ? Number(req.query.radius) : 5,
      });
      res.json({ mode: data.getMode(), count: results.length, results });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
