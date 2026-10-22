// Deploy builds (e.g. Vercel) only check out this repository. Before the site is
// synced, clone the website repository into ./precon-website when it isn't
// already available. Set SITE_REPO to its clone URL; for a private repository
// include a read-only token, e.g. https://<token>@github.com/GetHomeRealty/precon-website.git
// (SITE_BRANCH defaults to main). Local development uses ../precon-website instead.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { siteDir } from './site-dir.mjs';

try {
  console.log(`fetch-site: using website at ${siteDir()}`);
} catch {
  const repo = process.env.SITE_REPO;
  if (!repo) throw new Error('fetch-site: website files not found and SITE_REPO is not set.');
  const dest = path.resolve(process.cwd(), 'precon-website');
  fs.rmSync(dest, { recursive: true, force: true });
  execFileSync('git', ['clone', '--depth', '1', '--branch', process.env.SITE_BRANCH || 'main', repo, dest], { stdio: ['ignore', 'ignore', 'inherit'] });
  console.log(`fetch-site: cloned the website into ${dest}`);
}
