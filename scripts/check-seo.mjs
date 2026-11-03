// Post-build check of dist/: unique SEO tags per page, valid JSON-LD, the CSP covers every
// inline script, and the sitemap, robots, manifest and icons exist. `npm run check:seo`.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import assert from 'node:assert/strict';

const dist = resolve(import.meta.dirname, '../dist');
const read = (f) => readFileSync(join(dist, f), 'utf8');
const attr = (html, re) => html.match(re)?.[1];
const metaProp = (html, p) => attr(html, new RegExp(`<meta (?:property|name)="${p}" content="([^"]*)"`));

const pages = { 'index.html': '/', 'pricing.html': '/pricing', 'docs.html': '/docs' };
const seen = { title: new Set(), description: new Set() };

for (const [file, path] of Object.entries(pages)) {
    const html = read(file);
    const title = attr(html, /<title>([^<]+)<\/title>/);
    const description = metaProp(html, 'description');
    for (const [k, v] of Object.entries({ title, description })) {
        assert.ok(v, `${file}: missing ${k}`);
        assert.ok(!seen[k].has(v), `${file}: duplicate ${k}`);
        seen[k].add(v);
    }
    const url = `https://waumail.my${path === '/' ? '' : path}`;
    assert.equal(attr(html, /<link rel="canonical" href="([^"]+)"/), path === '/' ? 'https://waumail.my/' : url, `${file}: canonical`);
    assert.match(html, /<html lang="en"/, `${file}: lang`);
    for (const p of ['og:title', 'og:description', 'og:url', 'og:type', 'og:site_name', 'og:locale', 'og:image', 'og:image:width', 'og:image:height', 'og:image:alt', 'twitter:card']) {
        assert.ok(metaProp(html, p), `${file}: missing ${p}`);
    }
    const img = new URL(metaProp(html, 'og:image')).pathname;
    assert.ok(existsSync(join(dist, img)), `${file}: og image ${img} not in dist`);

    const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
    const types = ld.flatMap((d) => d['@graph']).map((n) => n['@type']);
    assert.ok(types.includes('Organization') && types.includes('WebSite'), `${file}: Organization/WebSite JSON-LD`);
    assert.ok(!JSON.stringify(ld).includes('aggregateRating'), `${file}: no invented ratings`);
    if (file !== 'docs.html') assert.ok(types.includes('SoftwareApplication'), `${file}: SoftwareApplication`);
    if (file === 'index.html') assert.ok(types.includes('FAQPage'), `${file}: FAQPage`);

    // Every executable inline script must be allowed by a hash in the page's CSP meta.
    const csp = attr(html, /<meta http-equiv="content-security-policy" content="([^"]+)"/);
    assert.ok(csp, `${file}: CSP meta`);
    for (const [, attrs, body] of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
        if (/\bsrc=|application\/ld\+json/.test(attrs)) continue;
        const hash = `sha256-${createHash('sha256').update(body).digest('base64')}`;
        assert.ok(csp.includes(hash), `${file}: inline script not in CSP (${hash})`);
    }
}

assert.match(read('404.html'), /<meta name="robots" content="noindex/, '404 is noindex');
const sitemap = read('sitemap-0.xml');
for (const loc of ['https://waumail.my/', 'https://waumail.my/pricing', 'https://waumail.my/docs']) assert.ok(sitemap.includes(`<loc>${loc}</loc>`), `sitemap: ${loc}`);
assert.ok(!sitemap.includes('404'), 'sitemap excludes 404');
assert.ok(read('sitemap-index.xml').includes('sitemap-0.xml'), 'sitemap index');
assert.match(read('robots.txt'), /Sitemap: https:\/\/waumail\.my\/sitemap-index\.xml/);
const manifest = JSON.parse(read('site.webmanifest'));
for (const f of ['favicon.svg', 'favicon.ico', 'apple-touch-icon.png', ...manifest.icons.map((i) => i.src.slice(1))]) assert.ok(existsSync(join(dist, f)), `missing ${f}`);

console.log('SEO check passed: 3 pages, sitemap, robots, manifest, icons, JSON-LD, CSP hashes.');
