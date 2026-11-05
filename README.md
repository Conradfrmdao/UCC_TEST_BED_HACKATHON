# Chinga - UCC Hackathon prototype

Chinga is a local, demo-first prototype for child-focused scam prevention and privacy-protected scam intelligence. The current build uses synthetic Ugandan scenarios and deterministic simulated analysis. It does not use a live AI model, send SMS/Telegram messages, or submit reports to an authority.

## Run locally

Prerequisites: Node.js 20+ and npm.

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

- Web app: http://localhost:3000
- Mock API: http://localhost:4000/api/health
- Administrator demo: http://localhost:3000/admin
- Child demo: http://localhost:3000/child
- Parent demo: http://localhost:3000/parent

To run separately, use `npm run dev:frontend` and `npm run dev:backend`. Run `npm run build`, `npm run lint`, and `npm test` before a demo.

Keep the development command running while using the app. If a local page cannot connect, restart `npm run dev` and reload it. The service worker bypasses requests in development and clears older Chinga caches on activation. In production, only failed document navigations receive the standalone connection page; scripts, API calls and React Server Component requests never receive offline HTML. Role pages and API responses are not cached.

## Demo boundaries

- All records and people are fabricated.
- Campaign membership is a predefined demo association, not ML clustering.
- Known fixture messages return a clearly marked `SIMULATED` assessment.
- Arbitrary messages return `analysis_unavailable`; the prototype never invents a verdict.
- Authentication and role switching are demonstration-only. Screen size never grants a role.
- No user-supplied link is fetched or previewed.

See [architecture](docs/ARCHITECTURE.md), [implementation plan](docs/IMPLEMENTATION_PLAN.md), [design system](docs/DESIGN_SYSTEM.md), and [data sources](docs/DATA_SOURCES.md).
