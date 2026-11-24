#!/usr/bin/env node
/**
 * 生成 11 月报告数据。
 * 10 月沿用已发布的 jinjiuOctoberReport（劲酒/养生一号 10/29，毛铺 10/22）。
 * 11 月三款产品统一取 11/25。
 * 报告页面只写「2026年11月」，不写具体取数日。
 * 投放 / 引用文章取 1124 Excel。
 * 页面数据不写位次。
 * 输出: src/data/jinjiuNovemberReport.json
 */
import { readFileSync, writeFileSync } from 'fs';

const novExtra = JSON.parse(readFileSync('src/data/nov_entries_sentiments.json', 'utf8'));
const octoberReport = JSON.parse(readFileSync('src/data/jinjiuOctoberReport.json', 'utf8'));
const deliveryRaw = JSON.parse(readFileSync('src/data/delivery_excel_1124.json', 'utf8'));

const products = [
  { id: 125, key: 'jinjiu', name: '劲酒', brandMatch: '劲酒', influenceName: '劲酒' },
  { id: 126, key: 'maopu', name: '毛铺', brandMatch: '毛铺酒', influenceName: '毛铺酒' },
  { id: 127, key: 'yangsheng', name: '养生一号', brandMatch: '劲牌养生一号', influenceName: '劲牌养生一号' },
];

function loadNov(id) {
  return JSON.parse(readFileSync(`src/data/geoReport_${id}_nov.json`, 'utf8'));
}

const pct = (v) => (v == null ? '-' : `${Number(v)}%`);
const kw = (list) => (list || []).map((k) => (typeof k === 'string' ? k : k.tag_name_zh || k.tag_name)).filter(Boolean);

function displayName(b) {
  const strip = (s) => String(s || '').replace(/\s+/g, '');
  if (!b.brand_name || strip(b.name).includes(strip(b.brand_name))) return b.name;
  return `${b.brand_name} ${b.name}`;
}

const rankRow = (b, fmt) => ({ name: displayName(b), value: fmt(b.value), isTarget: b.is_target });

function mapDelivery(d) {
  return {
    overview: {
      delivery_citations: d.total_citations,
      citation_rate: d.citation_rate,
      delivery_articles: d.total_articles,
      cited_articles: d.cited_articles,
    },
    platform_totals: {
      total: d.total_citations,
      deepseek: d.ai_citations.deepseek,
      doubao: d.ai_citations.doubao,
      yuanbao: d.ai_citations.yuanbao,
      wenxin: d.ai_citations.wenxin,
      kimi: d.ai_citations.kimi,
    },
    top_channels: d.top_channels,
    insights: d.insights,
    top10: d.top10.slice(0, 10),
  };
}

function platformStats(list) {
  return (list || []).map((p) => ({
    platform_id: p.platform_id,
    platform_name: p.platform_name,
    platform_logo: p.platform_logo,
    brand_mention_rate: p.brand_mention_rate,
  }));
}

const report = {
  meta: { label: '2026年11月', source_date: '2026-11-25', delivery_excel: '1124' },
  products: {},
};

let totalConv = 0;
for (const p of products) {
  const nov = loadNov(p.id);
  const prev = octoberReport.products[p.key].october;
  totalConv += nov.influence.total_conversations || 0;
  const selfNov = nov.influence.list.find((b) => b.is_target);
  const sent = novExtra[p.key].sentiments;

  report.products[p.key] = {
    name: p.name,
    brandMatch: p.brandMatch,
    october: {
      mention_rate: prev.mention_rate,
      top1_mention_rate: prev.top1_mention_rate,
      top3_mention_rate: prev.top3_mention_rate,
      influence_rank: prev.influence_rank,
    },
    november: {
      mention_rate: nov.stats.brand_mention_rate,
      top1_mention_rate: nov.stats.top1_mention_rate,
      top3_mention_rate: nov.stats.top3_mention_rate,
      influence_rank: selfNov?.rank ?? nov.overview_daily?.[0]?.influence_rank ?? null,
      conversations: nov.influence.total_conversations,
      platform_stats: platformStats(nov.stats.platform_stats),
    },
    compare: {
      mention_rate: nov.product_rankings.mention_rate.slice(0, 5).map((b) => rankRow(b, pct)),
      top1: nov.product_rankings.top1.slice(0, 5).map((b) => rankRow(b, pct)),
      influence: nov.influence.list.slice(0, 5).map((b) => ({
        name: b.is_target
          ? p.influenceName
          : (b.display_name || b.product_name || b.brand_name || b.name),
        value: `NO. ${b.rank}`,
        isTarget: !!b.is_target,
      })),
    },
    sentiments: {
      positive: sent.positive_percentage,
      negative: sent.negative_percentage,
      positive_keywords: kw(sent.positive_keywords),
      negative_keywords: kw(sent.negative_keywords),
    },
    entries_by_platform: novExtra[p.key].entries_by_platform,
    entries_all: novExtra[p.key].entries_all,
    delivery: mapDelivery(deliveryRaw[p.key]),
  };
}

report.scope = {
  platforms: 4,
  entries: 20 + 21 + 21,
  conversations: totalConv,
};

writeFileSync('src/data/jinjiuNovemberReport.json', JSON.stringify(report, null, 2), 'utf8');
console.log(JSON.stringify({
  scope: report.scope,
  products: Object.fromEntries(
    Object.entries(report.products).map(([k, v]) => [
      k,
      {
        october: v.october,
        november: v.november,
        compare: v.compare,
      },
    ])
  ),
}, null, 2));
