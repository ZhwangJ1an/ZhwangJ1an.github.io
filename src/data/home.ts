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
  /** Visual description of the hero photograph — visible content only. */
  heroAlt: string;

  /** 01 About */
  aboutLabel: string;
  aboutStatement: string[];

  /** 02 Insights */
  insightsLabel: string;
  insightsHeading: string;
  insightsSupport: string;
  featured: { title: string; kind: string };
  /** Secondary visual in the featured spread (CoSlide product UI). */
  featuredSecondary: { title: string; kind: string };
  insightsFigureAlt: string;
  insightsSecondaryAlt: string;
  insightsRows: Array<{ title: string; kind: string }>;
  insightsCta: string;

  /** 03 Creations */
  creationsLabel: string;
  creationsHeading: string;
  creationsSupport: string;
  creationsMediaAlt: string;
  creationsCta: string;

  /** 04 Moments */
  momentsLabel: string;
  momentsHeading: string;
  momentsSupport: string;
  /** Visual descriptions of the three photographs — visible content only. */
  momentAlts: [string, string, string];
  momentsCta: string;

  /** SEO */
  title: string;
  description: string;
}

const en: HomeCopy = {
  heroNameLines: ['JIAN', 'ZHUANG'],
  heroRoles: 'Researcher · Engineer · Builder',
  heroQuad: ['Research.', 'Technology.', 'Creation.', 'Life.'],
  heroAlt: 'Standing arms-crossed in a rocky mountain valley, a snow peak lit by sun behind the clouds.',

  aboutLabel: '01 / About',
  aboutStatement: ['I study flows.', 'I work with images.', 'I build with AI.'],

  insightsLabel: '02 / Insights',
  insightsHeading: 'Understanding flows through data.',
  insightsSupport: "Ideas, research and things I've been building.",
  // Development placeholders — real entries arrive with Phase 6.
  featured: { title: 'Flow imaging', kind: 'Research' },
  featuredSecondary: { title: 'CoSlide', kind: 'Project' },
  insightsFigureAlt:
    'Four density plots comparing method variants on log MSE, SSIM, correlation and IoU — G-S (Proposed) drawn solid.',
  insightsSecondaryAlt: 'PowerPoint task pane of CoSlide, an AI slide-design assistant.',
  insightsRows: [
    { title: 'Scientific AI', kind: 'Research' },
    { title: 'CoSlide', kind: 'Project' },
  ],
  insightsCta: 'Explore insights',

  creationsLabel: '03 / Creations',
  creationsHeading: 'Things I make, record and share.',
  creationsSupport: 'Demos, visualizations and talks — beyond the papers.',
  creationsMediaAlt: 'Browser window showing a video channel page with rail-journey videos in a grid.',
  creationsCta: 'Explore creations',

  momentsLabel: '04 / Moments',
  momentsHeading: 'Small pieces of life.',
  momentsSupport: 'Photos and quiet records, kept casually.',
  momentAlts: [
    'On a rocky summit ridge — blue hood and sunglasses, snow patches and grey clouds behind.',
    'A peace sign on an airfield apron, jets parked under an overcast sky.',
    'By a wooden fence above a wide river bend under a clear sky.',
  ],
  momentsCta: 'View moments',

  title: 'Jian Zhuang — Research, Technology, Creation & Life',
  description: 'Jian Zhuang. Researcher, engineer, builder — flows, images, and the systems in between.',
};

const zh: HomeCopy = {
  heroNameLines: ['庄简'],
  heroRoles: '研究者 · 工程实践 · 创作者',
  heroQuad: ['研究', '技术', '创作', '生活'],
  heroAlt: '人物双臂交叉站在多石的山谷中，云层后的雪峰被阳光照亮。',

  aboutLabel: '01 / 关于',
  aboutStatement: ['理解流动，', '处理图像，', '把想法真正做出来。'],

  insightsLabel: '02 / 洞察',
  insightsHeading: '用数据理解流动。',
  insightsSupport: '想法、研究，与正在构建的东西。',
  featured: { title: '流动成像', kind: '研究' },
  featuredSecondary: { title: 'CoSlide', kind: '项目' },
  insightsFigureAlt: '对数 MSE、SSIM、相关系数与 IoU 四项指标上各方法变体的分布密度对比，G-S（Proposed）以实线标出。',
  insightsSecondaryAlt: 'CoSlide 在 PowerPoint 中的任务窗格，一个 AI 幻灯片设计助手。',
  insightsRows: [
    { title: '科学 AI', kind: '研究' },
    { title: 'CoSlide', kind: '项目' },
  ],
  insightsCta: '进入洞察',

  creationsLabel: '03 / 创作',
  // Controlled editorial line breaks — CJK phrases must not split mid-word.
  creationsHeading: '做出来，\n记录下来，\n分享出去。',
  creationsSupport: '演示、可视化与演讲——论文之外的部分。',
  creationsMediaAlt: '浏览器中的视频主页，网格里排布着铁路旅程视频。',
  creationsCta: '进入创作',

  momentsLabel: '04 / 生活',
  momentsHeading: '生活的一些切片。',
  momentsSupport: '照片与随手记录，不设体系。',
  momentAlts: [
    '岩石山顶上，蓝色冲锋衣帽与墨镜，身后是残雪与阴云。',
    '停机坪上的剪刀手，阴云下停放着战机。',
    '木栏旁，晴空下俯瞰宽阔的河湾。',
  ],
  momentsCta: '查看生活',

  title: '庄简 — 研究、技术、创作与生活',
  description: '庄简。研究者、工程师、创作者——关注流动、图像，以及两者之间的系统。',
};

const copy: Record<Lang, HomeCopy> = { en, zh };

export function getHomeCopy(lang: Lang): HomeCopy {
  return copy[lang];
}
