export const organisations = [
  { id: 'org-mtn', name: 'MTN Uganda', sector: 'Telecommunications', disclaimer: 'Referenced as an impersonated organisation; not associated with the scam.', weekly: [2, 3, 4, 5, 7, 9, 12] },
  { id: 'org-airtel', name: 'Airtel Uganda', sector: 'Telecommunications', disclaimer: 'Referenced as an impersonated organisation; not associated with the scam.', weekly: [1, 2, 2, 4, 4, 6, 8] },
  { id: 'org-makerere', name: 'Makerere University', sector: 'Education', disclaimer: 'Referenced as an impersonated organisation; not associated with the scam.', weekly: [0, 1, 1, 3, 5, 5, 7] },
  { id: 'org-centenary', name: 'Centenary Bank', sector: 'Financial services', disclaimer: 'Referenced as an impersonated organisation; not associated with the scam.', weekly: [0, 1, 2, 2, 3, 4, 5] },
  { id: 'org-unicef', name: 'UNICEF Uganda', sector: 'Development', disclaimer: 'Referenced as an impersonated organisation; not associated with the scam.', weekly: [0, 0, 1, 1, 2, 3, 4] }
];

export const submissions = [
  { id: 'SUB-1048', at: '2026-11-04T08:42:00+03:00', category: 'Reward scam', risk: 'high', organisationId: 'org-mtn', channel: 'App', district: 'Wakiso', status: 'new', campaignId: 'CMP-201', evidence: 'Congratulations! You have won UGX 500,000 in the MTN youth draw. Reply with your Mobile Money PIN to release the reward.', signals: ['Requests a secret PIN', 'Unexpected cash reward', 'Urgent call to act'] },
  { id: 'SUB-1047', at: '2026-11-04T07:18:00+03:00', category: 'Scholarship scam', risk: 'high', organisationId: 'org-makerere', channel: 'Telegram', district: 'Kampala', status: 'reviewing', campaignId: 'CMP-202', evidence: 'MAKERERE FULL SCHOLARSHIP: Pay a UGX 35,000 processing fee today to reserve your place. Send to 0770 000 111.', signals: ['Advance fee request', 'Impersonates an institution', 'Artificial deadline'] },
  { id: 'SUB-1046', at: '2026-11-03T19:31:00+03:00', category: 'OTP theft', risk: 'high', organisationId: 'org-centenary', channel: 'SMS', district: 'Mukono', status: 'escalated', campaignId: 'CMP-204', evidence: 'Your account will be blocked. Send the 6 digit OTP we just sent so support can verify you.', signals: ['Requests an OTP', 'Threatens account closure', 'Pretends to be support'] },
  { id: 'SUB-1045', at: '2026-11-03T16:05:00+03:00', category: 'Promotion scam', risk: 'suspicious', organisationId: 'org-airtel', channel: 'App', district: 'Jinja', status: 'reviewed', campaignId: 'CMP-203', evidence: 'Airtel back-to-school bundle: claim 20GB free. Register at airtel-bonus.example before 6pm.', signals: ['Lookalike promotion', 'Unverified domain', 'Short deadline'] },
  { id: 'SUB-1044', at: '2026-11-03T12:24:00+03:00', category: 'Scholarship scam', risk: 'suspicious', organisationId: 'org-unicef', channel: 'App', district: 'Gulu', status: 'new', campaignId: 'CMP-202', evidence: 'UNICEF student grant applications are open. Pay registration through Mobile Money and send your school ID.', signals: ['Fee for a grant', 'Requests identity material', 'Unverified sender'] },
  { id: 'SUB-1043', at: '2026-11-02T20:14:00+03:00', category: 'Reward scam', risk: 'high', organisationId: 'org-mtn', channel: 'SMS', district: 'Masaka', status: 'reviewed', campaignId: 'CMP-201', evidence: 'You are selected for MTN cash rewards. Confirm now by sharing your MoMo PIN.', signals: ['Requests a secret PIN', 'Unexpected reward'] },
  { id: 'SUB-1042', at: '2026-11-02T15:10:00+03:00', category: 'Promotion scam', risk: 'suspicious', organisationId: 'org-airtel', channel: 'Telegram', district: 'Mbarara', status: 'reviewing', campaignId: 'CMP-203', evidence: 'Free Airtel data for students. Open airtel-student-gift.example and sign in now.', signals: ['Unverified domain', 'Requests account sign-in'] },
  { id: 'SUB-1041', at: '2026-11-01T09:35:00+03:00', category: 'OTP theft', risk: 'high', organisationId: 'org-centenary', channel: 'App', district: 'Kampala', status: 'reviewed', campaignId: 'CMP-204', evidence: 'Bank security desk: read back the code sent to your phone. Do not tell anyone else.', signals: ['Requests an OTP', 'Pretends to be bank security'] },
  { id: 'SUB-1040', at: '2026-10-30T18:20:00+03:00', category: 'Reward scam', risk: 'suspicious', organisationId: 'org-mtn', channel: 'App', district: 'Wakiso', status: 'reviewed', campaignId: 'CMP-201', evidence: 'Claim your anniversary prize before midnight. A small activation payment is needed.', signals: ['Advance fee', 'Unexpected prize', 'Artificial deadline'] },
  { id: 'SUB-1039', at: '2026-10-28T14:07:00+03:00', category: 'Scholarship scam', risk: 'suspicious', organisationId: 'org-makerere', channel: 'SMS', district: 'Lira', status: 'reviewed', campaignId: 'CMP-202', evidence: 'Makerere bursary shortlist: send UGX 20,000 verification fee and your student number.', signals: ['Advance fee request', 'Requests personal data'] }
];

