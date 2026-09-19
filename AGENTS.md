# Kepio — rules for AI agents

Read this file completely before doing anything. It applies to every task in this repo.

## What this project is
**Kepio** (pronounced "KEE-pee-oh", from "keep it") is a personal notebook web app. People save useful things they find on Telegram and the web (jobs, freelance gigs, courses, tools, rentals, articles), organize them, and act on them.
Flow: **Find → Keep → Act**.
Visual language: **Paper UI** — warm stationery, ruled dividers, folder tabs, stamps, sticky notes. Clean enough for long reading and forms.
The site is **bilingual from day one: Uzbek (Latin) and English**. Russian may come later, so the i18n structure must make adding a locale cheap.

The owner is a developer and teacher and must be able to **explain every line in an interview**. So: simple, readable code, small files, obvious names, short comments explaining *why*. No clever abstractions, no over-engineering.

## Language rules
- Talk to the owner in **Uzbek (Latin)**. Keep English technical terms as they are (component, route, bundle...).
- Code, comments, commit messages: **English**.
- UI copy exists in **both** `uz` and `en`. Never hardcode UI strings in components.
- Dictionaries: `apps/web/src/content/types.ts` (a `Dictionary` type), `uz.ts` and `en.ts` (both typed as `Dictionary`, so a missing key is a compile error). Adding a string means adding it in both.
- English copy must read naturally (not literal translation). Uzbek copy follows the Uzbek typography rules below.
- User-saved content (titles, notes) is never translated; it stays in whatever language the user wrote.

## i18n architecture (no i18n library in v1)
- Locales: `uz`, `en`. Default/fallback locale: `uz`.
- URLs are prefixed: `/uz/...` and `/en/...` (`app/[lang]/...`). Route slugs are English for both locales (`library`, `daily`, `archive`, `settings`, `sign-in`).
- `generateStaticParams` returns both locales so the landing is **statically generated per locale**.
- `<html lang>` is set from the route param. `/` redirects to `/uz` or `/en` using `Accept-Language` (use the request-interception file convention of the **installed** Next.js version — check its docs — and keep it tiny).
- A language switcher (`UZ | EN`) in header and footer links to the same page in the other locale, with `lang` and `hreflang` attributes.
- Pass **only the strings a client component needs** as props; never import a whole dictionary into client code.
- Dates/numbers via `Intl` with the active locale.

## Stack
- **Frontend (phase 1, now):** Next.js (App Router, latest stable) + React + TypeScript (`strict`) + Tailwind CSS with design tokens as CSS variables.
- Fonts via `next/font` (self-hosted): **Source Serif 4** (text/headings) + **Courier Prime** (mono labels).
- Icons: inline SVG or `lucide-react` (named imports only).
- Tests: Playwright + `@axe-core/playwright`, run for **both locales**.
- **Backend (phase 2, NOT now):** separate Node.js + Express + PostgreSQL in `apps/api`. Until then the frontend uses a **mock API adapter** behind a typed interface, so swapping to the real API later changes one folder.
- Do NOT add: UI kits (MUI, Chakra, shadcn), CSS-in-JS runtimes, animation libraries, state libraries, i18n libraries, or any dependency you cannot justify in one sentence. Prefer zero new dependencies.

## Non-negotiable quality bars

### Performance (mobile Lighthouse, throttled)
- Landing (each locale): Performance ≥ 95. Other pages ≥ 90.
- Core Web Vitals targets: LCP < 2.5 s, INP < 200 ms, CLS < 0.1.
- **Server Components by default.** `"use client"` only where truly interactive (search box, toggles, forms, status control).
- Landing is **statically generated**. No images above the fold — LCP element is the `<h1>` text. First-load JS ≤ 100 KB gzip.
- **No photographs anywhere.** All decoration is CSS/SVG.
- Paper grain: ONE tiny inline SVG-noise data URI (< 2 KB) on ONE fixed, `pointer-events: none` pseudo-element. Never a large image, never on many elements.
- Animate only `transform` and `opacity`. Respect `prefers-reduced-motion`.
- Fonts: only used weights, `display: swap`, subsets `latin` + `latin-ext`. Total font transfer ≤ 120 KB.
- Long lists: paginate; `content-visibility: auto` on list items.
- Reserve space for everything so CLS stays ≈ 0.
- Set the reduced-decoration attribute with a tiny blocking inline script in `<head>` (no flash). **Do not** read cookies in the root layout — that would make the whole site dynamic and kill the static landing.

