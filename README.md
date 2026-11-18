# Raphael Adem — analytics portfolio

A static, frontend-only Astro portfolio for an aspiring data analyst. The homepage, six case-study pages, social image, sitemap and robots file are all built ahead of time. No accounts, database, tracking, form service, runtime image CDN or client-side framework hydration.

## Run it

Use **Node 22.12+** (the repository selects Node 22 with `.nvmrc`).

```sh
npm ci
npm run dev
```

Open `http://localhost:4321/`. To test the actual static output:

```sh
npm run lint
npm test
npm run build
npm run preview
```

Stop the dev server before starting the preview if you want to use the same port. The deployable website is **`dist/`**. Do not publish the repository root or commit `dist/`.

## Deploy on Netlify

1. Make the branch containing this implementation available in your repository.
2. In Netlify, choose **Add new project → Import an existing project**. Select the repository and the branch containing the portfolio.
3. Use the repository root as the base directory, **`npm run build`** as the build command, **`dist`** as the publish directory, and **Node 22**. The checked-in `netlify.toml` already supplies these settings.
4. Deploy. Netlify supplies its primary production `URL` for absolute canonicals, social cards, sitemap entries and robots. When using a custom domain, set **`SITE_URL` to its full HTTPS origin** in the site's build environment, then redeploy. Leave `BASE_PATH` unset for a root-domain deployment.
5. Open `/`, `/projects/healthcare-operations/`, `/social-card.png`, `/sitemap.xml` and `/robots.txt` on the deployed domain. No SPA rewrites are needed.

**Vercel alternative:** import the same repository/branch, select the **Astro** preset, set Node **22.x**, install command **`npm ci`**, build command **`npm run build`**, output **`dist`**, and deploy. The config reads `VERCEL_PROJECT_PRODUCTION_URL` unless `SITE_URL` overrides it.

**GitHub Pages or another static host:** set `SITE_URL` to the actual site origin and `BASE_PATH` to the repository subpath (for this repo's standard Pages location, `/data-analytics-portfolio`). Run `npm ci && npm run build` and publish `dist/` as the Pages artifact. The generated asset and case-study URLs include the base path; `.nojekyll` is supplied. Do not include the repository subpath twice.

A plain local build deliberately has no claimed public canonical. In that build the crawler files use the local preview origin and the sharing image has a relative URL. **Supply the production origin when building for a host that does not set it automatically.** A static file upload cannot discover its eventual public domain afterwards.

## Edit content

Edit **[`src/data/portfolio.ts`](src/data/portfolio.ts)**. It contains Raphael's profile, all page copy, labels, social URLs, technical skills, the tool catalog, industry labels and the single typed `projects` array.

- **Add a case study:** add a `project({ ... })` entry with a unique slug. `introduction` and `objective` form the verbatim overview; `excerpt` is the short card text. The helper supplies `complete` status, null external links and an empty gallery unless media is specified. Add a new industry label in the same file if needed. Cards, case-study routes, filters, counts and the sitemap follow the data. Update the supplied-catalog regression assertions if you intentionally change its scope.
- **Stats:** project count includes works in progress; the toolkit includes only entries marked `core`; industries are deduplicated from completed projects only. No measurement or finding is inferred from any drawing.
- **Resources:** set a project's `dashboardUrl` and/or `reportUrl` only when there is a working destination. Use HTTPS destinations or local resource paths starting with `/`. For a direct PDF download, put the file in `public/` and use its local path; an external report host controls its own download headers. Without a URL, the card and case study omit that link entirely.
- **Contact:** change `profiles`, or set `CONTACT_EMAIL` only if Raphael supplies an address. The email action is a plain `mailto:` link, never a form.
- **Images:** `person.headshot`, each project’s `image` and its `additionalImages` use original filenames from `src/images/`. `shot(file, name, alt)` names an image for the viewer and supplies its accessible description. Use `image: null` when a future project has no screenshot yet. A misspelled filename fails the build rather than shipping a broken image.

## Asset handoff checklist

The first file in each row is the card image (or portrait); the others are additional views on the same topic. The original dashboards retain their palettes and their own figures. They are not merged into one dataset.

| Placement | Original in `src/images/` | Additional views |
|---|---|---|
| Hero portrait and social card | `photo-profile-user.png` | — |
| Sales | `sales-revenue-analysis.png` | — |
| Employee attrition and workforce | `hr-attrition.png` | `workforce-analytics.jpg` |
| Finance | `profitability-analysis.png` | `budget-and-variance.png`, `cash-flow-and-financial-risk.png` |
| Healthcare | `bio-data-evaluation.png` | `healthconditio.png` |
| IVAAN Rice | `ivaaan.png` | — |
| ICT (in progress) | `service-and-incidence.png` | `photo_2026-11-18_20-22-29.jpg` (Asset License Management) |

Astro generates responsive WebP derivatives without editing the originals. Cards contain each screenshot in a 16:9 frame so wide reports keep their labels. Each case study shows a larger view; select it for the keyboard-accessible viewer, then choose **Actual size** to inspect small type. With JavaScript off, selecting the screenshot opens its full-size WebP directly.

Still optional: set a per-study `dashboardUrl` / `reportUrl`, set `CONTACT_EMAIL`, or add `public/Raphael-Adem-CV.pdf` **and** set `SHOW_CV = true`. Rebuild after changing files or config. Only publish approved screenshots without identifiable personal records.

## Implementation and checks

- `src/components/DataSculpture.astro`: decorative SVG geometry, not analytical results. `Thumbnail.astro` and `StudyGallery.astro` render the supplied evidence.
- `src/layouts/Page.astro`, `src/styles/`: the shared page system, font, theme tokens and metadata.
- `src/components/CaseStudy.astro`: the one full case-study presentation. A normal anchor works without JS; a normal click fetches that static article into a native dialog. Modified clicks, copying the link, and opening the full page still work.
- `src/pages/`: static home, six generated studies, 404, RA favicon, 1200×630 PNG, sitemap and robots.
- `scripts/prepare-assets.mjs`: prepares the kit’s layout CSS without its example palettes, plus the used motion modules, neutral tool/social marks, font and licenses. The original `.agents/skills/design-taste-frontend` is a build input: **keep it in the repository**. The unused demo photos and effects never enter the output.
- `tests/content.test.ts`: supplied content, image metadata, AA contrast pairs, counts, filters, optional links and healthcare wording.
- `tests/browser.mjs`: Chromium interaction and axe WCAG A/AA checks at 360, 768 and 1440px in both themes. Includes reduced motion, repeat pointer/keyboard hero jumps, menu focus, all filters, nested lightboxes, standalone routes and JavaScript-disabled navigation.

To run the browser regression suite, start `npm run preview` in another terminal, then:

```sh
npx playwright-core install chromium
npm run test:browser
```

Alternatively set `CHROME_PATH` to an existing compatible Chrome/Chromium executable. Set `TEST_URL` to test a different local preview, including its trailing slash. These tools are development-only and do not ship to visitors.

See [the design and verification report](docs/DESIGN-REPORT.md) for the skill rules, exceptions, checks, and deployment limitations. Tool-mark sources are in [the credits](docs/CREDITS.md).
