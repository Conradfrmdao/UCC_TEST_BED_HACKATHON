# Telegram adapter

Future webhook payloads will be normalised to `{ channel, externalUserId, text, urls, attachmentRefs, pairingToken }` and passed to the central analysis/reporting services. Verify Telegram webhook authenticity, rate-limit senders, download files only through a quarantined media service, and use a one-time account-link token. Required environment variable: `TELEGRAM_BOT_TOKEN`. No bot is active in this prototype.
