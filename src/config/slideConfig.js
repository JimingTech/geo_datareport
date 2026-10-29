import React from 'react';
import Page_CoreDataOverview from '../pages/Page_CoreDataOverview';
import Page_CompetitorAnalysis from '../pages/Page_CompetitorAnalysis';
import Page_ContentDetails from '../pages/Page_ContentDetails';
import Page_QueryDataSystemLink from '../pages/Page_QueryDataSystemLink';

// 词条明细：与数据系统 UI 同款
// 项目 721（创新谷-优化词，给客户的项目）共 70 个词条，监测平台为 DeepSeek / 豆包
// 每平台 5 页 × 每页 15 条，最后一页 10 条（对齐创维电视 / 慕思）
const PROJECT_ID = 721;
const PLATFORM_IDS = [1, 2];
const ENTRY_PAGE_SIZE = 15;
const ENTRY_PAGE_COUNT = 5;

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
    backgroundImage: '/proposal-cover/proposal-cover-chuangxingu.jpg',
    brand: 'GEO 索引未来',
    subtitle: '创维创新谷 GEO \n 阶段性报告',
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

  { type: 'chapter', title: '核心数据与竞品分析', subtitle: 'DATA OVERVIEW & COMPETITOR ANALYSIS', backgroundImage: '' },
  { type: 'section', title: '核心数据总览' },
  { type: 'page', title: '核心数据总览', component: Page_CoreDataOverview },
  { type: 'section', title: '竞品分析' },
  { type: 'page', title: '创维创新谷 竞品分析', component: Page_CompetitorAnalysis },

  { type: 'chapter', title: '投放内容与引用明细', subtitle: 'CONTENT DETAILS', backgroundImage: '/proposal-chapters/proposal-chapter-cover-03.jpg' },
  { type: 'section', title: '引用渠道与数据明细' },
  { type: 'page', title: '创维创新谷 投放明细', component: Page_ContentDetails },

  { type: 'chapter', title: '词条数据明细', subtitle: 'KEYWORD DETAILS', backgroundImage: '/proposal-chapters/proposal-chapter-cover-03.jpg' },
  { type: 'section', title: '词条监测明细' },
  { type: 'page', title: '创维创新谷 词条数据明细', components: KeywordPages },
];
