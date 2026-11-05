import { randomInt, randomUUID } from 'node:crypto';
import { Redis } from '@upstash/redis';

const INVITE_TTL_SECONDS = 10 * 60;
const PARENT_TTL_SECONDS = 7 * 24 * 60 * 60;
function redisClient() { if (!process.env.UPSTASH_REDIS_REST_URL && !process.env.KV_REST_API_URL) return null; return Redis.fromEnv(); }
function cleanName(value, fallback) { const name = String(value || '').trim().replace(/\s+/g, ' '); return name.slice(0, 40) || fallback; }
function decode(value) { if (!value) return null; if (typeof value === 'object') return value; try { return JSON.parse(value); } catch { return null; } }
async function saveParent(redis, parent) { const next = { ...parent, updatedAt: new Date().toISOString() }; await redis.set(`chinga:parent:${next.parentId}`, JSON.stringify(next), { ex: PARENT_TTL_SECONDS }); return next; }

export function pairingAvailable() { return Boolean(redisClient()); }
export async function rateLimit(request, action, limit = 15) { const redis = redisClient(); if (!redis) return { allowed: false, unavailable: true }; const ip = (request.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim().slice(0, 80); const key = `chinga:rate:${action}:${ip}`; const count = await redis.incr(key); if (count === 1) await redis.expire(key, 60); return { allowed: count <= limit }; }

export async function createInvite({ guardianName, childName, parentId, parentToken }) {
  const redis = redisClient(); if (!redis) throw new Error('pairing_not_configured');
  let parent;
  if (parentId && parentToken) { parent = decode(await redis.get(`chinga:parent:${parentId}`)); if (!parent || parent.parentToken !== parentToken) throw new Error('parent_not_found'); }
  else parent = { parentId: randomUUID(), parentToken: randomUUID(), guardianName: cleanName(guardianName, 'Guardian'), children: [], createdAt: new Date().toISOString() };
  parent = await saveParent(redis, parent);
  const now = Date.now(); const invite = { parentId: parent.parentId, parentToken: parent.parentToken, guardianName: parent.guardianName, childId: randomUUID(), childName: cleanName(childName, 'Child'), createdAt: new Date(now).toISOString(), expiresAt: new Date(now + INVITE_TTL_SECONDS * 1000).toISOString() };
  for (let attempt = 0; attempt < 8; attempt += 1) { const code = String(randomInt(100000, 1000000)); const stored = await redis.set(`chinga:invite:${code}`, JSON.stringify(invite), { nx: true, ex: INVITE_TTL_SECONDS }); if (stored) return { ...invite, code }; }
  throw new Error('code_generation_failed');
}
export async function claimInvite(code) {
  const redis = redisClient(); if (!redis) throw new Error('pairing_not_configured'); const invite = decode(await redis.getdel(`chinga:invite:${code}`)); if (!invite) return null;
  const parent = decode(await redis.get(`chinga:parent:${invite.parentId}`)); if (!parent || parent.parentToken !== invite.parentToken) return null;
  const child = { id: invite.childId, name: invite.childName, status: 'connected', incidents: 0, linkedAt: new Date().toISOString(), lastCheckIn: new Date().toISOString() };
  parent.children = [...(parent.children || []).filter((item) => item.id !== child.id), child]; await saveParent(redis, parent);
  return { parentId: invite.parentId, childId: child.id, guardianName: invite.guardianName, childName: child.name, linked: true, linkedAt: child.linkedAt };
}
export async function getParent(parentId, parentToken) { const redis = redisClient(); if (!redis) throw new Error('pairing_not_configured'); const parent = decode(await redis.get(`chinga:parent:${parentId}`)); if (!parent || parent.parentToken !== parentToken) return null; return { parentId: parent.parentId, guardianName: parent.guardianName, children: parent.children || [], updatedAt: parent.updatedAt }; }
export async function migrateLegacyParent(familyId, parentToken) { const redis = redisClient(); if (!redis) throw new Error('pairing_not_configured'); const legacy = decode(await redis.get(`chinga:family:${familyId}`)); if (!legacy || legacy.parentToken !== parentToken) return null; const child = legacy.linked ? [{ id: randomUUID(), name: legacy.childName || 'Child', status: 'connected', incidents: 0, linkedAt: legacy.linkedAt || new Date().toISOString(), lastCheckIn: legacy.lastCheckIn || new Date().toISOString() }] : []; const parent = await saveParent(redis, { parentId: randomUUID(), parentToken, guardianName: legacy.guardianName || 'Guardian', children: child, createdAt: new Date().toISOString() }); return { parentId: parent.parentId, guardianName: parent.guardianName, children: parent.children }; }
export async function removeChild(parentId, parentToken, childId) { const redis = redisClient(); if (!redis) throw new Error('pairing_not_configured'); const parent = decode(await redis.get(`chinga:parent:${parentId}`)); if (!parent || parent.parentToken !== parentToken) return false; const before = (parent.children || []).length; parent.children = (parent.children || []).filter((child) => child.id !== childId); if (parent.children.length === before) return false; await saveParent(redis, parent); return true; }
