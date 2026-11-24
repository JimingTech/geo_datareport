#!/usr/bin/env node
/**
 * 生成 src/data/musiNovReport.json —— 11 月报告的数据源。
 *
 * 数据口径：
 *   · 11 月列一律取 2026-11-25。页面文字写成「11月」，不写单日。
 *   · 慕思智能床只统计「11.25前20」，慕思床垫只统计「11.25前10」。
 *     页面不标注这一点。慕思AI床垫用当天全部词条。
 *   · 10 月列：沿用上一版月报已发布的 10 月数值。
 *   · 投放与引用文章仍用 10 月 Excel，本文件不写投放。
 *
 * 指标来源（勿混用 compare 表字段）：
 *   提及率 → stats.brand_mention_rate；
 *   竞品排名 → influence 中 is_target 的 rank（行业影响力排名，列值 NO.1）；
 *   Top1/Top3 → compare.top1_ranking / top3_ranking 中 is_target。
 * 页面数据不写 position / avg_position。
 */
import { readFileSync, writeFileSync } from 'fs';

const products = [
  { key: 'smart', name: '慕思智能床', brandMatch: '慕思智能床', id: 182, date: '2026-11-25', entryCount: 20 },
  { key: 'ai', name: '慕思AI床垫', brandMatch: '慕思AI床垫', id: 181, date: '2026-11-25', entryCount: null },
  { key: 'mattress', name: '慕思床垫', brandMatch: '慕思', id: 239, date: '2026-11-25', entryCount: 10 },
];

const prev = JSON.parse(readFileSync('src/data/musiOctReport.json', 'utf8'));
const sentiments = JSON.parse(readFileSync('src/data/nov_sentiments.json', 'utf8'));

const loadNov = (id) => JSON.parse(readFileSync(`src/data/geoReport_${id}_2026-11-25.json`, 'utf8'));

const pct = (v) => (v == null ? '-' : `${Number(v)}%`);

const targetFirstOnTie = (list, rateKey) =>
  [...list]
    .sort((a, b) => {
      const diff = Number(b[rateKey]) - Number(a[rateKey]);
      if (diff !== 0) return diff;
      return Number(!!b.is_target) - Number(!!a.is_target);
    })
    .map((b, i) => ({ ...b, rank: i + 1 }));

const report = {
  meta: {
    label: '2026年11月',
    october: {
      source: '沿用上一版 10 月月报已发布数值',
    },
    november: {
      dates: Object.fromEntries(products.map((p) => [p.key, p.date])),
      source: 'jiming 账号 P182 / P181 / P239，2026-11-25（页面口径写 11 月）',
    },
  },
  products: {},
};

for (const p of products) {
  const nov = loadNov(p.id);
  const ids = String(nov.meta.entry_ids || '').split(',').filter(Boolean);
  if (p.entryCount == null && ids.length) throw new Error(`${p.name} 不应带词条过滤`);
  if (p.entryCount != null && ids.length !== p.entryCount) {
    throw new Error(`${p.name} 词条数是 ${ids.length}，期望 ${p.entryCount}`);
  }
  const selfInf = nov.influence.list.find((b) => b.is_target);
  const selfTop1 = (nov.compare.top1_ranking || []).find((b) => b.is_target);
  const selfTop3 = (nov.compare.top3_ranking || []).find((b) => b.is_target);
  const daily = (nov.overview_daily || []).find((d) => d.date === p.date);
  if (!daily) throw new Error(`${p.name} 缺少逐日总览`);
  if (Number(daily.mention_rate) !== Number(nov.stats.brand_mention_rate)) {
    throw new Error(`${p.name} 提及率与逐日总览不一致`);
  }
  if (Number(daily.influence_rank) !== Number(selfInf?.rank)) {
    throw new Error(`${p.name} 竞品排名与逐日总览不一致`);
  }
  const sent = sentiments[p.key];
  const october = prev.products[p.key].october;

  report.products[p.key] = {
    name: p.name,
    brandMatch: p.brandMatch,
    project_id: p.id,
    october: {
      mention_rate: october.mention_rate,
      top1_mention_rate: october.top1_mention_rate,
      top3_mention_rate: october.top3_mention_rate,
      influence_rank: october.influence_rank,
    },
    november: {
      mention_rate: nov.stats.brand_mention_rate,
      top1_mention_rate: selfTop1?.top1_mention_rate ?? null,
      top3_mention_rate: selfTop3?.top3_mention_rate ?? null,
      influence_rank: selfInf?.rank ?? null,
      conversations: nov.influence.total_conversations,
    },
    compare: {
      mention_rate: nov.compare.mention_rate_ranking.slice(0, 5).map((b) => ({
        name: b.display_name || b.brand_name,
        value: pct(b.mention_rate),
        isTarget: !!b.is_target,
        rank: b.rank ?? null,
      })),
      top1: targetFirstOnTie(nov.compare.top1_ranking, 'top1_mention_rate').slice(0, 5).map((b) => ({
        name: b.brand_name,
        value: pct(b.top1_mention_rate),
        isTarget: !!b.is_target,
        rank: b.rank ?? null,
      })),
      influence: nov.influence.list.slice(0, 5).map((b) => ({
        name: b.display_name || b.brand_name,
        value: b.rank == null ? '-' : `NO.${b.rank}`,
        isTarget: !!b.is_target,
        rank: b.rank ?? null,
      })),
    },
    sentiments: {
      positive: sent.positive_percentage,
      negative: sent.negative_percentage,
      positive_keywords: sent.positive_keywords,
      negative_keywords: sent.negative_keywords,
    },
  };
}

report.scope = { platforms: 6, entries: 80, conversations: 480 };

writeFileSync('src/data/musiNovReport.json', JSON.stringify(report, null, 2), 'utf8');
console.log('已写入 src/data/musiNovReport.json');
for (const p of products) {
  const r = report.products[p.key];
  console.log(
    `\n${p.name}  P${p.id}` +
      `\n  提及率  ${r.october.mention_rate}%  →  ${r.november.mention_rate}%` +
      `\n  Top1    ${r.october.top1_mention_rate}%  →  ${r.november.top1_mention_rate}%` +
      `\n  Top3    ${r.october.top3_mention_rate}%  →  ${r.november.top3_mention_rate}%` +
      `\n  排名    NO.${r.october.influence_rank}  →  NO.${r.november.influence_rank}` +
      `\n  竞品提及率 ${r.compare.mention_rate.map((x) => `${x.name} ${x.value}`).join(' | ')}` +
      `\n  竞品Top1   ${r.compare.top1.map((x) => `${x.name} ${x.value}`).join(' | ')}` +
      `\n  竞品排名   ${r.compare.influence.map((x) => `${x.name} ${x.value}`).join(' | ')}`
  );
}
