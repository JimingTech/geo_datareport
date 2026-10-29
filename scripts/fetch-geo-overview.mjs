#!/usr/bin/env node
/**
 * 从 GEO ONE 数据系统采集全部项目的汇总数据，写入 src/data/geoOverview.json。
 * 自 Slide_Skyworth 迁移。
 *
 * 用法:
 *   node scripts/fetch-geo-overview.mjs
 *
 * 项目自动按名称/分组识别（创维式账号结构）:
 *   - 品类优化词:  项目名以「品类优化词」开头
 *   - 品类监测词:  项目名以「品类监测词」开头
 *   - 产品优化词:  group_name 含「优化词」
 *   - 产品监测词:  group_name 含「监测词」
 *
 * 古井双产品（古16/古20）更推荐直接用 fetch-geo-report.mjs 按项目 ID 拉取。
 *
 * 必需环境变量（可写在项目根目录 .env）:
 *   GEO_API_BASE   API 地址，如 https://api.geotopone.com
 *   GEO_USER       账号
 *   GEO_PASS       密码
 *   GEO_BRAND_NAME 本品品牌名（从竞品计数中排除，默认不排除）
 */

import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// 加载根目录下的 .env 文件
const envPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.env');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const parts = trimmed.split('=');
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
      if (key && val && !process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const API_BASE = process.env.GEO_API_BASE;
const USERNAME = process.env.GEO_USER;
const PASSWORD = process.env.GEO_PASS;
const BRAND_NAME = process.env.GEO_BRAND_NAME || '';

if (!API_BASE || !USERNAME || !PASSWORD) {
  console.error('缺少环境变量：GEO_API_BASE / GEO_USER / GEO_PASS 都必须提供（或者在根目录创建 .env 文件配置）。');
  console.error('示例: GEO_API_BASE=https://api.geotopone.com GEO_USER=xxx GEO_PASS=xxx node scripts/fetch-geo-overview.mjs');
  process.exit(1);
}

let cookie = '';

async function api(pathname, params = {}) {
  const url = new URL(pathname, API_BASE);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
  }
  const res = await fetch(url, { headers: { cookie } });
  const json = await res.json();
  if (!json.ok) throw new Error(`${pathname} 请求失败: ${json.error || res.status}`);
  return json;
}

async function login() {
  const res = await fetch(new URL('/login', API_BASE), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: USERNAME, password: PASSWORD }),
  });
  const json = await res.json();
  if (!json.ok) throw new Error(`登录失败: ${json.error}`);
  const lastByName = new Map();
  for (const line of (res.headers.getSetCookie?.() || [res.headers.get('set-cookie')]).filter(Boolean)) {
    const pair = line.split(';')[0];
    lastByName.set(pair.split('=')[0], pair);
  }
  cookie = [...lastByName.values()].join('; ');
  return json.user;
}

const num = (v) => (v === null || v === undefined || v === '' ? null : Number(v));
const round1 = (v) => (v === null ? null : Math.round(v * 10) / 10);

/** 项目实际有数据的日期区间。接口返回可能乱序；当天数据可能还在采集中，有其他日期时剔除当天 */
async function dataRange(projectId) {
  let dates = [];
  try {
    dates = (await api(`/api/projects/${projectId}/data-dates`)).data.dates || [];
  } catch { /* 老版本后端无此接口 */ }
  dates = [...dates].sort();
  const today = new Date().toISOString().slice(0, 10);
  if (dates.length > 1 && dates[dates.length - 1] === today) dates = dates.slice(0, -1);
  return { dates, start: dates[0] || null, end: dates[dates.length - 1] || null };
}

