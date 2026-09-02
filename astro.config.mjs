// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://zhuangjian.space',

  // Static output for GitHub Pages (default, kept explicit).
  output: 'static',

  // URL strategy: trailing slash (e.g. /about/, /zh/about/).
  // This is Astro's default `build.format: 'directory'` output
  // (dist/about/index.html), served natively by GitHub Pages.
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },

  // English stays at the root (`/`, `/about/`, ...), Chinese lives under
  // `/zh/...`. No `/en/` prefix, no browser-language redirects.
  // Verified against Astro 7.2.9: `i18n.routing.prefixDefaultLocale` is the
  // current config shape, and `getRelativeLocaleUrl` (astro:i18n) emits
  // exactly these URLs for this configuration.
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
