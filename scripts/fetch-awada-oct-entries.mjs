#!/usr/bin/env node
/**
 * 拉取 Awada-优化词(668) 2026-10-26 的分平台词条明细。
 * 词条表只保留 mention_rate / top1_mention_rate，不写 position。
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const envPath = path.join(root, '.env');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
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
const DATE = '2026-10-26';
let cookie = '';

async function api(pathname, params = {}) {
  const url = new URL(pathname, API_BASE);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
  }
  const res = await fetch(url, { headers: { cookie } });
  const json = await res.json();
  if (!json.ok) throw new Error(`${pathname} ${json.error || res.status}`);
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
  return json.user;
}

const fmtRate = (v) => (v == null || v === '' ? '--' : `${Number(v).toFixed(1)}%`);
const fmtDate = (v) => {
  if (!v) return '--';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return String(v).slice(0, 10).replace(/-/g, '/');
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
};

const user = await login();
console.log(`已登录: ${user.name} (${user.company_name})`);

const platforms = (await api('/api/platforms', { project_id: PROJECT_ID })).data;
const platform_entries = {};
for (const pl of platforms) {
  const entries = await api('/api/entries', {
    project_id: PROJECT_ID,
    start_date: DATE,
    end_date: DATE,
    page: 1,
    page_size: 200,
    sort_by: 'mention_rate',
    sort_order: 'desc',
    platform_ids: pl.id,
  });
  const list = entries.data.list || [];
  platform_entries[String(pl.id)] = list.map((e) => ({
    entry_name: e.entry_name,
    mention_rate: fmtRate(e.mention_rate),
    top1_mention_rate: fmtRate(e.top1_mention_rate),
    last_conversation_time: fmtDate(e.last_conversation_time),
    last_screenshot_url: e.last_screenshot_url || null,
  }));
  const hit = list.filter((e) => Number(e.mention_rate) > 0).length;
  console.log(`平台 ${pl.id}(${pl.name}): ${list.length} 条，有提及 ${hit} 条`);
  if (list.some((e) => e.top1_mention_rate == null)) {
    throw new Error(`${pl.name} 有词条缺少 top1_mention_rate`);
  }
}

const out = { project_id: PROJECT_ID, date: DATE, platforms: platforms.map((p) => ({ id: p.id, name: p.name })), platform_entries };
writeFileSync(path.join(root, 'src/data/awada_oct_entries.json'), JSON.stringify(out, null, 2), 'utf8');
console.log('已写入 src/data/awada_oct_entries.json');
