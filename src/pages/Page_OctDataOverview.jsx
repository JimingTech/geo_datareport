import React from 'react';
import report from '../data/musiOctReport.json';

const { products, scope } = report;

function fmtPct(v) {
  return `${Number(v)}%`;
}

export default function Page_OctDataOverview() {
  const rows = [
    { key: 'smart', name: '慕思智能床' },
    { key: 'ai', name: '慕思AI床垫' },
    { key: 'mattress', name: '慕思床垫' },
  ];

  return (
    <div className="w-full h-full flex flex-col px-12 sm:px-16 pt-[22px] pb-8 text-zinc-800 font-sans justify-between overflow-hidden">
      <div className="flex items-center shrink-0 mb-[27px]">
        <div className="w-2 h-10 bg-[#004CE5] rounded-full shadow-[0_0_15px_rgba(0,76,229,0.25)]" />
        <h1 className="text-4xl font-black text-zinc-900 tracking-wider ml-4">
          核心数据总览 <span className="text-2xl font-bold text-zinc-400 ml-4">（2026年10月）</span>
        </h1>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-slate-50/40 py-3.5 px-6 shrink-0 mb-4">
        <p className="text-[1.35rem] leading-relaxed text-zinc-500 font-bold">
          本次监测周期覆盖 <span className="font-['Montserrat',sans-serif] text-[#004CE5] font-black">{scope.platforms}</span> 个核心AI平台，针对重点监测词条 <span className="font-['Montserrat',sans-serif] text-[#004CE5] font-black">{scope.entries}</span> 个进行查询，追踪相关问答数据共计 <span className="font-['Montserrat',sans-serif] text-[#004CE5] font-black">{scope.conversations.toLocaleString()}</span> 篇次。
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-300 bg-white shadow-[0_4px_30px_rgba(0,0,0,0.015)] overflow-hidden flex-1 min-h-0 flex flex-col mb-4">
        <table className="w-full text-left border-collapse table-fixed flex-1">
          <thead>
            <tr className="text-white">
              <th className="py-6 px-4 text-2xl font-black text-center w-[22%] bg-zinc-800 border-r border-white/10">产品</th>
              <th className="py-6 px-2 text-2xl font-black text-center border-l border-white/10 bg-[#004CE5]">提及率</th>
              <th className="py-6 px-2 text-2xl font-black text-center border-l border-white/10 bg-[#1A62E5]">Top1 提及率</th>
              <th className="py-6 px-2 text-2xl font-black text-center border-l border-white/10 bg-[#2A6CF0]">Top3 提及率</th>
              <th className="py-6 px-2 text-2xl font-black text-center border-l border-white/10 bg-[#2E75FF]">竞品排名</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const p = products[row.key].october;
              return (
                <tr key={row.key} className="border-b border-zinc-200 bg-white">
                  <td className="py-8 px-4 border-r border-zinc-200 bg-slate-50/10 text-center font-black text-2xl text-zinc-800">
                    {row.name}
                  </td>
                  <td className="py-8 px-2 text-center text-4xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">{fmtPct(p.mention_rate)}</td>
                  <td className="py-8 px-2 text-center text-4xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">{fmtPct(p.top1_mention_rate)}</td>
                  <td className="py-8 px-2 text-center text-4xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">{fmtPct(p.top3_mention_rate)}</td>
                  <td className="py-8 px-2 text-center text-4xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">NO.{p.influence_rank}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-6 shrink-0 h-[220px]">
        <div className="rounded-2xl border border-[#004CE5]/15 bg-[#004CE5]/[0.01] px-6 py-4 flex flex-col shadow-[0_4px_25px_rgba(0,76,229,0.005)]">
          <div className="flex items-center gap-2.5 mb-2 shrink-0">
            <span className="w-3 h-3 rounded-full bg-[#004CE5] shadow-[0_0_8px_rgba(0,76,229,0.3)]" />
            <h3 className="text-2xl font-black text-zinc-900 tracking-wider">现状总结</h3>
          </div>
          <div className="flex-1 flex items-center min-h-0">
            <p className="text-[21px] leading-snug text-zinc-700 font-bold">
              三款产品竞品排名都是NO.1。智能床提及率87.2%、Top3 69.4%，这两项第一，Top1 31.7%，低于舒福德的38.3%。AI床垫提及率90.6%、Top1 47.2%、Top3 80%，三项都是第一。普通床垫提及率83.3%，Top1 21.1%，与喜临门相同，排在第一。
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.01] px-6 py-4 flex flex-col shadow-[0_4px_25px_rgba(16,185,129,0.005)]">
          <div className="flex items-center gap-2.5 mb-2 shrink-0">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
            <h3 className="text-2xl font-black text-zinc-900 tracking-wider">重点优化策略</h3>
          </div>
          <div className="flex-1 flex items-center min-h-0">
            <p className="text-[21px] leading-snug text-zinc-700 font-bold">
              智能床把Top1做到舒福德之上，同时守住87.2%的提及率和69.4%的Top3。AI床垫守住47.2%的首推，继续领先喜临门。普通床垫守住83.3%的提及率和NO.1，Top1与喜临门同为21.1%，继续把首选拉开。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
