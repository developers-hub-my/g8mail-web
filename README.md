# g8mail-web

Marketing landing page for **Wau** — developer email sandbox by G8Suite (proprietary, SaaS).

- **Site**: [waumail.my](https://waumail.my)
- **App (console)**: [console.g8suite.com](https://console.g8suite.com)
- **Stack**: [Astro](https://astro.build) + TailwindCSS v4, deployed on Netlify as a static site.

The design mirrors `g8mail-app/resources/views/welcome.blade.php`.

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

```text
src/
├── consts.ts            # Site / console / GitHub URLs
├── layouts/
│   └── BaseLayout.astro  # <head>, SEO meta, fonts, dark shell
├── components/
│   ├── Nav.astro         # Fixed top nav
│   ├── Hero.astro        # Headline + captured-email card
│   ├── Features.astro    # 6-card feature grid
│   ├── CodeSample.astro  # .env / PHP / curl tab switcher
│   ├── Pricing.astro     # 4 tiers + monthly/annual toggle
│   ├── Faq.astro         # Accordion
│   ├── Footer.astro
│   ├── Icon.astro        # Inline Lucide icons
│   └── WauMark.astro     # Wau bulan logo mark
└── pages/
    └── index.astro
```
