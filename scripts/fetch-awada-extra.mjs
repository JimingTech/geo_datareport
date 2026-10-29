#!/usr/bin/env node
/**
 * 采集 Awada-优化词(668) 报告补充数据：情感、分平台词条、竞品进榜明细。
 * 优化前 = 2026-09-03，9 月 = 2026-09-21。
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const envPath = path.join(root, '.env');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    const key = t.slice(0, i).trim();
    const val = t.slice(i + 1).trim().replace(/^['"]|['"]$/g, '');
    if (key && val && !process.env[key]) process.env[key] = val;
  }
}

const API_BASE = process.env.GEO_API_BASE;
const PROJECT_ID = 668;
const MONITOR_ID = 670;
const BEFORE_DATE = '2026-09-03';
const SEPT_DATE = '2026-09-21';

let cookie = '';

async function api(pathname, params = {}) {
  const url = new URL(pathname, API_BASE);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
  }
  const res = await fetch(url, { headers: { cookie } });
  const json = await res.json();
  if (!json.ok) throw new Error(`${pathname} ${JSON.stringify(json).slice(0, 300)}`);
  return json;
}

async function login() {
  const res = await fetch(new URL('/login', API_BASE), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: process.env.GEO_USER, password: process.env.GEO_PASS }),
  });
  const json = await res.json();
  if (!json.ok) throw new Error(`登录失败: ${json.error}`);
  cookie = (res.headers.getSetCookie?.() || [res.headers.get('set-cookie')])
    .filter(Boolean)
    .map((c) => c.split(';')[0])
    .filter((c) => c.includes('=') && c.split('=').slice(1).join('='))
    .join('; ');
}

const fmtRate = (v) => (v == null || v === '' ? '--' : `${Number(v).toFixed(1)}%`);
const fmtDate = (v) => {
  if (!v) return '--';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return String(v).slice(0, 10).replace(/-/g, '/');
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
};

await login();

const out = { project_id: PROJECT_ID, before_date: BEFORE_DATE, september_date: SEPT_DATE };

for (const [key, date] of [['before', BEFORE_DATE], ['september', SEPT_DATE]]) {
  const range = { project_id: PROJECT_ID, start_date: date, end_date: date };

  let sentiments = null;
  try {
    sentiments = (await api('/api/sentiments/stats', range)).data;
  } catch (e) {
    console.warn(`sentiments ${date} 不可用: ${e.message}`);
  }

  let top1 = null;
  try {
    top1 = (await api('/api/competitors/top-mention-rate', { ...range, top_type: 'top1', page_size: 100 })).data;
  } catch (e) {
    console.warn(`top1 ${date} 不可用: ${e.message}`);
  }

  let mentionFull = null;
  try {
    mentionFull = (await api('/api/competitors/mention-rate', { ...range, page: 1, page_size: 200 })).data;
  } catch (e) {
    console.warn(`mention-rate ${date} 不可用: ${e.message}`);
  }

  let entryBrand = null;
  try {
    entryBrand = (await api('/api/competitors/compare', range)).data;
  } catch (e) {
    console.warn(`compare ${date} 不可用: ${e.message}`);
  }

  const brands = mentionFull?.list || [];
  const brandCount = new Set(brands.map((b) => b.brand_name).filter(Boolean)).size;
  const productCount = brands.length;
  const selfMention = brands.find((b) => b.is_target || b.is_self);

  out[key] = {
    date,
    sentiments,
    top1_list: (top1?.list || []).map((b) => ({
      rank: b.rank,
      name: b.display_name || b.brand_name,
      rate: b.selected_top_mention_rate == null ? null : Number(b.selected_top_mention_rate),
      is_target: !!(b.is_self ?? b.is_target),
    })),
    brand_count: brandCount,
    product_count: productCount,
    self_mention_rank: selfMention?.rank ?? null,
    mention_top: brands.slice(0, 15).map((b) => ({
      rank: b.rank,
      name: b.display_name || b.product_name || b.brand_name,
      brand: b.brand_name,
      rate: Number(b.mention_rate),
      is_target: !!(b.is_target || b.is_self),
    })),
    entry_brand_details: entryBrand?.entry_brand_details || entryBrand?.entry_details || null,
    compare_keys: entryBrand ? Object.keys(entryBrand) : [],
  };
  const selfTop1 = out[key].top1_list.find((b) => b.is_target);
  console.log(`${key} (${date}) 情感=${sentiments ? 'ok' : '-'} top1条数=${out[key].top1_list.length} 本品Top1名次=${selfTop1?.rank ?? '-'} 品牌数=${brandCount} 产品数=${productCount}`);
}

const platforms = (await api('/api/platforms', { project_id: PROJECT_ID })).data;
out.platforms = platforms.map((p) => ({ id: p.id, name: p.name, url: p.url || null }));
out.platform_entries = {};
for (const pl of platforms) {
  const entries = await api('/api/entries', {
    project_id: PROJECT_ID,
    start_date: SEPT_DATE,
    end_date: SEPT_DATE,
    page: 1,
    page_size: 200,
    sort_by: 'mention_rate',
    sort_order: 'desc',
    platform_ids: pl.id,
  });
  out.platform_entries[String(pl.id)] = (entries.data.list || []).map((e) => ({
    entry_name: e.entry_name,
    mention_rate: fmtRate(e.mention_rate),
    top1_mention_rate: fmtRate(e.top1_mention_rate),
    last_conversation_time: fmtDate(e.last_conversation_time),
    last_screenshot_url: e.last_screenshot_url || null,
  }));
  console.log(`platform ${pl.id}(${pl.name}): ${out.platform_entries[String(pl.id)].length} 条`);
}

// 监测词（仅 9/10 有数据）
try {
  const mon = await api('/api/sentiments/stats', {
    project_id: MONITOR_ID,
    start_date: '2026-09-10',
    end_date: '2026-09-10',
  });
  out.monitor = { date: '2026-09-10', sentiments: mon.data };
  console.log('监测词情感', mon.data?.positive_percentage, mon.data?.negative_percentage);
} catch (e) {
  console.warn('监测词情感不可用', e.message);
}

// 探测更多接口，找词条竞品明细
const probes = [
  '/api/competitors/entry-details',
  '/api/entries/brand-details',
  '/api/competitors/entry-brand-details',
  '/api/conversations/entry-brands',
];
out.probe = {};
for (const p of probes) {
  try {
    const r = await api(p, { project_id: PROJECT_ID, start_date: SEPT_DATE, end_date: SEPT_DATE });
    out.probe[p] = { ok: true, keys: Object.keys(r.data || {}), sample: JSON.stringify(r.data).slice(0, 200) };
    console.log('probe', p, 'ok', Object.keys(r.data || {}));
  } catch (e) {
    out.probe[p] = { ok: false, error: e.message.slice(0, 120) };
  }
}

writeFileSync(path.join(root, 'src/data/awada_extra.json'), JSON.stringify(out, null, 2), 'utf-8');
console.log('已写入 src/data/awada_extra.json');
