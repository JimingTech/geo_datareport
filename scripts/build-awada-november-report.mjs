#!/usr/bin/env node
/**
 * 生成包含 优化前、9月、10月、11月 数据的 Awada 阶段性报告 JSON。
 *
 * 优化前: 2026-09-03
 * 9月: 2026-09-28
 * 10月: 2026-10-26
 * 11月: 2026-11-23
 *
 * 口径对照：
 *   提及率 → stats.brand_mention_rate
 *   综合竞品排名 → influence 中 is_target 的 rank
 *   Top1 / Top3 → top-mention-rate 榜里的本品
 * 页面数据不写 position / avg_position。
 */
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(readFileSync(path.join(root, p), 'utf8'));

const BEFORE_DATE = '2026-09-03';
const SEPT_DATE = '2026-09-28';
const OCT_DATE = '2026-10-26';
const NOV_DATE = '2026-11-23';

const before = read(`src/data/geoReport_668_${BEFORE_DATE}.json`);
const sept = read(`src/data/geoReport_668_${SEPT_DATE}.json`);
const oct = read(`src/data/geoReport_668_${OCT_DATE}.json`);
const nov = read(`src/data/geoReport_668_${NOV_DATE}.json`);
const entries = read('src/data/awada_nov_entries.json');
const excel = read('scripts/_excel_dump_awada_1124.json');

const pct = (v) => (v == null ? '-' : `${Number(v)}%`);

const selfOf = (r) => r.influence.list.find((b) => b.is_target) || {};
const top1Of = (r) => (r.compare.top1_ranking || []).find((b) => b.is_target);
const top3Of = (r) => (r.compare.top3_ranking || []).find((b) => b.is_target);
const mentionOf = (r) => (r.compare.mention_rate_ranking || []).find((b) => b.is_target);

function periodSnapshot(r) {
  const selfInf = selfOf(r);
  const selfTop1 = top1Of(r);
  const selfTop3 = top3Of(r);
  const selfMention = mentionOf(r);
  return {
    mention_rate: r.stats.brand_mention_rate,
    top1_mention_rate: r.stats.top1_mention_rate,
    top3_mention_rate: r.stats.top3_mention_rate,
    influence_rank: selfInf.rank,
    mention_rank: selfMention?.rank ?? null,
    top1_rank: selfTop1?.rank ?? null,
    top3_rank: selfTop3?.rank ?? null,
    conversations: r.influence.total_conversations,
    covered_entries: r.entries.list.filter((e) => Number(e.mention_rate) > 0).length,
    platforms: r.stats.platform_stats.map((p) => ({
      name: p.platform_name,
      mention_rate: p.brand_mention_rate,
    })),
  };
}

const nameOf = (b) => b.display_name || b.product_name || b.brand_name || '-';

function boardRows(list) {
  const sorted = [...list].sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999));
  const top = sorted.slice(0, 4);
  const self = sorted.find((b) => b.is_target);
  if (self && !top.some((b) => b.is_target)) top.push(self);
  else if (self && sorted[4] && !top.some((b) => b.rank === sorted[4].rank && nameOf(b) === nameOf(sorted[4]))) {
    top.push(sorted[4]);
  }
  return top;
}

function ranking(list, valueFn) {
  return boardRows(list).map((b) => ({
    name: nameOf(b),
    value: valueFn(b),
    isTarget: !!b.is_target,
    rank: b.rank ?? null,
  }));
}

for (const [id, list] of Object.entries(entries.platform_entries)) {
  if (list.length !== 40) throw new Error(`平台 ${id} 词条不是 40 条`);
  if (list.some((e) => e.position != null || e.avg_position != null)) {
    throw new Error(`平台 ${id} 词条明细写进了位次字段`);
  }
}

// 投放明细 (Excel 概览与渠道)
const overviewSheet = excel['数据概览'];
const detailSheet = excel['文章引用明细'].slice(1).filter((r) => Number.isFinite(Number(r[0])) && r[0] !== '');
const channelSheet = excel['平台与渠道分析'].slice(1);
const cell = (row, col) => overviewSheet[row - 1]?.[col];
const totalConversations = cell(6, 1);
const totalCitationRecords = cell(6, 4);
const deliveryCitations = cell(10, 1);
const deliveryArticles = cell(14, 1);
const citedArticles = cell(14, 4);
const sum = (idx) => detailSheet.reduce((acc, r) => acc + (Number(r[idx]) || 0), 0);

