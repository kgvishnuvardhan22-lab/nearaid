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

module.exports = router;
