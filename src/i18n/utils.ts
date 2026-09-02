/**
 * i18n utilities for use inside Astro components.
 *
 * Locale-prefix generation is delegated to Astro's official
 * `getRelativeLocaleUrl` (astro:i18n) — configured via astro.config.mjs —
 * so the site emits exactly the URLs Astro itself considers canonical for
 * this i18n configuration. Pure path logic lives in `locale-path.ts`.
 */

import { getRelativeLocaleUrl } from 'astro:i18n';
import { localizePathWith } from './locale-path.ts';
import type { Lang } from './config.ts';
import { ui, type TranslationKey } from './ui.ts';

/** Look up a UI string. Both locales are compile-time complete. */
export function t(lang: Lang, key: TranslationKey): string {
  return ui[lang][key];
}

/**
 * Maps a URL (absolute pathname, query and hash included) to its equivalent
 * in `target` locale:
 *
 *   localizePath('/insights/coslide/', 'zh')      → /zh/insights/coslide/
 *   localizePath('/zh/insights/coslide/', 'en')   → /insights/coslide/
 *   localizePath('/insights/?type=paper', 'zh')   → /zh/insights/?type=paper
 *
 * Works for any nested path, present or future — there is no route table.
 */
export function localizePath(url: string | URL, target: Lang): string {
  return localizePathWith(url, target, (locale, neutralPath) =>
    getRelativeLocaleUrl(locale, neutralPath),
  );
}
