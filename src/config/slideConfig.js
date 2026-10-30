import React from 'react';
import Page_KpiAcceptance from '../pages/Page_KpiAcceptance';
import Page_CompetitorAnalysis from '../pages/Page_CompetitorAnalysis';
import Page_ContentDetails from '../pages/Page_ContentDetails';
import Page_QueryDataSystemLink from '../pages/Page_QueryDataSystemLink';

// 词条明细：与数据系统 UI 同款
// 项目 5203（京东雾化器）共 71 个词条。10月31日有数的平台是 DeepSeek / 豆包
// 每平台 4 页 × 每页 19 条，末页 14 条
const PROJECT_ID = 5203;
const PLATFORM_IDS = [1, 2];
const ENTRY_PAGE_SIZE = 19;
const ENTRY_PAGE_COUNT = 4;

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
    backgroundImage: '/proposal-cover/proposal-cover-new.png',
    brand: 'GEO 索引未来',
    subtitle: '京东雾化器 GEO \n 阶段性报告',
    date: 'October 2026',
  },

  {
    type: 'toc',
    title: '报告目录',
    backgroundImage: '',
    menuText: 'MENU',
    brandLabel: 'GEOINDEXFUTURE // 2026',
    serviceGuide: 'GEO DATA REPORT',
  },

  { type: 'chapter', title: 'KPI 达标与竞品分析', subtitle: 'KPI ACCEPTANCE & COMPETITOR ANALYSIS', backgroundImage: '' },
  { type: 'section', title: 'KPI 达标验收情况' },
  { type: 'page', title: 'KPI 达标验收情况', component: Page_KpiAcceptance },
  { type: 'section', title: '竞品分析' },
  { type: 'page', title: '京东雾化器 竞品分析', component: Page_CompetitorAnalysis },

  { type: 'chapter', title: '投放内容与引用明细', subtitle: 'CONTENT DETAILS', backgroundImage: '' },
  { type: 'section', title: '引用渠道与数据明细' },
  { type: 'page', title: '京东雾化器 投放明细', component: Page_ContentDetails },

  { type: 'chapter', title: '词条数据明细', subtitle: 'KEYWORD DETAILS', backgroundImage: '' },
  { type: 'section', title: '词条监测明细' },
  { type: 'page', title: '京东雾化器 词条数据明细', components: KeywordPages },
];
