// Express app wiring: security basics, routes, and error handling.
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const facilitiesRouter = require('./routes/facilities');
const adminRouter = require('./routes/admin');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const data = require('./data');

const app = express();

// CORS: only the configured frontend origin(s) may call the API from a browser.
const origins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map((s) => s.trim());
app.use(cors({ origin: origins }));

app.use(express.json({ limit: '100kb' }));

// Global API rate limit (login has its own stricter limit).
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests - slow down.' },
}));

app.get('/api/health', (req, res) => res.json({ status: 'ok', mode: data.getMode() }));
app.use('/api/facilities', facilitiesRouter);
app.use('/api/admin', adminRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
