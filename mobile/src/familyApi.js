const FAMILY_API_URL = process.env.EXPO_PUBLIC_FAMILY_API_URL || 'https://chinga-mobile-hackathon.vercel.app/api/family';

async function callFamilyApi({ method = 'POST', query = '', token, body, timeoutMs = 10000 }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${FAMILY_API_URL}${query}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { 'x-chinga-parent-token': token } : {})
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.ok) throw new Error(payload?.error?.message || 'Family linking is unavailable. Please try again.');
    return payload.data;
  } catch (error) {
    if (error?.name === 'AbortError') throw new Error('The connection timed out. Check your internet and try again.');
    throw error;
  } finally { clearTimeout(timeout); }
}

export function createSharedInvite({ guardianName, childName, parentId, parentToken }) {
  return callFamilyApi({ body: { action: 'create', guardianName, childName, parentId, parentToken } });
}

export function claimSharedInvite(code) {
  return callFamilyApi({ body: { action: 'claim', code } });
}

export function migrateLegacyParent(familyId, parentToken) {
  return callFamilyApi({ token: parentToken, body: { action: 'migrateLegacy', familyId } });
}

export function fetchParentStatus(parentId, parentToken) {
  return callFamilyApi({ method: 'GET', query: `?parentId=${encodeURIComponent(parentId)}`, token: parentToken, timeoutMs: 7000 });
}

export function removeChildConnection(parentId, childId, parentToken) {
  return callFamilyApi({ token: parentToken, body: { action: 'removeChild', parentId, childId } });
}
