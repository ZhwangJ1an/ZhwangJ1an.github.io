/**
 * Homepage editorial copy — the single source for both language versions.
 *
 * CONTENT INTEGRITY: everything here is either an approved identity
 * expression or a clearly-marked development placeholder. No invented
 * biographical facts, institutions, metrics, or dates. Placeholder items
 * are replaced by the real content collection in Phase 6.
 */

import type { Lang } from '../i18n/config.ts';

export interface HomeCopy {
  /** Hero */
  heroNameLines: [string, string] | [string];
  heroRoles: string;
  heroQuad: string[];

  /** 01 About */
  aboutLabel: string;
  aboutStatement: string[];

  /** 02 Insights */
  insightsLabel: string;
  insightsHeading: string;
  insightsSupport: string;
  featured: { title: string; kind: string };
  insightsRows: Array<{ title: string; kind: string }>;
  insightsCta: string;

  /** 03 Creations */
  creationsLabel: string;
  creationsHeading: string;
  creationsSupport: string;
  creationsCta: string;

  /** 04 Moments */
  momentsLabel: string;
  momentsHeading: string;
  momentsSupport: string;
  momentsCta: string;

  /** SEO */
  title: string;
  description: string;
}

const en: HomeCopy = {
  heroNameLines: ['JIAN', 'ZHUANG'],
  heroRoles: 'Researcher · Engineer · Builder',
  heroQuad: ['Research.', 'Technology.', 'Creation.', 'Life.'],

  aboutLabel: '01 / About',
  aboutStatement: ['I study flows.', 'I work with images.', 'I build with AI.'],

  insightsLabel: '02 / Insights',
  insightsHeading: 'Understanding flows through data.',
  insightsSupport: "Ideas, research and things I've been building.",
  // Development placeholders — real entries arrive with Phase 6.
  featured: { title: 'Flow imaging', kind: 'Research' },
  insightsRows: [
    { title: 'Scientific AI', kind: 'Research' },
    { title: 'CoSlide', kind: 'Project' },
  ],
  insightsCta: 'Explore insights',

  creationsLabel: '03 / Creations',
  creationsHeading: 'Things I make, record and share.',
  creationsSupport: 'Demos, visualizations and talks — beyond the papers.',
  creationsCta: 'Explore creations',

  momentsLabel: '04 / Moments',
  momentsHeading: 'Small pieces of life.',
  momentsSupport: 'Photos and quiet records, kept casually.',
  momentsCta: 'View moments',

  title: 'Jian Zhuang — Research, Technology, Creation & Life',
  description: 'Jian Zhuang. Researcher, engineer, builder — flows, images, and the systems in between.',
};

const zh: HomeCopy = {
  heroNameLines: ['庄简'],
  heroRoles: '研究者 · 工程实践 · 创作者',
  heroQuad: ['研究', '技术', '创作', '生活'],

  aboutLabel: '01 / 关于',
  aboutStatement: ['理解流动，', '处理图像，', '把想法真正做出来。'],

  insightsLabel: '02 / 洞察',
  insightsHeading: '用数据理解流动。',
  insightsSupport: '想法、研究，与正在构建的东西。',
  featured: { title: '流动成像', kind: '研究' },
  insightsRows: [
    { title: '科学 AI', kind: '研究' },
    { title: 'CoSlide', kind: '项目' },
  ],
  insightsCta: '进入洞察',

  creationsLabel: '03 / 创作',
  // Controlled editorial line breaks — CJK phrases must not split mid-word.
  creationsHeading: '做出来，\n记录下来，\n分享出去。',
  creationsSupport: '演示、可视化与演讲——论文之外的部分。',
  creationsCta: '进入创作',

  momentsLabel: '04 / 生活',
  momentsHeading: '生活的一些切片。',
  momentsSupport: '照片与随手记录，不设体系。',
  momentsCta: '查看生活',

  title: '庄简 — 研究、技术、创作与生活',
  description: '庄简。研究者、工程师、创作者——关注流动、图像，以及两者之间的系统。',
};

const copy: Record<Lang, HomeCopy> = { en, zh };

export function getHomeCopy(lang: Lang): HomeCopy {
  return copy[lang];
}
