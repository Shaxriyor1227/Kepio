# Task: build the Kepio frontend (phase 1)

Read `AGENTS.md` first, then this file completely. **Start with an implementation plan only — no code until the owner approves it.**

## 1. Goal
A fast, accessible, SEO-friendly, **bilingual (uz + en)** frontend for Kepio in Paper UI style, running on a **mock API** (no backend yet). The landing is static and indexable in both languages; app pages work with mock data.

## 2. Design reference (`/design`)
| File | Screen | Becomes |
|---|---|---|
| `01-kutubxona.png` | Library (Uzbek copy) | `/[lang]/library` |
| `02-landing.png` | Landing (Uzbek copy) | `/[lang]` |
| `03-specs.png` | Design-system spec sheet (English) | `/dev/specs` (dev only, 404 in production, outside `[lang]`) |
| `04-kun-tartibi.png` | Daily register + quick entry + table (English) | `/[lang]/daily` |

Not designed yet — build from the same tokens/components: `/[lang]/sign-in`, `/[lang]/library/[id]` (detail), `/[lang]/library/new`, `/[lang]/archive`, `/[lang]/settings` (minimal).

The screenshots are drawn with the old name "Daftar" and mixed languages. **Use them for layout, spacing and component look — not for copy or the brand name.** All copy comes from the dictionaries (section 6). The brand is **KEPIO** (wordmark uppercase in the header, "Kepio" in prose).

## 3. Known defects in the screenshots — FIX, do not copy
1. **Text wraps/clips inside small labels** (header stamp, user chip, search hint, tab "UY-JOY", "YANGI TOIFA", sort/filter selects, pagination label, tags). → `white-space: nowrap`, enough padding/height, horizontal scroll for the tab strip. Verify in **both** languages.
2. **Dark labels on dark backgrounds** ("TAKLIFNOMA", "BOSQICH 03"). → always pair `--ink` backgrounds with `--on-ink` text.
3. **Sticky notes cover content** in the hero preview. → reserve margin space; below 1024 px show only one note.
4. **Floating add button overlaps the footer** and wraps. → `nowrap`, page bottom padding, compact bottom-right button on mobile (≥ 44 px).
5. **Low-contrast small text** (gray mono meta, tab counts, placeholders, 11 px labels). → min 12 px, ≥ 4.5:1.
6. **Photos** in screens 03 and 04. → no photos anywhere.
7. **Fake / unbuilt claims**: "12,400+ saqlangan qaydlar", the "Sardor Ibrohimov" testimonial, "Pro" badge, "SINXRON: FAOL", working Telegram-bot / Chrome-extension buttons, "no credit card" line, fixed demo date on the stamp. → remove numbers, testimonial, Pro badge, sync indicator. Show bot/extension as disabled with "Tez orada" / "Coming soon". Replace the testimonial with the product statement (section 6), **no person attributed**.
8. **`⌘N` hint** (browsers reserve it). → drop; keep `Ctrl/⌘+K` for search.
9. **Mixed apostrophes** in Uzbek copy → follow the Uzbek typography rule.
10. **Header inconsistency** between screens → one shared header (section 5).
11. **Typo:** pagination says "VARAK"; correct Uzbek is "Varaq".

## 4. Design tokens (from `03-specs.png`; read exact values from the image — these are the starting point)
```css
:root {
  --paper:      #fef9ec;  /* page & sheets */
  --desk:       #f2eee1;  /* header/footer band, inset wells */
  --rule:       #e7e2d5;  /* dividers, borders */
  --ink:        #09150e;  /* primary text, primary button bg */
  --ink-2:      #1e2a22;
  --ink-soft:   #3d463f;  /* body text on paper */
  --ink-muted:  #5c6259;  /* mono meta (verify ≥ 4.5:1) */
  --on-ink:     #fef9ec;  /* text on --ink backgrounds */
  --seal:       #a7382e;  /* stamps, accents, "new" */
  --sticky-yellow: #f5ecb4;
  --sticky-green:  #dde8cd;
  --sticky-rose:   #ebd9d0;
  --focus:      var(--ink);
  --shadow-sheet: 0 1px 0 rgb(0 0 0 / .06), 0 8px 16px -10px rgb(0 0 0 / .35);
  --shadow-sticky: 0 6px 12px -8px rgb(0 0 0 / .35);
  --radius: 2px;
}
```
- Type: headings **Source Serif 4** (600–700, tight leading); body Source Serif 4 400, 17–18 px / 1.65; labels **Courier Prime** 12 px uppercase, `letter-spacing: .08em`. H1: `clamp(2.5rem, 6vw, 4.5rem)`.
- Write `scripts/contrast.mjs` that checks every text/background pair and prints a table. If a token fails, adjust it slightly and tell the owner.
- Light theme only in v1.

