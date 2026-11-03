# g8mail-web

Marketing landing page for **Wau** — developer email sandbox by G8Suite (proprietary, SaaS).

- **Site**: [waumail.my](https://waumail.my)
- **App (console)**: [console.waumail.my](https://console.waumail.my)
- **Stack**: [Astro](https://astro.build) 7 with plain CSS (Node 24), deployed on Netlify as a static site.


## Development

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static output in dist/
npm run preview   # preview the production build
```

## SEO, social cards and analytics

| What | Where |
|---|---|
| Per-page title, description, canonical, Open Graph / Twitter image, `noindex` | Props on `BaseLayout` (`title`, `description`, `image`, `imageAlt`, `noindex`, `schema`) |
| JSON-LD (Organization, WebSite, SoftwareApplication from `PLANS`, FAQPage) | `src/seo.ts` |
| Sitemap | `@astrojs/sitemap` → `/sitemap-index.xml`; `public/robots.txt` points at it |
| OG images (1200×630), app icons, `favicon.ico` | Committed in `public/`; sources in `brand/`. Regenerate with `npm run brand-assets` (needs `rsvg-convert` and ImageMagick; downloads IBM Plex into `node_modules/.cache`) |
| CSP | `<meta>` written by Astro (`security.csp` in `astro.config.mjs`); the theme script's hash is added in `BaseLayout`. Other headers in `netlify.toml` |
| Post-build check | `npm run build && npm run check:seo` |

Sign-up links use `registerUrl('<placement>')` from `src/consts.ts`, which adds
`utm_source=waumail.my&utm_medium=website&utm_campaign=site&utm_content=<placement>`.

### Analytics (optional)

Set `PUBLIC_PLAUSIBLE_DOMAIN` (for example `waumail.my`) in Netlify → Site configuration →
Environment variables, then redeploy. The Plausible script and its CSP origin are added only
when it is set; unset renders nothing. Google Analytics is not wired in.

## Deploying to Netlify

`netlify.toml` is already configured (`npm run build` → publish `dist/`).

1. Push this directory to a Git repository.
2. In Netlify: **Add new site → Import an existing project**, pick the repo.
3. Build settings are read from `netlify.toml` — no manual config needed.
4. Set the custom domain to `waumail.my` under **Domain management**.

## Structure

Design system: "Kite paper & ink" — see `documentation/05-design/DESIGN.md` in the g8mail
repo. Tokens live in `src/styles/global.css` (light and dark, theme follows the system
unless the visitor pins one). Plan limits in `src/consts.ts` mirror
`g8mail-app/database/seeders/PlanSeeder.php`; change both together.

```text
src/
├── consts.ts               # Site / console URLs, registerUrl(), PLANS (from PlanSeeder)
├── seo.ts                  # JSON-LD nodes
├── layouts/
│   └── BaseLayout.astro     # <head>, SEO meta, fonts, theme, header/footer, shared JS
├── components/
│   ├── SiteHeader.astro     # Sticky nav + mobile menu
│   ├── SiteFooter.astro
│   ├── ThemeToggle.astro    # light / auto / dark
│   ├── Icon.astro           # Inline Lucide icons
│   └── WauMark.astro        # Wau bulan logo mark
├── styles/
│   ├── global.css           # Tokens, primitives, site chrome
│   ├── home.css · pricing.css · docs.css
└── pages/
    ├── index.astro          # Home
    ├── pricing.astro        # Plans, compare table, billing notes
    ├── docs.astro           # Public getting-started guide
    └── 404.astro            # Not found (noindex)
```
