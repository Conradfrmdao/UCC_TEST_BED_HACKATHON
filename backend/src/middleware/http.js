export function ok(res, data, meta = {}) {
  res.json({ ok: true, data, meta: { mode: 'synthetic_demo', ...meta } });
}

export function notFound(req, res) {
  res.status(404).json({ ok: false, error: { code: 'not_found', message: 'The requested demo resource was not found.' } });
}

export function errorHandler(error, req, res, next) {
  void next;
  console.error(error);
  res.status(500).json({ ok: false, error: { code: 'internal_error', message: 'The demo service could not complete this request.' } });
}
