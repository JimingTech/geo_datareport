import React from 'react';
import Page_CoreDataOverview from '../pages/Page_CoreDataOverview';
import Page_CompetitorAnalysis from '../pages/Page_CompetitorAnalysis';
import Page_ContentDetails from '../pages/Page_ContentDetails';
import Page_QueryDataSystemLink from '../pages/Page_QueryDataSystemLink';

// 词条明细：与慕思 / 桃李同款，一页最多 15 条
// 项目 380（创维-优化词）共 152 个词条，监测平台为 DeepSeek / 豆包 / 元宝 / 通义千问
// 每平台 11 页：前 10 页 15 条，最后一页 2 条
const PROJECT_ID = 380;
const PLATFORM_IDS = [1, 2, 3, 5];
const ENTRY_PAGE_SIZE = 15;
const ENTRY_PAGE_COUNT = 11;

const KeywordPages = [];
for (const platformId of PLATFORM_IDS) {
  for (let pageIndex = 0; pageIndex < ENTRY_PAGE_COUNT; pageIndex += 1) {
    KeywordPages.push(() =>
      React.createElement(Page_QueryDataSystemLink, {
        projectId: PROJECT_ID,
        platformId,
        pageIndex,
        pageSize: ENTRY_PAGE_SIZE,
      })
    );
  }
}

export const slideConfig = [
  {
    type: 'cover',
    title: '封面',
    backgroundImage: '/proposal-cover/proposal-cover-skyworth-a7h-nohost.jpg',
    brand: 'GEO 索引未来',
    subtitle: '创维电视 GEO \n 阶段性报告',
    date: 'November 2026',
  },

  {
    type: 'toc',
    title: '报告目录',
    backgroundImage: '',
    menuText: 'MENU',
    brandLabel: 'GEOINDEXFUTURE // 2026',
    serviceGuide: 'GEO DATA REPORT',
  },

  { type: 'chapter', title: '核心数据与竞品分析', subtitle: 'DATA OVERVIEW & COMPETITOR ANALYSIS', backgroundImage: '' },
  { type: 'section', title: '核心数据总览' },
  { type: 'page', title: '核心数据总览', component: Page_CoreDataOverview },
  { type: 'section', title: '竞品分析' },
  { type: 'page', title: '创维电视（全部词条）竞品分析', component: () => React.createElement(Page_CompetitorAnalysis, { productKey: 'all' }) },
  { type: 'page', title: '创维电视（除壁纸、超薄以外）竞品分析', component: () => React.createElement(Page_CompetitorAnalysis, { productKey: 'ex_form' }) },
  { type: 'page', title: '创维电视（大词）竞品分析', component: () => React.createElement(Page_CompetitorAnalysis, { productKey: 'big' }) },

  { type: 'chapter', title: '投放内容与引用明细', subtitle: 'CONTENT DETAILS', backgroundImage: '/proposal-chapters/proposal-chapter-cover-03.jpg' },
  { type: 'section', title: '引用渠道与数据明细' },
  { type: 'page', title: '创维电视 投放明细', component: Page_ContentDetails },

  { type: 'chapter', title: '词条数据明细', subtitle: 'KEYWORD DETAILS', backgroundImage: '/proposal-chapters/proposal-chapter-cover-03.jpg' },
  { type: 'section', title: '词条监测明细' },
  { type: 'page', title: '创维电视 词条数据明细', components: KeywordPages },
];