## 5. Shared building blocks
`components/paper/`: `Sheet`, `FolderTab` (link-based), `Stamp` (new / read / done / archived; plain bordered label in reduced mode), `StickyNote` (yellow/green/rose, optional pin), `Rule`, `PaperButton` (primary ink / secondary outline / danger seal; hard offset shadow, 1 px hover lift, focus ring), `Field`, `Tag`, `Pagination`, `QuoteBlock` (red left border).
`components/layout/`: `SiteHeader` (landing), `AppHeader` (wordmark "KEPIO" + stamp, search, user chip; second row nav: Library · Daily · Archive · Settings with `aria-current`), `LanguageSwitcher`, `Footer` (with reduced-decoration toggle), `SkipLink`, `FloatingAddButton`.
The vertical red edge tab ("KEPIO") is decorative: `aria-hidden`, hidden below 1024 px.

## 6. Dictionaries (`content/uz.ts`, `content/en.ts`)
Both implement `Dictionary`. Key copy (write the rest in the same voice; English must be natural, not literal):

| Key | uz | en |
|---|---|---|
| hero eyebrow | KEPIO / KEE-pee-oh · keep it | KEPIO / KEE-pee-oh · keep it |
| hero h1 | Foydali narsani topding. *Endi yoʻqotma.* | You found something useful. *Now don't lose it.* |
| primary CTA | Saqlashni boshlash → | Start keeping → |
| secondary link | Qanday ishlaydi | How it works |
| steps | Top → Saqla → Bajar | Find → Keep → Act |
| product statement | “Eslab qolishni bizga qoldir. Sening ishing — bajarish.” | “Leave the remembering to us. Your job is to act.” |
| micro-claims | Oʻzbekcha va inglizcha · Reklamasiz | Uzbek & English · No ads |
| header stamp | SHAXSIY BILIMLAR | PERSONAL NOTES |
| nav | Kutubxona · Kun tartibi · Arxiv · Sozlamalar | Library · Daily · Archive · Settings |
| stamps | YANGI · OʻQILDI · BAJARILDI · ARXIVLANDI | NEW · READ · DONE · ARCHIVED |
| collections | Barchasi · Ish · Freelance · Kurslar · Uy-joy · Asboblar | All · Jobs · Freelance · Courses · Housing · Tools |
| add button | Saqlash → | Save → |
| coming soon | Tez orada | Coming soon |

Screens 03/04 have archival wording ("Folio", "Ledger", "Seal ledger volume"). Re-map to Kepio's domain: "Daily register" = today's saved items + quick entry; "Seal ledger volume" = "Close the day"; "Ledger health audit" = usage/progress card.

## 7. Pages (all under `/[lang]`, English slugs)
**`/` Landing (static per locale).** Hero (eyebrow, h1, subtitle, primary CTA → `/sign-in`, secondary link → `#how-it-works`). Hero preview sheet is **pure CSS/HTML, `aria-hidden`, no images**. Section "Find → Keep → Act" (3 steps). Product-statement quote block. Final CTA block (bot/extension shown disabled, "Coming soon"). Only true micro-claims. Footer links only to pages that exist.

**`/library`.** Collection tabs as links (+ disabled "new collection"), search (debounced 250 ms, `router.replace` inside `startTransition`), status chips with counts, sort select. 6 items per page, pagination ("Page 1 / 7 · 42 total"). Item card: source label + meta, title, 2-line summary, tags, external link, status stamp. Margin column ("From the margin") with **max 3** sticky notes + stats card. **All filters in the URL**: `?collection=jobs&status=new&q=go&sort=recent&page=2`. Empty state + loading skeleton (no shimmer).

**`/library/[id]`.** Breadcrumb, h1, meta row, ruled divider, body (≤ 68ch), quote block, margin: sticky "Next step" (checkbox + deadline), tags, status control (radiogroup: New → Read → Done → Archive). Optimistic client state in phase 1.

**`/library/new`.** Layered sheet form: link or text, title, source (Telegram / Web / Other), collection (radio group styled as tabs), tags (chip input, keyboard operable), note, deadline. Validation with error summary + inline errors, visible focus, success toast (`aria-live`). Submit adds to the in-memory store.

**`/daily`** (from `04-kun-tartibi.png`). Title + stamp + meta strip, quick-entry form, entries as a real `<table>` with `<caption>` and `<th scope>` (date · source · content · status); below 768 px wrap in a focusable labelled horizontal-scroll region. Right column: sticky memo, actions (CSV export client-side, Print → `window.print()`), progress card (mock numbers).

**`/sign-in`.** One sheet, two link-tabs (Sign in / Sign up), email, password (show/hide), name (sign-up). Fake submit → redirect to `/library`. `noindex`.

