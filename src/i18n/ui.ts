/**
 * UI string dictionary — global, short interface strings only.
 * Long-form page/article content does NOT belong here; it lives in
 * content collections or page props.
 */

import type { Lang } from './config.ts';

const en = {
  'nav.home': 'Home',
  'nav.about': 'About',
  'nav.insights': 'Insights',
  'nav.creations': 'Creations',
  'nav.moments': 'Moments',
  'nav.label': 'Primary',
  'menu.open': 'Menu',
  'menu.close': 'Close',
  'skipToContent': 'Skip to content',
  'lang.switch': 'Switch language',
  'lang.short.en': 'EN',
  'lang.short.zh': '中文',
} as const;

export type TranslationKey = keyof typeof en;

// A missing or extra key here is a compile error, so both locales can
// never drift apart.
const zh: Record<TranslationKey, string> = {
  'nav.home': '首页',
  'nav.about': '关于',
  'nav.insights': '洞察',
  'nav.creations': '创作',
  'nav.moments': '生活',
  'nav.label': '主导航',
  'menu.open': '菜单',
  'menu.close': '关闭',
  'skipToContent': '跳至主要内容',
  'lang.switch': '切换语言',
  'lang.short.en': 'EN',
  'lang.short.zh': '中文',
};

export const ui: Record<Lang, Record<TranslationKey, string>> = { en, zh };

export function t(lang: Lang, key: TranslationKey): string {
  return ui[lang][key];
}
