import { Router } from 'express';
import { alerts, buildOverview, campaigns, organisations, parentChildren, reports, submissions } from '@chinga/demo-data';
import { ok } from '../middleware/http.js';
import { analyseDemo } from '../services/analysis-service.js';

export const api = Router();
const mutableStatuses = new Map();

api.get('/health', (req, res) => ok(res, { status: 'ready', service: 'chinga-demo-api', aiEngine: 'not_implemented' }));
api.get('/admin/overview', (req, res) => ok(res, buildOverview(req.query.days || 7)));
api.get('/admin/incidents', (req, res) => ok(res, submissions.map((item) => ({ ...item, status: mutableStatuses.get(item.id) || item.status }))));
api.patch('/admin/incidents/:id', (req, res) => {
  const item = submissions.find((entry) => entry.id === req.params.id);
  if (!item) return res.status(404).json({ ok: false, error: { code: 'not_found', message: 'Submission not found.' } });
  const allowed = ['new', 'reviewing', 'reviewed', 'escalated'];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ ok: false, error: { code: 'invalid_status', message: 'Unsupported review status.' } });
  mutableStatuses.set(item.id, req.body.status);
  return ok(res, { ...item, status: req.body.status });
});
api.get('/admin/campaigns', (req, res) => ok(res, campaigns));
api.get('/admin/organisations', (req, res) => ok(res, organisations));
api.get('/admin/reports', (req, res) => ok(res, reports));
api.get('/admin/alerts', (req, res) => ok(res, alerts));

api.post('/demo/analyse', (req, res) => {
  const result = analyseDemo(req.body?.content);
  if (result.kind === 'invalid') return res.status(400).json({ ok: false, error: { code: 'invalid_input', message: result.message } });
  return ok(res, result, { disclaimer: 'SIMULATED result. No live AI or threat-intelligence check was performed.' });
});

api.post('/reports', (req, res) => {
  const summary = String(req.body?.summary || '').trim();
  if (summary.length < 10) return res.status(400).json({ ok: false, error: { code: 'invalid_report', message: 'Please provide a little more detail.' } });
  return res.status(201).json({ ok: true, data: { id: `RPT-DEMO-${Date.now()}`, status: 'simulated_submission', confidential: Boolean(req.body.confidential) }, meta: { mode: 'synthetic_demo', disclaimer: 'Not submitted to UCC, Police, or another authority.' } });
});

api.get('/parent/children', (req, res) => ok(res, parentChildren));
api.get('/parent/alerts', (req, res) => ok(res, alerts.filter((item) => item.type === 'parent')));
api.post('/parent/pair', (req, res) => ok(res, { code: 'SAFE-4821', expiresInMinutes: 10, singleUse: true, simulated: true }));
api.post('/demo/reset', (req, res) => { mutableStatuses.clear(); ok(res, { reset: true }); });
