# Chinga native app

This is a separate Expo / React Native Android frontend. It does not embed the web app. It is a prototype, not a child-safety service.

## Run on an Android phone

The distributable APK supports Android 7 and newer and does not require Expo Go. For local development, install a compatible Expo Go app on the phone, connect the phone and computer to the same network, then run:

```powershell
cd mobile
npm install --workspaces=false
npm start
```

Scan the QR code from Expo Go. Expo Go compatibility depends on the SDK supported by the installed Expo Go version; if it cannot open this SDK, a development build or matching Expo Go version is needed. A locally compiled Android app requires the Android SDK and a working emulator or device; an APK can also be built later using EAS.

## What works locally

- Native child home, message-check, report-preview, help and family screens; Android back navigation; guardian overview and switches.
- The child home uses a deep-blue header and a white content sheet, with clean vector icons and a bottom navigation bar that respects Android gesture and system-button safe areas.
- Two exact sample messages return clearly labelled, hard-coded results. Every other input returns an unavailable state. Nothing is sent to a server.
- The report preview is held only in memory and never submitted. Parent signup uses the fixed demo code `123456`; no SMS is sent.
- When the deployed pairing store is configured, a parent can create a single-use six-digit family code and a child can claim it from a second phone within 10 minutes. The parent phone polls for the connection state. This demo link is not production authentication; family records expire after seven days and should use fabricated names and numbers.
- If the pairing store is unavailable, the app shows an honest service-unavailable message instead of pretending the phones linked.
- After linking, the high-risk reward example creates a minimal local alert in the guardian view, without storing the original message. No push or SMS notification is sent.
- The 116 action opens the dialler; the user chooses whether to place the call.
- A child can select and preview a screenshot on-device. It is not uploaded or analysed.
- Protection preferences are saved on the device, but no filtering or blocking is active.

The shared analysis service contract and real backend are intentionally not connected. Do not use this prototype for real private reports or as a safety verdict.

See [IMPLEMENTATION.md](IMPLEMENTATION.md) for the revised PRD status and work required before these features can be used as a real service.

## Shareable Android build

`eas.json` has a `preview` profile configured to produce a signed, directly installable APK. Version 1.2.0 uses Android version code 3, so it can update earlier EAS-signed builds. Sign in to Expo and link the project before running:

```powershell
npx eas-cli login
npx eas-cli build --platform android --profile preview
```

EAS supplies a build link when the build succeeds. This project is linked to `@conrad256/chinga-safety`; the preview build uses the `preview` update channel. After verifying a change, publish compatible JavaScript and asset updates with `npx eas-cli update --channel preview --message "Describe the change"`. Updates only reach compatible builds; changes to native modules, permissions, or the native runtime require a new APK and appropriate runtime versioning. Protect the Expo account and its Android signing credentials, because they are needed to deliver future upgrades.

Current signed preview APK: `https://expo.dev/artifacts/eas/sBRTQFOqlqYCFCFY3pLDbtzxY54p_-hnVyk7daGqRiQ.apk` (Chinga 1.3.0, Android build 4). The Expo artifact is a test-distribution link and may expire; replace it with a durable approved release host before public launch.

Current Android update group for runtime 1.2.0: `5f85bcd5-68d6-409f-b81d-0f10497b429c` on the `preview` branch/channel.

An APK cannot support literally every Android phone. This Expo SDK supports Android 7 and newer. Installation may also be prevented by device policy, disabled unknown-source installation, insufficient storage, a damaged download, or a differently signed copy of the same application ID. If Android reports a signature conflict, uninstall the old differently signed Chinga build before installing; this removes that build's local demo data.
