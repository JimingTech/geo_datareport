#!/usr/bin/env node
/**
 * 桃李面包 TOC(465) / TOB(464) 报告取数
 *   9月 = 2026-09-22 单日（写入 before）
 *   10月 = 2026-10-29 单日（写入 september 字段，页面标签为「10月」）
 */
import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const envPath = path.join(root, '.env');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf-8').split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i === -1) continue;
    const key = t.slice(0, i).trim();
    const val = t.slice(i + 1).trim().replace(/^['"]|['"]$/g, '');
    if (key && val && !process.env[key]) process.env[key] = val;
  }
}

const API_BASE = process.env.GEO_API_BASE || 'https://api.geotopone.com';
const USERNAME = process.env.GEO_USER;
const PASSWORD = process.env.GEO_PASS;
if (!USERNAME || !PASSWORD) {
  console.error('缺少 GEO_USER / GEO_PASS');
  process.exit(1);
}

const BEFORE_DATE = '2026-09-22';
const SEPT_DATE = '2026-10-29';
const MONTH_START = '2026-10-01';
const MONTH_END = '2026-10-29';

const PRODUCTS = [
  { key: 'toc', projectId: 465, name: '桃李面包 ToC', short: 'ToC' },
  { key: 'tob', projectId: 464, name: '桃李面包 ToB', short: 'ToB' },
];
const MONITOR_ID = 463;

const NO_DATA = '-';
const num = (v) => (v === null || v === undefined || v === '' ? null : Number(v));
const isBlank = (v) => v === null || v === undefined || v === '';
function fmtRate(v) {
  if (isBlank(v)) return NO_DATA;
  const n = Number(v);
  return Number.isFinite(n) ? `${n.toFixed(1)}%` : NO_DATA;
}
function fmtDate(v) {
  if (!v) return '--';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return String(v).slice(0, 10).replace(/-/g, '/');
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

function productFullName(b) {
  const product = b.display_name || b.product_name || '';
  const brand = b.brand_name || '';
  if (product && brand && product !== brand && !product.includes(brand) && !brand.includes(product)) {
    return `${brand}${product}`;
  }
  return product || brand || '-';
}

let cookie = '';
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
    .filter((pair) => pair.slice(pair.indexOf('=') + 1).length > 0)
    .join('; ');
  return json.user;
}

async function api(pathname, params = {}, { optional = false } = {}) {
  const url = new URL(pathname, API_BASE);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
  }
  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { cookie }, signal: AbortSignal.timeout(45000) });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || res.status);
      return json;
    } catch (e) {
      lastErr = e;
      if (attempt < 3) await new Promise((r) => setTimeout(r, 800 * attempt));
    }
  }
  if (optional) {
    console.warn(`  ! ${pathname} 不可用（${lastErr.message}）`);
    return null;
  }
  throw new Error(`${pathname} 失败: ${lastErr.message}`);
}

function snapshot(stats, influence, top1, top3) {
  const self = (influence?.data?.list || []).find((b) => b.is_target) || {};
  const selfTop1 = (top1?.data?.list || []).find((b) => b.is_self ?? b.is_target);
  const selfTop3 = (top3?.data?.list || []).find((b) => b.is_self ?? b.is_target);
  return {
    mention_rate: num(stats.data.brand_mention_rate),
    top1_mention_rate: num(selfTop1?.selected_top_mention_rate ?? stats.data.top1_mention_rate),
    top3_mention_rate: num(selfTop3?.selected_top_mention_rate ?? stats.data.top3_mention_rate),
    avg_position: num(stats.data.avg_position),
    influence_score: num(self.influence_score),
    influence_rank: self.rank ?? null,
    conversations: influence?.data?.total_conversations ?? null,
    platforms: (stats.data.platform_stats || []).map((p) => ({
      platform_id: p.platform_id,
      name: p.platform_name,
      mention_rate: num(p.brand_mention_rate),
      avg_position: num(p.avg_position),
    })),
  };
}

function ranking(list, valueFn) {
  return (list || []).map((b, i) => ({
    name: productFullName(b),
    value: valueFn(b),
    isTarget: !!(b.is_target ?? b.is_self),
    rank: b.rank ?? (b.is_target || b.is_self ? null : i + 1),
  }));
}

function topFourPlusSelf(list) {
  const rows = list || [];
  const leaders = rows.filter((b) => !(b.is_target || b.is_self)).slice(0, 4);
  const self = rows.find((b) => b.is_target || b.is_self);
  return self ? [...leaders, self] : leaders;
}

