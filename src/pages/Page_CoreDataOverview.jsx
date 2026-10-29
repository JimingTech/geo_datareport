import React from 'react';
import report from '../data/taoliSeptemberReport.json';

const { products, scope, meta } = report;

function fmtPct(v) {
  return `${Number(v).toFixed(1)}%`;
}

const ROWS = [
  { key: 'toc', name: '桃李面包 ToC' },
  { key: 'tob', name: '桃李面包 ToB' },
];

export default function Page_CoreDataOverview() {
  return (
    <div className="w-full h-full flex flex-col px-12 sm:px-16 pt-[22px] pb-8 text-zinc-800 font-sans justify-between overflow-hidden">
      <div className="flex items-center shrink-0 mb-[27px]">
        <div className="w-2 h-10 bg-[#004CE5] rounded-full shadow-[0_0_15px_rgba(0,76,229,0.25)]" />
        <h1 className="text-4xl font-black text-zinc-900 tracking-wider ml-4">
          核心数据总览 <span className="text-2xl font-bold text-zinc-400 ml-4">（{meta.label}）</span>
        </h1>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-slate-50/40 py-3.5 px-6 shrink-0 mb-4">
        <p className="text-[1.35rem] leading-relaxed text-zinc-500 font-bold">
          本次监测周期共计 <span className="font-['Montserrat',sans-serif] text-[#004CE5] font-black">{scope.calendar_days}</span> 天，覆盖 <span className="font-['Montserrat',sans-serif] text-[#004CE5] font-black">{scope.platforms}</span> 个核心AI平台，针对 <span className="font-['Montserrat',sans-serif] text-[#004CE5] font-black">{scope.entries}</span> 个重点监测词条进行累计查询 <span className="font-['Montserrat',sans-serif] text-[#004CE5] font-black">{scope.conversations.toLocaleString()}</span> 次，追踪引用文章共计 <span className="font-['Montserrat',sans-serif] text-[#004CE5] font-black">{scope.articles.toLocaleString()}</span> 篇、累计引用 <span className="font-['Montserrat',sans-serif] text-[#004CE5] font-black">{scope.citations.toLocaleString()}</span> 次。
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-300 bg-white shadow-[0_4px_30px_rgba(0,0,0,0.015)] overflow-hidden flex-1 min-h-0 flex flex-col mb-3">
        <table className="w-full text-left border-collapse table-fixed flex-1">
          <thead>
            <tr className="text-white">
              <th rowSpan={2} className="py-4 px-6 text-2xl font-black text-center w-[18%] bg-zinc-800 border-r border-white/10">产品</th>
              <th colSpan={2} className="py-3 px-4 text-2xl font-black text-center border-l border-white/10 bg-[#004CE5]">提及率</th>
              <th colSpan={2} className="py-3 px-4 text-2xl font-black text-center border-l border-white/10 bg-[#1459E8]">Top1提及率</th>
              <th colSpan={2} className="py-3 px-4 text-2xl font-black text-center border-l border-white/10 bg-[#2366F4]">Top3提及率</th>
              <th colSpan={2} className="py-3 px-4 text-2xl font-black text-center border-l border-white/10 bg-[#2E75FF]">综合竞品排名</th>
            </tr>
            <tr className="bg-slate-50/80 border-b border-zinc-200 text-[#004CE5] font-black text-2xl">
              <th className="py-2 px-2 text-center border-l border-zinc-200 w-[10.25%]">{meta.before_label}</th>
              <th className="py-2 px-2 text-center border-l border-zinc-200 border-r-2 border-[#004CE5]/15 w-[10.25%]">{meta.september_label}</th>
              <th className="py-2 px-2 text-center border-l border-zinc-200 w-[10.25%]">{meta.before_label}</th>
              <th className="py-2 px-2 text-center border-l border-zinc-200 border-r-2 border-[#004CE5]/15 w-[10.25%]">{meta.september_label}</th>
              <th className="py-2 px-2 text-center border-l border-zinc-200 w-[10.25%]">{meta.before_label}</th>
              <th className="py-2 px-2 text-center border-l border-zinc-200 border-r-2 border-[#004CE5]/15 w-[10.25%]">{meta.september_label}</th>
              <th className="py-2 px-2 text-center border-l border-zinc-200 w-[10.25%]">{meta.before_label}</th>
              <th className="py-2 px-2 text-center border-l border-zinc-200 w-[10.25%]">{meta.september_label}</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => {
              const p = products[row.key];
              return (
                <tr key={row.key} className="border-b border-zinc-200 bg-white hover:bg-slate-50/20 transition-colors">
                  <td className="py-1.5 px-6 border-r border-zinc-200 bg-slate-50/10 text-center font-black text-2xl text-zinc-800">
                    {row.name}
                  </td>
                  <td className="py-1.5 px-2 text-center border-r border-zinc-200 text-4xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">{fmtPct(p.before.mention_rate)}</td>
                  <td className="py-1.5 px-2 text-center border-r-2 border-[#004CE5]/15 text-4xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">{fmtPct(p.september.mention_rate)}</td>
                  <td className="py-1.5 px-2 text-center border-r border-zinc-200 text-4xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">{fmtPct(p.before.top1_mention_rate)}</td>
                  <td className="py-1.5 px-2 text-center border-r-2 border-[#004CE5]/15 text-4xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">{fmtPct(p.september.top1_mention_rate)}</td>
                  <td className="py-1.5 px-2 text-center border-r border-zinc-200 text-4xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">{fmtPct(p.before.top3_mention_rate)}</td>
                  <td className="py-1.5 px-2 text-center border-r-2 border-[#004CE5]/15 text-4xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">{fmtPct(p.september.top3_mention_rate)}</td>
                  <td className="py-1.5 px-2 text-center border-r border-zinc-200 text-4xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">NO. {p.before.influence_rank}</td>
                  <td className="py-1.5 px-2 text-center border-r-2 border-[#004CE5]/15 text-4xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">NO. {p.september.influence_rank}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-6 shrink-0 h-[168px]">
        <div className="rounded-2xl border border-[#004CE5]/15 bg-[#004CE5]/[0.01] px-6 py-3.5 flex flex-col shadow-[0_4px_25px_rgba(0,76,229,0.005)]">
          <div className="flex items-center gap-2.5 mb-1.5 shrink-0">
            <span className="w-3 h-3 rounded-full bg-[#004CE5] shadow-[0_0_8px_rgba(0,76,229,0.3)] animate-pulse" />
            <h3 className="text-2xl font-black text-zinc-900 tracking-wider">现状总结</h3>
          </div>
          <div className="flex-1 flex items-center min-h-0">
            <p className="text-[22px] leading-snug text-zinc-700 font-bold">
              相较9月，ToC 提及率由 72.2% 升至 82.8%，综合竞品排名稳守 NO.1，Top1 由 42.2% 升至 51.1%；ToB 提及率由 88.3% 升至 93.9%，综合竞品排名稳居 NO.1，Top1 由 73.9% 升至 82.2%。
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.01] px-6 py-3.5 flex flex-col shadow-[0_4px_25px_rgba(16,185,129,0.005)]">
          <div className="flex items-center gap-2.5 mb-1.5 shrink-0">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)] animate-pulse" />
            <h3 className="text-2xl font-black text-zinc-900 tracking-wider">重点优化策略</h3>
          </div>
          <div className="flex-1 flex items-center min-h-0">
            <p className="text-[22px] leading-snug text-zinc-700 font-bold">
              ToC 守住 51.1% 的首推，继续拦截豪士在早餐/早八场景的分流；ToB 守住 93.9% 的提及广度、82.2% 的首推与 NO.1，继续压住曼可顿、宾堡。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
