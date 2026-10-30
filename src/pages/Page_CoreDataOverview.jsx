import React from 'react';
import report from '../data/jingdongReport.json';

const { meta, scope, before, october } = report;

function fmtPct(v) {
  return `${Number(v)}%`;
}

function cnDay(iso) {
  const [, month, day] = iso.split('-');
  return `${Number(month)}月${Number(day)}日`;
}

function platRate(snap, name) {
  return snap.platforms.find((p) => p.name === name)?.mention_rate;
}

function trend(from, to, upWord = '升至', downWord = '降至') {
  return Number(to) >= Number(from) ? upWord : downWord;
}

const BEFORE_LABEL = '优化前';
const OCT_LABEL = '10月31日';
const beforeDay = cnDay(meta.before_date);
const uncovered = scope.entries - october.covered_entries;
const dsBefore = platRate(before, 'DeepSeek');
const dsAfter = platRate(october, 'DeepSeek');
const dbBefore = platRate(before, '豆包');
const dbAfter = platRate(october, '豆包');

export default function Page_CoreDataOverview() {
  const rows = [{ key: 'all', name: meta.product, before, october }];

  return (
    <div className="w-full h-full flex flex-col px-12 sm:px-16 pt-[22px] pb-8 text-zinc-800 font-sans overflow-hidden">
      <div className="flex items-center shrink-0 mb-[27px]">
        <div className="w-2 h-10 bg-[#004CE5] rounded-full shadow-[0_0_15px_rgba(0,76,229,0.25)]" />
        <h1 className="text-4xl font-black text-zinc-900 tracking-wider ml-4">
          核心数据总览 <span className="text-2xl font-bold text-zinc-400 ml-4">（2026年10月）</span>
        </h1>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-slate-50/40 py-3.5 px-6 shrink-0 mb-4">
        <p className="text-[1.35rem] leading-relaxed text-zinc-500 font-bold">
          本次监测覆盖 <span className="font-['Montserrat',sans-serif] text-[#004CE5] font-black">{scope.platforms}</span> 个核心 AI 平台，针对重点监测词条 <span className="font-['Montserrat',sans-serif] text-[#004CE5] font-black">{scope.entries}</span> 个进行查询，追踪相关问答数据共计 <span className="font-['Montserrat',sans-serif] text-[#004CE5] font-black">{scope.conversations.toLocaleString()}</span> 篇次。下表对比优化前（{beforeDay}）与 10月31日。项目自 9月23日启动。
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-300 bg-white shadow-[0_4px_30px_rgba(0,0,0,0.015)] overflow-hidden shrink-0 flex flex-col mb-[30px]">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="text-white">
              <th rowSpan={2} className="py-5 px-4 text-2xl font-black text-center w-[14%] bg-zinc-800 border-r border-white/10">产品</th>
              <th colSpan={2} className="py-4 px-2 text-2xl font-black text-center border-l border-white/10 bg-[#004CE5]">提及率</th>
              <th colSpan={2} className="py-4 px-2 text-2xl font-black text-center border-l border-white/10 bg-[#1A62E5]">Top1 提及率</th>
              <th colSpan={2} className="py-4 px-2 text-2xl font-black text-center border-l border-white/10 bg-[#2A6CF0]">Top3 提及率</th>
              <th colSpan={2} className="py-4 px-2 text-2xl font-black text-center border-l border-white/10 bg-[#2E75FF]">综合竞品排名</th>
            </tr>
            <tr className="bg-slate-50/80 border-b border-zinc-200 text-[#004CE5] font-black text-lg">
              {[0, 1, 2, 3].map((i) => (
                <React.Fragment key={i}>
                  <th className="py-2.5 px-1 text-center border-l border-zinc-200 w-[10.75%] whitespace-nowrap">{BEFORE_LABEL}</th>
                  <th className="py-2.5 px-1 text-center border-l border-zinc-200 border-r-2 border-[#004CE5]/15 w-[10.75%] whitespace-nowrap">{OCT_LABEL}</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-b border-zinc-200 bg-white hover:bg-slate-50/20 transition-colors">
                <td className="py-[60px] px-4 border-r border-zinc-200 bg-slate-50/10 text-center font-black text-3xl text-zinc-800 whitespace-nowrap">
                  {row.name}
                </td>
                <td className="py-[60px] px-2 text-center border-r border-zinc-200 text-5xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">{fmtPct(row.before.mention_rate)}</td>
                <td className="py-[60px] px-2 text-center border-r-2 border-[#004CE5]/15 text-5xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">{fmtPct(row.october.mention_rate)}</td>
                <td className="py-[60px] px-2 text-center border-r border-zinc-200 text-5xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">{fmtPct(row.before.top1_mention_rate)}</td>
                <td className="py-[60px] px-2 text-center border-r-2 border-[#004CE5]/15 text-5xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">{fmtPct(row.october.top1_mention_rate)}</td>
                <td className="py-[60px] px-2 text-center border-r border-zinc-200 text-5xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">{fmtPct(row.before.top3_mention_rate)}</td>
                <td className="py-[60px] px-2 text-center border-r-2 border-[#004CE5]/15 text-5xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">{fmtPct(row.october.top3_mention_rate)}</td>
                <td className="py-[60px] px-2 text-center border-r border-zinc-200 text-5xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">NO. {row.before.influence_rank}</td>
                <td className="py-[60px] px-2 text-center border-r-2 border-[#004CE5]/15 text-5xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">NO. {row.october.influence_rank}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
        <div className="rounded-2xl border border-[#004CE5]/15 bg-[#004CE5]/[0.01] px-6 py-5 flex flex-col shadow-[0_4px_25px_rgba(0,76,229,0.005)]">
          <div className="flex items-center gap-2.5 mb-3 shrink-0">
            <span className="w-3 h-3 rounded-full bg-[#004CE5] shadow-[0_0_8px_rgba(0,76,229,0.3)] animate-pulse" />
            <h3 className="text-2xl font-black text-zinc-900 tracking-wider">现状总结</h3>
          </div>
          <div className="flex-1 flex flex-col justify-evenly min-h-0">
            <p className="text-[22px] leading-relaxed text-zinc-800 font-bold">
              1. 提及率由 {fmtPct(before.mention_rate)} {trend(before.mention_rate, october.mention_rate)} {fmtPct(october.mention_rate)}，综合竞品排名由 NO.{before.influence_rank} {trend(october.influence_rank, before.influence_rank)} NO.{october.influence_rank}。
            </p>
            <div className="h-px bg-[#004CE5]/10" />
            <p className="text-[22px] leading-relaxed text-zinc-800 font-bold">
              2. DeepSeek 由 {fmtPct(dsBefore)} {trend(dsBefore, dsAfter)} {fmtPct(dsAfter)}；豆包由 {fmtPct(dbBefore)} {trend(dbBefore, dbAfter)} {fmtPct(dbAfter)}。10月31日的监测落在这两个平台。
            </p>
            <div className="h-px bg-[#004CE5]/10" />
            <p className="text-[22px] leading-relaxed text-zinc-800 font-bold">
              3. {scope.entries} 个监测词条已覆盖 {october.covered_entries} 个。Top1 提及率由 {fmtPct(before.top1_mention_rate)} {trend(before.top1_mention_rate, october.top1_mention_rate)} {fmtPct(october.top1_mention_rate)}，Top3 提及率由 {fmtPct(before.top3_mention_rate)} {trend(before.top3_mention_rate, october.top3_mention_rate)} {fmtPct(october.top3_mention_rate)}。
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.01] px-6 py-5 flex flex-col shadow-[0_4px_25px_rgba(16,185,129,0.005)]">
          <div className="flex items-center gap-2.5 mb-3 shrink-0">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)] animate-pulse" />
            <h3 className="text-2xl font-black text-zinc-900 tracking-wider">重点优化策略</h3>
          </div>
          <div className="flex-1 flex flex-col justify-evenly min-h-0">
            {[
              { num: '01', title: '补齐 DeepSeek', desc: `豆包已到 ${fmtPct(dbAfter)}，DeepSeek 还在 ${fmtPct(dsAfter)}。把隐私包装、当天送达、货源靠谱这些豆包已经打透的问法补到 DeepSeek。` },
              { num: '02', title: '收回首推', desc: '10月31日京东自营 Top1 提及率 48.6%，本品 15.5%。同一问法里把首推口径固定到京东大健康，不要落在「京东自营」。' },
              { num: '03', title: '补齐剩余词条', desc: `还剩 ${uncovered} 个词条未覆盖，集中在正品辨别和售后处理。` },
            ].map((strat) => (
              <div key={strat.num} className="flex items-start gap-3">
                <span className="text-emerald-600 font-black text-2xl shrink-0 mt-0.5 font-['Montserrat',sans-serif]">{strat.num}</span>
                <p className="text-[22px] leading-relaxed text-zinc-800 font-bold flex-grow min-h-0">
                  <span className="text-zinc-900 font-black">{strat.title}：</span>
                  {strat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
