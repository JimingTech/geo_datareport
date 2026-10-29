#!/usr/bin/env node
/**
 * 采集古井贡酒双产品的「单日快照 + 整月监测范围」，写入 src/data/monthlySnapshot.json，
 * 并同步重建 src/data/platform_entries.json（词条数据明细页的数据源）。
 *
 * 用法:
 *   node scripts/fetch-monthly-snapshot.mjs --date 2026-08-29
 *   node scripts/fetch-monthly-snapshot.mjs --date 2026-08-29 --month 2026-08
 *   node scripts/fetch-monthly-snapshot.mjs --gu16-date 2026-10-28 --gu20-date 2026-10-21 --month 2026-10
 *
 * 口径约定（历史踩坑，务必遵守）：
 *   · 核心数据总览的「提及率 / 平均提及位次」→ conversations/stats 的 brand_mention_rate / avg_position
 *   · 核心数据总览 / 竞品分析页的「竞品排名」→ competitors/influence 的行业影响力排名（rank，展示 NO. 1 / NO. 2）
 *   · 竞品分析页不要再写「提及位次排名」，也不要写「影响力指数」；第三张表固定用行业影响力名次
 *   · 分平台词条必须传 platform_ids（复数）；传单数 platform_id 会退化成全平台汇总
 *   · competitors/top-mention-rate 是唯一返回全量识别品牌的接口，page_size 服务端封顶 100，需翻页
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
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
    process.env[t.slice(0, i).trim()] = t.slice(i + 1).trim().replace(/^['"]|['"]$/g, '');
  }
}

const args = process.argv.slice(2);
const getFlag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 ? args[i + 1] : fallback;
};

const API_BASE = process.env.GEO_API_BASE;
const USERNAME = process.env.GEO_USER;
const PASSWORD = process.env.GEO_PASS;
const DATE = getFlag('date', '2026-08-29');
const GU16_DATE = getFlag('gu16-date', DATE);
const GU20_DATE = getFlag('gu20-date', DATE);
const MONTH = getFlag('month', (GU16_DATE > GU20_DATE ? GU16_DATE : GU20_DATE).slice(0, 7));

if (!API_BASE || !USERNAME || !PASSWORD) {
  console.error('缺少 GEO_API_BASE / GEO_USER / GEO_PASS（可写在根目录 .env）');
  process.exit(1);
}

/** 报告侧沿用的产品键（123/124）与数据系统真实项目 ID 的映射 */
const PRODUCTS = [
  { slideKey: '123', projectId: 351, name: '古井贡酒古16', short: '古16', date: GU16_DATE },
  { slideKey: '124', projectId: 352, name: '古井贡酒古20', short: '古20', date: GU20_DATE },
];

const monthStart = `${MONTH}-01`;
const monthEnd = (() => {
  const [y, m] = MONTH.split('-').map(Number);
  return `${MONTH}-${String(new Date(y, m, 0).getDate()).padStart(2, '0')}`;
})();

let cookie = '';
const num = (v) => (v === null || v === undefined || v === '' ? null : Number(v));

/** 数据系统对无数据单元格的显示形式，词条明细页需与之一致 */
const NO_DATA = '-';

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
      if (attempt < 3) await new Promise((r) => setTimeout(r, 1200 * attempt));
    }
  }
  if (optional) {
    console.warn(`  ! ${pathname} 不可用（${lastErr.message}），已置空`);
    return null;
  }
  throw new Error(`${pathname} 失败: ${lastErr.message}`);
}

const rankTop5 = (list, valueKey, nameKey = 'display_name') =>
  (list || []).slice(0, 5).map((b) => ({
    name: b[nameKey] || b.brand_name,
    value: num(b[valueKey]),
    is_target: !!(b.is_target ?? b.is_self),
  }));

