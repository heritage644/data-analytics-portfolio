GATE: ERROR (consistency.mjs gave no report (exit 1: Error: Chrome exited early (null)))

# Design and verification — Raphael Adem

**Revision 1:** The production build, lint/type checks, unit tests, browser regressions, axe checks and performance check passed. The separate design-skill gate is **incomplete**, not a pass: its Chromium consistency process exited before producing a report. The gate’s layout and copy checks did run; the mobile catalog-height waiver applied, and there were two copy advisories. The gate was not rerun, per its instructions. The original release’s gate result does not stand in for this revision.

## Design decisions

**Kind:** service portfolio, not analytics software for sale. The audience is a hiring manager or business owner; **View projects** is the main action. **Voice:** Raphael speaks in the first person about independent work; each case study distinguishes the questions asked from any results not supplied.

| Surface | Skill rule in use |
|---|---|
| Shared system | The client’s **red and white** palette replaces the original palette deal. White and neutral surfaces frame the work; red marks actions, active states, focus and decorative chart highlights. Self-hosted **Schibsted Grotesk**, soft radii, tonal buttons, shared spacing tokens and aligned page edges carry through to the study pages. |
| Navigation and hero | The initial mark, `nav-mega` pattern and split hero put Raphael's name, work and two next actions on the first screen. The number-free dashboard drawing combines columns, a line, a ring and blank KPI tiles. The supplied portrait is eagerly loaded in a circular, red-ringed frame. |
| About and skills | A single dealt `word-highlight` moment uses Raphael's own statement. The three counts come from the catalog; screen readers get the final numbers, not animation frames. One contrasting `dark-band` groups the two skill inventories with icons rather than proficiency scores. |
| Catalog and detail | Consistent fields make the six studies comparable; a real dashboard screenshot identifies each one. ICT keeps an **In progress** badge and **Planned** areas. The same article and enlargeable gallery serve the keyboard-accessible dialog and its permanent URL. |
| Contact and footer | A `close-type` closing section uses the supplied invitation and an explicit Fiverr hiring action. The column footer repeats the real social destinations, not a form or a fabricated address. |
| Motion and delivery | One hero entrance, restrained hover/press feedback and a reduced-motion path. No shaders, WebGL, animation framework, remote fonts or charting library. Detailed study content is fetched only when opened. |

## Exceptions made for the brief

[Configured waiver targets](../.taste-skill/waivers.json). Only the third matched a finding in the checks the revision gate completed.

1. **`no-visual`, Skills:** the inventory has nine interface glyphs and four real tool marks, all smaller than the checker's large-visual threshold. A stock photograph would not add evidence of a skill.
2. **`card-layout`, Projects:** these are comparable case-study records, not six unrelated marketing features. They deliberately share a field order, while the actual dashboard images differ.
3. **`screen-height`, mobile Projects:** six readable stacked studies, their actions and the healthcare caveat need more than two phone screens. The initial view keeps every project available instead of concealing entries to fit.

The brief also requires dark mode and real counts on a service page; both were kept. The hero drawing is decorative. Project evidence now comes from the supplied screenshots without reinterpreting the measurements in them. There is no invented client, finding, patient count, email, form destination, credential or production domain.

Two **copy-lint** warnings were kept: `copy-stat-strip` is the requested, data-derived **6 / 3 / 5** inventory; `copy-numbered` identifies the project folio numbers, which index a catalog rather than imply process steps. The visible copy and actual link behavior were checked rather than rewritten to satisfy wording heuristics.

## Revision 1: branding, screenshots and anchor navigation

