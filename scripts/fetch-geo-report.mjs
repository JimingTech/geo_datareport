#!/usr/bin/env node
/**
 * 从 GEO ONE 数据系统采集指定项目的报告数据，写入 src/data/geoReport_<project_id>.json。
 * 自 Slide_Skyworth 迁移，并适配古井双产品（如 123=古16 / 124=古20）。
 *
 * 用法:
 *   node scripts/fetch-geo-report.mjs <project_id> [--start YYYY-MM-DD] [--end YYYY-MM-DD]
 *   node scripts/fetch-geo-report.mjs --list
 *
 * 必需环境变量（可写在项目根目录 .env）:
 *   GEO_API_BASE  API 地址，如 https://api.geotopone.com
 *   GEO_USER      账号
 *   GEO_PASS      密码
 *
 * ⚠ 指标口径（务必遵守，历史踩坑）：数据系统「总览」的三个指标各有固定来源，
 *   页面（核心数据总览 / 竞品排名）必须按此取数，切勿混用「竞品对比」表的字段：
 *     · 提及率       → conversations/stats.brand_mention_rate
 *     · 平均提及位次  → conversations/stats.avg_position       （不是 compare.position_ranking！两者可能差 0.1）
 *     · 竞品排名      → 行业影响力排名 = competitors/influence 中本品(is_target)的 rank（不是提及率排名的名次）
 *   本脚本已把逐日的这三个指标算好放进 report.overview_daily，按日期直接取用即可。
 *
 * ⚠ 竞品分析页的三张排名表请一律取 report.product_rankings（产品口径，来自 competitors/
 *   mention-rate、top-mention-rate、position 三个专用接口），不要用 report.compare 里的
 *   mention_rate_ranking / position_ranking——那两个是品牌口径，目标品牌下挂多个产品时
 *   （如劲牌养生一号）位次会和数据系统页面对不上（4.8 vs 5.4），品牌名也和页面显示的产品名不一致。
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

if (!API_BASE || !USERNAME || !PASSWORD) {
  console.error('缺少环境变量：GEO_API_BASE / GEO_USER / GEO_PASS 都必须提供（或者在根目录创建 .env 文件配置）。');
  console.error('示例: GEO_API_BASE=https://api.geotopone.com GEO_USER=xxx GEO_PASS=xxx node scripts/fetch-geo-report.mjs <project_id>');
  process.exit(1);
}

const args = process.argv.slice(2);
const listOnly = args.includes('--list');
const projectId = Number(args.find((a) => !a.startsWith('--')));
if (!listOnly && !projectId) {
  console.error('用法: node scripts/fetch-geo-report.mjs <project_id> [--start YYYY-MM-DD] [--end YYYY-MM-DD]');
  console.error('      node scripts/fetch-geo-report.mjs --list');
  process.exit(1);
}
const getFlag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 ? args[i + 1] : undefined;
};

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
  cookie = (res.headers.getSetCookie?.() || [res.headers.get('set-cookie')])
    .filter(Boolean)
    .map((c) => c.split(';')[0])
    .filter((c) => c.includes('=') && c.split('=').slice(1).join('='))
    .join('; ');
  return json.user;
}

const num = (v) => (v === null || v === undefined || v === '' ? null : Number(v));
const today = () => new Date().toISOString().slice(0, 10);

async function main() {
  const user = await login();
  console.log(`已登录: ${user.name} (${user.company_name})`);

  const projects = (await api('/api/projects')).data;
  if (listOnly) {
    console.log('当前账号项目:');
    for (const p of projects) {
      console.log(`  ${p.id}\t${p.project_name}\tgroup=${p.group_name || '-'}\tproduct=${p.target_product || '-'}\tentries=${p.entry_count ?? '-'}`);
    }
    return;
  }

  const project = projects.find((p) => p.id === projectId);
  if (!project) {
    console.error(`未找到项目 ${projectId}，当前账号的项目: ${projects.map((p) => `${p.id}=${p.project_name}`).join(', ')}`);
    process.exit(1);
  }

  // 默认区间：项目实际有数据的日期范围（/data-dates），取不到再退回“创建日~今天”
  let dataDates = [];
  try {
    dataDates = (await api(`/api/projects/${projectId}/data-dates`)).data.dates || [];
    dataDates = [...dataDates].sort();
  } catch { /* 老版本后端无此接口 */ }
  const startDate = getFlag('start') || dataDates[0] || project.created_at.slice(0, 10);
  const endDate = getFlag('end') || dataDates[dataDates.length - 1] || today();
  const range = { project_id: projectId, start_date: startDate, end_date: endDate };
  console.log(`项目: ${project.project_name} / 目标产品: ${project.target_product}`);
  console.log(`数据区间: ${startDate} ~ ${endDate}`);

  const [platforms, stats, influence, entries, compare, citationStats, citationArticles] = await Promise.all([
    api('/api/platforms', { project_id: projectId }),
    api('/api/conversations/stats', range),
    api('/api/competitors/influence', range),
    api('/api/entries', { ...range, page: 1, page_size: 100, sort_by: 'mention_rate', sort_order: 'desc' }),
    api('/api/competitors/compare', range),
    api('/api/citations/stats', range),
    api('/api/citations/articles', { ...range, page: 1, page_size: 10, sort_by: 'total_citations', sort_order: 'desc' }),
  ]);

  // ——— 竞品三张排名表：必须用下面这三个专用接口（match_mode=product）———
  // /api/competitors/compare 的 mention_rate_ranking / position_ranking 是「品牌」口径，
  // 当目标品牌下挂多个产品时（如劲牌养生一号），位次会和数据系统页面对不上（4.8 vs 5.4）。
  const rankingPages = { page: 1, page_size: 20 };
  const [mentionRank, top1, top3, positionRank] = await Promise.all([
    api('/api/competitors/mention-rate', { ...range, ...rankingPages }).catch((e) => {
      console.warn(`mention-rate 接口不可用（${e.message}）`);
      return null;
    }),
    api('/api/competitors/top-mention-rate', { ...range, ...rankingPages, top_type: 'top1' }).catch((e) => {
      console.warn(`top-mention-rate(top1) 接口不可用（${e.message}）`);
      return null;
    }),
    api('/api/competitors/top-mention-rate', { ...range, ...rankingPages, top_type: 'top3' }).catch((e) => {
      console.warn(`top-mention-rate(top3) 接口不可用（${e.message}）`);
      return null;
    }),
    api('/api/competitors/position', { ...range, ...rankingPages }).catch((e) => {
      console.warn(`position 接口不可用（${e.message}）`);
      return null;
    }),
  ]);

  const mapRanking = (res, valueKey) =>
    (res?.data?.list || []).map((b) => ({
      rank: b.rank,
      name: b.display_name || b.product_name || b.brand_name,
      brand_name: b.brand_name,
      value: num(b[valueKey]),
      is_target: !!(b.is_target ?? b.is_self),
    }));

  const platformMap = Object.fromEntries(platforms.data.map((p) => [p.id, p]));

  const report = {
    meta: {
      fetched_at: new Date().toISOString(),
      api_base: API_BASE,
      project_id: projectId,
      project_name: project.project_name,
      target_product: project.target_product,
      target_brand_name: project.target_brand_name || null,
      start_date: startDate,
      end_date: endDate,
    },
    platforms: platforms.data,
    stats: {
      brand_mention_rate: num(stats.data.brand_mention_rate),
      top1_mention_rate: num(stats.data.top1_mention_rate),
      top3_mention_rate: num(stats.data.top3_mention_rate),
      avg_position: num(stats.data.avg_position),
      daily_stats: (stats.data.daily_stats || []).map((d) => ({
        date: d.date,
        mention_rate: num(d.mention_rate ?? d.brand_mention_rate),
        avg_position: num(d.avg_position),
      })),
      platform_stats: (stats.data.platform_stats || []).map((p) => ({
        platform_id: p.platform_id,
        platform_name: platformMap[p.platform_id]?.name || `平台${p.platform_id}`,
        platform_logo: platformMap[p.platform_id]?.url || null,
        brand_mention_rate: num(p.brand_mention_rate),
        avg_position: num(p.avg_position),
      })),
    },
    influence: {
      total_conversations: influence.data.total_conversations,
      list: (influence.data.list || []).map((b) => ({
        rank: b.rank,
        brand_name: b.brand_name,
        product_name: b.product_name || null,
        display_name: b.display_name || b.display_name_zh || b.product_name || b.brand_name,
        favicon_url: b.favicon_url,
        influence_score: num(b.influence_score),
        mention_rate: num(b.mention_rate),
        avg_position: num(b.avg_position),
        is_target: !!b.is_target,
      })),
    },
    entries: {
      total: entries.data.total,
      list: (entries.data.list || []).map((e) => ({
        entry_id: e.entry_id,
        entry_name: e.entry_name,
        mention_rate: num(e.mention_rate),
        position: num(e.position),
        platform_ids: e.platform_ids || [],
        last_conversation_time: e.last_conversation_time,
        last_screenshot_url: e.last_screenshot_url,
      })),
    },
    compare: {
      target_product: compare.data.target_product,
      mention_rate_ranking: compare.data.mention_rate_ranking || [],
      position_ranking: compare.data.position_ranking || [],
      rate_daily: compare.data.rate_daily || compare.data.mention_rate_daily || [],
      position_daily: compare.data.position_daily || [],
      top1_ranking: (top1?.data?.list || []).map((b) => ({
        rank: b.rank,
        brand_name: b.display_name || b.brand_name,
        top1_mention_rate: num(b.selected_top_mention_rate),
        is_target: !!(b.is_self ?? b.is_target),
      })),
    },
    // 竞品分析页三张表的取数来源（产品口径，与数据系统页面一致）
    product_rankings: {
      mention_rate: mapRanking(mentionRank, 'mention_rate'),
      top1: mapRanking(top1, 'selected_top_mention_rate'),
      top3: mapRanking(top3, 'selected_top_mention_rate'),
      position: mapRanking(positionRank, 'avg_position'),
    },
    citations: {
      total_conversations: citationStats.data.total_conversations,
      citation_rate: num(citationStats.data.citation_rate),
      total_citations: citationStats.data.total_citations,
      platform_stats: (citationStats.data.platform_stats || []).map((p) => ({
        platform_name: p.platform_name,
        domain: p.domain,
        logo_url: p.logo_url,
        citation_count: p.citation_count,
        share: num(p.share),
      })),
      articles: (citationArticles.data.list || []).map((a) => ({
        title: a.title,
        link_url: a.link_url,
        domain: a.domain,
        platform_name: a.platform_name,
        logo_url: a.logo_url,
        total_citations: a.total_citations,
        avg_citations: num(a.avg_citations),
        has_target_product: !!a.has_target_product,
      })),
    },
  };

  // conversations/stats 不返回 TOP1/TOP3 提及率，用竞品排名里本品那一行补齐
  for (const key of ['top1', 'top3']) {
    if (report.stats[`${key}_mention_rate`] == null) {
      report.stats[`${key}_mention_rate`] = report.product_rankings[key].find((b) => b.is_target)?.value ?? null;
    }
  }

  // ——— 总览口径的每日指标（供「核心数据总览 / 竞品排名」页直接取数，避免取错字段）———
  // 提及率=stats.brand_mention_rate；平均提及位次=stats.avg_position（非 position_ranking）；
  // 竞品排名=行业影响力排名=influence 中本品(is_target)的 rank（非 mention_rate_ranking 名次）。
  const overviewDates = report.stats.daily_stats.map((d) => d.date);
  const dailyRank = Object.fromEntries(
    await Promise.all(
      overviewDates.map(async (date) => {
        try {
          const inf = await api('/api/competitors/influence', { project_id: projectId, start_date: date, end_date: date });
          const self = (inf.data.list || []).find((b) => b.is_target);
          return [date, self ? self.rank : null];
        } catch {
          return [date, null];
        }
      })
    )
  );
  report.overview_daily = report.stats.daily_stats.map((d) => ({
    date: d.date,
    mention_rate: d.mention_rate,   // 提及率
    avg_position: d.avg_position,   // 平均提及位次（总览口径）
    influence_rank: dailyRank[d.date] ?? null, // 竞品排名 = 行业影响力排名
  }));

  const outPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), `../src/data/geoReport_${projectId}.json`);
  
  // 确保目录存在
  const outDir = path.dirname(outPath);
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  writeFileSync(outPath, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`已写入 ${outPath}`);
  console.log(`词条 ${report.entries.list.length} 条 / 竞品 ${report.influence.list.length} 个 / 引用文章 ${report.citations.articles.length} 篇`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
