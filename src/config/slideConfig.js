import React from 'react';
import Page_CoreDataOverview from '../pages/Page_CoreDataOverview';
import Page_CompetitorAnalysis from '../pages/Page_CompetitorAnalysis';
import Page_CompetitorAnalysis_AI from '../pages/Page_CompetitorAnalysis_AI';
import Page_CompetitorAnalysis_Premium from '../pages/Page_CompetitorAnalysis_Premium';
import Page_ContentDetails from '../pages/Page_ContentDetails';
import Page_ContentDetails_AI from '../pages/Page_ContentDetails_AI';
import Page_ContentDetails_Premium from '../pages/Page_ContentDetails_Premium';
import Page_QueryDataSystemLink from '../pages/Page_QueryDataSystemLink';

// 词条明细：与 Report_gujinggong 同款数据系统 UI
// 每个 AI 平台固定 2 页；劲酒 20 词每页 10；毛铺/养生一号 21 词每页 11
const PLATFORM_IDS = [1, 2, 4, 6]; // DeepSeek / 豆包 / 文心 / Kimi

function makeEntryPages(projectId, pageSize) {
  const pages = [];
  for (const platformId of PLATFORM_IDS) {
    for (let pageIndex = 0; pageIndex < 2; pageIndex += 1) {
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

const KeywordPages_Jinjiu = makeEntryPages(125, 10);
const KeywordPages_Maopu = makeEntryPages(126, 11);
const KeywordPages_Yangsheng = makeEntryPages(127, 11);

export const slideConfig = [
  {
    type: 'cover',
    title: '封面',
    backgroundImage: '/proposal-cover/proposal-cover-new.png',
    brand: 'GEO 索引未来',
    subtitle: '劲牌GEO \n 阶段性报告',
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
  { type: 'page', title: '劲酒 竞品分析', component: Page_CompetitorAnalysis },
  { type: 'page', title: '毛铺 竞品分析', component: Page_CompetitorAnalysis_AI },
  { type: 'page', title: '养生一号 竞品分析', component: Page_CompetitorAnalysis_Premium },

  { type: 'chapter', title: '投放内容与引用明细', subtitle: 'CONTENT DETAILS', backgroundImage: '' },
  { type: 'section', title: '投放渠道与数据明细' },
  { type: 'page', title: '劲酒 投放明细', component: Page_ContentDetails },
  { type: 'page', title: '毛铺 投放明细', component: Page_ContentDetails_AI },
  { type: 'page', title: '养生一号 投放明细', component: Page_ContentDetails_Premium },

  { type: 'chapter', title: '词条数据明细', subtitle: 'KEYWORD DETAILS', backgroundImage: '' },
  { type: 'section', title: '词条监测明细' },
  { type: 'page', title: '劲酒 词条数据明细', components: KeywordPages_Jinjiu },
  { type: 'page', title: '毛铺 词条数据明细', components: KeywordPages_Maopu },
  { type: 'page', title: '养生一号 词条数据明细', components: KeywordPages_Yangsheng },
];