**`/archive`, `/settings`.** Minimal valid pages; settings hosts the reduced-decoration toggle and a language choice.

**`/dev/specs`** (no `[lang]`). Rebuild of `03-specs.png`: palette, type scale, component states, and the **contrast table computed from tokens**. `notFound()` when `NODE_ENV === 'production'`.

Also: `not-found.tsx`, `error.tsx`, `loading.tsx` for data routes (localized).

## 8. Mock API (`src/lib/api/`)
- `types.ts`: `Signal { id, title, summary, url?, sourceType, sourceLabel, collection, tags: string[], status: 'new'|'read'|'done'|'archived', note?, deadline?, createdAt }`.
- `client.ts`: `SignalsApi` — `list({collection,status,q,sort,page,pageSize})` → `{items,total,counts}`, `get(id)`, `create(input)`, `updateStatus(id,status)`.
- `mock.ts` + `seed.ts`: deterministic seed of **42 realistic items** (jobs, courses, rentals, tools, articles), roughly half Uzbek and half English titles (user content is not translated). In-memory store.
- Pages import only `api` from `client.ts`; swapping to Express in phase 2 must touch only this folder.

## 9. Responsive, print, reduced decoration
- Breakpoints 360 / 390 / 768 / 1024 / 1440. ≥ 1024: two columns with margin column. < 1024: margin column moves below the list. < 640: one column, tab strip scrolls (scroll-snap), compact add button.
- **Print** (`print.css`): hide nav, floating button, pins, tabs; white paper, black ink; no shadows; `break-inside: avoid`; show link URLs after external links.
- **Reduced decoration** (`html[data-decor="off"]`): no grain, no shadows (1 px borders), no rotation, stamps → plain bordered labels, sticky notes flat with borders, no transitions. Toggle in footer + settings, persisted in `localStorage`, applied by the head script before paint; auto-on for `prefers-contrast: more`.

## 10. Structure
```
kepio/
├─ AGENTS.md  ├─ .env.example  ├─ README.md  ├─ package.json (workspaces: apps/*)
├─ design/  ├─ docs/  ├─ scripts/contrast.mjs
└─ apps/web/
   ├─ next.config.ts  ├─ playwright.config.ts
   ├─ tests/ (a11y.spec.ts, keyboard.spec.ts, i18n.spec.ts)
   └─ src/
      ├─ app/
      │  ├─ [lang]/
      │  │  ├─ layout.tsx  page.tsx  not-found.tsx  error.tsx
      │  │  ├─ sign-in/page.tsx
      │  │  └─ (app)/{layout.tsx, library/{page,loading,[id]/page,new/page}, daily/, archive/, settings/}
      │  ├─ dev/specs/page.tsx
      │  ├─ sitemap.ts  robots.ts  opengraph-image (per locale)
      ├─ components/{paper,layout,signals}/
      ├─ content/{types.ts,uz.ts,en.ts}
      ├─ lib/{i18n.ts,api/,format.ts,cn.ts}
      └─ styles/{globals.css,print.css}
```
(`apps/api` is created in phase 2 — do not create it now.)

## 11. Phases — stop after each one
| # | Phase | Done when |
|---|---|---|
| 0 | Implementation plan (no code) | Owner approves |
| 1 | Foundation: repo, Next app, tokens, fonts, global CSS, **i18n scaffolding (routing, dictionaries, switcher)**, layouts, decor toggle, `paper/` primitives, `/dev/specs`, `scripts/contrast.mjs` | `build` passes; `/uz` and `/en` both render; `/dev/specs` shows every primitive; contrast table has no failures; axe = 0 violations |
| 2 | Landing `/uz` and `/en` | Lighthouse mobile per locale: Perf ≥ 95, A11y 100, SEO ≥ 95, BP ≥ 95; first-load JS ≤ 100 KB gz; metadata, hreflang, sitemap, robots, OG images, JSON-LD present; no label wraps in either language |
| 3 | Mock API + `/library`, detail, new | Filters/search/pagination live in the URL and survive refresh; form errors accessible; keyboard-only run-through passes; both locales |
| 4 | `/daily`, `/sign-in`, `/archive`, `/settings` | All routes render in both locales; axe = 0 violations |
| 5 | Polish: print, reduced mode, responsive QA, Playwright tests (both locales), README | Tests green; Lighthouse ≥ 90 on every route; screenshots for 360 / 768 / 1440 in both languages |

## 12. Out of scope in phase 1
Real backend, real auth, database, Telegram bot, Chrome extension, payments, dark mode, Russian (but structure must allow adding it), analytics.

## 13. Report after each phase (in Uzbek)
1. What was built. 2. Commands to run/check. 3. **Measured** results (Lighthouse, axe, bundle size). 4. Deviations from this prompt and why. 5. What you need from the owner.
