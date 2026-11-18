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

- **Add a case study:** add a `project({ ... })` entry with a unique slug. `introduction` and `objective` form the verbatim overview; `excerpt` is the short card text. The helper supplies the default screenshot path, `complete` status and null external links. Add a new industry label in the same file if needed. Cards, case-study routes, filters, counts and the sitemap follow the data. Update the supplied-catalog regression assertions if you intentionally change its scope.
- **Stats:** project count includes works in progress; the toolkit includes only entries marked `core`; industries are deduplicated from completed projects only. No measurement or finding is inferred from any drawing.
- **Resources:** set a project's `dashboardUrl` and/or `reportUrl` only when there is a working destination. Use HTTPS destinations or local resource paths starting with `/`. For a direct PDF download, put the file in `public/` and use its local path; an external report host controls its own download headers. Without a URL, the card and case study omit that link entirely.
- **Contact:** change `profiles`, or set `CONTACT_EMAIL` only if Raphael supplies an address. The email action is a plain `mailto:` link, never a form.
- **Optional files:** checks happen against `public/` **at build time**, not by making failed browser requests. Add the file and rebuild. The headshot, dashboard, and report destinations are independently optional.

## Asset handoff checklist

| Still to supply | Exact location or setting | What visitors see now |
|---|---|---|
| Raphael's headshot | `public/headshot.webp` (square crop) | Circular RA monogram, with an identified portrait slot |
| Sales dashboard | `public/projects/sales-performance.png` | Original column study |
| Workforce dashboard | `public/projects/employee-attrition.png` | Original ring study |
| Financial dashboard | `public/projects/financial-performance.png` | Original layered study |
| Healthcare dashboard | `public/projects/healthcare-operations.png` | Original wave study; record-count caveat |
| IVAAN Rice dashboard | `public/projects/ivaan-rice.png` | Original terrace study |
| ICT dashboard | `public/projects/ict-operations.png` | Wireframe study, **In progress**, **Planned** areas |
| Dashboard/report links | Per-project `dashboardUrl` / `reportUrl` | Absent, not dead links |
| CV | `public/Raphael-Adem-CV.pdf` **and** `SHOW_CV = true` | No download button |
| Email | `CONTACT_EMAIL` in the content file | No email button or contact form |
| Production domain | Provider's production URL or `SITE_URL` | Local preview, no invented public domain |

All six screenshot slots say **“Dashboard preview coming soon”** until replaced. A landscape PNG near 2:1, optimized for web, fits well; a differently proportioned real dashboard is contained, not cropped. Only use screenshots that are safe to publish, without identifiable healthcare or workforce records. When ICT is complete, update the content before changing its status.

## Implementation and checks

- `src/components/DataSculpture.astro` and `Thumbnail.astro`: original inline SVG illustrations. Their coordinates are drawing geometry, not numerical results.
- `src/layouts/Page.astro`, `src/styles/`: the shared page system, font, theme tokens and metadata.
- `src/components/CaseStudy.astro`: the one full case-study presentation. A normal anchor works without JS; a normal click fetches that static article into a native dialog. Modified clicks, copying the link, and opening the full page still work.
- `src/pages/`: static home, six generated studies, 404, RA favicon, 1200×630 PNG, sitemap and robots.
- `scripts/prepare-assets.mjs`: locally copies only the used skill modules, resolved icons, font and licenses. The original `.agents/skills/design-taste-frontend` is a build input: **keep it in the repository**. The unused demo photos and effects never enter the output.
- `tests/content.test.ts`: supplied content, counts, filters, optional links and healthcare wording.
- `tests/browser.mjs`: Chromium interaction and axe WCAG A/AA checks at 360, 768 and 1440px in both themes. Includes reduced motion, menu focus, all filters, all dialogs, standalone routes and a JavaScript-disabled navigation check.

To run the browser regression suite, start `npm run preview` in another terminal, then:

```sh
npx playwright-core install chromium
npm run test:browser
```

Alternatively set `CHROME_PATH` to an existing compatible Chrome/Chromium executable. Set `TEST_URL` to test a different local preview, including its trailing slash. These tools are development-only and do not ship to visitors.

See [the design and verification report](docs/DESIGN-REPORT.md) for the skill rules, exceptions, checks, and deployment limitations. Tool-mark sources are in [the credits](docs/CREDITS.md).
