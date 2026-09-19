---
name: Paper UI
colors:
  surface: '#fef9ec'
  surface-dim: '#dedacd'
  surface-bright: '#fef9ec'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f3e6'
  surface-container: '#f2eee1'
  surface-container-high: '#ede8db'
  surface-container-highest: '#e7e2d5'
  on-surface: '#1d1c14'
  on-surface-variant: '#434844'
  inverse-surface: '#323128'
  inverse-on-surface: '#f5f0e3'
  outline: '#747873'
  outline-variant: '#c3c8c2'
  surface-tint: '#556258'
  primary: '#09150e'
  on-primary: '#ffffff'
  primary-container: '#1e2a22'
  on-primary-container: '#849287'
  inverse-primary: '#bccabe'
  secondary: '#a7382e'
  on-secondary: '#ffffff'
  secondary-container: '#fd7868'
  on-secondary-container: '#700f0b'
  tertiary: '#10140d'
  on-tertiary: '#ffffff'
  tertiary-container: '#242920'
  on-tertiary-container: '#8b9085'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e6da'
  primary-fixed-dim: '#bccabe'
  on-primary-fixed: '#121e17'
  on-primary-fixed-variant: '#3d4a41'
  secondary-fixed: '#ffdad5'
  secondary-fixed-dim: '#ffb4aa'
  on-secondary-fixed: '#410001'
  on-secondary-fixed-variant: '#872019'
  tertiary-fixed: '#e0e4d7'
  tertiary-fixed-dim: '#c4c8bb'
  on-tertiary-fixed: '#181d15'
  on-tertiary-fixed-variant: '#43483f'
  background: '#fef9ec'
  on-background: '#1d1c14'
  surface-variant: '#e7e2d5'
typography:
  display-lg:
    fontFamily: Source Serif 4
    fontSize: 44px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Source Serif 4
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Source Serif 4
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Source Serif 4
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Source Serif 4
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Source Serif 4
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
  title-md:
    fontFamily: Source Serif 4
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Source Serif 4
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Source Serif 4
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Source Serif 4
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Courier Prime
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
  label-md:
    fontFamily: Courier Prime
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 14px
    letterSpacing: 0.12em
  label-sm:
    fontFamily: Courier Prime
    fontSize: 10px
    fontWeight: '400'
    lineHeight: 12px
    letterSpacing: 0.14em
spacing:
  gutter: 1.5rem
  margin: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system translates the quiet dignity, tactility, and editorial restraint of physical stationery into an elevated digital medium. It is engineered for long-form contemplation, rigorous note-taking, and meticulous form design. 

The emotional tone balances academic poise with artisan warmth—evoking archival ledgers, heavy stock paper, precision drafting rulers, and hand-inked stamps. Rather than falling into ornamental scrapbooking or nostalgic skeuomorphism, the visual philosophy is disciplined, modern, and typographically strict. Layouts feel like freshly laid sheets of milled paper resting on a study desk: balanced, breathable, purposeful, and durable over hours of sustained focus.

## Colors

The color architecture is derived from raw archival materials: sunlit rag paper, deep carbon ink, faded rules, and functional seal wax.

- **Primary (`#1E2A22`)**: Deep evergreen ink. Used for headlines, high-emphasis text, primary borders, and structural outlines. Yields maximum legibility and contrast against light paper grounds without the harshness of pitch black.
- **Secondary (`#A3352B`)**: Stamp red. Reserved for critical verification marks, archival stamps, destructive triggers, and singular accents that simulate physical ink pads.
- **Tertiary (`#4A4F45`)**: Soft carbon ink. Used for secondary body text, metadata, captions, and structural guidelines that support without demanding primary attention.
- **Neutral (`#F6F1E4`)**: Foundation paper stock. Serves as the primary canvas ground, establishing warmth across the entire interface.
- **Supporting Surfaces & Highlights**:
  - `paper-2` (`#EFE8D6`): Desk surface and low-tier recessed backing.
  - `rule` (`#D8CDB4`): Hairline rules, dividers, and ledger borders.
  - `sticky-yellow` (`#F7EEB4`), `sticky-green` (`#DDE8C6`), `sticky-rose` (`#EBD9CF`): Subtle status surfaces, margin annotations, callouts, and system tags.

## Typography

Typography establishes an intentional contrast between the literary pacing of classical serif text and the systematic precision of typewriter monospaces.

- **Editorial Headings & Body**: Source Serif 4 anchors the reading experience. Headings are set tight, weighted, and commanding without aggressive tracking. Body copy adheres strictly to a readable 17px base with a 1.65 line-height ratio, preventing eye fatigue across deep blocks of text.
- **Labels, Forms, & Index Metadata**: Set in monospaced uppercase with generous tracking (`0.12em` to `0.14em`). This mirrors archival stamping, library index cataloging, and precise technical annotations.
- **Micro-rules**: Never combine multiple non-serif fonts. Numbers in tables, charts, or ledgers should use tabular lining figures inherited from the monospaced hierarchy for optical alignment.

## Layout & Spacing

The layout is built upon an editorial sheet discipline. Content lives inside modular "sheets" or "folios" with defined boundaries rather than sprawling endlessly across uncontained viewports.

