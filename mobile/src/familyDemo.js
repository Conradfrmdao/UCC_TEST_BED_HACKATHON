// A local walkthrough only: no real verification, security or cross-device sync.
export const DEMO_OTP = '123456';
export const emptyFamily = () => ({ registered: false, guardianName: '', phoneLast4: '', childName: '', invite: null, pendingInvite: null, linked: false, parentId: '', parentToken: '', childId: '', children: [], role: '', connectionMode: '', linkedAt: '', alerts: [] });

export function validPhone(value) {
  const compact = value.replace(/[\s()-]/g, '');
  return /^\+?\d{9,15}$/.test(compact);
}

export function registerParent(state, guardianName, phone, otp) {
  const name = guardianName.trim().replace(/\s+/g, ' ');
  if (name.length < 2 || name.length > 40) return { error: 'Enter your name (2–40 characters).' };
  if (!validPhone(phone)) return { error: 'Enter a valid phone number with 9–15 digits.' };
  if (otp.trim() !== DEMO_OTP) return { error: 'That demo code is incorrect. Try 123456.' };
  const digits = phone.replace(/\D/g, '');
  return { state: { ...state, registered: true, guardianName: name, phoneLast4: digits.slice(-4), role: 'parent' } };
}

export function createInvite(state, nickname, now = Date.now(), random = Math.random) {
  if (!state.registered) return { error: 'Create a demo parent account first.' };
  if (state.linked) return { error: 'A child is already linked in this local demo.' };
  const name = nickname.trim();
  if (!name || name.length > 30) return { error: 'Enter a child nickname (up to 30 characters).' };
  const code = String(Math.floor(random() * 900000) + 100000);
  return { state: { ...state, childName: name, invite: { code, expiresAt: now + 10 * 60 * 1000 }, linked: false } };
}

export function acceptInvite(state, code, now = Date.now()) {
  if (!state.invite) return { error: 'No family code exists on this device. Create one in the parent view first.' };
  if (state.invite.expiresAt <= now) return { error: 'This demo code expired. Generate another in the parent view.' };
  if (state.invite.code !== code.trim()) return { error: 'That family code does not match. Check it and try again.' };
  return { state: { ...state, linked: true, invite: null } };
}

export function addDemoAlert(state, risk) {
  if (!state.linked || risk !== 'high') return state;
  return { ...state, alerts: [{ id: String(Date.now()), title: 'Sample high-risk check', detail: 'A linked child tried the reward example. No message content was shared.', at: new Date().toISOString() }, ...state.alerts].slice(0, 10) };
}
