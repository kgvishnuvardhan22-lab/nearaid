// Entry point: load config, connect the data layer, start the HTTP server.
require('dotenv').config();
const data = require('./data');

if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'change-me-to-a-long-random-string') {
  console.warn('[security] JWT_SECRET is unset or still the example value. Set a long random secret in .env before deploying.');
}

data.init().then((mode) => {
  const app = require('./app');
  const port = Number(process.env.PORT || 5000);
  app.listen(port, () => console.log(`NearAid API listening on http://localhost:${port} (mode: ${mode})`));
}).catch((err) => {
  console.error('Failed to start:', err);
  process.exit(1);
});