async function allBrandNames(projectId, start, end) {
  const names = [];
  for (let page = 1; page <= 20; page++) {
    const r = await api('/api/competitors/top-mention-rate', {
      project_id: projectId, start_date: start, end_date: end, top_type: 'top1', page, page_size: 100,
    }, { optional: true });
    const list = r?.data?.list || [];
    for (const b of list) {
      if (b.is_self || b.is_target) continue;
      const n = b.brand_name || b.display_name;
      if (n) names.push(n);
    }
    if (list.length < 100) break;
  }
  return names;
}

async function fetchDay(projectId, date) {
  const range = { project_id: projectId, start_date: date, end_date: date };
  const [stats, influence, compare, top1, top3, citations, articles, entries] = await Promise.all([
    api('/api/conversations/stats', range),
    api('/api/competitors/influence', range),
    api('/api/competitors/compare', range),
    api('/api/competitors/top-mention-rate', { ...range, top_type: 'top1', page_size: 100 }, { optional: true }),
    api('/api/competitors/top-mention-rate', { ...range, top_type: 'top3', page_size: 100 }, { optional: true }),
    api('/api/citations/stats', range, { optional: true }),
    api('/api/citations/articles', { ...range, page: 1, page_size: 10, sort_by: 'total_citations', sort_order: 'desc' }, { optional: true }),
    api('/api/entries', { ...range, page: 1, page_size: 100, sort_by: 'mention_rate', sort_order: 'desc' }),
  ]);
  return { stats, influence, compare, top1, top3, citations, articles, entries };
}

