import React from 'react';
import report from '../data/awadaOctoberReport.json';

const { scope, before, september, october, november } = report;

function fmtPct(v) {
  return `${Number(v)}%`;
}

const BEFORE_LABEL = report.meta.before_label || '优化前';
const SEPT_LABEL = report.meta.september_label || '9月';
const OCT_LABEL = report.meta.october_label || '10月';
const NOV_LABEL = report.meta.november_label || '11月';
const LABELS = [BEFORE_LABEL, SEPT_LABEL, OCT_LABEL, NOV_LABEL];

export default function Page_CoreDataOverview() {
  const rows = [{ key: 'all', name: 'Awada', before, september, october, november }];

  return (
    <div className="w-full h-full flex flex-col px-12 sm:px-16 pt-[22px] pb-8 text-zinc-800 font-sans overflow-hidden">
      <div className="flex items-center shrink-0 mb-[27px]">
        <div className="w-2 h-10 bg-[#004CE5] rounded-full shadow-[0_0_15px_rgba(0,76,229,0.25)]" />
        <h1 className="text-4xl font-black text-zinc-900 tracking-wider ml-4">
          核心数据总览 <span className="text-2xl font-bold text-zinc-400 ml-4">（2026年11月）</span>
        </h1>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-slate-50/40 py-3.5 px-6 shrink-0 mb-4">
        <p className="text-[1.35rem] leading-relaxed text-zinc-500 font-bold">
          本次监测周期覆盖 <span className="font-['Montserrat',sans-serif] text-[#004CE5] font-black">{scope.platforms}</span> 个核心AI平台，针对重点监测词条 <span className="font-['Montserrat',sans-serif] text-[#004CE5] font-black">{scope.entries}</span> 个进行查询，追踪相关问答数据共计 <span className="font-['Montserrat',sans-serif] text-[#004CE5] font-black">{scope.conversations.toLocaleString()}</span> 篇次，整体项目圆满结项。
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-300 bg-white shadow-[0_4px_30px_rgba(0,0,0,0.015)] overflow-hidden shrink-0 flex flex-col mb-[30px]">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="text-white">
              <th rowSpan={2} className="py-5 px-3 text-2xl font-black text-center w-[12%] bg-zinc-800 border-r border-white/10">产品</th>
              <th colSpan={4} className="py-4 px-2 text-2xl font-black text-center border-l border-white/10 bg-[#004CE5]">提及率</th>
              <th colSpan={4} className="py-4 px-2 text-2xl font-black text-center border-l border-white/10 bg-[#1A62E5]">Top1 提及率</th>
              <th colSpan={4} className="py-4 px-2 text-2xl font-black text-center border-l border-white/10 bg-[#2A6CF0]">Top3 提及率</th>
              <th colSpan={4} className="py-4 px-2 text-2xl font-black text-center border-l border-white/10 bg-[#2E75FF]">综合竞品排名</th>
            </tr>
            <tr className="bg-slate-50/80 border-b border-zinc-200 text-[#004CE5] font-black text-base">
              {[0, 1, 2, 3].map((groupIndex) => (
                <React.Fragment key={groupIndex}>
                  {LABELS.map((lbl, idx) => (
                    <th
                      key={lbl}
                      className={`py-2.5 px-1 text-center border-l border-zinc-200 w-[5.5%] whitespace-nowrap ${
                        idx === 3 ? 'border-r-2 border-[#004CE5]/15' : ''
                      }`}
                    >
                      {lbl}
                    </th>
                  ))}
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-b border-zinc-200 bg-white hover:bg-slate-50/20 transition-colors">
                <td className="py-[60px] px-3 border-r border-zinc-200 bg-slate-50/10 text-center font-black text-3xl text-zinc-800">
                  {row.name}
                </td>

                {/* 提及率 */}
                <td className="py-[60px] px-1 text-center border-r border-zinc-200 text-3xl font-bold text-zinc-900 font-['Montserrat',sans-serif] whitespace-nowrap">{fmtPct(row.before.mention_rate)}</td>
                <td className="py-[60px] px-1 text-center border-r border-zinc-200 text-3xl font-bold text-zinc-900 font-['Montserrat',sans-serif] whitespace-nowrap">{fmtPct(row.september.mention_rate)}</td>
                <td className="py-[60px] px-1 text-center border-r border-zinc-200 text-3xl font-bold text-zinc-900 font-['Montserrat',sans-serif] whitespace-nowrap">{fmtPct(row.october.mention_rate)}</td>
                <td className="py-[60px] px-1 text-center border-r-2 border-[#004CE5]/15 text-3xl font-bold text-zinc-900 font-['Montserrat',sans-serif] whitespace-nowrap">{fmtPct(row.november.mention_rate)}</td>

                {/* Top1 提及率 */}
                <td className="py-[60px] px-1 text-center border-r border-zinc-200 text-3xl font-bold text-zinc-900 font-['Montserrat',sans-serif] whitespace-nowrap">{fmtPct(row.before.top1_mention_rate)}</td>
                <td className="py-[60px] px-1 text-center border-r border-zinc-200 text-3xl font-bold text-zinc-900 font-['Montserrat',sans-serif] whitespace-nowrap">{fmtPct(row.september.top1_mention_rate)}</td>
                <td className="py-[60px] px-1 text-center border-r border-zinc-200 text-3xl font-bold text-zinc-900 font-['Montserrat',sans-serif] whitespace-nowrap">{fmtPct(row.october.top1_mention_rate)}</td>
                <td className="py-[60px] px-1 text-center border-r-2 border-[#004CE5]/15 text-3xl font-bold text-zinc-900 font-['Montserrat',sans-serif] whitespace-nowrap">{fmtPct(row.november.top1_mention_rate)}</td>

                {/* Top3 提及率 */}
                <td className="py-[60px] px-1 text-center border-r border-zinc-200 text-3xl font-bold text-zinc-900 font-['Montserrat',sans-serif] whitespace-nowrap">{fmtPct(row.before.top3_mention_rate)}</td>
                <td className="py-[60px] px-1 text-center border-r border-zinc-200 text-3xl font-bold text-zinc-900 font-['Montserrat',sans-serif] whitespace-nowrap">{fmtPct(row.september.top3_mention_rate)}</td>
                <td className="py-[60px] px-1 text-center border-r border-zinc-200 text-3xl font-bold text-zinc-900 font-['Montserrat',sans-serif] whitespace-nowrap">{fmtPct(row.october.top3_mention_rate)}</td>
                <td className="py-[60px] px-1 text-center border-r-2 border-[#004CE5]/15 text-3xl font-bold text-zinc-900 font-['Montserrat',sans-serif] whitespace-nowrap">{fmtPct(row.november.top3_mention_rate)}</td>

                {/* 综合竞品排名 */}
                <td className="py-[60px] px-1 text-center border-r border-zinc-200 text-2xl font-bold text-zinc-900 font-['Montserrat',sans-serif] whitespace-nowrap">NO. {row.before.influence_rank}</td>
                <td className="py-[60px] px-1 text-center border-r border-zinc-200 text-2xl font-bold text-zinc-900 font-['Montserrat',sans-serif] whitespace-nowrap">NO. {row.september.influence_rank}</td>
                <td className="py-[60px] px-1 text-center border-r border-zinc-200 text-2xl font-bold text-zinc-900 font-['Montserrat',sans-serif] whitespace-nowrap">NO. {row.october.influence_rank}</td>
                <td className="py-[60px] px-1 text-center border-r-2 border-[#004CE5]/15 text-2xl font-bold text-zinc-900 font-['Montserrat',sans-serif] whitespace-nowrap">NO. {row.november.influence_rank}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
        <div className="rounded-2xl border border-[#004CE5]/15 bg-[#004CE5]/[0.01] px-6 py-5 flex flex-col shadow-[0_4px_25px_rgba(0,76,229,0.005)]">
          <div className="flex items-center gap-2.5 mb-3 shrink-0">
            <span className="w-3 h-3 rounded-full bg-[#004CE5] shadow-[0_0_8px_rgba(0,76,229,0.3)] animate-pulse" />
            <h3 className="text-2xl font-black text-zinc-900 tracking-wider">全周期成效复盘</h3>
          </div>
          <div className="flex-1 flex flex-col justify-evenly min-h-0">
            <p className="text-[22px] leading-relaxed text-zinc-800 font-bold">
              1. 提及率实现跨越式持续增长：由优化前的 1.9% 经 9月 8.8%、10月 23.1%，至结项达到 34.4%，累计净提升 +32.5 个百分点。
            </p>
            <div className="h-px bg-[#004CE5]/10" />
            <p className="text-[22px] leading-relaxed text-zinc-800 font-bold">
              2. 综合竞品排名大幅跃升：从最初的行业 NO.43 连续跃升至 NO.15、NO.5，最终稳居行业 NO.2，成为增长最快的户外餐厨品牌。
            </p>
            <div className="h-px bg-[#004CE5]/10" />
            <p className="text-[22px] leading-relaxed text-zinc-800 font-bold">
              3. 首选心智与词条深度覆盖：Top1 提及率升至 16.3%、Top3 达 17.5%；40 个核心词条中破零覆盖达 28 个，覆盖率达 70%。
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.01] px-6 py-5 flex flex-col shadow-[0_4px_25px_rgba(16,185,129,0.005)]">
          <div className="flex items-center gap-2.5 mb-3 shrink-0">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)] animate-pulse" />
            <h3 className="text-2xl font-black text-zinc-900 tracking-wider">结项核心成果总结</h3>
          </div>
          <div className="flex-1 flex flex-col justify-evenly min-h-0">
            {[
              { num: '01', title: '四端引擎全面破局', desc: '元宝从初期0升至42.5%、DeepSeek 37.5%、豆包 32.5%、通义千问 25.0%，四端均超25%且更趋均衡。' },
              { num: '02', title: '稳居行业第二领头羊', desc: '提及率 34.4% 全面超越挪客（31.3%）、牧高笛（29.4%）、爱路客（28.1%），并与榜首火枫差距大幅收窄。' },
              { num: '03', title: '第一推荐心智牢固沉淀', desc: 'Top1 提及率升至 16.3%（居行业第2），在专业露营厨具、高颜值餐厨等高价值词条中成功树立第一首推地位。' },
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
