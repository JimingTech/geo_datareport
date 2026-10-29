import React from 'react';
import report from '../data/jinjiuOctoberReport.json';

const { products, scope } = report;

function fmtPct(v) {
  return `${Number(v)}%`;
}

export default function Page_CoreDataOverview() {
  const rows = [
    { key: 'jinjiu', name: '劲酒' },
    { key: 'maopu', name: '毛铺' },
    { key: 'yangsheng', name: '养生一号' },
  ];

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
          本次监测覆盖 <span className="font-['Montserrat',sans-serif] text-[#004CE5] font-black">{scope.platforms}</span> 个核心AI平台，针对重点监测词条 <span className="font-['Montserrat',sans-serif] text-[#004CE5] font-black">{scope.entries}</span> 个进行查询，追踪相关问答数据共计 <span className="font-['Montserrat',sans-serif] text-[#004CE5] font-black">{scope.conversations.toLocaleString()}</span> 篇次，整体项目持续推进。
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-300 bg-white shadow-[0_4px_30px_rgba(0,0,0,0.015)] overflow-hidden flex-1 min-h-0 flex flex-col mb-3">
        <table className="w-full h-full text-left border-collapse table-fixed">
          <thead>
            <tr className="text-white">
              <th rowSpan={2} className="py-3 px-6 text-2xl font-black text-center w-[16%] bg-zinc-800 border-r border-white/10">产品</th>
              <th colSpan={2} className="py-2.5 px-4 text-2xl font-black text-center border-l border-white/10 bg-[#004CE5]">提及率</th>
              <th colSpan={2} className="py-2.5 px-4 text-2xl font-black text-center border-l border-white/10 bg-[#1A62E5]">TOP1提及率</th>
              <th colSpan={2} className="py-2.5 px-4 text-2xl font-black text-center border-l border-white/10 bg-[#2E75FF]">TOP3提及率</th>
              <th colSpan={2} className="py-2.5 px-4 text-2xl font-black text-center border-l border-white/10 bg-[#4788FF]">综合竞品排名</th>
            </tr>
            <tr className="bg-slate-50/80 border-b border-zinc-200 text-[#004CE5] font-black text-2xl">
              <th className="py-2 px-2 text-center border-l border-zinc-200 w-[10.5%]">9月</th>
              <th className="py-2 px-2 text-center border-l border-zinc-200 border-r-2 border-[#004CE5]/15 w-[10.5%]">10月</th>
              <th className="py-2 px-2 text-center border-l border-zinc-200 w-[10.5%]">9月</th>
              <th className="py-2 px-2 text-center border-l border-zinc-200 border-r-2 border-[#004CE5]/15 w-[10.5%]">10月</th>
              <th className="py-2 px-2 text-center border-l border-zinc-200 w-[10.5%]">9月</th>
              <th className="py-2 px-2 text-center border-l border-zinc-200 border-r-2 border-[#004CE5]/15 w-[10.5%]">10月</th>
              <th className="py-2 px-2 text-center border-l border-zinc-200 w-[10.5%]">9月</th>
              <th className="py-2 px-2 text-center border-l border-zinc-200 border-r-2 border-[#004CE5]/15 w-[10.5%]">10月</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const p = products[row.key];
              return (
                <tr key={row.key} className="border-b border-zinc-200 bg-white hover:bg-slate-50/20 transition-colors">
                  <td className="py-3 px-6 border-r border-zinc-200 bg-slate-50/10 text-center font-black text-2xl text-zinc-800">
                    {row.name}
                  </td>
                  <td className="py-3 px-2 text-center border-r border-zinc-200 text-[2rem] font-bold text-zinc-900 font-['Montserrat',sans-serif]">{fmtPct(p.september.mention_rate)}</td>
                  <td className="py-3 px-2 text-center border-r-2 border-[#004CE5]/15 text-[2rem] font-bold text-zinc-900 font-['Montserrat',sans-serif]">{fmtPct(p.october.mention_rate)}</td>
                  <td className="py-3 px-2 text-center border-r border-zinc-200 text-[2rem] font-bold text-zinc-900 font-['Montserrat',sans-serif]">{fmtPct(p.september.top1_mention_rate)}</td>
                  <td className="py-3 px-2 text-center border-r-2 border-[#004CE5]/15 text-[2rem] font-bold text-zinc-900 font-['Montserrat',sans-serif]">{fmtPct(p.october.top1_mention_rate)}</td>
                  <td className="py-3 px-2 text-center border-r border-zinc-200 text-[2rem] font-bold text-zinc-900 font-['Montserrat',sans-serif]">{fmtPct(p.september.top3_mention_rate)}</td>
                  <td className="py-3 px-2 text-center border-r-2 border-[#004CE5]/15 text-[2rem] font-bold text-zinc-900 font-['Montserrat',sans-serif]">{fmtPct(p.october.top3_mention_rate)}</td>
                  <td className="py-3 px-2 text-center border-r border-zinc-200 text-[2rem] font-bold text-zinc-900 font-['Montserrat',sans-serif]">NO. {p.september.influence_rank}</td>
                  <td className="py-3 px-2 text-center border-r-2 border-[#004CE5]/15 text-[2rem] font-bold text-zinc-900 font-['Montserrat',sans-serif]">NO. {p.october.influence_rank}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl border border-[#004CE5]/15 bg-[#004CE5]/[0.01] px-6 py-3.5 shrink-0 mb-3 flex flex-col shadow-[0_4px_25px_rgba(0,76,229,0.005)]">
        <div className="flex items-center gap-2.5 mb-1.5 shrink-0">
          <span className="w-3 h-3 rounded-full bg-[#004CE5] shadow-[0_0_8px_rgba(0,76,229,0.3)] animate-pulse" />
          <h3 className="text-2xl font-black text-zinc-900 tracking-wider">数据说明</h3>
        </div>
        <p className="text-[22px] leading-snug text-zinc-700 font-bold">
          <span className="text-zinc-900 font-black">高位波动属正常现象：</span>
          劲酒、毛铺仍在高位区间，月度小幅回落不代表 GEO 效果下降。养生一号提及率、Top1回落更明显，但综合竞品排名仍稳居NO.1。
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 shrink-0">
        <div className="rounded-2xl border border-[#004CE5]/15 bg-[#004CE5]/[0.01] px-6 py-3.5 flex flex-col shadow-[0_4px_25px_rgba(0,76,229,0.005)]">
          <div className="flex items-center gap-2.5 mb-1.5 shrink-0">
            <span className="w-3 h-3 rounded-full bg-[#004CE5] shadow-[0_0_8px_rgba(0,76,229,0.3)] animate-pulse" />
            <h3 className="text-2xl font-black text-zinc-900 tracking-wider">现状总结</h3>
          </div>
          <div className="flex-1 flex items-center min-h-0">
            <p className="text-[22px] leading-snug text-zinc-700 font-bold">
              相较9月，劲酒提及率91.3%、Top1 80%，综合排名稳居NO.1；毛铺提及率61.9%、Top1 45.2%，综合排名稳居NO.1；养生一号提及率48.8%、Top1 38.1%，综合排名稳居NO.1。
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
              劲酒守住NO.1与91.3%的提及率，把80%的Top1继续压住椰岛；毛铺守住NO.1，补齐DeepSeek端33.3%的短板；养生一号守住NO.1和38.1%的Top1，针对广誉远52.4%的提及率补齐高端送礼内容。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
