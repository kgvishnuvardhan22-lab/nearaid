// Central error handler - keeps stack traces out of API responses.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error('[error]', err.message);
  if (res.headersSent) return;
  res.status(err.status || 500).json({ error: err.status ? err.message : 'Internal server error' });
}

function notFound(req, res) {
  res.status(404).json({ error: 'Not found' });
}

module.exports = { errorHandler, notFound };
