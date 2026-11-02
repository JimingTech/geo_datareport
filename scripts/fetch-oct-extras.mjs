#!/usr/bin/env node
/**
 * 拉取 10 月补充数据：
 *   1. src/data/oct_sentiments.json  —— 情感占比与正负面标签
 *   2. src/data/platform_entries.json  —— 逐平台词条明细
 * 日期按产品分开：智能床 10/25、AI床垫 10/27、床垫 10/25。
 * 床垫的情感指标只统计「前十五」分组；词条明细页展示全部词条。
 * 分组口径不写入报告页面文案。
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const envPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.env');
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

const API_BASE = process.env.GEO_API_BASE || 'https://api.geotopone.com';
// 这三份项目在 jiming 账号下；根目录 .env 的 musi 账号没有 P181/P182/P239。
const USERNAME = 'jiming';
const PASSWORD = process.env.GEO_PASS;
if (!PASSWORD) {
  console.error('缺少 GEO_PASS。这三份项目在 jiming 账号下，不要依赖根目录 .env 里的 musi 密码。');
  process.exit(1);
}
const PROJECTS = [
  { id: 182, key: 'smart', name: '慕思智能床', date: '2026-10-25' },
  { id: 181, key: 'ai', name: '慕思AI床垫', date: '2026-10-27' },
  { id: 239, key: 'mattress', name: '慕思床垫', date: '2026-10-25', group: '前十五' },
];

let cookie = '';

async function api(pathname, params = {}) {
  const url = new URL(pathname, API_BASE);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
  }
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const res = await fetch(url, { headers: { cookie } });
      const json = await res.json();
      if (!json.ok) throw new Error(`${pathname} 请求失败: ${json.error || res.status}`);
      return json;
    } catch (err) {
      if (attempt === 3) throw err;
      await new Promise((r) => setTimeout(r, 800 * attempt));
    }
  }
}

async function login() {
  const res = await fetch(new URL('/login', API_BASE), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: USERNAME, password: PASSWORD }),
  });
  const json = await res.json();
  if (!json.ok) throw new Error(`登录失败: ${json.error}`);
  const raw = res.headers.getSetCookie?.() || [res.headers.get('set-cookie')].filter(Boolean);
  const pairs = raw
    .map((c) => c.split(';')[0])
    .filter((pair) => pair.split('=').slice(1).join('=').length > 0);
  cookie = pairs[pairs.length - 1] || '';
  if (!cookie) throw new Error('登录成功但未拿到有效会话');
  return json.user;
}

const tagText = (t) => (typeof t === 'string' ? t : t?.tag_name_zh || t?.tag_name || '');

const fmtRate = (v) => {
  if (v == null || v === '') return '--';
  const n = Number(v);
  return Number.isFinite(n) ? `${n.toFixed(1)}%` : String(v);
};

const fmtDate = (v) => {
  if (!v) return '--';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return String(v).slice(0, 10).replace(/-/g, '/');
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
};

const user = await login();
console.log(`已登录: ${user.name} (${user.company_name})`);

const only = process.env.ONLY;
const projects = only
  ? PROJECTS.filter((p) => p.key === only || String(p.id) === only)
  : PROJECTS;
if (!projects.length) throw new Error(`ONLY=${only} 没有对应项目`);

const sentiments = {};
const platformEntries = {};

for (const p of projects) {
  const range = { project_id: p.id, start_date: p.date, end_date: p.date };
  const detailRange = { ...range };

  if (p.group) {
    const groups = (await api('/api/entry-groups', { project_id: p.id })).data.groups || [];
    const group = groups.find((g) => g.name === p.group || g.name_zh === p.group);
    const all = (await api('/api/entries', { ...range, page: 1, page_size: 500 })).data.list || [];
    let members = group ? all.filter((e) => e.group_id === group.id) : [];
    if (!members.length) {
      const custom = (await api('/api/entry-custom-groups', { project_id: p.id })).data.groups || [];
      const hit = custom.find((g) => g.name === '10.25前15')
        || custom.find((g) => /10\.25/.test(g.name) && /前15|前十五/.test(g.name));
      if (!hit?.entry_ids?.length) throw new Error(`P${p.id} 未找到已更新的前15分组`);
      range.entry_ids = hit.entry_ids.join(',');
      console.log(`P${p.id} 指标分组 ${hit.name}（${hit.entry_ids.length} 条），明细展示全部 ${all.length} 条`);
    } else {
      range.entry_ids = members.map((e) => e.entry_id).join(',');
      console.log(`P${p.id} 指标分组 ${group.name}（${members.length} 条），明细展示全部 ${all.length} 条`);
    }
  }

  const sent = (await api('/api/sentiments/stats', range)).data;
  sentiments[p.key] = {
    project_id: p.id,
    name: p.name,
    date: p.date,
    group: p.group || null,
    positive_percentage: sent.positive_percentage,
    negative_percentage: sent.negative_percentage,
    positive_keywords: (sent.positive_keywords || []).map(tagText).filter(Boolean),
    negative_keywords: (sent.negative_keywords || []).map(tagText).filter(Boolean),
  };
  console.log(
    `P${p.id} ${p.name} 情感: 正面 ${sent.positive_percentage}% / 负面 ${sent.negative_percentage}%` +
      ` | 负面标签 ${sentiments[p.key].negative_keywords.join('、') || '无'}`
  );

  const platforms = (await api('/api/platforms', { project_id: p.id })).data;
  platformEntries[String(p.id)] = {};
  for (const pl of platforms) {
    const entries = await api('/api/entries', {
      ...detailRange,
      page: 1,
      page_size: 100,
      sort_by: 'mention_rate',
      sort_order: 'desc',
      platform_ids: pl.id,
    });
    platformEntries[String(p.id)][String(pl.id)] = (entries.data.list || []).map((e) => ({
      entry_name: e.entry_name,
      mention_rate: fmtRate(e.mention_rate),
      top1_mention_rate: fmtRate(e.top1_mention_rate),
      last_conversation_time: fmtDate(e.last_conversation_time),
      last_screenshot_url: e.last_screenshot_url || null,
    }));
    console.log(`  P${p.id} 平台 ${pl.id}(${pl.name}): ${platformEntries[String(p.id)][String(pl.id)].length} 条`);
  }
}

const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/data');
const sentimentPath = path.join(dir, 'oct_sentiments.json');
const entryPath = path.join(dir, 'platform_entries.json');
const sentimentsOut = only
  ? { ...JSON.parse(readFileSync(sentimentPath, 'utf-8')), ...sentiments }
  : sentiments;
const platformOut = only
  ? { ...JSON.parse(readFileSync(entryPath, 'utf-8')), ...platformEntries }
  : platformEntries;
writeFileSync(sentimentPath, JSON.stringify(sentimentsOut, null, 2), 'utf-8');
writeFileSync(entryPath, JSON.stringify(platformOut, null, 2), 'utf-8');
console.log('\n已写入 src/data/oct_sentiments.json 与 src/data/platform_entries.json');
