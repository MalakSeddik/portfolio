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
- Every animated/transitioning property must respect `prefers-reduced-motion`. The pattern used throughout: `--transition-fast` / `--transition-base` in `src/styles/theme.css` collapse to `0ms` under reduced motion, so most components get this for free just by using those variables instead of hardcoding durations. A couple of spots (the carousel dots' width change, the command palette's entrance) have explicit reduced-motion overrides too — check `theme.css`'s media query and each component's own `@media (prefers-reduced-motion: reduce)` block before assuming a new animated property is covered.

## What's built

- **Theme file** — `src/styles/theme.css`: all color/font/spacing/motion tokens in one place, meant to be edited directly. Palette: warm cream bg (`--color-bg: #fbfaf7`), near-black ink, oxblood accent (`--color-accent: #7a2e2e`), Fraunces (display) + Inter (body) fonts loaded via Google Fonts in `index.html`.

- **Hero** — `src/sections/Hero.tsx` / `.css`:
  - Static code-texture background — `src/components/HeroCodeTexture.tsx` / `.css`. A real code snippet (the exam-timer logic, not lorem-code) rendered faint behind the hero text, denser toward the section's empty margins and fainter directly behind the text column. **Opacity is accessibility-tuned: capped at 6% specifically so `--color-text-muted` body copy stays at ~4.55–4.58:1 against it (WCAG AA needs 4.5:1).** Do not raise this without re-measuring contrast (composited texture color against `--color-bg`, then contrast of both text colors against that). It is `aria-hidden="true"`, `pointer-events: none`, `user-select: none`, clipped to the hero — **it must never become interactive or respond to the cursor.**
  - "Email me" button — copies the email to the clipboard on click (`navigator.clipboard.writeText`, falling back to legacy `document.execCommand('copy')`, then to a revealed-and-selected plain-text fallback if both fail). Shows "Copied!" for ~2s, announced via `aria-live`. It is a `<button>`, not a mailto link.
  - The location eyebrow ("Alexandria, Egypt") is plain text with no leading glyph; the earlier accent-colored "$" prompt (`.hero__prompt`) was removed by request, along with its CSS rule. The `~/projects/...` path labels on project cards and the caret in the command palette were intentionally kept.

- **Selected work carousel** — `src/sections/SelectedWork.tsx` / `.css` + `src/components/ProjectCard.tsx` / `.css`. Self-built horizontal scroll-snap carousel (no carousel library). Equal-size cards regardless of content length: collapsed card body is a fixed 420px, with the description/name clamped (`-webkit-line-clamp`) and the stack-tag list height-capped rather than letting any of them grow the card. Prev/Next buttons (thin-bordered circles with an SVG chevron; disabled at the ends, not looped), pagination dots (inactive = small muted dot, active = 20px accent bar, 150ms width transition that goes instant under reduced motion; no separate "X / Y" counter, dropped as redundant), full keyboard support (arrow keys navigate when the carousel region is focused), `aria-live` position announcements, and native touch/trackpad swipe via CSS `scroll-snap`. No autoplay anywhere. Each card has its own expandable "Read more" disclosure — highlights, the architecture-decision note, project links, and (for MIG Classroom) the live demo all live inside the expanded panel, not the always-visible collapsed face.
  - Peek + edge fades: each slide is `calc((100% - gap) / 1.1)` wide, so exactly one full card plus a 10%-of-a-card peek of the next is visible at every width. A background-color gradient (`.carousel__frame::before/::after`, `pointer-events: none`, exactly the peek width) fades whichever edge has a card cut off. Which edge fades is decided from slide geometry (a slide straddling that edge), not scroll position, so at a middle snap point the flush-left visible card is never dimmed; at the end the left fade covers the previous card's sliver. Overlays rather than `mask-image` on purpose: a mask would clip the viewport's focus outline.
  - Scroll-containment fix applied after it regressed once already: the carousel viewport does not let vertical wheel/trackpad scroll move it sideways (`overflow-y: visible`, a defensive `onWheel` handler, `overscroll-behavior-x: contain`), and `body { overflow-x: hidden }` is a safety net against page-level horizontal scroll. Card-to-card navigation does **not** use `Element.scrollIntoView()` — that walks the whole scroll-ancestor chain (including the page) and was shifting the page's vertical scroll on every click. It uses `viewport.scrollTo({ left })` computed from `getBoundingClientRect()` instead, which only ever touches the carousel's own scroll position. If this area gets touched again, re-verify all four: no page horizontal scrollbar, vertical wheel scroll doesn't move the carousel, only arrows/dots/keys/swipe change cards, and navigating cards doesn't shift the page vertically.

- **More repos grid** — `src/sections/MoreRepos.tsx` / `.css` + `src/components/RepoCard.tsx` / `.css`. Repo names are long unbroken tokens, so containment is layered: `minmax(0, 1fr)` grid tracks at every width, `min-width: 0` on the card and name, `<wbr>` inserted after each `_`/`-` (preferred break points), `overflow-wrap: anywhere` as the fallback, and a wrapping header so the language tag drops below a long name instead of squeezing it.

