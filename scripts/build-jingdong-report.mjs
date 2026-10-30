#!/usr/bin/env node
/**
 * 组装 京东雾化器 (项目 5203) 报告数据 -> src/data/jingdongReport.json
 *
 * 数据来源：
 *   · 项目开始 / 优化前 = 2026-09-23（本品提及率 28.2%，Top1 21.1%，Top3 25%，竞品排名 NO.6）
 *   · 同日美团提及率 30.3%，不是本品口径
 *   · 优化后最新 = 2026-10-31（提及率 66.9%，Top1 15.5%，Top3 49.3%，竞品排名 NO.3）
 *   · 达标要求：任意 20 天单日提及率达到 60% 以上（10/12~10/31 共 20 天全部 ≥60%）
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(readFileSync(path.join(root, p), 'utf8'));

const PROJECT_ID = 5203;
const START_DATE = '2026-09-23';
const BEFORE_DATE = '2026-09-23';
const OCT_DATE = '2026-10-31';
const PASS_LINE = 60;
const TARGET_DAYS = 20;

const full = read(`src/data/geoReport_${PROJECT_ID}.json`);
const before = read(`src/data/geoReport_${PROJECT_ID}_${BEFORE_DATE}.json`);
const october = read(`src/data/geoReport_${PROJECT_ID}_${OCT_DATE}.json`);
const qualifiedRange = read(`src/data/geoReport_${PROJECT_ID}_2026-10-12_10-31.json`);
const extra = read('src/data/jingdong_extra.json');

const pct = (v) => (v == null ? '-' : `${Number(v)}%`);
const self = (r) => r.influence.list.find((b) => b.is_target) || {};

function snapshot(r) {
  const s = self(r);
  return {
    mention_rate: r.stats.brand_mention_rate,
    top1_mention_rate: r.stats.top1_mention_rate,
    top3_mention_rate: r.stats.top3_mention_rate,
    influence_score: s.influence_score ?? null,
    influence_rank: s.rank ?? null,
    conversations: r.influence.total_conversations,
    covered_entries: r.entries.list.filter((e) => Number(e.mention_rate) > 0).length,
    platforms: r.stats.platform_stats.map((p) => ({
      name: p.platform_name,
      mention_rate: p.brand_mention_rate,
    })),
  };
}

function productFullName(b) {
  const product = b.display_name || b.product_name || '';
  const brand = b.brand_name || '';
  if (product && brand && product !== brand && !product.includes(brand) && !brand.includes(product)) {
    return `${brand}${product}`;
  }
  return product || brand || '-';
}

function ranking(list, valueFn) {
  return list.map((b, i) => ({
    name: productFullName(b),
    value: valueFn(b),
    isTarget: !!b.is_target,
    rank: b.rank ?? (b.is_target ? null : i + 1),
  }));
}

function topFourPlusSelf(list) {
  const me = list.find((b) => b.is_target);
  const top5 = list.slice(0, 5);
  if (me && top5.some((b) => b.is_target)) {
    return top5;
  }
  const leaders = list.filter((b) => !b.is_target).slice(0, 4);
  return me ? [...leaders, me] : leaders;
}

function listedStats(details) {
  const stats = {};
  for (const e of details || []) {
    const seen = new Set();
    for (const r of e.ranks || []) {
      const name = r.display_name || r.brand_name;
      if (!name || seen.has(name)) continue;
      seen.add(name);
      const s = stats[name] || { listed: 0, top1: 0 };
      s.listed += 1;
      if (r.rank === 1) s.top1 += 1;
      stats[name] = s;
    }
  }
  return stats;
}

const octListed = listedStats(extra.october.entry_brand_details);
const mentionLeaders = topFourPlusSelf(october.compare.mention_rate_ranking);
const rivalNames = mentionLeaders.map((b) => productFullName(b));

// 每日提及率与达标统计（从项目启动 9/23 至今的监测日）
const allDaily = full.stats.daily_stats.map((d) => ({
  date: d.date,
  mention_rate: Number(d.mention_rate),
  passed: Number(d.mention_rate) >= PASS_LINE,
}));
const postStartDaily = allDaily.filter((d) => d.date >= START_DATE);
const qualifiedDays = postStartDaily.filter((d) => d.passed);
const ratesGe60 = qualifiedDays.map((d) => d.mention_rate);
const minGe60 = ratesGe60.length ? Math.min(...ratesGe60) : 0;
const maxGe60 = ratesGe60.length ? Math.max(...ratesGe60) : 0;
const avgGe60 = ratesGe60.length
  ? Number((ratesGe60.reduce((a, b) => a + b, 0) / ratesGe60.length).toFixed(1))
  : 0;

// 投放明细：若已有新 Excel dump 则读取，否则先基于数据系统引用文章与占位生成（等待用户提供投放文章统计文件）
let delivery = null;
const DELIVERY_XLSX = 'd:\\下载\\雾化器（中位数）_投放文章统计_1029.xlsx';
const jdExcelPath = path.join(root, 'scripts/_excel_dump_wuhuaqi.json');

if (existsSync(DELIVERY_XLSX)) {
  try {
    execSync(`python "${path.join(root, 'scripts/dump-excel.py')}" "${DELIVERY_XLSX}" "${jdExcelPath}"`, { stdio: 'inherit' });
  } catch (err) {
    console.warn('dump-excel.py 执行异常，将尝试直接读取现有 dump json:', err.message);
  }
}

if (existsSync(jdExcelPath)) {
  const excel = read('scripts/_excel_dump_wuhuaqi.json');
  const overviewSheet = excel['数据概览'];
  const header = excel['文章引用明细'][0] || [];
  const col = {
    rank: header.indexOf('排名'),
    title: header.indexOf('文章标题'),
    platform: header.indexOf('发布平台'),
    domain: header.indexOf('链接域名'),
    date: header.indexOf('发布时间'),
    total: header.indexOf('总引用次数'),
    deepseek: header.findIndex((h) => h && h.toLowerCase().includes('deepseek')),
    doubao: header.findIndex((h) => h && h.includes('豆包')),
    yuanbao: header.findIndex((h) => h && h.includes('元宝')),
    qwen: header.findIndex((h) => h && (h.includes('通义') || h.includes('千问'))),
    isCited: header.indexOf('是否被引用'),
    url: header.indexOf('文章链接'),
  };

  const detailSheet = excel['文章引用明细']
    .slice(1)
    .filter((r) => Number.isFinite(Number(r[0])) && r[0] !== '' && r[0] != null);
  const channelSheet = excel['平台与渠道分析'].slice(1);
  const cell = (row, colIdx) => overviewSheet[row - 1]?.[colIdx];
  const totalConversations = cell(6, 1);
  const totalCitationRecords = cell(6, 4);
  const deliveryCitations = cell(10, 1);
  const deliveryArticles = cell(14, 1);
  const citedArticles = cell(14, 4);

  const sumCol = (idx) => (idx !== -1 ? detailSheet.reduce((acc, r) => acc + (Number(r[idx]) || 0), 0) : 0);

  const isCitedRow = (r) => (col.isCited !== -1 ? r[col.isCited] === '是' : (Number(r[col.total]) || 0) > 0);

  const top10 = detailSheet.slice(0, 10).map((r) => ({
    rank: r[col.rank !== -1 ? col.rank : 0],
    title: r[col.title !== -1 ? col.title : 1],
    platform: r[col.platform !== -1 ? col.platform : 2],
    domain: r[col.domain !== -1 ? col.domain : 3],
    date: r[col.date !== -1 ? col.date : 4],
    total: Number(r[col.total !== -1 ? col.total : 5]) || 0,
    deepseek: col.deepseek !== -1 ? Number(r[col.deepseek]) || 0 : 0,
    doubao: col.doubao !== -1 ? Number(r[col.doubao]) || 0 : 0,
    yuanbao: col.yuanbao !== -1 ? Number(r[col.yuanbao]) || 0 : 0,
    qwen: col.qwen !== -1 ? Number(r[col.qwen]) || 0 : 0,
    isCited: col.isCited !== -1 ? r[col.isCited] : ((Number(r[col.total]) || 0) > 0 ? '是' : '否'),
  }));

  const DOMAIN_NAMES = {
    'mp.weixin.qq.com': '微信公众号',
    'post.smzdm.com': '什么值得买',
    'smzdm.com': '什么值得买',
    'zhihu.com': '知乎',
    'zhuanlan.zhihu.com': '知乎',
    'baijiahao.baidu.com': '百家号',
    'sohu.com': '搜狐',
    'v.douyin.com': '抖音',
    'douyin.com': '抖音',
    'iesdouyin.com': '抖音',
    'toutiao.com': '今日头条',
    'sina.com.cn': '新浪',
    'k.sina.com.cn': '新浪',
    'medicinesx.com': '中国医药卫生网',
    'news.pharmnet.com.cn': '中国医药网',
    'news.fh21.com.cn': '复禾医药网',
    '1545ts.com': '泰山网',
    'news.xnnews.com.cn': '咸宁新闻网',
    'medicinal.cn': '医药网',
    'wanliancm.com': '万联网',
    'weibo.com': '微博',
    'yxj.net.cn': '医学界',
    'zl.39.net': '39健康网',
    'news.xywy.com': '寻医问药网',
    'caifuhao.eastmoney.com': '东方财富',
    'health-times.cn': '健康时报',
  };

  const byDomain = new Map();
  for (const r of detailSheet) {
    const domain = r[col.domain !== -1 ? col.domain : 3];
    const platform = r[col.platform !== -1 ? col.platform : 2];
    const name = DOMAIN_NAMES[domain] || platform || domain;
    const acc = byDomain.get(name) || { channel: name, articles: 0, cited: 0, citations: 0 };
    acc.articles += 1;
    if (isCitedRow(r)) acc.cited += 1;
    acc.citations += Number(r[col.total !== -1 ? col.total : 5]) || 0;
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

  delivery = {
    source: '雾化器（中位数）_投放文章统计_1029.xlsx',
    generated_at: excel['数据概览']?.[2]?.[1]?.match(/生成时间：(\d{4})\/(\d{1,2})\/(\d{1,2})/)
      ? `${RegExp.$1}-${String(RegExp.$2).padStart(2, '0')}-${String(RegExp.$3).padStart(2, '0')}`
      : '2026-10-29',
    overview: {
      delivery_articles: deliveryArticles,
      cited_articles: citedArticles,
      cited_rate: Number(((citedArticles / deliveryArticles) * 100).toFixed(1)),
      unique_titles: new Set(detailSheet.map((r) => r[col.title !== -1 ? col.title : 1])).size,
      unique_cited_titles: new Set(detailSheet.filter(isCitedRow).map((r) => r[col.title !== -1 ? col.title : 1])).size,
      delivery_citations: deliveryCitations,
      total_conversations: totalConversations,
      total_citation_records: totalCitationRecords,
    },
    platform_totals: {
      total: sumCol(col.total !== -1 ? col.total : 5),
      deepseek: sumCol(col.deepseek),
      doubao: sumCol(col.doubao),
      yuanbao: sumCol(col.yuanbao),
      qwen: sumCol(col.qwen),
    },
    top10,
    top_channels: topChannels,
    domain_stats: domainStats,
  };
} else {
  delivery = {
    pending: true,
    source: '待导入投放文章统计',
    generated_at: OCT_DATE,
  };
}

const report = {
  meta: {
    project_id: PROJECT_ID,
    project_name: '京东雾化器',
    product: '京东雾化器',
    target_product: full.meta.target_product,
    brand: '京东大健康',
    label: '2026年10月',
    project_start_date: START_DATE,
    before_date: BEFORE_DATE,
    october_date: OCT_DATE,
    september_date: OCT_DATE, // 兼容旧字段名
    before_label: `优化前（${before.stats.brand_mention_rate}%）`,
    october_label: '优化后（10/31）',
    september_label: '优化后（10/31）', // 兼容旧字段名
  },
  kpi: {
    pass_line: PASS_LINE,
    target_days: TARGET_DAYS,
    project_start_date: START_DATE,
    before_date: BEFORE_DATE,
    before_mention_rate: before.stats.brand_mention_rate,
    latest_date: OCT_DATE,
    latest_mention_rate: october.stats.brand_mention_rate,
    qualified_days_count: qualifiedDays.length,
    qualified_start_date: qualifiedDays[0]?.date || '2026-10-11',
    qualified_end_date: qualifiedDays[qualifiedDays.length - 1]?.date || OCT_DATE,
    min_qualified_rate: minGe60,
    max_qualified_rate: maxGe60,
    max_qualified_date: qualifiedDays.find((d) => d.mention_rate === maxGe60)?.date || '2026-10-26',
    avg_qualified_rate: avgGe60,
    range_qualified_stats: snapshot(qualifiedRange),
    daily_trend: postStartDaily,
    all_daily: allDaily,
  },
  scope: {
    platforms: snapshot(october).platforms.length,
    platform_names: snapshot(october).platforms.map((p) => p.name),
    entries: october.entries.total,
    conversations: full.influence.total_conversations,
    daily_conversations: october.influence.total_conversations,
  },
  before: snapshot(before),
  october: snapshot(october),
  september: snapshot(october), // 兼容旧字段名
  compare: {
    mention_rate: ranking(mentionLeaders, (b) => pct(b.mention_rate)),
    top1: ranking(topFourPlusSelf(october.compare.top1_ranking || []), (b) => pct(b.top1_mention_rate)),
    influence: ranking(topFourPlusSelf(october.influence.list), (b) => `NO. ${b.rank}`),
  },
  rivals: rivalNames.map((name) => ({
    name,
    listed: octListed[name]?.listed ?? 0,
    top1: octListed[name]?.top1 ?? 0,
    isTarget: mentionLeaders.some((b) => b.is_target && productFullName(b) === name),
  })),
  sentiments: {
    positive: extra.october.sentiments?.positive_percentage ?? null,
    negative: extra.october.sentiments?.negative_percentage ?? null,
    positive_keywords: (extra.october.sentiments?.positive_keywords || []).map((k) => k.tag_name_zh || k.tag_name),
    before_positive_keywords: (extra.before.sentiments?.positive_keywords || []).map((k) => k.tag_name_zh || k.tag_name),
  },
  entries: (() => {
    const beforeMap = Object.fromEntries(before.entries.list.map((e) => [e.entry_name, e]));
    return october.entries.list.map((e) => ({
      name: e.entry_name,
      mention_rate: e.mention_rate,
      top1_mention_rate: e.top1_mention_rate,
      before_mention_rate: beforeMap[e.entry_name]?.mention_rate ?? null,
    }));
  })(),
  citations: {
    before: {
      citation_rate: before.citations.citation_rate,
      total_citations: before.citations.total_citations,
      platform_stats: before.citations.platform_stats,
    },
    october: {
      citation_rate: october.citations.citation_rate,
      total_citations: october.citations.total_citations,
      platform_stats: october.citations.platform_stats,
    },
  },
  delivery,
  platform_entries: extra.platform_entries,
  platforms: extra.platforms,
};

writeFileSync(path.join(root, 'src/data/jingdongReport.json'), JSON.stringify(report, null, 2), 'utf8');
writeFileSync(path.join(root, 'src/data/platform_entries.json'), JSON.stringify(extra.platform_entries, null, 2), 'utf8');
console.log('已生成 src/data/jingdongReport.json 与 src/data/platform_entries.json');
console.log(JSON.stringify({
  meta: report.meta,
  kpi: {
    pass_line: report.kpi.pass_line,
    target_days: report.kpi.target_days,
    before_mention_rate: report.kpi.before_mention_rate,
    latest_mention_rate: report.kpi.latest_mention_rate,
    qualified_days_count: report.kpi.qualified_days_count,
    qualified_range: `${report.kpi.qualified_start_date} ~ ${report.kpi.qualified_end_date}`,
    min_qualified_rate: report.kpi.min_qualified_rate,
    max_qualified_rate: report.kpi.max_qualified_rate,
    avg_qualified_rate: report.kpi.avg_qualified_rate,
  },
  scope: report.scope,
  before: report.before,
  october: report.october,
  compare: report.compare,
}, null, 2));