export const campaigns = [
  { id: 'CMP-201', title: 'Fake Mobile Money youth rewards', reports: 18, firstObserved: '2026-10-21T10:20:00+03:00', latestObserved: '2026-11-04T08:42:00+03:00', districts: ['Wakiso', 'Masaka', 'Kampala'], organisationId: 'org-mtn', techniques: ['Unexpected reward', 'PIN request', 'Urgency'], status: 'suspected', trend: [1, 1, 2, 2, 3, 4, 5], submissionIds: ['SUB-1048', 'SUB-1043', 'SUB-1040'] },
  { id: 'CMP-202', title: 'Student scholarship processing fees', reports: 14, firstObserved: '2026-10-18T08:00:00+03:00', latestObserved: '2026-11-04T07:18:00+03:00', districts: ['Kampala', 'Gulu', 'Lira'], organisationId: 'org-makerere', techniques: ['Advance fee', 'Identity request', 'False deadline'], status: 'under_review', trend: [1, 2, 1, 2, 2, 3, 3], submissionIds: ['SUB-1047', 'SUB-1044', 'SUB-1039'] },
  { id: 'CMP-203', title: 'Fake back-to-school data promotion', reports: 9, firstObserved: '2026-10-27T12:40:00+03:00', latestObserved: '2026-11-03T16:05:00+03:00', districts: ['Jinja', 'Mbarara'], organisationId: 'org-airtel', techniques: ['Lookalike domain', 'Credential capture'], status: 'suspected', trend: [0, 1, 1, 1, 2, 2, 3], submissionIds: ['SUB-1045', 'SUB-1042'] },
  { id: 'CMP-204', title: 'Bank support OTP theft', reports: 7, firstObserved: '2026-10-25T17:10:00+03:00', latestObserved: '2026-11-03T19:31:00+03:00', districts: ['Mukono', 'Kampala'], organisationId: 'org-centenary', techniques: ['OTP request', 'Account threat', 'Support impersonation'], status: 'under_review', trend: [0, 0, 1, 1, 1, 2, 2], submissionIds: ['SUB-1046', 'SUB-1041'] }
];

