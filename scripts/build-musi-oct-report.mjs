#!/usr/bin/env node
/**
 * 生成 src/data/musiOctReport.json —— 10 月报告的数据源。
 *
 * 数据口径：
 *   · 10 月列按产品取不同单日：P182 智能床 2026-10-25、P181 AI床垫 2026-10-27、
 *     P239 床垫 2026-10-25。报告页面文字一律写成「10月」，不写单日日期。
 *   · 慕思床垫只统计数据系统里「前十五」词条分组。页面不标注这一点。
 *   · 9 月列：沿用上一版单日数值。
 *   · 投放内容仍用 9/21 的 Excel，本文件不写投放，等新文件后再改。
 *
 * 指标来源（勿混用 compare 表字段）：
 *   提及率 → stats.brand_mention_rate；
 *   竞品排名 → influence 中 is_target 的 rank（行业影响力排名，列值 NO.1）；
 *   Top1/Top3 → compare.top1_ranking / top3_ranking 中 is_target。
 * 页面数据不写 position / avg_position。
 */
import { readFileSync, writeFileSync } from 'fs';

const products = [
  { key: 'smart', name: '慕思智能床', brandMatch: '慕思智能床', id: 182, date: '2026-10-25' },
  { key: 'ai', name: '慕思AI床垫', brandMatch: '慕思AI床垫', id: 181, date: '2026-10-27' },
  { key: 'mattress', name: '慕思床垫', brandMatch: '慕思', id: 239, date: '2026-10-25' },
];

const prev = JSON.parse(readFileSync('src/data/musiSepReport.json', 'utf8'));
const sentiments = JSON.parse(readFileSync('src/data/oct_sentiments.json', 'utf8'));

const loadOct = (id, date) => JSON.parse(readFileSync(`src/data/geoReport_${id}_${date}.json`, 'utf8'));

const pct = (v) => (v == null ? '-' : `${Number(v)}%`);

// Top1 提及率相同时，本品排在前面，并按新顺序重排名次。数字本身不改。
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
    label: '2026年10月',
    september: {
      source: '沿用上一版 9 月单日（智能床 09-21 / AI床垫 09-18 / 床垫 09-23）',
    },
    october: {
      dates: Object.fromEntries(products.map((p) => [p.key, p.date])),
      source: 'jiming 账号 P182 2026-10-25 / P181 2026-10-27 / P239 2026-10-25（页面口径写 10 月）',
    },
  },
  products: {},
};

for (const p of products) {
  const oct = loadOct(p.id, p.date);
  if (p.key === 'mattress' && String(oct.meta.entry_ids || '').split(',').filter(Boolean).length !== 15) {
    throw new Error('床垫分组词条不是 15 条');
  }
  const selfInf = oct.influence.list.find((b) => b.is_target);
  const selfTop1 = (oct.compare.top1_ranking || []).find((b) => b.is_target);
  const selfTop3 = (oct.compare.top3_ranking || []).find((b) => b.is_target);
  const daily = (oct.overview_daily || []).find((d) => d.date === p.date);
  if (daily && Number(daily.mention_rate) !== Number(oct.stats.brand_mention_rate)) {
    throw new Error(`${p.name} 提及率与逐日总览不一致`);
  }
  if (daily && Number(daily.influence_rank) !== Number(selfInf?.rank)) {
    throw new Error(`${p.name} 竞品排名与逐日总览不一致`);
  }
  const sent = sentiments[p.key];

  report.products[p.key] = {
    name: p.name,
    brandMatch: p.brandMatch,
    project_id: p.id,
    september: {
      mention_rate: prev.products[p.key].september.mention_rate,
      top1_mention_rate: prev.products[p.key].september.top1_mention_rate,
      top3_mention_rate: prev.products[p.key].september.top3_mention_rate,
      influence_rank: prev.products[p.key].september.influence_rank,
    },
    october: {
      mention_rate: oct.stats.brand_mention_rate,
      top1_mention_rate: selfTop1?.top1_mention_rate ?? null,
      top3_mention_rate: selfTop3?.top3_mention_rate ?? null,
      influence_rank: selfInf?.rank ?? null,
      conversations: oct.influence.total_conversations,
    },
    compare: {
      mention_rate: oct.compare.mention_rate_ranking.slice(0, 5).map((b) => ({
        name: b.display_name || b.brand_name,
        value: pct(b.mention_rate),
        isTarget: !!b.is_target,
        rank: b.rank ?? null,
      })),
      top1: targetFirstOnTie(oct.compare.top1_ranking, 'top1_mention_rate').slice(0, 5).map((b) => ({
        name: b.brand_name,
        value: pct(b.top1_mention_rate),
        isTarget: !!b.is_target,
        rank: b.rank ?? null,
      })),
      influence: oct.influence.list.slice(0, 5).map((b) => ({
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

writeFileSync('src/data/musiOctReport.json', JSON.stringify(report, null, 2), 'utf8');

console.log('已写入 src/data/musiOctReport.json');
for (const p of products) {
  const r = report.products[p.key];
  console.log(
    `\n${p.name}  P${p.id}` +
      `\n  提及率  ${r.september.mention_rate}%  →  ${r.october.mention_rate}%` +
      `\n  Top1    ${r.september.top1_mention_rate}%  →  ${r.october.top1_mention_rate}%` +
      `\n  Top3    ${r.september.top3_mention_rate}%  →  ${r.october.top3_mention_rate}%` +
      `\n  排名    NO.${r.september.influence_rank}  →  NO.${r.october.influence_rank}` +
      `\n  竞品提及率 ${r.compare.mention_rate.map((x) => `${x.name} ${x.value}`).join(' | ')}` +
      `\n  竞品Top1   ${r.compare.top1.map((x) => `${x.name} ${x.value}`).join(' | ')}` +
      `\n  竞品排名   ${r.compare.influence.map((x) => `${x.name} ${x.value}`).join(' | ')}`
  );
}
