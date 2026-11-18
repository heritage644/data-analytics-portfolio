GATE: PASS

# Design and verification — Raphael Adem

The `design-taste-frontend` 2.5.1 finish gate passed on the production homepage with **no unwaived failures**, three targeted waivers and 21 non-blocking warnings. The waivers are checked in at [`.taste-skill/waivers.json`](../.taste-skill/waivers.json). The final asset, keyboard and responsive refinements were also checked independently against the built site.

## Design decisions

**Kind:** service portfolio, not analytics software for sale. The audience is a hiring manager or business owner; **View projects** is the main action. **Voice:** Raphael speaks in the first person about independent work; each case study distinguishes the questions asked from any results not supplied.

| Surface | Skill rule in use |
|---|---|
| Shared system | The dealt **stone-blueprint** palette fits the subject: warm drafting paper and one blue ink. Self-hosted **Schibsted Grotesk**, soft radii, tonal buttons, shared spacing tokens and aligned page edges carry through to the study pages. |
| Navigation and hero | The initial mark, `nav-mega` pattern and split hero put Raphael's name, work and two next actions on the first screen. The number-free dashboard drawing combines columns, a line, a ring and blank KPI tiles. A circular RA slot works without a headshot. |
| About and skills | A single dealt `word-highlight` moment uses Raphael's own statement. The three counts come from the catalog; screen readers get the final numbers, not animation frames. One contrasting `dark-band` groups the two skill inventories with icons rather than proficiency scores. |
| Catalog and detail | Consistent fields make the six studies comparable; a different blueprint drawing identifies each one. ICT uses a wireframe, an **In progress** badge and **Planned** areas. The same article serves the keyboard-accessible dialog and its permanent URL. |
| Contact and footer | A `close-type` closing section uses the supplied invitation and an explicit Fiverr hiring action. The column footer repeats the real social destinations, not a form or a fabricated address. |
| Motion and delivery | One hero entrance, restrained hover/press feedback and a reduced-motion path. No shaders, WebGL, animation framework, remote fonts or charting library. Detailed study content is fetched only when opened. |

## Exceptions made for the brief

1. **`no-visual`, Skills:** the inventory has nine interface glyphs and four real tool marks, all smaller than the checker's large-visual threshold. A stock photograph would not add evidence of a skill.
2. **`card-layout`, Projects:** these are comparable case-study records, not six unrelated marketing features. They deliberately share a field order, while the six drawings differ.
3. **`screen-height`, mobile Projects:** six readable stacked studies, their actions and the healthcare caveat need more than two phone screens. The initial view keeps every project available instead of concealing entries to fit.

The brief also requires dark mode and real counts on a service page; both were kept. With no approved portrait or dashboard images, the usual photographic treatment would imply evidence Raphael has not provided. The illustrations are explicitly previews, not findings. There is no invented client, finding, patient count, email, form destination, credential or production domain.

Two **copy-lint** warnings were kept: `copy-stat-strip` is the requested, data-derived **6 / 3 / 5** inventory; `copy-numbered` identifies the project folio numbers, which index a catalog rather than imply process steps. Other gate advisories include the prescribed headings and social labels, links into the closing section, and a transparent card-sized link target. The visible copy and actual link behavior were checked rather than rewritten to satisfy wording heuristics.

## Checks on the local static build

| Check | Result |
|---|---|
| Production build | Eight HTML pages (home, six studies and 404); SVG favicon, PNG sharing card, sitemap and robots generated. |
| Lint and content | ESLint + Astro/TypeScript: no errors, warnings or hints. Five content tests passed. |
| Interaction and accessibility | Chromium at **360×800, 768×1024 and 1440×900**, each in light and dark. Checked all sections, theme persistence, mobile navigation, eight filters, six dialogs, Tab containment, Escape and return focus. Direct case-study links also worked without JS. No console errors/warnings or axe WCAG A/AA violations in the tested views. |
| Layout | Also measured **390×844, 820×1180 and 1024×768**. No horizontal overflow at any of the six sizes. The standalone layout check's only finding is the documented unfiltered phone catalog height. |
| Optional content | Throwaway builds exercised screenshot and headshot replacement, independent dashboard/report links on cards and studies, email opt-in, and all CV file/flag combinations. Nothing from those fixtures is in the shipped site. |
| Sharing and subpaths | Checked a separate base-path build: links, fonts, canonicals, PNG sharing metadata, robots and all seven sitemap entries use the configured origin and base. |
| Performance | Skill performance checker: **0 failures, 0 warnings** at 1440px and 390px. A single Latin WOFF2 is preloaded. Below-fold image slots use native lazy loading. |

**Lighthouse 12.8.2, local production homepage, 18 November 2026:**

| Preset | Performance | Accessibility | SEO | LCP | CLS | Total blocking time |
|---|---:|---:|---:|---:|---:|---:|
| Mobile | 99 | 100 | 100 | 1.9 s | 0 | 0 ms |
| Desktop | 100 | 100 | 100 | 0.4 s | 0 | 0 ms |

These are lab results, not measured visitor traffic or a claim of complete accessibility conformance. A public host, DNS, real devices, other browser engines, and the contents or availability of third-party profiles were not tested. Recheck Lighthouse after adding full dashboard images and after publishing to the final domain.

**Owner handoff:** [run and deploy instructions](../README.md#deploy-on-netlify) · [exact replacement filenames and switches](../README.md#asset-handoff-checklist) · [single editable content file](../src/data/portfolio.ts).
