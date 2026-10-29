import React from 'react';
import report from '../data/jingdongReport.json';

const { scope, before, october } = report;

function fmtPct(v) {
  return `${Number(v)}%`;
}

const BEFORE_LABEL = '优化前';
const OCT_LABEL = '10月31日';

const uncovered = scope.entries - october.covered_entries;

export default function Page_CoreDataOverview() {
  const rows = [{ key: 'all', name: '京东口腔①', before, october }];

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
          本次监测覆盖 <span className="font-['Montserrat',sans-serif] text-[#004CE5] font-black">{scope.platforms}</span> 个核心 AI 平台，针对重点监测词条 <span className="font-['Montserrat',sans-serif] text-[#004CE5] font-black">{scope.entries}</span> 个进行查询，追踪相关问答数据共计 <span className="font-['Montserrat',sans-serif] text-[#004CE5] font-black">{scope.conversations.toLocaleString()}</span> 篇次。下表对比优化前（10月9日）与 10月31日。
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
              1. 提及率由 42.1% 升至 73.7%，综合竞品排名由 NO.2 升至 NO.1。
            </p>
            <div className="h-px bg-[#004CE5]/10" />
            <p className="text-[22px] leading-relaxed text-zinc-800 font-bold">
              2. DeepSeek 由 11.8% 升至 88.2%；豆包由 72.4% 降至 59.2%，两端还没拉齐。
            </p>
            <div className="h-px bg-[#004CE5]/10" />
            <p className="text-[22px] leading-relaxed text-zinc-800 font-bold">
              3. {scope.entries} 个监测词条已覆盖 {october.covered_entries} 个。Top1 提及率由 11.8% 升至 48.7%，Top3 提及率由 29.6% 升至 60.5%。
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
              { num: '01', title: '稳住 DeepSeek', desc: 'DeepSeek 已到 88.2%。沿用知乎、抖音上已经起量的内容结构，把单日提及率守在 70% 以上。' },
              { num: '02', title: '拉回豆包', desc: '豆包由 72.4% 降到 59.2%。把预约、自营门店类语料补到豆包，缩小和 DeepSeek 的差距。' },
              { num: '03', title: '补齐剩余词条', desc: `还剩 ${uncovered} 个词条未覆盖，优先补自营牙科、电商口腔服务、专家预约和补牙医生。` },
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
