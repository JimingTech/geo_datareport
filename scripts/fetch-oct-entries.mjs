/**
 * 10 月词条 / 情感：劲酒、养生一号取 10/29，毛铺取 10/22。
 * 写入 src/data/oct_entries_sentiments.json 与 src/data/platform_entries.json
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

const API_BASE = process.env.GEO_API_BASE;
const USERNAME = process.env.GEO_USER;
const PASSWORD = process.env.GEO_PASS;
let cookie = '';

const ALL_PRODUCTS = [
  { id: 125, key: 'jinjiu', name: '劲酒', date: '2026-10-29' },
  { id: 126, key: 'maopu', name: '毛铺', date: '2026-10-22' },
  { id: 127, key: 'yangsheng', name: '养生一号', date: '2026-10-29' },
];
const onlyKey = process.argv.find((a) => a.startsWith('--only='))?.slice(7);
const PRODUCTS = onlyKey ? ALL_PRODUCTS.filter((p) => p.key === onlyKey || String(p.id) === onlyKey) : ALL_PRODUCTS;
if (!PRODUCTS.length) {
  console.error(`--only=${onlyKey} 未匹配到产品`);
  process.exit(1);
}

const num = (v) => (v === null || v === undefined || v === '' ? null : Number(v));

function fmtRate(v) {
  if (v == null || v === '') return '--';
  const n = Number(v);
  return Number.isFinite(n) ? `${n.toFixed(1)}%` : String(v);
}

async function api(pathname, params = {}) {
  const url = new URL(pathname, API_BASE);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
  }
  const res = await fetch(url, { headers: { cookie } });
  const json = await res.json();
  if (!json.ok) throw new Error(`${pathname} 失败: ${json.error || res.status}`);
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
}

function mapEntries(list) {
  return (list || []).map((e) => ({
    name: e.entry_name,
    mention_rate: num(e.mention_rate),
    top1_mention_rate: num(e.top1_mention_rate),
  }));
}

await login();
const sentimentsOut = {};
const platformOut = {};

for (const p of PRODUCTS) {
  const range = { project_id: p.id, start_date: p.date, end_date: p.date };
  const platforms = (await api('/api/platforms', { project_id: p.id })).data;
  console.log(`\n==== ${p.name} (${p.id}) @ ${p.date}`);

  const [sentiments, entriesAll, negAnswers] = await Promise.all([
    api('/api/sentiments/stats', range),
    api('/api/entries', { ...range, page: 1, page_size: 100, sort_by: 'mention_rate', sort_order: 'desc' }),
    api('/api/sentiments/negative-answers', { ...range, page: 1, page_size: 20 }).catch(() => ({ data: { list: [] } })),
  ]);

  const entries_by_platform = {};
  platformOut[String(p.id)] = {};
  for (const pl of platforms) {
    const entries = await api('/api/entries', {
      ...range,
      page: 1,
      page_size: 100,
      sort_by: 'mention_rate',
      sort_order: 'desc',
      platform_ids: String(pl.id),
    });
    const list = entries.data.list || [];
    entries_by_platform[pl.name] = mapEntries(list);
    platformOut[String(p.id)][String(pl.id)] = list.map((e) => ({
      entry_name: e.entry_name,
      mention_rate: fmtRate(e.mention_rate),
      top1_mention_rate: fmtRate(e.top1_mention_rate),
      last_screenshot_url: e.last_screenshot_url || null,
    }));
    console.log(`  ${pl.name}: ${list.length} 条`);
  }

  const s = sentiments.data || {};
  sentimentsOut[p.key] = {
    project_id: p.id,
    date: p.date,
    sentiments: {
      positive_rate: num(s.positive_percentage ?? s.positive_rate),
      positive_percentage: num(s.positive_percentage ?? s.positive_rate),
      negative_percentage: num(s.negative_percentage ?? s.negative_rate),
      positive_keywords: s.positive_keywords || s.positive_keyword_list || [],
      negative_keywords: s.negative_keywords || s.negative_keyword_list || [],
      daily_stats: s.daily_stats || [],
    },
    negative_answers: (negAnswers.data?.list || []).slice(0, 5).map((a) => ({
      entry: a.entry_name || a.keyword || a.query || '-',
      type: a.negative_type || a.type || '负面回答',
      summary: a.summary || a.content || a.answer_snippet || a.problem || '-',
    })),
    entries_all: mapEntries(entriesAll.data.list),
    entries_by_platform,
  };
}

const sentPath = path.join(root, 'src/data/oct_entries_sentiments.json');
const platPath = path.join(root, 'src/data/platform_entries.json');
mkdirSync(path.dirname(sentPath), { recursive: true });
const prevSent = existsSync(sentPath) ? JSON.parse(readFileSync(sentPath, 'utf8')) : {};
const prevPlat = existsSync(platPath) ? JSON.parse(readFileSync(platPath, 'utf8')) : {};
writeFileSync(sentPath, JSON.stringify({ ...prevSent, ...sentimentsOut }, null, 2), 'utf8');
writeFileSync(platPath, JSON.stringify({ ...prevPlat, ...platformOut }, null, 2), 'utf8');
console.log('\nwrote', sentPath);
console.log('wrote', platPath);
