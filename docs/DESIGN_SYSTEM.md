# Design system

Chinga draws on EstateCore UG's spacious landing page and framed workspace. The palette is blue, with a navy sidebar, neutral canvas and white content surfaces. The shared styles live in `frontend/app/globals.css`.

## Visual direction

- The landing photograph fills the right side of the hero and fades into white across the left, top and bottom. On phones it sits beneath the introduction with the same soft edges.
- Use the plain Chinga wordmark. No decorative icon tiles, letter avatars, emoji or initials in coloured boxes.
- Keep simple line icons for navigation and actions such as search, close and back. Content headings and metrics stand on their own.
- Prioritise clear headings, readable text and generous space. Use rules and alignment for supporting content rather than adding cards to every section.
- Status labels always include text; colour is supplementary. Synthetic records and simulated results remain labelled.

## Tokens

- Canvas `#f4f6f8`, surface `#ffffff`, ink `#111b27`, muted `#627184`, line `#e0e6ec`.
- Navy `#132d4f`, blue `#245ea9`, pale blue `#e6effa`.
- Amber `#95600d` / `#fbf0dc` for suspicious states; red `#a13532` / `#fbeae7` for high risk.
- Arial / Helvetica / sans-serif. Tight heading spacing; body copy has comfortable line height. Numeric metrics use tabular figures.
- Main cards have 20 px corners, with 14–16 px corners on phones. Primary actions are pills. Status badges have small, 5 px corners.
- Elevation is restrained and reserved for overlays and compact controls.

## Workspaces

- The desktop admin rail is 234 px, collapsible to 82 px. Active navigation uses the same light surface as the main workspace. The phone menu is a drawer.
- Summary cards have plain labels, values and context. The final card uses navy for emphasis.
- Tables support horizontal scrolling at intermediate widths and selected labelled fields on phones.
- Detail drawers retain evidence, timestamps and review actions. Organisation and report lists use full names without initials.
- Parent summaries, child lists and alert lists use text directly. Mobile parent navigation stays at the bottom.
- Child actions are large text-led panels. Supporting guidance uses plain lists, and useful navigation icons remain unboxed.

## Photo and connection states

- `public/images/chinga-family-safety-hero.webp` is an optimised version of the original PNG. It is an illustrative AI-generated Ugandan family scene, labelled in the landing footer.
- The photo is served locally without an external image dependency. Layered CSS gradients create the white fade.
- A connection error says the app server cannot be reached, rather than assuming the device has no internet. The static offline fallback has its own styles and a retry action, so it does not need JavaScript bundles to render.
- Focus rings, visible form labels, adequate tap targets and reduced-motion preferences are preserved.