- The complete [mapping of the 12 original files](../README.md#asset-handoff-checklist) includes the asset/licence management page under ICT. Its timestamped JPG is a dashboard, not a second portrait. No status, claim, finding or count was inferred from a screenshot.
- All literal brand colours live in [`palette.css`](../src/styles/palette.css). Light: `--red #DC2626`, `--red-hover #B91C1C`, `--red-pressed #991B1B`, `--red-soft #FEF2F2`, `--red-soft-strong #FEE2E2`, `--white #FFFFFF`, `--mist #F8F8F8`, `--charcoal #111111`, `--secondary #5F5F5F`, `--border #E5E5E5`. Dark: `--night #0B0B0B`, `--raised #161616`, `--night-line #383838`, `--night-muted #BDBDBD`, `--red-lift #FF8585`, `--red-night-tint #301818`, `--red-night-tint-strong #462222`. Buttons keep white text on the deeper reds in both modes; links use the darker hover swatch in light mode and the lifted swatch in dark mode. The favicon and portrait sharing card read the same swatches.
- **Header:** removed the work-status text, indicator, styles and data from both desktop and mobile navigation. No replacement banner or spacer. The existing contact invitation and university credit remain.
- **Reproduction:** on the unchanged build, all three hero links received clicks, had unique targets, and updated the hash. The browser landed on the padded wrapper rather than its heading. Using the mobile menu set a persistent `tabindex` on that wrapper, unintentionally enabling another header-sized scroll margin. The heading gap went from 40 to 112px on a phone and 48 to 136px on a tablet. No overlay swallowed the click.
- **Fix:** native fragments now target focusable section headings. CSS reserves the fixed header height once and a 16px reading gap. The mobile menu no longer mutates the destination’s attributes. Decorative hero layers ignore pointer events, and the stacked hero grows on especially short screens. There is no JavaScript scrolling controller. The three links were used again after scrolling to the top, with pointer and Enter, including after first visiting the same destination through the mobile menu. Across 36 settled pointer/Enter activations (three links × three widths × two themes × two input methods), each visible heading received focus and the hash matched. The measured gaps were **15.83–16.34px**, including smooth and reduced-motion navigation.
- **Media:** Astro generates responsive WebP files without altering an original. Full-size views support keyboard focus containment, Escape, return focus and actual-size inspection, both in a case dialog and on its standalone route. Selecting a card opens its standalone article without JavaScript; selecting its screenshot then opens the original-width WebP. SHA-256 checks matched all 12 original files before and after the revision. Supplied image colours are deliberately preserved; the surrounding UI uses the client palette.
- **Final colour and status audit:** searched project sources, configuration, utilities, SVGs, theme metadata, generated styles/assets and built pages for old palette values, colour names, cool hex/RGB/HSL-family colours and header status variants. None remain in the shipped interface. The intact third-party skill contains unused example palettes; only the filtered system sheet and neutral versions of the used marks are shipped. No owner photograph or dashboard was recoloured.
- **Measured contrast:** the primary button rendered white text on the specified default, hover and pressed reds: **4.83:1**, **6.47:1** and **8.31:1**. Body links are **6.47:1** on white; dark links are **8.38:1** on the page and **7.71:1** on the raised surface. Tool labels on the light and dark tints are **5.91:1** and **7.05:1**, respectively.

## Checks on the local static build

| Check | Result |
|---|---|
| Production build | Eight HTML pages (home, six studies and 404); SVG favicon, PNG sharing card, sitemap and robots generated. |
| Lint and content | ESLint + Astro/TypeScript: no errors, warnings or hints. All seven content, media and contrast tests passed. |
| Interaction and accessibility | Chromium at **360×800, 768×1024 and 1440×900**, each in light and dark. Checked all sections, theme persistence, mobile navigation, eight filters, six dialogs, Tab containment, Escape and return focus. Each of the eleven dashboard views was opened and inspected at actual size, with Escape and focus return to the gallery. Hero section links, permanent case-study URLs and full-size image links also worked without JS. No console errors/warnings or axe WCAG A/AA violations in the tested views. |
| Layout | Also measured **390×844, 820×1180 and 1024×768**. No horizontal overflow at any of the six sizes. The final phone layout check’s only finding was the documented unfiltered catalog height. The hero visual and scroll-cue row remain separated by 16px even at 320×640. |
| Optional content | Dashboard/report URLs, contact email and CV remain opt-in. The regression suite checks that disabled resources do not render. No destinations or downloads were invented for the supplied screenshots. |
| Sharing and subpaths | Checked a separate project-subpath build: all 108 local link/image/srcset targets resolved, and the font, canonical URLs, portrait sharing metadata, robots and sitemap used the configured origin/base. |
| Performance | Skill performance checker: **0 failures, 0 warnings** at 1440px and 390px. A single Latin WOFF2 is preloaded. Below-fold image slots use native lazy loading. |

**Lighthouse 12.8.2, local production homepage, 18 November 2026:**

| Preset | Performance | Accessibility | SEO | LCP | CLS | Total blocking time |
|---|---:|---:|---:|---:|---:|---:|
| Mobile | 99 | 100 | 100 | 2.0 s | 0 | 0 ms |
| Desktop | 100 | 100 | 100 | 0.5 s | 0 | 0 ms |

These are lab results, not measured visitor traffic or a claim of complete accessibility conformance. A public host, DNS, real devices, other browser engines, and external profile destinations were not tested. Recheck Lighthouse after replacing media or publishing to the final domain.

**Owner handoff:** [run and deploy instructions](../README.md#deploy-on-netlify) · [exact replacement filenames and switches](../README.md#asset-handoff-checklist) · [single editable content file](../src/data/portfolio.ts).
