import React from 'react';
import Page_CoreDataOverview from '../pages/Page_CoreDataOverview';
import Page_CompetitorAnalysis from '../pages/Page_CompetitorAnalysis';
import Page_ContentDetails from '../pages/Page_ContentDetails';
import Page_ContentDetails_AI from '../pages/Page_ContentDetails_AI';
import Page_CompetitorAnalysis_AI from '../pages/Page_CompetitorAnalysis_AI';
import Page_QueryDataSystemLink from '../pages/Page_QueryDataSystemLink';
import Page_OctoberPlanKpi from '../pages/Page_OctoberPlanKpi';
import Page_OctoberPlanWork from '../pages/Page_OctoberPlanWork';
import Page_OctoberPlanResearch from '../pages/Page_OctoberPlanResearch';

const PLATFORM_IDS = [1, 2, 5]; // DeepSeek / 豆包 / 通义千问
const ENTRY_PAGE_SIZE = 15;
const ENTRY_PAGE_COUNT = 4;

function makeEntryPages(productKey) {
  const pages = [];
  for (const platformId of PLATFORM_IDS) {
    for (let pageIndex = 0; pageIndex < ENTRY_PAGE_COUNT; pageIndex += 1) {
      pages.push(() =>
        React.createElement(Page_QueryDataSystemLink, {
          productKey,
          platformId,
          pageIndex,
          pageSize: ENTRY_PAGE_SIZE,
        })
      );
    }
  }
  return pages;
}

const KeywordPages_ToC = makeEntryPages('toc');
const KeywordPages_ToB = makeEntryPages('tob');

export const slideConfig = [
  {
    type: 'cover',
    title: '封面',
    backgroundImage: '/proposal-cover/proposal-cover-new.png',
    brand: 'GEO 索引未来',
    subtitle: '桃李面包GEO \n 阶段性报告',
    date: 'September 2026',
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
  { type: 'section', title: '核心数据总览' },
  { type: 'page', title: '核心数据总览', component: Page_CoreDataOverview },
  { type: 'section', title: '竞品分析' },
  { type: 'page', title: '桃李面包 ToC 竞品分析', component: Page_CompetitorAnalysis },
  { type: 'page', title: '桃李面包 ToB 竞品分析', component: Page_CompetitorAnalysis_AI },

  { type: 'chapter', title: '投放内容与引用明细', subtitle: 'CONTENT DETAILS', backgroundImage: '/proposal-chapters/proposal-chapter-cover-03.jpg' },
  { type: 'section', title: '投放渠道与数据明细' },
  { type: 'page', title: '桃李面包 ToC 投放明细', component: Page_ContentDetails },
  { type: 'page', title: '桃李面包 ToB 投放明细', component: Page_ContentDetails_AI },

  { type: 'chapter', title: '桃李面包\n10月工作安排', subtitle: 'OCTOBER WORK PLAN', backgroundImage: '/proposal-chapters/proposal-chapter-cover-03.jpg' },
  { type: 'section', title: '10月工作安排' },
  { type: 'page', title: '冲击合同设定目标 KPI', component: Page_OctoberPlanKpi },
  { type: 'page', title: '详细工作安排', component: Page_OctoberPlanWork },
  { type: 'page', title: '调研与策略', component: Page_OctoberPlanResearch },

  { type: 'chapter', title: '词条数据明细', subtitle: 'KEYWORD DETAILS', backgroundImage: '/proposal-chapters/proposal-chapter-cover-03.jpg' },
  { type: 'section', title: '桃李面包 ToC 平台明细' },
  { type: 'page', title: 'ToC 词条数据明细', components: KeywordPages_ToC },
  { type: 'section', title: '桃李面包 ToB 平台明细' },
  { type: 'page', title: 'ToB 词条数据明细', components: KeywordPages_ToB },
];
