import React from 'react';
import Page_PhaseSummary from '../pages/Page_PhaseSummary';
import Page_PlatformMentionRates from '../pages/Page_PlatformMentionRates';
import Page_CoreDataOverview from '../pages/Page_CoreDataOverview';
import Page_OctDataOverview from '../pages/Page_OctDataOverview';
import Page_CompetitorAnalysis from '../pages/Page_CompetitorAnalysis';
import Page_ContentDetails from '../pages/Page_ContentDetails';
import Page_ContentDetails_AI from '../pages/Page_ContentDetails_AI';
import Page_CompetitorAnalysis_AI from '../pages/Page_CompetitorAnalysis_AI';
import Page_CompetitorAnalysis_Musi from '../pages/Page_CompetitorAnalysis_Musi';
import Page_ContentDetails_Musi from '../pages/Page_ContentDetails_Musi';
import Page_QueryDataSystemLink from '../pages/Page_QueryDataSystemLink';
import Page_AiPlatformUserScale from '../pages/Page_AiPlatformUserScale';
import Page_ModelVersionChanges from '../pages/Page_ModelVersionChanges';
import Page_ModelChangesOverview from '../pages/Page_ModelChangesOverview';
import Page_DoubaoNetworkShift from '../pages/Page_DoubaoNetworkShift';
import Page_DoubaoNoNetworkCases from '../pages/Page_DoubaoNoNetworkCases';
import Page_WorkBuddyWorkflow from '../pages/Page_WorkBuddyWorkflow';
import Page_WorkBuddyMarket from '../pages/Page_WorkBuddyMarket';
import Page_WorkBuddyMarketEvents from '../pages/Page_WorkBuddyMarketEvents';

// 词条明细：与 Report_gujinggong 同款数据系统 UI
// 30 词产品：每平台 2 页（每页 15）
// 20 词产品：每平台 2 页（每页 10），保证 20 条全部展示且不被裁切
const PLATFORM_IDS = [1, 2, 3, 4, 5, 6];

function makeEntryPages(projectId, pageCount, pageSize) {
  const pages = [];
  for (const platformId of PLATFORM_IDS) {
    for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
      pages.push(() =>
        React.createElement(Page_QueryDataSystemLink, {
          projectId,
          platformId,
          pageIndex,
          pageSize,
        })
      );
    }
  }
  return pages;
}

const KeywordPages_Smart = makeEntryPages(182, 2, 15);
const KeywordPages_AI = makeEntryPages(181, 2, 15);
const KeywordPages_Musi = makeEntryPages(239, 2, 10);

export const slideConfig = [
  {
    type: 'cover',
    title: '封面',
    backgroundImage: '/proposal-cover/proposal-cover-new.png',
    brand: 'GEO 索引未来',
    subtitle: '慕思GEO \n 阶段性报告',
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

  { type: 'chapter', title: '核心数据与竞品分析', subtitle: 'DATA OVERVIEW & COMPETITOR ANALYSIS', backgroundImage: '/' },
  { type: 'section', title: '阶段总结' },
  { type: 'page', title: '慕思GEO优化阶段性总结', component: Page_PhaseSummary },
  { type: 'page', title: '三产品各AI平台提及率现状', component: Page_PlatformMentionRates },
  { type: 'section', title: '核心数据总览' },
  { type: 'page', title: '核心数据总览', component: Page_CoreDataOverview },
  { type: 'section', title: '竞品分析' },
  { type: 'page', title: '慕思智能床 竞品分析', component: Page_CompetitorAnalysis },
  { type: 'page', title: '慕思AI床垫 竞品分析', component: Page_CompetitorAnalysis_AI },
  { type: 'page', title: '慕思床垫 竞品分析', component: Page_CompetitorAnalysis_Musi },

  { type: 'chapter', title: '投放内容与引用明细', subtitle: 'CONTENT DETAILS', backgroundImage: '/proposal-chapters/proposal-chapter-cover-03.jpg' },
  { type: 'section', title: '投放渠道与数据明细' },
  { type: 'page', title: '慕思智能床 投放明细', component: Page_ContentDetails },
  { type: 'page', title: '慕思AI床垫 投放明细', component: Page_ContentDetails_AI },
  { type: 'page', title: '慕思床垫 投放明细', component: Page_ContentDetails_Musi },

  { type: 'chapter', title: '各AI平台\n模型变更情况', subtitle: 'AI PLATFORM MODEL UPDATES', backgroundImage: '/proposal-chapters/proposal-chapter-cover-03.jpg' },
  { type: 'section', title: '近期主流AI模型更迭' },
  { type: 'page', title: '各AI平台用户量', component: Page_AiPlatformUserScale, hideHeader: true },
  { type: 'page', title: '主流AI模型版本变更', component: Page_ModelVersionChanges, hideHeader: true },
  { type: 'page', title: '近期主流模型更新记录', component: Page_ModelChangesOverview, hideHeader: true },
  { type: 'page', title: '豆包隐性变动：搜索不联网', component: Page_DoubaoNetworkShift, hideHeader: true },
  { type: 'page', title: '豆包不联网的两类情形', component: Page_DoubaoNoNetworkCases, hideHeader: true },
  { type: 'page', title: 'AI新产品：腾讯WorkBuddy（架构与界面）', component: Page_WorkBuddyWorkflow, hideHeader: true },
  { type: 'page', title: 'AI新产品：腾讯WorkBuddy（市场定位与用户量）', component: Page_WorkBuddyMarket, hideHeader: true },
  { type: 'page', title: 'AI新产品：腾讯WorkBuddy（市场反馈与代表事件）', component: Page_WorkBuddyMarketEvents, hideHeader: true },

  { type: 'chapter', title: '词条数据明细', subtitle: 'KEYWORD DETAILS', backgroundImage: '/proposal-chapters/proposal-chapter-cover-03.jpg' },
  { type: 'section', title: '词条监测明细' },
  { type: 'page', title: '慕思智能床 词条数据明细', components: KeywordPages_Smart },
  { type: 'page', title: '慕思AI床垫 词条数据明细', components: KeywordPages_AI },
  { type: 'page', title: '慕思床垫 词条数据明细', components: KeywordPages_Musi },

  { type: 'chapter', title: '10月数据', subtitle: 'OCTOBER DATA', backgroundImage: '/proposal-chapters/proposal-chapter-cover-03.jpg' },
  { type: 'section', title: '10月核心数据' },
  { type: 'page', title: '10月核心数据总览', component: Page_OctDataOverview },
  { type: 'page', title: '10月各AI平台提及率', component: Page_PlatformMentionRates },
  { type: 'section', title: '10月竞品分析' },
  { type: 'page', title: '10月 慕思智能床竞品分析', component: Page_CompetitorAnalysis },
  { type: 'page', title: '10月 慕思AI床垫竞品分析', component: Page_CompetitorAnalysis_AI },
  { type: 'page', title: '10月 慕思床垫竞品分析', component: Page_CompetitorAnalysis_Musi },
];
