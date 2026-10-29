#!/usr/bin/env node
/**
 * 生成 src/data/awadaOctoberReport.json。
 *
 * 9 月列沿用上一版 2026-09-21 快照，不再使用「优化前」（2026-09-03）。
 * 10 月列取 2026-10-26 单日。页面写「2026年10月」。
 * 投放明细 = 《Awada-优化词(中位数)_投放文章统计_1029.xlsx》
 *   （scripts/_excel_dump_awada_1029.json）
 *
 * 口径：
 *   提及率 → stats.brand_mention_rate（与 overview_daily 核对）
 *   综合竞品排名 → influence 中 is_target 的 rank（与 overview_daily.influence_rank 核对）
 *   Top1 / Top3 → top-mention-rate 榜里的本品
 * 页面数据不写 position / avg_position。
 */
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(readFileSync(path.join(root, p), 'utf8'));

const OCT_DATE = '2026-10-26';
const DELIVERY_FILE = 'Awada-优化词(中位数)_投放文章统计_1029.xlsx';
const DELIVERY_DATE = '2026-10-29';
const prev = read('src/data/awadaSeptemberReport.json');
const oct = read(`src/data/geoReport_668_${OCT_DATE}.json`);
const entries = read('src/data/awada_oct_entries.json');
const excel = read('scripts/_excel_dump_awada_1029.json');

if (prev.meta.september_date !== '2026-09-21') {
  throw new Error(`9月列来源不是 2026-09-21：${prev.meta.september_date}`);
}
if (prev.september.mention_rate !== 6.9 || prev.september.influence_rank !== 16) {
  throw new Error('9月列与上一版快照不一致');
}
if (entries.date !== OCT_DATE || entries.project_id !== 668) {
  throw new Error('词条明细不是项目 668 的 2026-10-26');
}

const pct = (v) => (v == null ? '-' : `${Number(v)}%`);
const selfInf = oct.influence.list.find((b) => b.is_target);
const selfTop1 = (oct.compare.top1_ranking || []).find((b) => b.is_target);
const selfTop3 = (oct.compare.top3_ranking || []).find((b) => b.is_target);
const selfMention = (oct.compare.mention_rate_ranking || []).find((b) => b.is_target);
const daily = (oct.overview_daily || []).find((d) => d.date === OCT_DATE);

if (!daily) throw new Error('缺少 2026-10-26 的逐日总览');
if (Number(daily.mention_rate) !== Number(oct.stats.brand_mention_rate)) {
  throw new Error('提及率与逐日总览不一致');
}
if (Number(daily.influence_rank) !== Number(selfInf?.rank)) {
  throw new Error('综合竞品排名与逐日总览不一致');
}
if (Number(selfTop1?.top1_mention_rate) !== Number(oct.stats.top1_mention_rate)) {
  throw new Error('Top1 提及率与榜单不一致');
}
if (Number(selfTop3?.top3_mention_rate) !== Number(oct.stats.top3_mention_rate)) {
  throw new Error('Top3 提及率与榜单不一致');
}
if (Number(selfMention?.mention_rate) !== Number(oct.stats.brand_mention_rate)) {
  throw new Error('提及率排名里的本品提及率与总览不一致');
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

const covered = oct.entries.list.filter((e) => Number(e.mention_rate) > 0);

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
if (detailSheet.length !== deliveryArticles) {
  throw new Error(`投放明细行数 ${detailSheet.length} 与概览投放文章总数 ${deliveryArticles} 不一致`);
}
if (sum(5) !== deliveryCitations) {
  throw new Error(`明细引用合计 ${sum(5)} 与概览投放文章引用次数 ${deliveryCitations} 不一致`);
}
const citedCount = detailSheet.filter((r) => r[10] === '是').length;
if (citedCount !== citedArticles) {
  throw new Error(`明细被引篇数 ${citedCount} 与概览被引用文章数 ${citedArticles} 不一致`);
}

const top10 = detailSheet.slice(0, 10).map((r) => ({
  rank: r[0],
  title: r[1],
  platform: r[2],
  domain: r[3],
  date: r[4],
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
  source: DELIVERY_FILE,
  generated_at: DELIVERY_DATE,
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
    label: '2026年10月',
    september_date: prev.meta.september_date,
    october_date: OCT_DATE,
    september_label: '9月',
    october_label: '10月',
  },
  scope: {
    platforms: 4,
    platform_names: ['DeepSeek', '豆包', '元宝', '通义千问'],
    entries: oct.entries.total,
    conversations: oct.influence.total_conversations,
  },
  september: {
    mention_rate: prev.september.mention_rate,
    top1_mention_rate: prev.september.top1_mention_rate,
    top3_mention_rate: prev.september.top3_mention_rate,
    influence_rank: prev.september.influence_rank,
    conversations: prev.september.conversations,
    covered_entries: prev.september.covered_entries,
    platforms: prev.september.platforms,
  },
  october: {
    mention_rate: oct.stats.brand_mention_rate,
    top1_mention_rate: oct.stats.top1_mention_rate,
    top3_mention_rate: oct.stats.top3_mention_rate,
    influence_rank: selfInf.rank,
    mention_rank: selfMention.rank,
    top1_rank: selfTop1.rank,
    conversations: oct.influence.total_conversations,
    covered_entries: covered.length,
    platforms: oct.stats.platform_stats.map((p) => ({
      name: p.platform_name,
      mention_rate: p.brand_mention_rate,
    })),
  },
  compare: {
    mention_rate: ranking(oct.compare.mention_rate_ranking, (b) => pct(b.mention_rate)),
    top1: ranking(oct.compare.top1_ranking || [], (b) => pct(b.top1_mention_rate)),
    influence: ranking(oct.influence.list, (b) => `NO. ${b.rank}`),
  },
  delivery,
  platform_entries: entries.platform_entries,
};

writeFileSync(path.join(root, 'src/data/awadaOctoberReport.json'), JSON.stringify(report, null, 2), 'utf8');
console.log(JSON.stringify({
  september: report.september,
  october: report.october,
  compare: report.compare,
  delivery_overview: report.delivery.overview,
  platform_totals: report.delivery.platform_totals,
  domain_stats: report.delivery.domain_stats,
}, null, 2));
