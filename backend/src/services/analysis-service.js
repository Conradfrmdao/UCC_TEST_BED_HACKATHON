const fixtures = [
  {
    matches: ['mobile money pin', 'momo pin', 'won ugx', 'cash reward'],
    result: {
      analysisId: 'demo-reward-001', mode: 'demo', riskLevel: 'high', riskScore: null,
      signals: ['The message promises an unexpected reward.', 'It asks for a secret Mobile Money PIN.', 'It pressures the reader to act quickly.'],
      explanation: 'Be careful. This matches a simulated reward-scam example. Real support staff should not ask for your secret Mobile Money PIN.',
      recommendedActions: ['Do not reply or share your PIN.', 'Block the sender.', 'Tell a trusted adult if it is safe to do so.'],
      impersonatedOrganisation: 'MTN Uganda', relatedCampaignId: 'CMP-201'
    }
  },
  {
    matches: ['scholarship', 'processing fee', 'bursary'],
    result: {
      analysisId: 'demo-scholarship-001', mode: 'demo', riskLevel: 'suspicious', riskScore: null,
      signals: ['A fee is requested before a scholarship is confirmed.', 'The sender creates urgency.', 'The sender is not verified.'],
      explanation: 'This matches a simulated scholarship-scam example. Do not send money until you verify the offer using the institution’s official contact details.',
      recommendedActions: ['Do not pay the requested fee.', 'Ask a trusted adult to help verify the offer.', 'Contact the institution through an official channel.'],
      impersonatedOrganisation: 'Makerere University', relatedCampaignId: 'CMP-202'
    }
  },
  {
    matches: ['otp', 'one time code', '6 digit code'],
    result: {
      analysisId: 'demo-otp-001', mode: 'demo', riskLevel: 'high', riskScore: null,
      signals: ['The message asks for a one-time security code.', 'It pretends to be account support.'],
      explanation: 'This matches a simulated account-takeover example. Never share an OTP or verification code with another person.',
      recommendedActions: ['Do not share the code.', 'Change the account password using the official app if you already shared it.', 'Ask a trusted adult for help.'],
      impersonatedOrganisation: null, relatedCampaignId: 'CMP-204'
    }
  }
];

export function analyseDemo(input) {
  const content = String(input || '').trim().toLowerCase();
  if (!content) return { kind: 'invalid', message: 'Paste a message or URL to use the demo analyser.' };
  const fixture = fixtures.find((item) => item.matches.some((term) => content.includes(term)));
  if (fixture) return { kind: 'simulated_result', ...fixture.result };
  return {
    kind: 'analysis_unavailable', analysisId: `unavailable-${Date.now()}`, mode: 'demo', riskLevel: 'unknown', riskScore: null,
    signals: [], explanation: 'Analysis is not yet available for this content. The prototype will not guess whether it is safe.',
    recommendedActions: ['Do not share passwords, PINs, or OTP codes.', 'Ask a trusted adult or contact the organisation through an official channel.'],
    impersonatedOrganisation: null, relatedCampaignId: null
  };
}
