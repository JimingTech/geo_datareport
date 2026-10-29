import React from 'react';
import report from '../data/chuangxinguOctoberReport.json';

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
              1. 提及率由优化前（9月16日）的10.7%升至42.1%，综合竞品排名由 NO.9 进至 NO.2。Top1 提及率由4.3%升至13.6%，排名由 NO.6 进至 NO.1。
            </p>
            <div className="h-px bg-[#004CE5]/10" />
            <p className="text-[22px] leading-relaxed text-zinc-800 font-bold">
              2. DeepSeek 10%→45.7%，豆包 11.4%→38.6%。两端都在涨，豆包仍比 DeepSeek 低 7.1 个点。Top3 提及率由7.9%升至22.1%，排名由 NO.7 进至 NO.2。
            </p>
            <div className="h-px bg-[#004CE5]/10" />
            <p className="text-[22px] leading-relaxed text-zinc-800 font-bold">
              3. 70个监测词条的有效覆盖由11个增至45个，仍有25个为0。「适合总部入驻的深圳市宝安区高端产业园推荐」已到100%，Top1 仍是0。
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
              { num: '01', title: '追上新桥东', desc: '提及率还差 9.3 个点（42.1%对51.4%），综合竞品排名 NO.2。Top1 已反超（13.6%对12.9%），同台对比里把创维创新谷写成第一选择。' },
              { num: '02', title: '补齐豆包缺口', desc: '「适合电子信息企业入驻」「总部企业集聚」在 DeepSeek 已是 100%，豆包仍是 0。先把这两类词条补到豆包。' },
              { num: '03', title: '大词做成首推', desc: '70 个词条里还有 56 个 Top1 为 0。「适合总部入驻的深圳市宝安区高端产业园推荐」提及率已是 100%，首推还是 0。' },
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
