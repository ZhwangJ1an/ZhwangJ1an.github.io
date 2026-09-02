/**
 * test-media-policy.mjs — Global Locked Media Policy source audit
 * (docs/media-policy.md).
 *
 * Scans src/ for content imagery that bypasses the unified media
 * primitive (MediaSlot.astro). Any raw media markup outside the
 * allowlist fails the run — and because this script is chained into
 * `npm run build`, a bypass fails CI/deployment too.
 *
 * Allowed:
 *   - src/components/MediaSlot.astro — the media primitive itself
 *   - src/layouts/BaseLayout.astro  — the runtime controller, which is
 *     the only code allowed to create media elements (createElement)
 *   - UI/metadata assets (favicon, SVG icons) — nothing here generates
 *     <img> tags, so no further exceptions exist today
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SRC = join(ROOT, 'src');

const MEDIA_PRIMITIVE = 'src/components/MediaSlot.astro';
const MEDIA_CONTROLLER = 'src/layouts/BaseLayout.astro';

/** Rules: pattern → which files (repo-relative, forward slashes) may contain it. */
const RULES = [
  { label: 'raw <img> tag', pattern: /<img[\s>]/i, allow: new Set([MEDIA_PRIMITIVE, MEDIA_CONTROLLER]) },
  { label: 'raw <picture> tag', pattern: /<picture[\s>]/i, allow: new Set([MEDIA_PRIMITIVE, MEDIA_CONTROLLER]) },
  { label: 'Astro <Image> component', pattern: /<Image[\s/>]/, allow: new Set() },
  { label: 'Astro <Picture> component', pattern: /<Picture[\s/>]/, allow: new Set() },
  {
    label: 'runtime media element (createElement)',
    pattern: /createElement\(\s*['"](img|picture|source)['"]\s*\)/i,
    allow: new Set([MEDIA_CONTROLLER]),
  },
  {
    label: 'CSS background-image url() (potential content-image bypass)',
    pattern: /background-image\s*:[^;}]*url\(/i,
    allow: new Set(),
    extensions: ['.astro', '.css', '.html'],
  },
  {
    label: 'markdown/MDX content image',
    pattern: /![^\[\]]*\]\([^)]+\)/,
    allow: new Set(),
    extensions: ['.md', '.mdx'],
  },
];

const SCAN_EXTENSIONS = new Set([
  '.astro',
  '.ts',
  '.tsx',
  '.js',
  '.mjs',
  '.css',
  '.html',
  '.md',
  '.mdx',
]);

function walk(dir) {
  const entries = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      entries.push(...walk(full));
    } else {
      entries.push(full);
    }
  }
  return entries;
}

const files = walk(SRC).filter((f) => SCAN_EXTENSIONS.has(f.slice(f.lastIndexOf('.'))));
const violations = [];

for (const file of files) {
  const rel = relative(ROOT, file).split(sep).join('/');
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    for (const rule of RULES) {
      if (rule.extensions && !rule.extensions.includes(rel.slice(rel.lastIndexOf('.')))) continue;
      if (rule.allow.has(rel)) continue;
      if (rule.pattern.test(line)) {
        violations.push(
          `VIOLATION [${rule.label}]\n  ${rel}:${i + 1}\n  ${line.trim().slice(0, 120)}`,
        );
      }
    }
  });
}

const scanned = files.length;
if (violations.length > 0) {
  console.error(
    `media-policy: FAIL — ${violations.length} violation(s) in ${scanned} scanned files\n\n` +
      violations.join('\n\n') +
      `\n\nEvery content image must render through MediaSlot.astro\n` +
      `(Global Locked Media Policy — see docs/media-policy.md).`,
  );
  process.exit(1);
}

console.log(`media-policy: ok — ${scanned} files scanned, no content-image bypass of the locked media primitive`);
