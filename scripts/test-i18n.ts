/**
 * i18n logic tests — run with `npm run test:i18n` (Node >= 24 executes
 * TypeScript natively; no test framework, no extra dependencies).
 *
 * Coverage strategy:
 *  - `getLangFromUrl` / `getLocaleNeutralPath` / `localizePathWith` are the
 *    real production functions, imported from `src/i18n/locale-path.ts`.
 *  - Prefix generation is wired to Astro 7.2.9's REAL implementation
 *    (`astro/dist/i18n/index.js` — the non-virtual module that
 *    `astro:i18n` itself delegates to) with this project's exact config,
 *    so the asserted URLs are what the production build emits.
 *  - The single-line adapter in `src/i18n/utils.ts` (astro:i18n →
 *    localizePathWith) is covered end-to-end by the dist HTML checks.
 */

import { getLocaleRelativeUrl } from '../node_modules/astro/dist/i18n/index.js';
import {
  getLangFromUrl,
  getLocaleNeutralPath,
  localizePathWith,
} from '../src/i18n/locale-path.ts';
import type { Lang } from '../src/i18n/config.ts';
import {
  getActiveNavSection,
  isExactNavPage,
  isLocaleHome,
  navItems,
} from '../src/components/navigation/navData.ts';

// Mirrors astro.config.mjs exactly (format/trailingSlash defaults included).
// `domains` is required by Astro's function types; this project has no
// per-locale domains, so it is undefined at runtime as well.
const ASTRO_CONFIG = {
  base: '/',
  trailingSlash: 'ignore' as const,
  format: 'directory' as const,
  defaultLocale: 'en',
  locales: ['en', 'zh'],
  strategy: 'pathname-prefix-other-locales' as const,
  domains: undefined,
};

// The same delegation utils.ts performs with astro:i18n at build time.
const localizePath = (url: string | URL, target: Lang): string =>
  localizePathWith(url, target, (locale, neutralPath) =>
    getLocaleRelativeUrl({ ...ASTRO_CONFIG, locale, path: neutralPath }),
  );

let passed = 0;
let failed = 0;

function expectEqual(actual: unknown, expected: unknown, label: string): void {
  if (actual === expected) {
    passed++;
    console.log(`  ok  ${label}`);
  } else {
    failed++;
    console.error(`FAIL  ${label}\n      expected: ${JSON.stringify(expected)}\n      actual:   ${JSON.stringify(actual)}`);
  }
}

console.log('\n# getLangFromUrl — locale detection from the first path segment');
const langCases: Array<[string, Lang]> = [
  ['/', 'en'],
  ['/about/', 'en'],
  ['/insights/coslide/', 'en'],
  ['/zh/', 'zh'],
  ['/zh/about/', 'zh'],
  ['/zh/insights/coslide/', 'zh'],
  // STEP 22 edge cases — none of these may be misjudged as /zh/ locale.
  ['/zhang/', 'en'],
  ['/zh-cn/', 'en'],
  ['/zh-cn/about/', 'en'],
  ['/foo/zh/bar/', 'en'],
  ['/insights/zh/?type=paper', 'en'],
  ['//', 'en'],
  // Normalization: case variants of the real locale still match…
  ['/ZH/about/', 'zh'],
  // …but `zh_cn`/`zh-cn` normalize to `zh-cn`, which is NOT the locale `zh`.
  ['/zh_cn/', 'en'],
];
for (const [url, expected] of langCases) {
  expectEqual(getLangFromUrl(url), expected, `getLangFromUrl('${url}') → ${expected}`);
}

console.log('\n# getLocaleNeutralPath — only a real locale segment is removed');
const neutralCases: Array<[string, string]> = [
  ['/', '/'],
  ['/zh/', '/'],
  ['/zh/about/', '/about/'],
  ['/zh/insights/coslide/', '/insights/coslide/'],
  ['/about/', '/about/'],
  ['/zhang/', '/zhang/'],
  ['/zh-cn/', '/zh-cn/'],
  ['/foo/zh/bar/', '/foo/zh/bar/'],
];
for (const [url, expected] of neutralCases) {
  expectEqual(getLocaleNeutralPath(url), expected, `getLocaleNeutralPath('${url}') → ${expected}`);
}

