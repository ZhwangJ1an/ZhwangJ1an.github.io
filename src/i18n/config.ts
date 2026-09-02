/**
 * Central locale definitions for the whole site.
 * Every component must import `Lang` from here — never redeclare `'en' | 'zh'`.
 */

export const languages = {
  en: 'English',
  zh: '中文',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'en';

/**
 * BCP 47 language tag used for `<html lang>` and `hreflang`.
 * URL locale `zh` maps to `zh-CN`: the URL prefix stays short while the
 * HTML language tag stays a valid BCP 47 region tag for Chinese content.
 */
export const htmlLang: Record<Lang, string> = {
  en: 'en',
  zh: 'zh-CN',
};