- **Grid Architecture**: A fixed-width container system (maximum 1140px on desktop) centered within an exposed `#EFE8D6` desk background. Within each folio sheet, an 8-column (tablet) or 12-column (desktop) layout handles content flow, bounded by 1.5rem gutters.
- **Vertical Baseline**: All block spacing conforms to an 8px rhythmic increment. Margins around sheet containers emulate paper page margins (minimum 32px on desktop, 16px on mobile).
- **Responsive Adaptations**:
  - **Desktop (1024px+)**: Dual-sheet and master-detail ledger layouts side-by-side. 32px page padding.
  - **Tablet (768px - 1023px)**: Single sheet centered, tabbed folder navigation collapses into index headers. 24px page padding.
  - **Mobile (< 768px)**: Sheet edges snap to viewport margins with 16px lateral padding. Ruled lines extend edge-to-edge. Folder tabs wrap into horizontal scroll bands.

## Elevation & Depth

Depth is tactile, physical, and restrained. Elevation is achieved through paper layering and directional contact shadows rather than blurry ambient lighting.

- **Base Canvas**: The foundation viewport is `#EFE8D6`, representing the surrounding work surface.
- **Sheet Level (Default Card/Page)**: Elevated sheets use `#F6F1E4`, bounded by a 1px solid `#D8CDB4` rule and an organic contact drop shadow:
  `box-shadow: 0 1px 0 rgba(0, 0, 0, 0.06), 0 8px 16px -10px rgba(0, 0, 0, 0.35);`
- **Raised Interactive Layer (Buttons, Modals, Floating Stacks)**: Active elements use an ink offset drop:
  `box-shadow: 2px 2px 0 #1E2A22;`
- **Recessed Surface (Inputs, Inactive Tab Wells)**: Tinted flat with no shadow, utilizing a subtle 1px border of `#D8CDB4` to create an inset debossed feel.
- **Texture**: Surfaces leverage a non-distracting SVG grain filter (opacity 0.03) applied at the document layer to eliminate digital gloss without hindering readability.

## Shapes

The shape system strictly reflects machine-cut rag paper.

- **Corner Radii**: A universal maximum of 2px (`border-radius: 2px`). Completely sharp 90-degree corners are favored for sheet perimeters, dividers, and button blocks; 2px is reserved for inputs, badges, and small paper chits to soften corner fiber wear.
- **Cut Corners & Notches**: Folder tabs, index tags, and document markers use straight 45-degree angle chamfers or perpendicular tab steps rather than rounded organic curves.
- **Lines & Rules**: Divider lines are consistently 1px solid `#D8CDB4`. Dotted and dashed patterns are restricted to perforated voucher strips, attachment drops, and archival fold hints.

## Components

### Buttons
- **Primary Button**: Solid `#1E2A22` fill with `#F6F1E4` text, 1px solid `#1E2A22` border, `box-shadow: 2px 2px 0 #1E2A22`. On hover, translate -1px in both X and Y axes, expanding the hard shadow to `3px 3px 0 #1E2A22`. On active press, translate +2px into the shadow with zero offset.
- **Secondary Button**: Background `#F6F1E4`, 1px solid `#1E2A22`, text `#1E2A22`, `box-shadow: 2px 2px 0 #1E2A22`. Hover lifts 1px.
- **Subtle/Link Button**: Text `#1E2A22`, underlined with a 1px baseline `#D8CDB4`, hovering changes line color to `#1E2A22`.

### Inputs & Form Fields
- **Underline Style**: No enclosed box by default. Fields rest on a 1px bottom border of `#D8CDB4` against the `#F6F1E4` sheet.
- **Active & Focus**: The bottom rule shifts to 2px solid `#1E2A22`. An accessible 2px offset focus ring in `#1E2A22` ensures WCAG AAA compliance on keyboard navigation.
- **Labels**: Always top-aligned, uppercase, `label-md` in `#4A4F45`. Error text displays in `stamp-red` (`#A3352B`) formatted as a typed notation below the rule.

### Folder Tabs
- Top-edge folder tabs directly connected to the parent sheet. 
- Inactive tabs sit recessed in `#EFE8D6` with a bottom border separating them from the main sheet.
- Active tab has matching `#F6F1E4` fill, raised 2px above siblings, with no bottom border, unifying seamlessly with the content container below.

### Stamps & Status Badges
- **Stamp Badges**: Compact uppercase tags rotated by `-4deg` to `+2deg` randomly or contextually. Enclosed by a 1.5px solid border in `#A3352B` with matching red ink text and a 2px inner padding.
- **Sticky Notations**: Contextual highlight chips using `#F7EEB4` (warning/pending), `#DDE8C6` (success/complete), and `#EBD9CF` (archived/critical). Borderless, sharp corners, flat drop shadow (`0 2px 4px rgba(0,0,0,0.06)`).

### Checkboxes & Radios
- Checkboxes: 16px square, 1px solid `#1E2A22`, background `#F6F1E4`. Selected state displays an ink checkmark drawn with sharp terminal strokes.
- Radios: 16px circle, 1px solid `#1E2A22`, interior indicator is a solid 8px `#1E2A22` centered dot.

### Cards & Folios
- Main containers must be styled as sheets of paper resting on the desk. They feature 1px solid `#D8CDB4` borders, paper grain, and the primary soft physical shadow. Never stack cards directly inside cards; use ruled sections or sticky chits to divide content.