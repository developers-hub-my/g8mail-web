// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
    site: 'https://waumail.my',
    // pricing.html is served at /pricing with no redirect, matching the links, canonicals and sitemap.
    trailingSlash: 'never',
    build: { format: 'file' },
    integrations: [sitemap()],
    // No Markdown pages; Shiki's inline styles would also clash with the CSP.
    markdown: { syntaxHighlight: false },
    security: {
        // Astro hashes its bundled scripts into a <meta> CSP; BaseLayout adds the theme script's hash,
        // connect-src and the analytics origin. Style attributes need 'unsafe-inline'.
        csp: {
            directives: [
                "default-src 'self'",
                "img-src 'self' data:",
                "font-src 'self' https://fonts.gstatic.com",
                "base-uri 'self'",
                "form-action 'self'",
                "object-src 'none'",
            ],
            styleDirective: { resources: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'] },
        },
    },
});
