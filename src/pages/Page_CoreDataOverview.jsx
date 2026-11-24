import React from 'react';
import report from '../data/pangluoNovemberReport.json';

const { scope, before, september } = report;

function fmtPct(v) {
  return `${Number(v)}%`;
}

const BEFORE_LABEL = report.meta.before_label;
const SEPT_LABEL = report.meta.september_label;

export default function Page_CoreDataOverview() {
  const rows = [{ key: 'all', name: report.meta.product, before, september }];

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
                  <th className="py-2.5 px-1 text-center border-l border-zinc-200 border-r-2 border-[#004CE5]/15 w-[10.75%] whitespace-nowrap">{SEPT_LABEL}</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-b border-zinc-200 bg-white hover:bg-slate-50/20 transition-colors">
                <td className="py-[60px] px-4 border-r border-zinc-200 bg-slate-50/10 text-center font-black text-[1.65rem] leading-tight text-zinc-800">
                  {row.name}
                </td>
                <td className="py-[60px] px-2 text-center border-r border-zinc-200 text-5xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">{fmtPct(row.before.mention_rate)}</td>
                <td className="py-[60px] px-2 text-center border-r-2 border-[#004CE5]/15 text-5xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">{fmtPct(row.september.mention_rate)}</td>
                <td className="py-[60px] px-2 text-center border-r border-zinc-200 text-5xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">{fmtPct(row.before.top1_mention_rate)}</td>
                <td className="py-[60px] px-2 text-center border-r-2 border-[#004CE5]/15 text-5xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">{fmtPct(row.september.top1_mention_rate)}</td>
                <td className="py-[60px] px-2 text-center border-r border-zinc-200 text-5xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">{fmtPct(row.before.top3_mention_rate)}</td>
                <td className="py-[60px] px-2 text-center border-r-2 border-[#004CE5]/15 text-5xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">{fmtPct(row.september.top3_mention_rate)}</td>
                <td className="py-[60px] px-2 text-center border-r border-zinc-200 text-5xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">NO. {row.before.influence_rank}</td>
                <td className="py-[60px] px-2 text-center border-r-2 border-[#004CE5]/15 text-5xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">NO. {row.september.influence_rank}</td>
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
              1. 提及率由优化前的 40.2% 提升至 53.6%，排名稳居行业 NO.1，领先第二名夸克 5.0 个百分点。Top1 提及率升至 17.9%（NO.2）；Top3 提及率升至 34.3%（NO.2）。综合竞品排名居 NO.2，与第一名夸克仅差 0.1 分（39.3 对 39.4）。
            </p>
            <div className="h-px bg-[#004CE5]/10" />
            <p className="text-[22px] leading-relaxed text-zinc-800 font-bold">
              2. 四端全面增长：DeepSeek 36.4%→51.4%（+15.0%），豆包 54.5%→60.0%（+5.5%），元宝 45.5%→57.1%（+11.6%），通义千问 24.2%→45.7%（+21.5%）。此前薄弱端通义千问大幅拉升，四端整体表现更为均衡。
            </p>
            <div className="h-px bg-[#004CE5]/10" />
            <p className="text-[22px] leading-relaxed text-zinc-800 font-bold">
              3. 35个监测词条的有效覆盖由优化前的 19 个增至 26 个，净增 7 个词条覆盖，覆盖率由 54.3% 提升至 74.3%。未覆盖词条由 16 个降至 9 个。
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
              { num: '01', title: '攻坚夸克首推优势', desc: '庞洛提及率已领先夸克 5.0 个百分点，综合得分仅差 0.1 分。但夸克在 Top1（25.7% 对 17.9%）仍有优势，需在同台对比中把庞洛写成第一选择。' },
              { num: '02', title: '突破高提及零首推词', desc: '「南极邮轮怎么选」「极地邮轮怎么选」「奢华邮轮推荐」等词条提及率已达 75%~100%，但 Top1 仍为 0。针对这些高潜大词优化首推语料。' },
              { num: '03', title: '补齐剩余9个空白词条', desc: '攻坚「一次南极行程最多能看几种企鹅」「大溪地怎么玩」「适合老年人的邮轮」等未覆盖词条，定向补充渠道语料，消除监测盲区。' },
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
