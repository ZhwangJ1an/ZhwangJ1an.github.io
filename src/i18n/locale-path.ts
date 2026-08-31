/**
 * Pure locale-path logic — no Astro imports.
 *
 * This file is imported both by the Astro build and directly by
 * `scripts/test-i18n.ts` (Node >= 24 runs TypeScript natively), so it must
 * stay free of virtual modules like `astro:i18n`. Explicit `.ts` import
 * extensions are required for Node and allowed by Astro's tsconfig
 * (`allowImportingTsExtensions: true`).
 */

import { defaultLang, languages, type Lang } from './config.ts';

/** Expected input: an absolute pathname, optionally with `?query` and/or `#hash`. */
interface SplitUrl {
  pathname: string;
  search: string;
  hash: string;
}

function splitUrl(url: string): SplitUrl {
  const hashIndex = url.indexOf('#');
  const searchIndex = url.indexOf('?');
  const pathnameEnd = Math.min(
    searchIndex === -1 ? url.length : searchIndex,
    hashIndex === -1 ? url.length : hashIndex,
  );
  return {
    pathname: url.slice(0, pathnameEnd),
    search:
      searchIndex !== -1 && (hashIndex === -1 || searchIndex < hashIndex)
        ? url.slice(searchIndex, hashIndex === -1 ? url.length : hashIndex)
        : '',
    hash: hashIndex === -1 ? '' : url.slice(hashIndex),
  };
}

/**
 * Normalizes a path segment the same way Astro's i18n internals do
 * (`ZH_cn` → `zh-cn`) before comparing against configured locales.
 */
function normalizeSegment(segment: string): string {
  return segment.toLowerCase().replaceAll('_', '-');
}

function isLocaleSegment(segment: string): boolean {
  return (Object.keys(languages) as Lang[]).some((lang) => lang === normalizeSegment(segment));
}

/**
 * Removes the locale prefix — and only a real locale path segment — from an
 * absolute pathname, producing the locale-neutral path.
 *
 * The locale can only ever be the FIRST path segment (that is where Astro's
 * `pathname-prefix-other-locales` strategy places it), so deeper segments
 * that merely contain a locale string are treated as content:
 *
 *   /                     → /
 *   /zh/                  → /
 *   /zh/about/            → /about/
 *   /zhang/               → /zhang/        (not a locale)
 *   /zh-cn/               → /zh-cn/        (not a locale)
 *   /foo/zh/bar/          → /foo/zh/bar/   (first segment is `foo`)
 */
export function getLocaleNeutralPath(url: string | URL): string {
  const pathname = typeof url === 'string' ? splitUrl(url).pathname : url.pathname;
  const segments = pathname.split('/');
  // For absolute paths, segments[0] === '' (before the leading slash).
  if (segments.length >= 2 && isLocaleSegment(segments[1])) {
    segments.splice(1, 1);
  }
  return segments.join('/');
}

/**
 * Detects the current locale from a URL, based strictly on the first real
 * path segment — never on substring matching.
 *
 *   /                     → en
 *   /about/               → en
 *   /zh/insights/coslide/ → zh
 *   /zhang/               → en
 *   /foo/zh/bar/          → en
 */
export function getLangFromUrl(url: URL | string): Lang {
  const pathname = typeof url === 'string' ? splitUrl(url).pathname : url.pathname;
  const firstSegment = normalizeSegment(pathname.split('/')[1] ?? '');
  const match = (Object.keys(languages) as Lang[]).find((lang) => lang === firstSegment);
  return match ?? defaultLang;
}

/**
 * Composes the localized URL for `url` in `target` locale, preserving the
 * full logical path plus query string and hash.
 *
 * Prefix generation is delegated through `localeUrlFor` — in the Astro build
 * this is wired to the official `getRelativeLocaleUrl` (see `utils.ts`);
 * tests wire it to Astro's real implementation to validate the composition.
 */
export function localizePathWith(
  url: string | URL,
  target: Lang,
  localeUrlFor: (target: Lang, neutralPath: string) => string,
): string {
  const { pathname, search, hash } = typeof url === 'string'
    ? splitUrl(url)
    : { pathname: url.pathname, search: url.search, hash: url.hash };

  const neutral = getLocaleNeutralPath(pathname);
  const cleanPath = neutral === '/' ? '' : neutral.replace(/^\/+|\/+$/g, '');
  return localeUrlFor(target, cleanPath) + search + hash;
}
