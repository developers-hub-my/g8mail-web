// Regenerates the committed social and icon assets in public/ from SVG sources in brand/.
// Run locally (needs rsvg-convert and ImageMagick): `npm run brand-assets`.
// Text is rendered with IBM Plex only: fontconfig is pointed at a folder holding nothing else,
// so a missing font can never fall back to a system face.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { PLANS, rm } from '../src/consts.ts';

const root = resolve(import.meta.dirname, '..');
const pub = join(root, 'public');
const src = join(root, 'brand');
const fontDir = join(root, 'node_modules/.cache/plex-fonts');
const FONTS = ['IBMPlexSans-SemiBold', 'IBMPlexSans-Medium', 'IBMPlexMono-Medium'];

const ink = '#0B1120';
const paper = '#FAF8F3';
const muted = '#A3AEC4';
const amber = '#F5A524';
const amberText = '#F7B84B';

mkdirSync(fontDir, { recursive: true });
mkdirSync(join(pub, 'og'), { recursive: true });
mkdirSync(src, { recursive: true });
for (const f of FONTS) {
    const file = join(fontDir, `${f}.ttf`);
    if (existsSync(file)) continue;
    const pkg = f.startsWith('IBMPlexMono') ? 'plex-mono' : 'plex-sans';
    const res = await fetch(`https://raw.githubusercontent.com/IBM/plex/master/packages/${pkg}/fonts/complete/ttf/${f}.ttf`);
    if (!res.ok) throw new Error(`Could not download ${f}: HTTP ${res.status}`);
    writeFileSync(file, Buffer.from(await res.arrayBuffer()));
}
const fontsConf = join(fontDir, 'fonts.conf');
writeFileSync(fontsConf, `<?xml version="1.0"?><fontconfig><dir>${fontDir}</dir><cachedir>${fontDir}/cache</cachedir></fontconfig>`);
// PANGOCAIRO_BACKEND=fc stops pango on macOS from resolving fonts through CoreText instead.
const env = { ...process.env, FONTCONFIG_FILE: fontsConf, PANGOCAIRO_BACKEND: 'fc' };

// Same geometry as src/components/WauMark.astro, on a 48-unit grid.
const mark = (color, fillOpacity = 0.14) => `
  <g transform="rotate(90 24 24)">
    <path d="M24 4 C 40 16, 40 32, 24 44 C 8 32, 8 16, 24 4 Z" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" fill="${color}" fill-opacity="${fillOpacity}"/>
    <line x1="10" y1="24" x2="38" y2="24" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
    <circle cx="24" cy="24" r="3" fill="${color}"/>
  </g>
  <path d="M 10 36 Q 24 47, 38 36" stroke="${color}" stroke-width="2" stroke-linecap="round" fill="none"/>`;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

// lines: [text, highlight?][]
const og = ({ label, lines, sub }) => {
    const size = 84;
    const lead = 92;
    const top = 284;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${ink}"/>
  <g transform="translate(760 90) scale(10)" opacity="0.10">${mark(amber, 0.5)}</g>
  <g transform="translate(80 64) scale(1.25)">${mark(amber)}</g>
  <text x="150" y="105" font-family="IBM Plex Sans" font-weight="600" font-size="42" letter-spacing="-0.8" fill="${paper}">Wau</text>
  <text x="80" y="196" font-family="IBM Plex Mono" font-weight="500" font-size="24" fill="${amberText}">${esc(label)}</text>
  ${lines
      .map(([t, hi], i) => `<text x="76" y="${top + i * lead}" font-family="IBM Plex Sans" font-weight="600" font-size="${size}" letter-spacing="-2.6" fill="${hi ? amberText : paper}">${esc(t)}</text>`)
      .join('\n  ')}
  <rect x="80" y="520" width="56" height="3" fill="${amber}"/>
  <text x="80" y="566" font-family="IBM Plex Sans" font-weight="500" font-size="26" fill="${muted}">${esc(sub)}</text>
  <text x="1120" y="566" text-anchor="end" font-family="IBM Plex Mono" font-weight="500" font-size="24" fill="${paper}">waumail.my</text>
</svg>
`;
};

const paid = PLANS.filter((p) => p.monthly > 0).map((p) => `${p.name} ${rm(p.monthly)}`);
const images = {
    default: og({
        label: 'Developer email sandbox',
        lines: [['Catch dev emails.'], ['Inspect everything.', true], ['Never deliver.']],
        sub: 'Hosted SMTP capture for dev, staging and UAT',
    }),
    pricing: og({
        label: 'Pricing',
        lines: [['Flat plans per workspace,'], ['in ringgit.', true]],
        sub: `Free · ${paid.join(' · ')} a month`,
    }),
    docs: og({
        label: 'Docs · Getting started',
        lines: [['Capture your first'], ['email in 5 minutes.', true]],
        sub: 'SMTP settings · REST API · MCP server',
    }),
};

// Full-bleed ink square: iOS and maskable launchers crop the corners, the mark sits in the safe zone.
const appIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${ink}"/>
  <g transform="translate(112 106) scale(6)">${mark(amber, 0.16)}</g>
</svg>
`;

const run = (cmd, args) => execFileSync(cmd, args, { env, stdio: 'inherit' });

for (const [name, svg] of Object.entries(images)) {
    const file = join(src, `og-${name}.svg`);
    writeFileSync(file, svg);
    run('rsvg-convert', ['-w', '1200', '-h', '630', '-o', join(pub, 'og', `${name}.png`), file]);
}

writeFileSync(join(src, 'app-icon.svg'), appIcon);
for (const [out, size] of [['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]]) {
    run('rsvg-convert', ['-w', String(size), '-h', String(size), '-o', join(pub, out), join(src, 'app-icon.svg')]);
}

const tmp = join(fontDir, 'ico');
mkdirSync(tmp, { recursive: true });
const icoParts = [16, 32, 48].map((s) => {
    const out = join(tmp, `${s}.png`);
    run('rsvg-convert', ['-w', String(s), '-h', String(s), '-o', out, join(pub, 'favicon.svg')]);
    return out;
});
run('magick', [...icoParts, join(pub, 'favicon.ico')]);

console.log('Wrote public/og/{default,pricing,docs}.png, icons and favicon.ico');
