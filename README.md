# Kepio — Personal Notebook Web App

**Kepio** (pronounced "KEE-pee-oh", from "keep it") is a personal notebook web app in **Paper UI** style. People save useful things they find on Telegram and the web (jobs, freelance gigs, courses, tools, rentals, articles), organize them, and act on them.

Flow: **Find → Keep → Act**.

## Features
- **Paper UI Visual Language**: Warm stationery, ruled dividers, folder tabs, stamps, and sticky notes.
- **Bilingual by Design**: Uzbek (Latin) and English (`/uz` and `/en`).
- **High Performance**: Static landing page per locale, sub-100KB first-load JS, zero unneeded dependencies.
- **Accessibility**: WCAG 2.2 AA compliant, full keyboard operability, visible focus rings, reduced-decoration mode.
- **Mock API Adapter**: Strongly-typed frontend API adapter ready for backend integration in Phase 2.

## Quick Start
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run contrast checks
npm run contrast

# Typecheck & Build
npm run typecheck
npm run build
```

## Structure
- `apps/web`: Next.js frontend application (App Router, Tailwind CSS, TypeScript).
- `scripts/`: Contrast and validation utilities.
- `design/`: Design references and system specifications.
