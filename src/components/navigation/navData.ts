/**
 * Navigation data — the single source for the primary sections.
 * Paths are locale-neutral; URL generation stays with Astro's official
 * helpers in the component layer, and labels come from the UI dictionary.
 * This file is pure (no astro:i18n), so the active-route logic is
 * covered by scripts/test-i18n.ts.
 */

import { getLocaleNeutralPath } from '../../i18n/locale-path.ts';
import type { TranslationKey } from '../../i18n/ui.ts';

export interface NavItem {
  key: TranslationKey;
  /** Locale-neutral first-level path, e.g. 'insights' (no slashes). */
  path: string;
}

export const navItems: readonly NavItem[] = [
  { key: 'nav.about', path: 'about' },
  { key: 'nav.insights', path: 'insights' },
  { key: 'nav.creations', path: 'creations' },
  { key: 'nav.moments', path: 'moments' },
] as const;

/**
 * The section active for a URL — matches the FIRST locale-neutral segment,
 * so /insights/ and /insights/coslide/ (and their /zh/ mirrors) both
 * resolve to `insights`. Never substring matching.
 */
export function getActiveNavSection(pathname: string): NavItem | undefined {
  const firstSegment = getLocaleNeutralPath(pathname).split('/')[1] ?? '';
  return navItems.find((item) => item.path === firstSegment);
}

/**
 * True only when the URL IS the section index itself (e.g. /insights/).
 * Nested pages (/insights/coslide/) get the visual section state but not
 * aria-current="page", which would be semantically wrong there.
 */
export function isExactNavPage(pathname: string, item: NavItem): boolean {
  return getLocaleNeutralPath(pathname) === `/${item.path}/`;
}

/** True when the URL is a homepage of either locale. */
export function isLocaleHome(pathname: string): boolean {
  return getLocaleNeutralPath(pathname) === '/';
}