/** 优化词项目：提及率 + TOP1/TOP3 提及率（取本品）+ 竞品排名榜单 */
async function fetchOptProject(p) {
  const { dates, start, end } = await dataRange(p.id);
  const range = { project_id: p.id, start_date: start, end_date: end };

  const stats = await api('/api/conversations/stats', range);
  const topRates = {};
  let brandNames = [];
  let top1Ranking = [];
  for (const topType of ['top1', 'top3']) {
    try {
      const r = await api('/api/competitors/top-mention-rate', { ...range, top_type: topType, page_size: 100 });
      const list = r.data.list || [];
      const self = list.find((b) => b.is_self);
      topRates[topType] = self ? num(self.selected_top_mention_rate) : null;
      if (topType === 'top1') {
        brandNames = list.map((b) => b.brand_name).filter(Boolean);
        top1Ranking = list.slice(0, 5).map((b) => ({
          name: b.display_name || b.brand_name,
          rate: num(b.selected_top_mention_rate),
          is_target: !!b.is_self,
        }));
      }
    } catch {
      topRates[topType] = null;
    }
  }
  const compare = await api('/api/competitors/compare', range);
  const citations = await api('/api/citations/stats', range);
  const articles = await api('/api/citations/articles', { ...range, page: 1, page_size: 1 });

  return {
    project_id: p.id,
    project_name: p.project_name,
    entry_count: p.entry_count,
    dates,
    mention_rate: num(stats.data.brand_mention_rate),
    top1_rate: topRates.top1,
    top3_rate: topRates.top3,
    total_conversations: citations.data.total_conversations,
    total_articles: articles.data.total ?? null,
    brand_names: brandNames,
    mention_ranking: (compare.data.mention_rate_ranking || []).slice(0, 5).map((b) => ({
      name: b.display_name || b.brand_name,
      rate: num(b.mention_rate),
      is_target: !!b.is_target,
    })),
    position_ranking: (compare.data.position_ranking || []).slice(0, 5).map((b) => ({
      name: b.display_name || b.brand_name,
      position: num(b.avg_position),
      is_target: !!b.is_target,
    })),
    top1_ranking: top1Ranking,
  };
}

/** 监测词项目：正负面比例 */
async function fetchMonitorProject(p) {
  const { dates, start, end } = await dataRange(p.id);
  const range = { project_id: p.id, start_date: start, end_date: end };

  const sentiments = await api('/api/sentiments/stats', range);
  const citations = await api('/api/citations/stats', range);
  const articles = await api('/api/citations/articles', { ...range, page: 1, page_size: 1 });

  return {
    project_id: p.id,
    project_name: p.project_name,
    entry_count: p.entry_count,
    dates,
    positive: num(sentiments.data.positive_percentage),
    negative: num(sentiments.data.negative_percentage),
    total_conversations: citations.data.total_conversations,
    total_articles: articles.data.total ?? null,
  };
}

