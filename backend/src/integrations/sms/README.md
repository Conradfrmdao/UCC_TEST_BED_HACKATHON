# SMS adapter

Future provider webhooks will be normalised to `{ channel: "sms", providerMessageId, senderRef, text, receivedAt }`. Short stateful reporting conversations will use opaque sessions and minimal retention. Candidate provider variables are `AFRICASTALKING_API_KEY` and `AFRICASTALKING_USERNAME`. Signatures, replay protection, delivery receipts, opt-out handling, and approved short codes are required. No SMS is sent today.