async function main() {
  const user = await login();
  console.log(`已登录: ${user.name} (${user.company_name})`);

  const products = {};
  const platformEntries = {};
  const scopeBrands = new Set();
  const scopePlatforms = new Set();
  let scopeConversations = 0;
  let scopeArticles = 0;
  let scopeCitations = 0;
  let scopeEntries = 0;

  for (const p of PRODUCTS) {
    console.log(`\n=== ${p.name} (${p.projectId}) ===`);
    const platforms = (await api('/api/platforms', { project_id: p.projectId })).data || [];
    const platformMap = Object.fromEntries(platforms.map((pl) => [pl.id, pl]));
    platforms.forEach((pl) => scopePlatforms.add(pl.name));

    const before = await fetchDay(p.projectId, BEFORE_DATE);
    const sept = await fetchDay(p.projectId, SEPT_DATE);

    const namePlatform = (list) => (list || []).map((x) => ({
      ...x,
      platform_name: x.platform_name || platformMap[x.platform_id]?.name || `平台${x.platform_id}`,
    }));

    const beforeSnap = snapshot(before.stats, before.influence, before.top1, before.top3);
    beforeSnap.platforms = namePlatform(beforeSnap.platforms);
    const septSnap = snapshot(sept.stats, sept.influence, sept.top1, sept.top3);
    septSnap.platforms = namePlatform(septSnap.platforms);
    septSnap.covered_entries = (sept.entries.data.list || []).filter((e) => Number(e.mention_rate) > 0).length;
    beforeSnap.covered_entries = (before.entries.data.list || []).filter((e) => Number(e.mention_rate) > 0).length;

    console.log(`  9月  提及率=${beforeSnap.mention_rate}% Top1=${beforeSnap.top1_mention_rate}% Top3=${beforeSnap.top3_mention_rate}% 排名=NO.${beforeSnap.influence_rank}`);
    console.log(`  10月 提及率=${septSnap.mention_rate}% Top1=${septSnap.top1_mention_rate}% Top3=${septSnap.top3_mention_rate}% 排名=NO.${septSnap.influence_rank}`);

    const compare = {
      mention_rate: ranking(topFourPlusSelf(sept.compare.data.mention_rate_ranking), (b) => `${num(b.mention_rate)}%`),
      top1: ranking(topFourPlusSelf(sept.top1?.data?.list || []), (b) => `${num(b.selected_top_mention_rate ?? b.top1_mention_rate)}%`),
      influence: ranking(topFourPlusSelf(sept.influence.data.list), (b) => String(b.rank)),
    };

    const citeList = (articles) => (articles?.data?.list || []).map((a, i) => ({
      rank: i + 1,
      src: a.platform_name || a.domain || '',
      title: a.title,
      cites: a.total_citations,
      domain: a.domain,
    }));

    products[p.key] = {
      project_id: p.projectId,
      name: p.name,
      short: p.short,
      before: beforeSnap,
      september: septSnap,
      compare,
      citations: {
        before: citeList(before.articles),
        september: citeList(sept.articles),
        before_total: before.citations?.data?.total_citations ?? null,
        september_total: sept.citations?.data?.total_citations ?? null,
        before_rate: num(before.citations?.data?.citation_rate),
        september_rate: num(sept.citations?.data?.citation_rate),
      },
      entries_all: (sept.entries.data.list || []).map((e) => ({
        name: e.entry_name,
        mention_rate: num(e.mention_rate),
        top1_mention_rate: num(e.top1_mention_rate),
      })),
    };

    platformEntries[p.key] = {};
    for (const pl of platforms) {
      const entries = await api('/api/entries', {
        project_id: p.projectId,
        start_date: SEPT_DATE,
        end_date: SEPT_DATE,
        page: 1,
        page_size: 100,
        sort_by: 'mention_rate',
        sort_order: 'desc',
        platform_ids: String(pl.id),
      });
      platformEntries[p.key][String(pl.id)] = (entries.data.list || []).map((e) => ({
        entry_name: e.entry_name,
        mention_rate: fmtRate(e.mention_rate),
        top1_mention_rate: fmtRate(e.top1_mention_rate),
        last_conversation_time: fmtDate(e.last_conversation_time),
        last_screenshot_url: e.last_screenshot_url || null,
      }));
      console.log(`  平台 ${pl.name}(${pl.id}) 词条 ${platformEntries[p.key][String(pl.id)].length} 条`);
    }

    const month = { project_id: p.projectId, start_date: MONTH_START, end_date: MONTH_END };
    const monthCitations = await api('/api/citations/stats', month);
    const monthArticles = await api('/api/citations/articles', { ...month, page: 1, page_size: 1 });
    const monthEntries = await api('/api/entries', { ...month, page: 1, page_size: 1 });
    scopeConversations += monthCitations.data.total_conversations || 0;
    scopeCitations += monthCitations.data.total_citations || 0;
    scopeArticles += monthArticles.data.total || 0;
    scopeEntries += monthEntries.data.total || 0;
    for (const n of await allBrandNames(p.projectId, MONTH_START, MONTH_END)) scopeBrands.add(n);
    console.log(`  10月1-29 会话=${monthCitations.data.total_conversations} 文章=${monthArticles.data.total} 引用=${monthCitations.data.total_citations}`);
  }

  const monitor = {};
  try {
    const sent = await api('/api/sentiments/stats', { project_id: MONITOR_ID, start_date: SEPT_DATE, end_date: SEPT_DATE }, { optional: true });
    monitor.positive = num(sent?.data?.positive_percentage ?? sent?.data?.positive_rate);
    monitor.negative = num(sent?.data?.negative_percentage ?? sent?.data?.negative_rate);
    monitor.positive_keywords = (sent?.data?.positive_keywords || []).map((k) => k.tag_name_zh || k.tag_name);
    monitor.negative_keywords = (sent?.data?.negative_keywords || []).map((k) => k.tag_name_zh || k.tag_name);
    console.log(`\n监测词 正面=${monitor.positive}% 负面=${monitor.negative}%`);
  } catch (e) {
    console.warn('监测词情感拉取失败', e.message);
  }

  const report = {
    meta: {
      fetched_at: new Date().toISOString(),
      label: '2026年10月',
      before_date: BEFORE_DATE,
      september_date: SEPT_DATE,
      before_label: '9月',
      september_label: '10月',
    },
    scope: {
      calendar_days: 29,
      platforms: scopePlatforms.size,
      platform_names: [...scopePlatforms],
      entries: scopeEntries,
      conversations: scopeConversations,
      articles: scopeArticles,
      citations: scopeCitations,
      competitor_brands: [...scopeBrands].filter((n) => !String(n).includes('桃李')).length,
    },
    products,
    monitor,
    platform_entries: platformEntries,
  };

  const dataDir = path.join(root, 'src/data');
  mkdirSync(dataDir, { recursive: true });
  writeFileSync(path.join(dataDir, 'taoliSeptemberReport.json'), JSON.stringify(report, null, 2), 'utf-8');
  writeFileSync(path.join(dataDir, 'platform_entries.json'), JSON.stringify(platformEntries, null, 2), 'utf-8');
  console.log('\n=== SCOPE ===');
  console.log(JSON.stringify(report.scope, null, 2));
  console.log('\n已写入 src/data/taoliSeptemberReport.json 与 src/data/platform_entries.json');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
