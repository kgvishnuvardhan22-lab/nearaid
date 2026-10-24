// Admin routes: login (JWT + bcrypt) and moderation of facility submissions.
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { body, param, validationResult } = require('express-validator');
const data = require('../data');
const { requireAdmin } = require('../middleware/auth');
const { VALID_TYPES } = require('../utils/nearby');

const router = express.Router();

// Stricter limit on login to slow down password guessing.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts - try again later.' },
});

function checkValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: errors.array()[0].msg });
    return false;
  }
  return true;
}

// POST /api/admin/login  { email, password } -> { token }
router.post(
  '/login',
  loginLimiter,
  [body('email').isEmail().normalizeEmail().withMessage('valid email required'),
   body('password').isString().notEmpty().withMessage('password required')],
  async (req, res, next) => {
    if (!checkValidation(req, res)) return;
    try {
      const admin = await data.findAdminByEmail(req.body.email);
      // Same response whether the email or the password is wrong (no user enumeration).
      if (!admin || !(await bcrypt.compare(req.body.password, admin.password_hash))) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      const token = jwt.sign({ sub: admin.id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '2h' });
      res.json({ token });
    } catch (err) {
      next(err);
    }
  }
);

// Everything below requires a valid admin JWT.
router.use(requireAdmin);

// GET /api/admin/pending - submissions waiting for review.
router.get('/pending', async (req, res, next) => {
  try {
    res.json({ results: await data.listByStatus('pending') });
  } catch (err) { next(err); }
});

// GET /api/admin/facilities - approved (verified) list.
router.get('/facilities', async (req, res, next) => {
  try {
    res.json({ results: await data.listByStatus('approved') });
  } catch (err) { next(err); }
});

// POST /api/admin/facilities/:id/approve
router.post('/facilities/:id/approve', param('id').isInt({ min: 1 }), async (req, res, next) => {
  if (!checkValidation(req, res)) return;
  try {
    const row = await data.approveFacility(Number(req.params.id));
    if (!row) return res.status(404).json({ error: 'Facility not found' });
    res.json(row);
  } catch (err) { next(err); }
});

// POST /api/admin/facilities/:id/reject
router.post('/facilities/:id/reject', param('id').isInt({ min: 1 }), async (req, res, next) => {
  if (!checkValidation(req, res)) return;
  try {
    const row = await data.rejectFacility(Number(req.params.id));
    if (!row) return res.status(404).json({ error: 'Facility not found' });
    res.json(row);
  } catch (err) { next(err); }
});

// PUT /api/admin/facilities/:id - edit a facility's details.
router.put(
  '/facilities/:id',
  [
    param('id').isInt({ min: 1 }),
    body('name').trim().isLength({ min: 3, max: 120 }).withMessage('name must be 3-120 characters'),
    body('type').isIn(VALID_TYPES).withMessage('invalid facility type'),
    body('address').trim().isLength({ min: 5, max: 250 }).withMessage('address must be 5-250 characters'),
    body('phone').optional({ checkFalsy: true }).trim().isLength({ max: 30 }).withMessage('phone is too long'),
    body('lat').isFloat({ min: -90, max: 90 }).withMessage('lat must be a number between -90 and 90'),
    body('lng').isFloat({ min: -180, max: 180 }).withMessage('lng must be a number between -180 and 180'),
  ],
  async (req, res, next) => {
    if (!checkValidation(req, res)) return;
    try {
      const row = await data.updateFacility(Number(req.params.id), {
        name: req.body.name, type: req.body.type, address: req.body.address,
        phone: req.body.phone, lat: Number(req.body.lat), lng: Number(req.body.lng),
      });
      if (!row) return res.status(404).json({ error: 'Facility not found' });
      res.json(row);
    } catch (err) { next(err); }
  }
);

module.exports = router;