/** 全量识别品牌（翻页取尽，服务端 page_size 封顶 100） */
async function allBrandNames(projectId, start, end) {
  const names = [];
  for (let page = 1; page <= 30; page++) {
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

/**
 * 空值判定：接口对未被提及的词条返回 position: null，而提及率返回字符串 "0.0"。
 * 注意 Number(null) === 0 且 Number.isFinite(0) 为真，只判 isFinite 会把「无位次」渲染成 NO. 0.0，
 * 必须先显式拦 null/undefined/''，位次再排掉 0（位次从 1 起，0 不是有效值）。
 */
const isBlank = (v) => v === null || v === undefined || v === '';

function fmtRate(v) {
  if (isBlank(v)) return NO_DATA;
  const n = Number(v);
  return Number.isFinite(n) ? `${n.toFixed(1)}%` : NO_DATA;
}
function fmtPos(v) {
  if (isBlank(v)) return NO_DATA;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? `NO. ${n.toFixed(1)}` : NO_DATA;
}
function fmtDate(v) {
  if (!v) return '--';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return String(v).slice(0, 10).replace(/-/g, '/');
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

async function main() {
  const user = await login();
  console.log(`已登录: ${user.name} (${user.company_name})`);
  console.log(`单日口径: 古16=${GU16_DATE} 古20=${GU20_DATE} / 整月口径: ${monthStart} ~ ${monthEnd}\n`);

  const out = {
    meta: {
      fetched_at: new Date().toISOString(),
      date: DATE,
      gu16_date: GU16_DATE,
      gu20_date: GU20_DATE,
      month: MONTH,
      month_start: monthStart,
      month_end: monthEnd,
    },
    products: {},
    scope: {},
  };
  const platformEntries = {};

  let scopeConversations = 0;
  let scopeArticles = 0;
  let scopeCitations = 0;
  let scopeEntries = 0;
  const scopeBrands = new Set();
  const scopePlatforms = new Set();
  let scopeCollectDays = 0;

  for (const p of PRODUCTS) {
    console.log(`=== ${p.name} (项目 ${p.projectId}) 单日 ${p.date} ===`);
    const day = { project_id: p.projectId, start_date: p.date, end_date: p.date };
    const month = { project_id: p.projectId, start_date: monthStart, end_date: monthEnd };

    const dayStats = await api('/api/conversations/stats', day);
    const dayInfluence = await api('/api/competitors/influence', day);
    const dayCompare = await api('/api/competitors/compare', day);
    const dayTop1 = await api('/api/competitors/top-mention-rate', { ...day, top_type: 'top1', page_size: 100 }, { optional: true });
    const dayTop3 = await api('/api/competitors/top-mention-rate', { ...day, top_type: 'top3', page_size: 100 }, { optional: true });
    const daySentiment = await api('/api/sentiments/stats', day, { optional: true });
    const dayNegative = await api('/api/sentiments/negative-answers', { ...day, page: 1, page_size: 20 }, { optional: true });

    const self = (dayInfluence.data.list || []).find((b) => b.is_target);
    const selfTop1 = (dayTop1?.data?.list || []).find((b) => b.is_self ?? b.is_target);
    const selfTop3 = (dayTop3?.data?.list || []).find((b) => b.is_self ?? b.is_target);

    out.products[p.slideKey] = {
      project_id: p.projectId,
      name: p.name,
      short: p.short,
      date: p.date,
      overview: {
        mention_rate: num(dayStats.data.brand_mention_rate),
        avg_position: num(dayStats.data.avg_position),
        influence_rank: self ? self.rank : null,
        top1_mention_rate: num(selfTop1?.selected_top_mention_rate),
        top3_mention_rate: num(selfTop3?.selected_top_mention_rate),
      },
      rankings: {
        mention_rate: rankTop5(dayCompare.data.mention_rate_ranking, 'mention_rate'),
        position: rankTop5(dayCompare.data.position_ranking, 'avg_position'),
        top1: rankTop5(dayTop1?.data?.list, 'selected_top_mention_rate'),
        // 竞品排名 = 行业影响力，不是提及位次
        influence: rankTop5(dayInfluence.data.list, 'influence_score'),
      },
      sentiment: {
        positive: num(daySentiment?.data?.positive_percentage ?? daySentiment?.data?.positive_rate),
        negative: num(daySentiment?.data?.negative_percentage ?? daySentiment?.data?.negative_rate),
        positive_keywords: daySentiment?.data?.positive_keywords || [],
        negative_keywords: daySentiment?.data?.negative_keywords || [],
        raw_keys: daySentiment ? Object.keys(daySentiment.data) : [],
      },
      negative_answers: (dayNegative?.data?.list || []).map((a) => ({
        entry: a.entry_name || a.keyword || a.query || null,
        type: a.negative_type || a.type || '负面回答',
        summary: a.summary || a.content || a.answer_snippet || a.problem || null,
      })),
    };

    const o = out.products[p.slideKey].overview;
    console.log(`  提及率=${o.mention_rate}%  Top1=${o.top1_mention_rate}%  Top3=${o.top3_mention_rate}%  影响力排名=NO.${o.influence_rank}`);
    console.log(`  情感: 正面=${out.products[p.slideKey].sentiment.positive}% 负面=${out.products[p.slideKey].sentiment.negative}% 负面回答=${out.products[p.slideKey].negative_answers.length}条`);
    console.log(`  情感接口字段: ${out.products[p.slideKey].sentiment.raw_keys.join(',')}`);

    // ——— 分平台词条明细（词条数据明细页）———
    const platforms = (await api('/api/platforms', { project_id: p.projectId })).data;
    platformEntries[p.slideKey] = {};
    for (const pl of platforms) {
      scopePlatforms.add(pl.name);
      const entries = await api('/api/entries', {
        ...day, page: 1, page_size: 100, sort_by: 'mention_rate', sort_order: 'desc',
        platform_ids: String(pl.id),
      });
      platformEntries[p.slideKey][String(pl.id)] = (entries.data.list || []).map((e) => ({
        entry_name: e.entry_name,
        mention_rate: fmtRate(e.mention_rate),
        top1_mention_rate: fmtRate(e.top1_mention_rate),
        last_conversation_time: fmtDate(e.last_conversation_time),
        last_screenshot_url: e.last_screenshot_url || null,
      }));
      console.log(`  平台 ${pl.name}(${pl.id}) 词条 ${platformEntries[p.slideKey][String(pl.id)].length} 条`);
    }

    // ——— 整月监测范围 ———
    const monthStats = await api('/api/conversations/stats', month);
    const monthCitations = await api('/api/citations/stats', month);
    const monthArticles = await api('/api/citations/articles', { ...month, page: 1, page_size: 1 });
    const monthEntries = await api('/api/entries', { ...month, page: 1, page_size: 1 });

    scopeCollectDays = Math.max(scopeCollectDays, (monthStats.data.daily_stats || []).length);
    scopeConversations += monthCitations.data.total_conversations || 0;
    scopeCitations += monthCitations.data.total_citations || 0;
    scopeArticles += monthArticles.data.total || 0;
    scopeEntries += monthEntries.data.total || 0;
    for (const n of await allBrandNames(p.projectId, monthStart, monthEnd)) scopeBrands.add(n);

    console.log(`  ${MONTH} 整月: 采集日=${(monthStats.data.daily_stats || []).length} 会话=${monthCitations.data.total_conversations} 引用文章=${monthArticles.data.total} 引用次数=${monthCitations.data.total_citations}\n`);
  }

  const [y, m] = MONTH.split('-').map(Number);
  out.scope = {
    calendar_days: new Date(y, m, 0).getDate(),
    collect_days: scopeCollectDays,
    platforms: scopePlatforms.size,
    platform_names: [...scopePlatforms],
    entries: scopeEntries,
    conversations: scopeConversations,
    articles: scopeArticles,
    citations: scopeCitations,
    competitor_brands: [...scopeBrands].filter((n) => !n.includes('古井贡酒')).length,
  };

  console.log('=== 整月监测范围合计 ===');
  console.log(JSON.stringify(out.scope, null, 2));

  const dataDir = path.join(root, 'src/data');
  mkdirSync(dataDir, { recursive: true });
  writeFileSync(path.join(dataDir, 'monthlySnapshot.json'), JSON.stringify(out, null, 2), 'utf-8');
  writeFileSync(path.join(dataDir, 'platform_entries.json'), JSON.stringify(platformEntries, null, 2), 'utf-8');
  console.log('\n已写入 src/data/monthlySnapshot.json 与 src/data/platform_entries.json');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