console.log('\n# Astro official URL generation with this project config');
const prefixCases: Array<[Lang, string, string]> = [
  ['en', '', '/'],
  ['zh', '', '/zh/'],
  ['en', 'about', '/about/'],
  ['zh', 'about', '/zh/about/'],
  ['en', 'insights/coslide', '/insights/coslide/'],
  ['zh', 'insights/coslide', '/zh/insights/coslide/'],
];
for (const [locale, path, expected] of prefixCases) {
  const actual = getLocaleRelativeUrl({ ...ASTRO_CONFIG, locale, path });
  expectEqual(actual, expected, `getRelativeLocaleUrl('${locale}', '${path}') → ${expected}`);
}

console.log('\n# localizePath — full switch matrix (STEP 6 / STEP 8 / STEP 21)');
const switchCases: Array<[string, Lang, string]> = [
  ['/', 'zh', '/zh/'],
  ['/zh/', 'en', '/'],
  ['/about/', 'zh', '/zh/about/'],
  ['/zh/about/', 'en', '/about/'],
  ['/insights/', 'zh', '/zh/insights/'],
  ['/zh/insights/', 'en', '/insights/'],
  ['/insights/coslide/', 'zh', '/zh/insights/coslide/'],
  ['/zh/insights/coslide/', 'en', '/insights/coslide/'],
  ['/insights/foo/bar/', 'zh', '/zh/insights/foo/bar/'],
  ['/zh/insights/foo/bar/', 'en', '/insights/foo/bar/'],
  // Query strings must survive the switch.
  ['/insights/?type=paper', 'zh', '/zh/insights/?type=paper'],
  ['/zh/insights/?type=paper', 'en', '/insights/?type=paper'],
  ['/insights/foo/bar/?type=paper', 'zh', '/zh/insights/foo/bar/?type=paper'],
  ['/zh/insights/foo/bar/?type=paper&page=2', 'en', '/insights/foo/bar/?type=paper&page=2'],
];
for (const [url, target, expected] of switchCases) {
  expectEqual(localizePath(url, target), expected, `'${url}' → ${target}: ${expected}`);
}

console.log('\n# Round-trip: switching there and back must restore the URL');
const roundTripCases = [
  '/',
  '/about/',
  '/insights/coslide/',
  '/insights/foo/bar/?type=paper',
];
for (const url of roundTripCases) {
  const roundTripped = localizePath(localizePath(url, 'zh'), 'en');
  expectEqual(roundTripped, url, `'${url}' → zh → en === '${url}'`);
}

console.log('\n# Active nav section — nested routes resolve to their section');
const insightsItem = navItems.find((item) => item.path === 'insights');
if (!insightsItem) throw new Error('nav data: insights item missing');
const activeCases: Array<[string, string | undefined]> = [
  ['/', undefined],
  ['/about/', 'about'],
  ['/insights/', 'insights'],
  ['/insights/coslide/', 'insights'],
  ['/zh/insights/', 'insights'],
  ['/zh/insights/coslide/', 'insights'],
  ['/zh/about/', 'about'],
  ['/zhang/', undefined],
  ['/foo/zh/bar/', undefined],
];
for (const [url, expected] of activeCases) {
  expectEqual(
    getActiveNavSection(url)?.path,
    expected,
    `getActiveNavSection('${url}') → ${expected ?? 'none'}`,
  );
}

console.log('\n# aria-current only for exact section pages (never nested pages)');
const exactCases: Array<[string, boolean]> = [
  ['/insights/', true],
  ['/zh/insights/', true],
  ['/insights/coslide/', false],
  ['/zh/insights/coslide/', false],
  ['/', false],
];
for (const [url, expected] of exactCases) {
  expectEqual(isExactNavPage(url, insightsItem), expected, `isExactNavPage('${url}') → ${expected}`);
}

console.log('\n# Locale home detection');
expectEqual(isLocaleHome('/'), true, "isLocaleHome('/') → true");
expectEqual(isLocaleHome('/zh/'), true, "isLocaleHome('/zh/') → true");
expectEqual(isLocaleHome('/about/'), false, "isLocaleHome('/about/') → false");

console.log(`\n${passed} passed, ${failed} failed\n`);
if (failed > 0) {
  process.exit(1);
}