const top10 = detailSheet.slice(0, 10).map((r) => ({
  rank: r[0],
  title: r[1],
  platform: r[2],
  domain: r[3],
  date: r[4] ? String(r[4]).slice(0, 10) : '-',
  total: Number(r[5]) || 0,
  deepseek: Number(r[6]) || 0,
  doubao: Number(r[7]) || 0,
  yuanbao: Number(r[8]) || 0,
  qwen: Number(r[9]) || 0,
  isCited: r[10],
}));

const DOMAIN_NAMES = {
  'mp.weixin.qq.com': '微信公众号',
  'post.smzdm.com': '什么值得买',
  'smzdm.com': '什么值得买',
  'hebei.ifeng.com': '凤凰网',
  'ishare.ifeng.com': '凤凰网',
  'ifeng.com': '凤凰网',
  'nb.ifeng.com': '凤凰网',
  'hainan.ifeng.com': '凤凰网',
  'joyhoues.com.cn': '凤凰网',
  'sohu.com': '搜狐',
  'focus.cn': '搜狐焦点',
  'v.douyin.com': '抖音',
  'douyin.com': '抖音',
  'toutiao.com': '今日头条',
  'zhihu.com': '知乎',
  'k.sina.com.cn': '新浪',
  'jianghu.taobao.com': '淘宝江湖',
  'b23.tv': '哔哩哔哩',
  'bilibili.com': '哔哩哔哩',
};

const byDomain = new Map();
for (const r of detailSheet) {
  const name = DOMAIN_NAMES[r[3]] || r[3];
  const acc = byDomain.get(name) || { channel: name, articles: 0, cited: 0, citations: 0 };
  acc.articles += 1;
  if (r[10] === '是') acc.cited += 1;
  acc.citations += Number(r[5]) || 0;
  byDomain.set(name, acc);
}
const domainStats = [...byDomain.values()].sort((a, b) => b.citations - a.citations || b.articles - a.articles);

const topChannels = channelSheet
  .filter((r) => r[0] && r[0] !== '发布平台')
  .sort((a, b) => (Number(b[4]) || 0) - (Number(a[4]) || 0) || (Number(b[1]) || 0) - (Number(a[1]) || 0))
  .map((r) => ({
    channel: r[0],
    articles: Number(r[1]) || 0,
    cited: Number(r[2]) || 0,
    citedRate: Number(r[3]) || 0,
    citations: Number(r[4]) || 0,
  }));

const delivery = {
  source: 'Awada-优化词(中位数)_投放文章统计_1124.xlsx',
  generated_at: '2026-11-24',
  overview: {
    delivery_articles: deliveryArticles,
    cited_articles: citedArticles,
    cited_rate: Number(((citedArticles / deliveryArticles) * 100).toFixed(1)),
    unique_titles: new Set(detailSheet.map((r) => r[1])).size,
    unique_cited_titles: new Set(detailSheet.filter((r) => r[10] === '是').map((r) => r[1])).size,
    delivery_citations: deliveryCitations,
    total_conversations: totalConversations,
    total_citation_records: totalCitationRecords,
  },
  platform_totals: {
    total: sum(5),
    deepseek: sum(6),
    doubao: sum(7),
    yuanbao: sum(8),
    qwen: sum(9),
  },
  top10,
  top_channels: topChannels,
  domain_stats: domainStats,
};

const report = {
  meta: {
    project_id: 668,
    project_name: 'Awada-优化词',
    product: 'Awada',
    brand: 'Awada',
    label: '2026年11月',
    before_date: BEFORE_DATE,
    september_date: SEPT_DATE,
    october_date: OCT_DATE,
    november_date: NOV_DATE,
    before_label: '优化前',
    september_label: '9月',
    october_label: '10月',
    november_label: '11月',
  },
  scope: {
    platforms: 4,
    platform_names: ['DeepSeek', '豆包', '元宝', '通义千问'],
    entries: nov.entries.total,
    conversations: nov.influence.total_conversations,
  },
  before: periodSnapshot(before),
  september: periodSnapshot(sept),
  october: periodSnapshot(oct),
  november: periodSnapshot(nov),
  compare: {
    mention_rate: ranking(nov.compare.mention_rate_ranking, (b) => pct(b.mention_rate)),
    top1: ranking(nov.compare.top1_ranking || [], (b) => pct(b.top1_mention_rate)),
    influence: ranking(nov.influence.list, (b) => `NO. ${b.rank}`),
  },
  delivery,
  platform_entries: entries.platform_entries,
};

writeFileSync(path.join(root, 'src/data/awadaOctoberReport.json'), JSON.stringify(report, null, 2), 'utf8');
console.log('报告数据已成功写入 src/data/awadaOctoberReport.json');
console.log('数据总览：');
console.log('before:', report.before);
console.log('september:', report.september);
console.log('october:', report.october);
console.log('november:', report.november);
