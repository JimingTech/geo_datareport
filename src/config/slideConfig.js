import React from 'react';
import Page_CoreDataOverview from '../pages/Page_CoreDataOverview';
import Page_CompetitorAnalysis from '../pages/Page_CompetitorAnalysis';
import Page_KeywordCategorization from '../pages/Page_KeywordCategorization';
import Page_KpiAcceptance from '../pages/Page_KpiAcceptance';
import Page_DataTroubleshooting from '../pages/Page_DataTroubleshooting';
import Page_DataTroubleshootingSummary from '../pages/Page_DataTroubleshootingSummary';
import Page_ContentDetails from '../pages/Page_ContentDetails';
import Page_Foreword from '../pages/Page_Foreword';

// Product 2 (AI Mattress) independent page imports
import Page_CoreDataOverview_AI from '../pages/Page_CoreDataOverview_AI';
import Page_CompetitorAnalysis_AI from '../pages/Page_CompetitorAnalysis_AI';
import Page_KeywordCategorization_AI from '../pages/Page_KeywordCategorization_AI';
import Page_KpiAcceptance_AI from '../pages/Page_KpiAcceptance_AI';
import Page_ContentDetails_AI from '../pages/Page_ContentDetails_AI';
import Page_QueryDataSystemLink from '../pages/Page_QueryDataSystemLink';

// 古16 / 古20 × DeepSeek / 豆包 / 文心 / Kimi
const Page_Entries_123_1 = () => React.createElement(Page_QueryDataSystemLink, { projectId: 123, platformId: 1 });
const Page_Entries_123_2 = () => React.createElement(Page_QueryDataSystemLink, { projectId: 123, platformId: 2 });
const Page_Entries_123_4 = () => React.createElement(Page_QueryDataSystemLink, { projectId: 123, platformId: 4 });
const Page_Entries_123_6 = () => React.createElement(Page_QueryDataSystemLink, { projectId: 123, platformId: 6 });

const Page_Entries_124_1 = () => React.createElement(Page_QueryDataSystemLink, { projectId: 124, platformId: 1 });
const Page_Entries_124_2 = () => React.createElement(Page_QueryDataSystemLink, { projectId: 124, platformId: 2 });
const Page_Entries_124_4 = () => React.createElement(Page_QueryDataSystemLink, { projectId: 124, platformId: 4 });
const Page_Entries_124_6 = () => React.createElement(Page_QueryDataSystemLink, { projectId: 124, platformId: 6 });

export const slideConfig = [
  // ——— 封面 & 目录 ———
  {
    type: 'cover',
    title: '封面',
    backgroundImage: '/proposal-cover/proposal-cover-new.png',
    brand: 'GEO 索引未来',
    subtitle: '古井贡酒GEO \n 阶段性报告',
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

  // ——— 篇章1: 核心数据与竞品分析 ———
  { type: 'chapter', title: '核心数据与竞品分析', subtitle: 'DATA OVERVIEW & COMPETITOR ANALYSIS', backgroundImage: '/' },
  { type: 'section', title: '核心数据总览' },
  { type: 'page', title: '核心数据总览', component: Page_CoreDataOverview },
  { type: 'section', title: '竞品分析' },
  { type: 'page', title: '古井贡酒古16 竞品分析', component: Page_CompetitorAnalysis },
  { type: 'page', title: '古井贡酒古20 竞品分析', component: Page_CompetitorAnalysis_AI },

  // ——— 篇章2: 投放内容明细 ———
  { type: 'chapter', title: '投放内容与引用明细', subtitle: 'CONTENT DETAILS', backgroundImage: '/proposal-chapters/proposal-chapter-cover-03.jpg' },
  { type: 'section', title: '投放渠道与数据明细' },
  { type: 'page', title: '古井贡酒古16 投放明细', component: Page_ContentDetails },
  { type: 'page', title: '古井贡酒古20 投放明细', component: Page_ContentDetails_AI },

  // ——— 篇章3: 词条数据明细 ———
  { type: 'chapter', title: '词条数据明细', subtitle: 'KEYWORD DETAILS', backgroundImage: '/proposal-chapters/proposal-chapter-cover-03.jpg' },
  { type: 'section', title: '古井贡酒古16 平台明细' },
  { type: 'page', title: '古16 DeepSeek 词条明细', component: Page_Entries_123_1 },
  { type: 'page', title: '古16 豆包 词条明细', component: Page_Entries_123_2 },
  { type: 'page', title: '古16 文心 词条明细', component: Page_Entries_123_4 },
  { type: 'page', title: '古16 Kimi 词条明细', component: Page_Entries_123_6 },
  { type: 'section', title: '古井贡酒古20 平台明细' },
  { type: 'page', title: '古20 DeepSeek 词条明细', component: Page_Entries_124_1 },
  { type: 'page', title: '古20 豆包 词条明细', component: Page_Entries_124_2 },
  { type: 'page', title: '古20 文心 词条明细', component: Page_Entries_124_4 },
  { type: 'page', title: '古20 Kimi 词条明细', component: Page_Entries_124_6 },

];
