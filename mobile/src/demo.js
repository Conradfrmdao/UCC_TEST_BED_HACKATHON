export const examples = [
  { id: 'reward', label: 'Reward example', text: 'Congratulations! You won UGX 500,000. Send your Mobile Money PIN to claim the cash reward.' },
  { id: 'scholarship', label: 'Scholarship example', text: 'You have a full scholarship. Pay a processing fee today.' }
];

export function analyseExample(input) {
  const match = examples.find((item) => item.text.toLowerCase() === input.trim().toLowerCase());
  if (match?.id === 'reward') return { risk: 'high', title: 'This sample has warning signs.', explanation: 'It promises a reward and asks for a secret Mobile Money PIN.', actions: ['Do not reply or share your PIN.', 'Block the sender.', 'Talk to a trusted adult if it is safe.'] };
  if (match?.id === 'scholarship') return { risk: 'suspicious', title: 'This sample has warning signs.', explanation: 'It asks for money before the scholarship is verified.', actions: ['Do not pay the fee.', 'Ask a trusted adult for help.', 'Contact the institution through an official channel.'] };
  return { risk: 'unknown', title: 'We cannot check this yet.', explanation: 'The real safety checker is not connected. We cannot tell whether this message or link is safe.', actions: ['Do not share passwords, PINs or one-time codes.', 'Ask a trusted adult for help if it is safe.'] };
}
