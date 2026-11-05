import { NextResponse } from 'next/server';
import { claimInvite, createInvite, getParent, migrateLegacyParent, pairingAvailable, rateLimit, removeChild } from '../../../lib/family-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const reply = (data, status = 200) => NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
function serviceError(error) {
  if (error?.message === 'pairing_not_configured') return reply({ ok: false, error: { code: 'pairing_unavailable', message: 'Family linking is being connected. Please try again shortly.' } }, 503);
  if (error?.message === 'parent_not_found') return reply({ ok: false, error: { code: 'parent_not_found', message: 'This parent account could not be found. Create a new child code.' } }, 404);
  console.error('Family pairing error', error);
  return reply({ ok: false, error: { code: 'pairing_error', message: 'Family linking could not complete. Please try again.' } }, 500);
}
export async function GET(request) {
  const url = new URL(request.url);
  if (url.searchParams.get('health') === '1') return reply({ ok: true, data: { available: pairingAvailable() } });
  const parentId = String(url.searchParams.get('parentId') || '').trim(); const parentToken = String(request.headers.get('x-chinga-parent-token') || '').trim();
  if (!parentId || !parentToken) return reply({ ok: false, error: { code: 'invalid_request', message: 'Parent credentials are required.' } }, 400);
  try { return reply({ ok: true, data: await getParent(parentId, parentToken) || { children: [] } }); } catch (error) { return serviceError(error); }
}
export async function POST(request) {
  let body; try { body = await request.json(); } catch { return reply({ ok: false, error: { code: 'invalid_json', message: 'A valid request is required.' } }, 400); }
  const action = String(body?.action || '').trim();
  try {
    const limit = await rateLimit(request, action || 'unknown', action === 'claim' ? 12 : 20);
    if (limit.unavailable) throw new Error('pairing_not_configured'); if (!limit.allowed) return reply({ ok: false, error: { code: 'rate_limited', message: 'Too many attempts. Wait one minute and try again.' } }, 429);
    if (action === 'create') { const childName = String(body.childName || '').trim(); if (!childName || childName.length > 40) return reply({ ok: false, error: { code: 'invalid_child_name', message: 'Enter a child nickname.' } }, 400); return reply({ ok: true, data: await createInvite({ guardianName: body.guardianName, childName, parentId: body.parentId, parentToken: body.parentToken }) }, 201); }
    if (action === 'claim') { const code = String(body.code || '').replace(/\D/g, ''); if (!/^\d{6}$/.test(code)) return reply({ ok: false, error: { code: 'invalid_code', message: 'Enter the six-digit family code.' } }, 400); const child = await claimInvite(code); return child ? reply({ ok: true, data: child }) : reply({ ok: false, error: { code: 'code_unavailable', message: 'That code is incorrect, expired, or already used.' } }, 404); }
    if (action === 'migrateLegacy') { const familyId = String(body.familyId || '').trim(); const parentToken = String(request.headers.get('x-chinga-parent-token') || '').trim(); if (!familyId || !parentToken) return reply({ ok: false, error: { code: 'invalid_request', message: 'Parent credentials are required.' } }, 400); const parent = await migrateLegacyParent(familyId, parentToken); return parent ? reply({ ok: true, data: parent }) : reply({ ok: false, error: { code: 'not_found', message: 'The older family link was not found.' } }, 404); }
    if (action === 'removeChild') { const parentId = String(body.parentId || '').trim(); const childId = String(body.childId || '').trim(); const parentToken = String(request.headers.get('x-chinga-parent-token') || '').trim(); if (!parentId || !childId || !parentToken) return reply({ ok: false, error: { code: 'invalid_request', message: 'Parent credentials are required.' } }, 400); return await removeChild(parentId, parentToken, childId) ? reply({ ok: true, data: { removed: true } }) : reply({ ok: false, error: { code: 'not_found', message: 'This child device was not found.' } }, 404); }
    return reply({ ok: false, error: { code: 'invalid_action', message: 'Unsupported family action.' } }, 400);
  } catch (error) { return serviceError(error); }
}
