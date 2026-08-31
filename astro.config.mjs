// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://zhuangjian.space',

  // Static output for GitHub Pages (default, kept explicit).
  output: 'static',

  // Phase 2 will add:
  //   i18n: { defaultLocale: 'en', locales: ['en', 'zh'], routing: { prefixDefaultLocale: false } }
  // so English routes stay at `/...` and Chinese routes live under `/zh/...`.
});
