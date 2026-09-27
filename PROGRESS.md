# Progress

Malak Seddik's personal portfolio site — a single-page site built with Vite + React + TypeScript, plain CSS (no framework, no component library). Deployment-ready but intentionally not connected to any host or domain yet.

## Design rules ("must not look AI-generated")

Hard nos, enforced throughout:

- No purple gradients
- No solid filled pill buttons — buttons are outline/underline style only (see `.button` in `src/styles/global.css`; the one accent-colored button uses an outline too, never a solid fill)
- No fake stats, metrics, or reviews — every number on the site is real
- No emoji icons
- No scroll-triggered animations
- No typing effects
- No parallax
- No autoplay (the carousel has none, by design)
- No custom-cursor effects

Also:

- Real content only — no invented copy, no filler
- Motion only on user action (click, key, swipe) or a single on-load reveal — nothing continuous/ambient
- Every animated/transitioning property must respect `prefers-reduced-motion`. The pattern used throughout: `--transition-fast` / `--transition-base` in `src/styles/theme.css` collapse to `0ms` under reduced motion, so most components get this for free just by using those variables instead of hardcoding durations. A couple of spots (the carousel dots' scale, the command palette's entrance) have explicit reduced-motion overrides too — check `theme.css`'s media query and each component's own `@media (prefers-reduced-motion: reduce)` block before assuming a new animated property is covered.

## What's built

- **Theme file** — `src/styles/theme.css`: all color/font/spacing/motion tokens in one place, meant to be edited directly. Palette: warm cream bg (`--color-bg: #fbfaf7`), near-black ink, oxblood accent (`--color-accent: #7a2e2e`), Fraunces (display) + Inter (body) fonts loaded via Google Fonts in `index.html`.

- **Hero** — `src/sections/Hero.tsx` / `.css`:
  - Static code-texture background — `src/components/HeroCodeTexture.tsx` / `.css`. A real code snippet (the exam-timer logic, not lorem-code) rendered faint behind the hero text, denser toward the section's empty margins and fainter directly behind the text column. **Opacity is accessibility-tuned: capped at 6% specifically so `--color-text-muted` body copy stays at ~4.55–4.58:1 against it (WCAG AA needs 4.5:1).** Do not raise this without re-measuring contrast (composited texture color against `--color-bg`, then contrast of both text colors against that). It is `aria-hidden="true"`, `pointer-events: none`, `user-select: none`, clipped to the hero — **it must never become interactive or respond to the cursor.**
  - "Email me" button — copies the email to the clipboard on click (`navigator.clipboard.writeText`, falling back to legacy `document.execCommand('copy')`, then to a revealed-and-selected plain-text fallback if both fail). Shows "Copied!" for ~2s, announced via `aria-live`. It is a `<button>`, not a mailto link.
  - The "$" prompt glyph before the location line (`.hero__prompt` in `src/sections/Hero.css`) — **flagged for removal, not yet done.** See Open items.

- **Selected work carousel** — `src/sections/SelectedWork.tsx` / `.css` + `src/components/ProjectCard.tsx` / `.css`. Self-built horizontal scroll-snap carousel (no carousel library). Equal-size cards regardless of content length: collapsed card body is a fixed 420px, with the description/name clamped (`-webkit-line-clamp`) and the stack-tag list height-capped rather than letting any of them grow the card. Prev/Next buttons (disabled at the ends, not looped), pagination dots, an "X / Y" counter, full keyboard support (arrow keys navigate when the carousel region is focused), `aria-live` position announcements, and native touch/trackpad swipe via CSS `scroll-snap`. No autoplay anywhere. Each card has its own expandable "Read more" disclosure — highlights, the architecture-decision note, project links, and (for MIG Classroom) the live demo all live inside the expanded panel, not the always-visible collapsed face.
  - Scroll-containment fix applied after it regressed once already: the carousel viewport does not let vertical wheel/trackpad scroll move it sideways (`overflow-y: visible`, a defensive `onWheel` handler, `overscroll-behavior-x: contain`), and `body { overflow-x: hidden }` is a safety net against page-level horizontal scroll. Card-to-card navigation does **not** use `Element.scrollIntoView()` — that walks the whole scroll-ancestor chain (including the page) and was shifting the page's vertical scroll on every click. It uses `viewport.scrollTo({ left })` computed from `getBoundingClientRect()` instead, which only ever touches the carousel's own scroll position. If this area gets touched again, re-verify all four: no page horizontal scrollbar, vertical wheel scroll doesn't move the carousel, only arrows/dots/keys/swipe change cards, and navigating cards doesn't shift the page vertically.

- **⌘K command palette** — `src/components/CommandPalette.tsx` / `.css`. Global `⌘K` / `Ctrl+K` shortcut, plus a small trigger badge in the nav. Type to filter, arrow keys to move, Enter to run, Esc to close. Full focus trap while open; focus returns to whatever triggered it on close.

- **Exam-timer live demo** — `src/components/MigClassroomDemo.tsx` / `.css`, shown only on the MIG Classroom card (wired through an optional `demo` field on `Project` in `src/data/projects.ts`, so it's easy to add a demo to another project later). Collapsed by default behind a native `<details>` disclosure labeled "Try the exam timer". The logic is real, not simulated: remaining time is computed as `endAt - Date.now()` on every tick rather than decremented, so it stays correct if the tab is backgrounded. (An earlier "answer key stays server-side" illustration that lived alongside this demo was removed by request — this card's demo is just the timer now.)

- **Data files** — `src/data/profile.ts` (name/contact/links), `src/data/projects.ts` (the 5 selected-work projects, including each one's `highlights`, architecture `note`, and optional `demo`), `src/data/repos.ts` (the "more repos" grid — currently 2 entries after one was removed by request).

## Working rule for this project

After any change, verify it on a **real hard reload (Ctrl+Shift+R)**, not just the dev-server preview pane. Several real bugs this session only showed up on a genuine reload or a real (not synthetic/JS-dispatched) click — the automated testing environment used during development has its own quirks (e.g. programmatic clicks not always matching real trusted-gesture behavior) that don't reflect how an actual visitor's browser behaves, so treat anything only checked via a script-dispatched event as unverified.

When touching the hero code texture specifically, **report the measured WCAG contrast numbers** — the composited background color at the texture's opacity, and the resulting contrast ratio for both `--color-text-muted` (needs ≥4.5:1, normal text) and `--color-text` (needs ≥3:1, large text). Don't eyeball it or assume a change is safe without recalculating.

## Open items

1. **Remove the hero "$" prompt glyph** — the small accent-colored `$` before "Alexandria, Egypt" in `src/sections/Hero.tsx` (rendered via `<span className="hero__prompt">`), styled in `src/sections/Hero.css`. Requested for removal; not yet done.
2. **Finishing pass**:
   - Real favicon (`public/favicon.svg` is still the Vite scaffold default)
   - OpenGraph tags in `index.html` (title/description meta are already real and specific; OG tags are not added yet)
   - A full `prefers-reduced-motion` audit across every component in one pass (spot-checked component-by-component throughout the build, never re-verified end-to-end as a single sweep)
   - A clean production build check (`npm run build`) immediately before launch
3. **Launch**:
   - Connect a custom domain (intentionally not done — no host or domain was assumed anywhere in the build)
   - Confirm no "Made with AI" / platform badge appears anywhere once actually deployed
