import React from 'react';
import report from '../data/chuangweiOctoberReport.json';

const { scope, products } = report;

function fmtPct(v) {
  return `${Number(v)}%`;
}

const BEFORE_LABEL = report.meta.before_label;
const SEPT_LABEL = report.meta.september_label;

const ROWS = [
  { key: 'all', name: '创维电视（全部词条）' },
  { key: 'ex_form', name: '创维电视（除壁纸、超薄以外）' },
  { key: 'big', name: '创维电视（大词）' },
];

export default function Page_CoreDataOverview() {
  return (
    <div className="w-full h-full flex flex-col px-12 sm:px-16 pt-[22px] pb-8 text-zinc-800 font-sans overflow-hidden">
      <div className="flex items-center shrink-0 mb-[27px]">
        <div className="w-2 h-10 bg-[#004CE5] rounded-full shadow-[0_0_15px_rgba(0,76,229,0.25)]" />
        <h1 className="text-4xl font-black text-zinc-900 tracking-wider ml-4">
          核心数据总览 <span className="text-2xl font-bold text-zinc-400 ml-4">（{report.meta.label}）</span>
        </h1>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-slate-50/40 py-3.5 px-6 shrink-0 mb-4">
        <p className="text-[1.35rem] leading-relaxed text-zinc-500 font-bold">
          本次监测周期覆盖 <span className="font-['Montserrat',sans-serif] text-[#004CE5] font-black">{scope.platforms}</span> 个核心AI平台，针对重点监测词条 <span className="font-['Montserrat',sans-serif] text-[#004CE5] font-black">{scope.entries}</span> 个进行查询，追踪相关问答数据共计 <span className="font-['Montserrat',sans-serif] text-[#004CE5] font-black">{scope.conversations.toLocaleString()}</span> 篇次，整体项目持续推进。
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-300 bg-white shadow-[0_4px_30px_rgba(0,0,0,0.015)] overflow-hidden flex-1 min-h-0 flex flex-col mb-4">
        <table className="w-full h-full text-left border-collapse table-fixed">
          <thead>
            <tr className="text-white">
              <th rowSpan={2} className="py-4 px-3 text-2xl font-black text-center w-[22%] bg-zinc-800 border-r border-white/10">产品</th>
              <th colSpan={2} className="py-3 px-2 text-2xl font-black text-center border-l border-white/10 bg-[#004CE5]">提及率</th>
              <th colSpan={2} className="py-3 px-2 text-2xl font-black text-center border-l border-white/10 bg-[#1A62E5]">Top1 提及率</th>
              <th colSpan={2} className="py-3 px-2 text-2xl font-black text-center border-l border-white/10 bg-[#2A6CF0]">Top3 提及率</th>
              <th colSpan={2} className="py-3 px-2 text-2xl font-black text-center border-l border-white/10 bg-[#2E75FF]">综合竞品排名</th>
            </tr>
            <tr className="bg-slate-50/80 border-b border-zinc-200 text-[#004CE5] font-black text-lg">
              {[0, 1, 2, 3].map((i) => (
                <React.Fragment key={i}>
                  <th className="py-2 px-1 text-center border-l border-zinc-200 w-[9.75%] whitespace-nowrap">{BEFORE_LABEL}</th>
                  <th className="py-2 px-1 text-center border-l border-zinc-200 border-r-2 border-[#004CE5]/15 w-[9.75%] whitespace-nowrap">{SEPT_LABEL}</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => {
              const p = products[row.key];
              return (
                <tr key={row.key} className="border-b border-zinc-200 bg-white hover:bg-slate-50/20 transition-colors">
                  <td className="py-3 px-3 border-r border-zinc-200 bg-slate-50/10 text-center font-black text-[1.35rem] leading-tight text-zinc-800">
                    {row.name}
                  </td>
                  <td className="py-3 px-2 text-center border-r border-zinc-200 text-4xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">{fmtPct(p.before.mention_rate)}</td>
                  <td className="py-3 px-2 text-center border-r-2 border-[#004CE5]/15 text-4xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">{fmtPct(p.september.mention_rate)}</td>
                  <td className="py-3 px-2 text-center border-r border-zinc-200 text-4xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">{fmtPct(p.before.top1_mention_rate)}</td>
                  <td className="py-3 px-2 text-center border-r-2 border-[#004CE5]/15 text-4xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">{fmtPct(p.september.top1_mention_rate)}</td>
                  <td className="py-3 px-2 text-center border-r border-zinc-200 text-4xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">{fmtPct(p.before.top3_mention_rate)}</td>
                  <td className="py-3 px-2 text-center border-r-2 border-[#004CE5]/15 text-4xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">{fmtPct(p.september.top3_mention_rate)}</td>
                  <td className="py-3 px-2 text-center border-r border-zinc-200 text-4xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">NO. {p.before.influence_rank}</td>
                  <td className="py-3 px-2 text-center border-r-2 border-[#004CE5]/15 text-4xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">NO. {p.september.influence_rank}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white shadow-[0_4px_25px_rgba(0,0,0,0.02)] px-6 py-3.5 shrink-0 mb-4 flex items-stretch gap-4">
        <div className="w-1.5 rounded-full bg-[#004CE5] shadow-[0_0_12px_rgba(0,76,229,0.25)] shrink-0" />
        <div className="min-w-0 flex-1">
          <h3 className="text-2xl font-black text-[#004CE5] tracking-wider mb-1">高位波动属正常现象</h3>
          <p className="text-[22px] leading-snug text-zinc-800 font-bold">
            当前各项指标已接近优化上限，在高位区间内出现约 10% 以内的月度上下波动属于正常现象，并不代表 GEO 优化效果下降，整体优化成效仍保持稳定。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 shrink-0">
        <div className="rounded-2xl border border-[#004CE5]/15 bg-[#004CE5]/[0.01] px-6 py-5 flex flex-col shadow-[0_4px_25px_rgba(0,76,229,0.005)]">
          <div className="flex items-center gap-2.5 mb-3 shrink-0">
            <span className="w-3 h-3 rounded-full bg-[#004CE5] shadow-[0_0_8px_rgba(0,76,229,0.3)] animate-pulse" />
            <h3 className="text-2xl font-black text-zinc-900 tracking-wider">现状总结</h3>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-[20px] leading-relaxed text-zinc-800 font-bold">
              1. 全部词条提及率由10月的80.3%升至83.4%，综合竞品排名保持 NO.1。Top1 29.6%→48.2%，Top3 45.7%→65.1%，两项排名都保持 NO.1。
            </p>
            <div className="h-px bg-[#004CE5]/10" />
            <p className="text-[20px] leading-relaxed text-zinc-800 font-bold">
              2. 「除壁纸、超薄以外」114个词条提及率80.3%→80.9%，综合排名保持 NO.1。Top1 22.1%→40.1%，排名保持 NO.1。Top3 38.8%→57.5%，排名由 NO.3 进至 NO.1。
            </p>
            <div className="h-px bg-[#004CE5]/10" />
            <p className="text-[20px] leading-relaxed text-zinc-800 font-bold">
              3. 大词 37 个，提及率80.4%→79.7%，综合排名由 NO.2 进至 NO.1。Top1 由20.3%（NO.2）升至33.8%（NO.1）。Top3 33.8%→51.4%，排名仍是 NO.3。11月 TCL 提及率76.4%，只差3.3个点。
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.01] px-6 py-5 flex flex-col shadow-[0_4px_25px_rgba(16,185,129,0.005)]">
          <div className="flex items-center gap-2.5 mb-3 shrink-0">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)] animate-pulse" />
            <h3 className="text-2xl font-black text-zinc-900 tracking-wider">重点优化策略</h3>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { num: '01', title: '拉开大词上的 TCL', desc: '37个大词提及率80.4%→79.7%，只领先 TCL 3.3个点。综合排名已从 NO.2 进到 NO.1，领先还要再拉开。' },
              { num: '02', title: '盯住 DeepSeek', desc: '全部词条里元宝已从10月的67.1%升到79.6%。DeepSeek 76.3%，比通义千问低13.2个点，是现在最低的一端。' },
              { num: '03', title: '把大词 Top3 拉回来', desc: '「除壁纸、超薄以外」的 Top3 已从 NO.3 进到 NO.1。大词 Top3 33.8%→51.4%，排名仍是 NO.3。' },
            ].map((strat) => (
              <div key={strat.num} className="flex items-start gap-3">
                <span className="text-emerald-600 font-black text-2xl shrink-0 mt-0.5 font-['Montserrat',sans-serif]">{strat.num}</span>
                <p className="text-[20px] leading-relaxed text-zinc-800 font-bold flex-grow min-h-0">
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