export const reports = [
  { id: 'RPT-309', category: 'Money sent', submittedAt: '2026-11-04T08:10:00+03:00', status: 'new', summary: 'Reporter says a scholarship contact requested a processing fee. UGX 35,000 was sent before the concern was recognised.', evidence: ['1 screenshot', '1 transaction reference (masked)'], confidential: false },
  { id: 'RPT-308', category: 'Account access', submittedAt: '2026-11-03T20:04:00+03:00', status: 'priority_review', summary: 'Reporter shared a one-time code after receiving an account closure warning. No password or PIN is stored.', evidence: ['2 sanitised SMS messages'], confidential: false },
  { id: 'RPT-307', category: 'Threat or coercion', submittedAt: '2026-11-03T14:32:00+03:00', status: 'restricted', summary: 'A confidential support request was created. General dashboard details are intentionally limited.', evidence: ['Restricted evidence'], confidential: true },
  { id: 'RPT-306', category: 'Suspicious link', submittedAt: '2026-11-02T11:45:00+03:00', status: 'reviewed', summary: 'Reporter received a fake student-data promotion and did not sign in.', evidence: ['1 URL displayed as inert text'], confidential: false }
];

export const alerts = [
  { id: 'ALT-88', at: '2026-11-04T08:45:00+03:00', type: 'campaign', severity: 'warning', title: 'Reward campaign reporting increased', detail: 'Five linked synthetic reports were recorded in the current seven-day demo window.' },
  { id: 'ALT-87', at: '2026-11-04T08:43:00+03:00', type: 'parent', severity: 'high', title: 'Parent alert simulated', detail: 'Minimum necessary alert prepared for child profile Kato B.; no private conversation included.' },
  { id: 'ALT-86', at: '2026-11-03T19:34:00+03:00', type: 'review', severity: 'high', title: 'OTP theft evidence escalated', detail: 'Submission SUB-1046 moved to escalated review.' },
  { id: 'ALT-85', at: '2026-11-03T16:08:00+03:00', type: 'system', severity: 'info', title: 'Demo analysis completed', detail: 'Known promotion fixture matched. No external URL was opened.' }
];

export const dailyTotals = [
  { date: 'Oct 29', analysed: 17, suspicious: 5 }, { date: 'Oct 30', analysed: 21, suspicious: 7 },
  { date: 'Oct 31', analysed: 18, suspicious: 6 }, { date: 'Nov 1', analysed: 24, suspicious: 8 },
  { date: 'Nov 2', analysed: 29, suspicious: 11 }, { date: 'Nov 3', analysed: 34, suspicious: 14 },
  { date: 'Nov 4', analysed: 23, suspicious: 10 }
];

export function organisationName(id) {
  return organisations.find((item) => item.id === id)?.name || 'Unknown organisation';
}

export function buildOverview(days = 7) {
  const selected = dailyTotals.slice(-Number(days));
  const analysed = selected.reduce((sum, item) => sum + item.analysed, 0);
  const suspicious = selected.reduce((sum, item) => sum + item.suspicious, 0);
  const recent = submissions.filter((item) => new Date(item.at) >= new Date(days === 3 ? '2026-11-02T00:00:00+03:00' : '2026-10-28T00:00:00+03:00'));
  return {
    rangeDays: Number(days), analysed, suspicious,
    highRisk: recent.filter((item) => item.risk === 'high').length,
    reports: reports.filter((item) => !item.confidential || item.status === 'restricted').length,
    activeCampaigns: campaigns.length,
    trend: selected,
    recentThreats: recent.slice(0, 5),
    topOrganisations: organisations.map((org) => ({ ...org, count: submissions.filter((item) => item.organisationId === org.id).length })).sort((a, b) => b.count - a.count)
  };
}

export const childHistory = [
  { id: 'H-12', at: 'Today, 8:42 AM', label: 'Mobile Money reward message', result: 'High risk', tone: 'high' },
  { id: 'H-11', at: 'Monday, 4:20 PM', label: 'School group link', result: 'Analysis unavailable', tone: 'unknown' }
];

export const parentChildren = [
  { id: 'child-kb', nickname: 'Kato B.', ageBand: '13-15', paired: true, lastCheck: 'Today, 8:42 AM' },
  { id: 'child-am', nickname: 'Amina M.', ageBand: '10-12', paired: false, lastCheck: 'Not paired yet' }
];
