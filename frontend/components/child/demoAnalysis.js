// This is a frontend demonstration, not an AI or security assessment.
const samples = [
  {
    text: 'Congratulations! You won UGX 500,000. Send your Mobile Money PIN to claim the cash reward.',
    riskLevel: 'high',
    explanation: 'This sample asks for a secret Mobile Money PIN. Never share your PIN with anyone.',
    signals: ['It promises an unexpected reward.', 'It asks for a secret PIN.'],
    recommendedActions: ['Do not reply or share your PIN.', 'Block the sender.', 'Ask a trusted adult for help if it is safe.']
  },
  {
    text: 'You have a full scholarship. Pay a processing fee today.',
    riskLevel: 'suspicious',
    explanation: 'This sample asks for money before a scholarship is confirmed.',
    signals: ['It asks for an advance fee.', 'It creates urgency.'],
    recommendedActions: ['Do not send money.', 'Ask a trusted adult to help verify the offer.', 'Contact the institution using its official contact details.']
  }
];

export function analyseSample(content) {
  const sample = samples.find((item) => item.text.toLowerCase() === content.trim().toLowerCase());
  if (sample) return { kind: 'simulated_result', ...sample };
  return {
    kind: 'analysis_unavailable', riskLevel: 'unknown', signals: [],
    explanation: 'The real safety checker is not connected yet. We cannot tell whether this message or link is safe.',
    recommendedActions: ['Do not share passwords, PINs, or one-time codes.', 'Ask a trusted adult for help if it is safe to do so.']
  };
}
