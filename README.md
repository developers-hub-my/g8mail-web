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
├── consts.ts               # Site / console URLs, PLANS (from PlanSeeder)
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
    └── docs.astro           # Public getting-started guide
```