async function main() {
  const user = await login();
  console.log(`已登录: ${user.name} (${user.company_name})`);

  const projects = (await api('/api/projects')).data;
  const categoryOptProj = projects.find((p) => p.project_name.startsWith('品类优化词'));
  const categoryMonitorProj = projects.find((p) => p.project_name.startsWith('品类监测词'));
  const productOptProjs = projects.filter((p) => (p.group_name || '').includes('优化词'));
  const productMonitorProjs = projects.filter((p) => (p.group_name || '').includes('监测词'));

  if (!categoryOptProj || !categoryMonitorProj || !productOptProjs.length || !productMonitorProjs.length) {
    console.error('项目识别不完整，当前账号项目:');
    for (const p of projects) console.error(`  ${p.id} ${p.project_name} (group: ${p.group_name || '-'})`);
    process.exit(1);
  }
  console.log(`品类优化词: ${categoryOptProj.id} / 品类监测词: ${categoryMonitorProj.id}`);
  console.log(`产品优化词: ${productOptProjs.map((p) => p.id).join(',')} / 产品监测词: ${productMonitorProjs.map((p) => p.id).join(',')}`);

  const categoryOpt = await fetchOptProject(categoryOptProj);
  const productOpt = [];
  for (const p of productOptProjs) productOpt.push(await fetchOptProject(p));
  const categoryMonitor = await fetchMonitorProject(categoryMonitorProj);
  const productMonitor = [];
  for (const p of productMonitorProjs) productMonitor.push(await fetchMonitorProject(p));

  // 产品汇总按会话数加权（= 各项目提及会话合并后再算比率），与运营侧报表口径一致
  const totalConv = productOpt.reduce((s, p) => s + (p.total_conversations || 0), 0);
  const weighted = (key) => {
    if (!totalConv) return null;
    const sum = productOpt.reduce((s, p) => s + (p[key] || 0) * (p.total_conversations || 0), 0);
    return round1(sum / totalConv);
  };
  const productOptAvg = {
    mention_rate: weighted('mention_rate'),
    top1_rate: weighted('top1_rate'),
    top3_rate: weighted('top3_rate'),
  };

  // ===== 监测范围汇总 =====
  const all = [categoryOpt, ...productOpt, categoryMonitor, ...productMonitor];
  const allDates = [...new Set(all.flatMap((p) => p.dates))].sort();
  // 执行天数按单个项目的监测天数算（各批项目采集日期可能错开，取并集会虚高）
  const days = Math.max(...all.map((p) => p.dates.length));
  const totalEntries = all.reduce((s, p) => s + (p.entry_count || 0), 0);
  const totalQueries = all.reduce((s, p) => s + (p.total_conversations || 0), 0);
  const totalArticles = all.reduce((s, p) => s + (p.total_articles || 0), 0);
  // 识别竞品：优化词项目竞品榜中去重的品牌数（排除本品）
  const brandSet = new Set([categoryOpt, ...productOpt].flatMap((p) => p.brand_names));
  if (BRAND_NAME) brandSet.delete(BRAND_NAME);
  const platformIds = categoryOptProj.monitor_platforms || [];
  const platforms = (await api('/api/platforms', { project_id: categoryOptProj.id })).data
    .filter((pl) => platformIds.includes(pl.id))
    .map((pl) => pl.name);

  const overview = {
    meta: {
      fetched_at: new Date().toISOString(),
      api_base: API_BASE,
      account: USERNAME,
    },
    category_opt: categoryOpt,
    product_opt: productOpt,
    product_opt_avg: productOptAvg,
    category_monitor: categoryMonitor,
    product_monitor: productMonitor,
    scope: {
      start_date: allDates[0] || null,
      end_date: allDates[allDates.length - 1] || null,
      days,
      total_entries: totalEntries,
      entry_breakdown: {
        category_opt: categoryOpt.entry_count,
        product_opt: productOpt.reduce((s, p) => s + (p.entry_count || 0), 0),
        category_monitor: categoryMonitor.entry_count,
        product_monitor: productMonitor.reduce((s, p) => s + (p.entry_count || 0), 0),
      },
      platforms,
      total_queries: totalQueries,
      total_articles: totalArticles,
      competitor_count: brandSet.size,
    },
  };

  const outPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/data/geoOverview.json');
  
  // 确保目录存在
  const outDir = path.dirname(outPath);
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  writeFileSync(outPath, JSON.stringify(overview, null, 2), 'utf-8');
  console.log(`已写入 ${outPath}`);
  console.log(`品类优化词 提及率 ${categoryOpt.mention_rate}% / TOP1 ${categoryOpt.top1_rate}% / TOP3 ${categoryOpt.top3_rate}%`);
  console.log(`产品优化词均值 提及率 ${productOptAvg.mention_rate}% / TOP1 ${productOptAvg.top1_rate}% / TOP3 ${productOptAvg.top3_rate}%`);
  console.log(`品类监测词 正面 ${categoryMonitor.positive}% / 负面 ${categoryMonitor.negative}%`);
  console.log(`范围: ${days} 天 / 词条 ${totalEntries} / 查询 ${totalQueries} / 文章 ${totalArticles} / 竞品 ${brandSet.size} 家`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
