// Where the public website (the precon-website repository) lives.
//   SITE_DIR=<path>              explicit location (relative to this app or absolute)
//   ../precon-website            default: the website repo checked out next to this one
//   ./precon-website             e.g. cloned there by the deploy build step
import fs from 'node:fs';
import path from 'node:path';

const isSite = (d) => fs.existsSync(path.join(d, 'index.html')) && fs.existsSync(path.join(d, 'assets', 'js', 'data.js'));

export function siteDir() {
  const tried = [];
  const candidates = process.env.SITE_DIR
    ? [path.resolve(process.cwd(), process.env.SITE_DIR)]
    : [path.resolve(process.cwd(), '..', 'precon-website'), path.resolve(process.cwd(), 'precon-website')];
  for (const d of candidates) { if (isSite(d)) return d; tried.push(d); }
  throw new Error(`Website files not found (looked in: ${tried.join(', ')}). ` +
    'Clone https://github.com/GetHomeRealty/precon-website next to this folder, or set SITE_DIR.');
}
