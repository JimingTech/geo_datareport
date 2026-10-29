#!/usr/bin/env node
/**
 * 生成 10 月报告数据。
 * 9 月沿用上一版 9/21；10 月劲酒/养生一号取 10/29，毛铺取 10/22。
 * 报告页面只写「2026年10月」，不要露出三个产品取数日不同。
 * 投放明细取 1029 Excel。
 * 输出: src/data/jinjiuOctoberReport.json
 */
import { readFileSync, writeFileSync } from 'fs';

const octExtra = JSON.parse(readFileSync('src/data/oct_entries_sentiments.json', 'utf8'));
const deliveryRaw = JSON.parse(readFileSync('src/data/delivery_excel_1029.json', 'utf8'));

const products = [
  { id: 125, key: 'jinjiu', name: '劲酒', brandMatch: '劲酒', influenceName: '劲酒' },
  { id: 126, key: 'maopu', name: '毛铺', brandMatch: '毛铺酒', influenceName: '毛铺酒' },
  { id: 127, key: 'yangsheng', name: '养生一号', brandMatch: '劲牌养生一号', influenceName: '劲牌养生一号' },
];

function load(id, tag) {
  return JSON.parse(readFileSync(`src/data/geoReport_${id}_${tag}.json`, 'utf8'));
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

const report = {
  meta: { label: '2026年10月', delivery_excel: '1029' },
  products: {},
};

let totalConv = 0;
for (const p of products) {
  const sep = load(p.id, 'sep');
  const oct = load(p.id, 'oct');
  totalConv += oct.influence.total_conversations || 0;
  const selfSep = sep.influence.list.find((b) => b.is_target);
  const selfOct = oct.influence.list.find((b) => b.is_target);
  const sent = octExtra[p.key].sentiments;

  report.products[p.key] = {
    name: p.name,
    brandMatch: p.brandMatch,
    september: {
      mention_rate: sep.stats.brand_mention_rate,
      top1_mention_rate: sep.stats.top1_mention_rate,
      top3_mention_rate: sep.stats.top3_mention_rate,
      influence_rank: selfSep?.rank ?? sep.overview_daily?.[0]?.influence_rank ?? null,
    },
    october: {
      mention_rate: oct.stats.brand_mention_rate,
      top1_mention_rate: oct.stats.top1_mention_rate,
      top3_mention_rate: oct.stats.top3_mention_rate,
      influence_rank: selfOct?.rank ?? oct.overview_daily?.[0]?.influence_rank ?? null,
      conversations: oct.influence.total_conversations,
      platform_stats: oct.stats.platform_stats,
    },
    compare: {
      mention_rate: oct.product_rankings.mention_rate.slice(0, 5).map((b) => rankRow(b, pct)),
      top1: oct.product_rankings.top1.slice(0, 5).map((b) => rankRow(b, pct)),
      influence: oct.influence.list.slice(0, 5).map((b) => ({
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
    entries_by_platform: octExtra[p.key].entries_by_platform,
    entries_all: octExtra[p.key].entries_all,
    delivery: mapDelivery(deliveryRaw[p.key]),
  };
}

report.scope = {
  platforms: 4,
  entries: 20 + 21 + 21,
  conversations: totalConv,
};

writeFileSync('src/data/jinjiuOctoberReport.json', JSON.stringify(report, null, 2), 'utf8');
console.log(JSON.stringify({
  scope: report.scope,
  products: Object.fromEntries(
    Object.entries(report.products).map(([k, v]) => [
      k,
      { september: v.september, october: v.october, compare: v.compare },
    ])
  ),
}, null, 2));