- **⌘K command palette** — `src/components/CommandPalette.tsx` / `.css`. Global `⌘K` / `Ctrl+K` shortcut, plus a small trigger badge in the nav. Type to filter, arrow keys to move, Enter to run, Esc to close. Full focus trap while open; focus returns to whatever triggered it on close.

- **Exam-timer live demo** — `src/components/MigClassroomDemo.tsx` / `.css`, shown only on the MIG Classroom card (wired through an optional `demo` field on `Project` in `src/data/projects.ts`, so it's easy to add a demo to another project later). Collapsed by default behind a native `<details>` disclosure labeled "Try the exam timer", styled as one connected panel: a "Live demo" eyebrow (plain `.section-kicker`, same as the card's category label) 8px above it, the whole block using the panel's shared rhythm (24px top / 40px inline padding, no divider of its own) so it aligns with the text above, a bordered box with a 2px accent rule on the left, the summary as a full-width header row (accent SVG chevron that rotates 90deg on open via `--transition-base`, surface-tint hover, inset focus ring because the box is `overflow: hidden`), and the timer block as the body below a hairline divider. The logic is real, not simulated: remaining time is computed as `endAt - Date.now()` on every tick rather than decremented, so it stays correct if the tab is backgrounded. (An earlier "answer key stays server-side" illustration that lived alongside this demo was removed by request — this card's demo is just the timer now.)

- **Data files** — `src/data/profile.ts` (name/contact/links), `src/data/projects.ts` (the 5 selected-work projects, including each one's `highlights`, architecture `note`, and optional `demo`), `src/data/repos.ts` (the "more repos" grid — currently 2 entries after one was removed by request).

## Working rule for this project

After any change, verify it on a **real hard reload (Ctrl+Shift+R)**, not just the dev-server preview pane. Several real bugs this session only showed up on a genuine reload or a real (not synthetic/JS-dispatched) click — the automated testing environment used during development has its own quirks (e.g. programmatic clicks not always matching real trusted-gesture behavior) that don't reflect how an actual visitor's browser behaves, so treat anything only checked via a script-dispatched event as unverified. Also confirm a reload actually happened: a Ctrl+Shift+R key press sent to the in-app preview pane was observed silently doing nothing (the page was 20+ minutes old and only had Vite HMR updates). Check `performance.now()` is a few seconds, or navigate to the URL fresh.

When touching the hero code texture specifically, **report the measured WCAG contrast numbers** — the composited background color at the texture's opacity, and the resulting contrast ratio for both `--color-text-muted` (needs ≥4.5:1, normal text) and `--color-text` (needs ≥3:1, large text). Don't eyeball it or assume a change is safe without recalculating.

## Open items

1. **Mobile page-width overflow (pre-existing, found while fixing repo cards)** — at 375px the document's `scrollWidth` is ~1314px, so a phone can zoom out / pan sideways. Hiding `.carousel__track` brings it back to 375, so the carousel's off-screen slides are leaking into page width despite `.carousel__viewport` being `overflow-x: auto` and `body { overflow-x: hidden }`. Present at commit fa0cdd6 too (1320px), so not caused by the peek/fade work. Not yet fixed.
2. **Finishing pass — done 2026-09-27**, verified against the production build (`npm run build` + `vite preview`, config `portfolio-build` in `.claude/launch.json`):
   - Head: title "Malak Seddik — Software Engineer", 148-char description, OG + Twitter (`summary`) tags, `lang="en"`. **`og:url` is a placeholder (`https://YOUR-DOMAIN.example/`) — replace at launch.** No `og:image` (no real share image exists yet), hence `summary` not `summary_large_image`.
   - Favicon: `public/favicon.svg` is now an accent "M" monogram on the cream bg (Vite default removed).
   - Reduced-motion audit: forced every `prefers-reduced-motion: reduce` block + `matchMedia` on the built page, then scanned every element/pseudo-element (zero non-zero transitions/animations) and exercised each interaction for real — carousel jumps in one scroll event, card panel lands at full height with 0s transition, dot width / disclosure chevron / timer bar 0s, palette opens at opacity 1 / transform none with a steady caret. There is no on-load hero reveal (no animation runs on load at all).
   - A11y: collapsed project-card panels are now `inert` (previously their hidden links/buttons were Tab-reachable while `aria-hidden` — a real WCAG failure). All 29 Tab stops show the 2px accent ring; the palette input uses an accent bottom border instead (deliberate). `↗` glyphs in link text are `aria-hidden`. Contrast: lowest is the inline `code` chip in the exam demo at 4.59:1; muted text over the hero texture 4.57:1 (composite #eeeeeb), body text 14.93:1.
3. **Launch**:
   - Connect a custom domain (intentionally not done — no host or domain was assumed anywhere in the build)
   - Confirm no "Made with AI" / platform badge appears anywhere once actually deployed
