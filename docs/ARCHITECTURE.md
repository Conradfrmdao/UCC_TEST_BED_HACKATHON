# Architecture

## Product boundary

The prototype preserves the PRD's four roles (guest, child, parent/guardian, authorised administrator) and five connected components: installable web app, central security engine, Telegram adapter, SMS adapter, and administrator dashboard. Today only the web experiences and mock HTTP API are executable. The future security engine remains one shared service for every channel.

## Runtime shape

```text
Next.js PWA (child / parent / admin)
                 |
                 | JSON over /api
                 v
Express API -> application services -> demo repository
                 |
                 +-> central analysis contract (mock today)
                 +-> parent alert port (simulated)
                 +-> Telegram / SMS ports (scaffolded)
                 +-> UCC remote inference port (scaffolded)
```

The Next.js App Router owns role-separated routes and responsive presentation. Express owns validation, response envelopes, deterministic demo analysis, linked incidents/campaigns/organisations, and future integration boundaries. PostgreSQL will replace the in-memory repository behind service interfaces; route handlers should not contain inference or persistence logic.

## Core entities

- `AnalysisRecord`: submitted content metadata, sanitised evidence, risk, category, channel, district, organisation, and campaign link.
- `Campaign`: suspected grouping with techniques, districts, reporting trend, evidence links, and investigation state.
- `IncidentReport`: child-initiated report, sanitised summary, evidence metadata, confidential-route flag, and review state.
- `Organisation`: a referenced/impersonated institution. It is never described as a perpetrator.
- `ParentAlert`: minimum necessary safety event, delivery state, and child profile pseudonym.
- `AuditEvent`: administrator and simulated system activity.

## Analysis contract

Every channel calls the same `analyse(input, context)` port. Its response is:

```json
{
  "analysisId": "demo-001",
  "mode": "demo",
  "riskLevel": "high",
  "riskScore": null,
  "signals": [],
  "explanation": "",
  "recommendedActions": [],
  "impersonatedOrganisation": null,
  "relatedCampaignId": null
}
```

`riskScore` is deliberately null in demo mode. Unknown content returns an unavailable state. Future inference combines text classification, URL evidence, screenshot extraction, claimed-brand/domain comparison, threat intelligence, and calibrated uncertainty. Reliable technical evidence takes precedence over unsupported generative claims.

## Privacy and security

- Demo data is synthetic and carries no real child identity.
- General admin records contain sanitised scammer evidence only, never full child conversations.
- Parents receive minimum relevant alert context, not private conversation transcripts.
- A confidential reporting route can suppress guardian notification where notification may increase danger.
- URLs render as inert text; the service never automatically visits user-supplied links.
- Upload UI accepts PNG/JPEG/WebP up to 5 MB; production must revalidate server-side and use private object storage, malware scanning, retention limits, and signed access.
- Production requires verified guardian onboarding, short-lived one-time pairing codes, RBAC, audit logs, encryption, rate limiting, CSRF protections, and approved reporting/referral procedures.

## Deployment direction

The frontend and API remain independently deployable. Local demo mode needs no external service. During the hackathon, an environment-configured UCC adapter can call a remote inference endpoint over the approved event network. PostgreSQL and object storage should be provisioned separately. No credential belongs in source control.