### Accessibility (WCAG 2.2 AA, target: axe reports 0 violations)
- One `<h1>` per page, logical heading order, landmarks, a working **skip link** (translated).
- Text contrast ≥ 4.5:1, UI components/borders/focus ≥ 3:1. **Compute contrast in code**; never trust numbers written in a design.
- Body text ≥ 17 px, mono labels ≥ 12 px, line length ≤ 68ch. Click/touch targets ≥ 44×44 px on mobile (never below 24×24).
- Visible focus everywhere: `outline: 2px solid var(--ink); outline-offset: 3px`.
- Status is never color-only: stamps always carry a text label.
- Forms: real `<label>`, `aria-invalid`, errors linked with `aria-describedby`, an error summary that receives focus on submit, correct `autocomplete`/`type`/`inputmode`. Placeholders are hints, not labels.
- Filter tabs are **links** (URL state) with `aria-current="page"` — not fake ARIA tabs. Status control is a `radiogroup`.
- Decorative pieces (pins, rotated stamps, hero preview) are `aria-hidden`.
- Live feedback uses `aria-live="polite"`.
- Keyboard: everything operable. Only shortcut: `Ctrl/⌘+K` focuses search. (No `Ctrl+N`, no single-key shortcuts.)
- The language switcher has an accessible name and marks the current language with `aria-current`.
- `prefers-reduced-motion` and `prefers-contrast: more` → decoration off.

### SEO
- Metadata API on every page, **per locale**: unique `title` (< 60 chars), `description` (120–160 chars), canonical, `alternates.languages` (`uz`, `en`, `x-default` → `/en`), Open Graph (with `locale`), Twitter card.
- Only the landing is indexable. Sign-in and app routes: `robots: { index: false }`.
- `app/sitemap.ts` lists both locales with alternates; `app/robots.ts`; a generated `opengraph-image` per locale; JSON-LD `WebApplication` with `inLanguage` (truthful fields only, no invented ratings/prices).
- Semantic HTML first; public pages must not depend on client-side JS for content.
- Site URL from `NEXT_PUBLIC_SITE_URL` (document in `.env.example`).

### Security basics
- `next.config`: `poweredByHeader: false`; headers: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (deny camera/mic/geolocation), `frame-ancestors 'none'`.
- No secrets in the repo. Use `.env.example`.

### Uzbek typography (applies to `uz` copy)
- Use `ʻ` (U+02BB) in **oʻ / gʻ** (Oʻzbekiston, gʻoya, oʻqildi). Use `ʼ` (U+02BC) for the tutuq belgisi (eʼlon, taʼmirlangan). Never a straight `'` or curly quote as a letter.
- Every font must render `Oʻzbekiston · gʻoya · oʻqildi · eʼlon` correctly before it is accepted.
- **Labels never wrap or clip** (both languages; English is often longer or shorter — test both). Tabs, stamps, buttons, chips and mono labels use `white-space: nowrap`; long content truncates with an ellipsis or scrolls. Use `min-width: 0` in flex/grid children.

## Design fidelity
- Screenshots in `/design` are the visual reference. **Copy the look, not the bugs.** Known defects are listed in `docs/01-frontend-prompt.md` — fix them.
- No fake social proof: no invented user counts, testimonials, or ratings. No promises about features that do not exist yet (mark them "Tez orada" / "Coming soon").

## How to work
1. **Plan first.** Produce an implementation plan and wait for the owner's approval before writing code.
2. Work **one phase at a time**. After each phase run `npm run lint && npm run typecheck && npm run build` and the tests, then commit (small, clear message), summarize in Uzbek what was done and what to check manually, and **STOP**. Do not start the next phase until told.
3. If a prompt conflicts with these rules, follow these rules and tell the owner.
4. If unsure, ask one short question instead of guessing.
5. Report **measured** numbers (Lighthouse, axe, bundle size) — never estimates.
