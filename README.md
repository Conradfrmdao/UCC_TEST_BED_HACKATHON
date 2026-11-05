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

## Android frontend prototype

For the separate native Android app under development, see [mobile/README.md](mobile/README.md). The web app described below remains available as a separate prototype.

- Public landing page: https://chinga-mobile-hackathon.vercel.app
- Signed Android test APK: https://expo.dev/artifacts/eas/sBRTQFOqlqYCFCFY3pLDbtzxY54p_-hnVyk7daGqRiQ.apk
- Release: Chinga 1.3.0, Android build 4, Android 7 or newer

The native app opens with parent/child choices. Parent verification uses the clearly labelled demo code `123456`; no SMS is sent. The parent can create a ten-minute, single-use demo family code, but pairing is currently local to one phone because the shared backend is not connected. The APK includes ARM 32-bit, ARM 64-bit, x86 and x86_64 native libraries. The Expo test artifact may expire and must move to an approved durable host before public launch.

The child and guardian screens are mobile-first. The installable app opens at `/child`, with the guardian view at `/parent`. To share an installable link, deploy the Next.js frontend over HTTPS; `localhost` points to each phone itself and cannot serve as a shareable app URL. On Android, open the deployed link in Chrome and select **Add to Home screen** or **Install app**. Installation requires a compatible browser and HTTPS (except on localhost).

The mobile interface does not require the Express API: two exact sample messages show simulated results, all other inputs return an unavailable state, and incident reports are previews that are not saved or submitted. Screenshot analysis, real pairing, notifications, and live checks are not connected. The Call 116 link opens the phone dialler. A connection is needed to load screens; the offline page does not cache private content.

Keep the development command running while using the app. If a local page cannot connect, restart `npm run dev` and reload it. The service worker bypasses requests in development and clears older Chinga caches on activation. In production, only failed document navigations receive the standalone connection page; scripts, API calls and React Server Component requests never receive offline HTML. Role pages and API responses are not cached.

## Demo boundaries

- All records and people are fabricated.
- Campaign membership is a predefined demo association, not ML clustering.
- Known fixture messages return a clearly marked `SIMULATED` assessment.
- Arbitrary messages return `analysis_unavailable`; the prototype never invents a verdict.
- Authentication and role switching are demonstration-only. Screen size never grants a role.
- No user-supplied link is fetched or previewed.

See [architecture](docs/ARCHITECTURE.md), [implementation plan](docs/IMPLEMENTATION_PLAN.md), [design system](docs/DESIGN_SYSTEM.md), and [data sources](docs/DATA_SOURCES.md).
