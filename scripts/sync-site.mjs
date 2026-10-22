// Copies the static public site (the precon-website repository, see site-dir.mjs) into the app:
//   <site>/*.html  → site-pages/   (served by app/[page]/route.ts with the SEO <head> injected)
//   <site>/assets  → public/assets (served as static files)
// The website repository stays the source of truth — edit it there, never the
// copies here (both are gitignored).
import fs from 'node:fs';
import path from 'node:path';
import { siteDir } from './site-dir.mjs';

const root = siteDir();
const pub = path.resolve(process.cwd(), 'public');
const pages = path.resolve(process.cwd(), 'site-pages');
fs.mkdirSync(pub, { recursive: true });

// Pages used to be copied into public/; remove any left there so they can't bypass the SEO renderer.
for (const f of fs.readdirSync(pub)) if (f.endsWith('.html')) fs.rmSync(path.join(pub, f));
fs.rmSync(pages, { recursive: true, force: true });
fs.mkdirSync(pages, { recursive: true });
fs.rmSync(path.join(pub, 'assets'), { recursive: true, force: true });

const html = fs.readdirSync(root).filter((f) => f.endsWith('.html'));
for (const f of html) fs.copyFileSync(path.join(root, f), path.join(pages, f));
fs.cpSync(path.join(root, 'assets'), path.join(pub, 'assets'), { recursive: true });

console.log(`sync-site: copied ${html.length} pages from ${root} into site-pages/ and assets/ into public/`);
