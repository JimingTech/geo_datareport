import React from 'react';

export default function Page_CoreDataOverview() {
  return (
    <div className="w-full h-full flex flex-col px-12 sm:px-16 pt-[22px] pb-8 text-zinc-800 font-sans justify-between overflow-hidden">
      {/* Title Area */}
      <div className="flex items-center shrink-0 mb-[27px]">
        <div className="w-2 h-10 bg-[#004CE5] rounded-full shadow-[0_0_15px_rgba(0,76,229,0.25)]" />
        <h1 className="text-4xl font-black text-zinc-900 tracking-wider ml-4">
          核心数据总览 <span className="text-2xl font-bold text-zinc-400 ml-4">（2026年8月）</span>
        </h1>
      </div>

      {/* 1. Top Section: Decorative Data Remark */}
      <div className="rounded-xl border border-zinc-200 bg-slate-50/40 py-3.5 px-6 shrink-0 mb-4">
        <p className="text-[1.35rem] leading-relaxed text-zinc-500 font-bold">
          本次监测周期共计 <span className="font-['Montserrat',sans-serif] text-[#004CE5] font-black">31</span> 天，覆盖 <span className="font-['Montserrat',sans-serif] text-[#004CE5] font-black">4</span> 个核心AI平台，针对 <span className="font-['Montserrat',sans-serif] text-[#004CE5] font-black">30</span> 个重点监测词条进行累计查询 <span className="font-['Montserrat',sans-serif] text-[#004CE5] font-black">600</span> 次，追踪引用文章共计 <span className="font-['Montserrat',sans-serif] text-[#004CE5] font-black">3,144</span> 篇、累计引用 <span className="font-['Montserrat',sans-serif] text-[#004CE5] font-black">7,816</span> 次，涉及识别竞品品牌 <span className="font-['Montserrat',sans-serif] text-[#004CE5] font-black">113</span> 家。
        </p>
      </div>

      {/* 2. Middle Section: Consolidated Table */}
      <div className="rounded-2xl border border-zinc-300 bg-white shadow-[0_4px_30px_rgba(0,0,0,0.015)] overflow-hidden flex-1 min-h-0 flex flex-col mb-3">
        <table className="w-full text-left border-collapse table-fixed flex-1">
          <thead>
            <tr className="text-white">
              <th rowSpan={2} className="py-4 px-8 text-2xl font-black text-center w-[20%] bg-zinc-800 border-r border-white/10">产品</th>
              <th colSpan={2} className="py-3 px-4 text-2xl font-black text-center border-l border-white/10 bg-[#004CE5]">提及率</th>
              <th colSpan={2} className="py-3 px-4 text-2xl font-black text-center border-l border-white/10 bg-[#1459E8]">Top1提及率</th>
              <th colSpan={2} className="py-3 px-4 text-2xl font-black text-center border-l border-white/10 bg-[#2366F4]">Top3提及率</th>
              <th colSpan={2} className="py-3 px-4 text-2xl font-black text-center border-l border-white/10 bg-[#2E75FF]">竞品排名</th>
            </tr>
            <tr className="bg-slate-50/80 border-b border-zinc-200 text-[#004CE5] font-black text-2xl">
              <th className="py-2 px-2 text-center border-l border-zinc-200 w-[10%]">7月</th>
              <th className="py-2 px-2 text-center border-l border-zinc-200 border-r-2 border-[#004CE5]/15 w-[10%]">8月</th>
              <th className="py-2 px-2 text-center border-l border-zinc-200 w-[10%]">7月</th>
              <th className="py-2 px-2 text-center border-l border-zinc-200 border-r-2 border-[#004CE5]/15 w-[10%]">8月</th>
              <th className="py-2 px-2 text-center border-l border-zinc-200 w-[10%]">7月</th>
              <th className="py-2 px-2 text-center border-l border-zinc-200 border-r-2 border-[#004CE5]/15 w-[10%]">8月</th>
              <th className="py-2 px-2 text-center border-l border-zinc-200 w-[10%]">7月</th>
              <th className="py-2 px-2 text-center border-l border-zinc-200 w-[10%]">8月</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-zinc-200 bg-white hover:bg-slate-50/20 transition-colors">
              <td className="py-1.5 px-6 border-r border-zinc-200 bg-slate-50/10 text-center font-black text-2xl text-zinc-800">
                古井贡酒古16
              </td>
              <td className="py-1.5 px-2 text-center border-r border-zinc-200 text-4xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">85.0%</td>
              <td className="py-1.5 px-2 text-center border-r-2 border-[#004CE5]/15 text-4xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">83.3%</td>
              <td className="py-1.5 px-2 text-center border-r border-zinc-200 text-4xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">60.0%</td>
              <td className="py-1.5 px-2 text-center border-r-2 border-[#004CE5]/15 text-4xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">48.3%</td>
              <td className="py-1.5 px-2 text-center border-r border-zinc-200 text-4xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">73.3%</td>
              <td className="py-1.5 px-2 text-center border-r-2 border-[#004CE5]/15 text-4xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">60.0%</td>
              <td className="py-1.5 px-2 text-center border-r border-zinc-200 text-4xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">NO. 1</td>
              <td className="py-1.5 px-2 text-center border-r-2 border-[#004CE5]/15 text-4xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">NO. 1</td>
            </tr>

            <tr className="border-b border-zinc-200 bg-white hover:bg-slate-50/20 transition-colors">
              <td className="py-1.5 px-6 border-r border-zinc-200 bg-slate-50/10 text-center font-black text-2xl text-zinc-800">
                古井贡酒古20
              </td>
              <td className="py-1.5 px-2 text-center border-r border-zinc-200 text-4xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">91.7%</td>
              <td className="py-1.5 px-2 text-center border-r-2 border-[#004CE5]/15 text-4xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">85.0%</td>
              <td className="py-1.5 px-2 text-center border-r border-zinc-200 text-4xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">35.0%</td>
              <td className="py-1.5 px-2 text-center border-r-2 border-[#004CE5]/15 text-4xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">28.3%</td>
              <td className="py-1.5 px-2 text-center border-r border-zinc-200 text-4xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">50.0%</td>
              <td className="py-1.5 px-2 text-center border-r-2 border-[#004CE5]/15 text-4xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">48.3%</td>
              <td className="py-1.5 px-2 text-center border-r border-zinc-200 text-4xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">NO. 1</td>
              <td className="py-1.5 px-2 text-center border-r-2 border-[#004CE5]/15 text-4xl font-bold text-zinc-900 font-['Montserrat',sans-serif]">NO. 1</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white shadow-[0_4px_25px_rgba(0,0,0,0.02)] px-6 py-3.5 shrink-0 mb-3 flex items-stretch gap-4">
        <div className="w-1.5 rounded-full bg-[#004CE5] shadow-[0_0_12px_rgba(0,76,229,0.25)] shrink-0" />
        <div className="min-w-0 flex-1">
          <h3 className="text-2xl font-black text-[#004CE5] tracking-wider mb-1">高位波动属正常现象</h3>
          <p className="text-[22px] leading-snug text-zinc-800 font-bold">
            当前各项指标已接近优化上限，在高位区间内出现约 10% 以内的月度上下波动属于正常现象，并不代表 GEO 优化效果下降，整体优化成效仍保持稳定。
          </p>
        </div>
      </div>

      {/* 3. Bottom Section: Summary & Strategy Cards */}
      <div className="grid grid-cols-2 gap-6 shrink-0 h-[168px]">
        <div className="rounded-2xl border border-[#004CE5]/15 bg-[#004CE5]/[0.01] px-6 py-3.5 flex flex-col shadow-[0_4px_25px_rgba(0,76,229,0.005)]">
          <div className="flex items-center gap-2.5 mb-1.5 shrink-0">
            <span className="w-3 h-3 rounded-full bg-[#004CE5] shadow-[0_0_8px_rgba(0,76,229,0.3)] animate-pulse" />
            <h3 className="text-2xl font-black text-zinc-900 tracking-wider">现状总结</h3>
          </div>
          <div className="flex-1 flex items-center min-h-0">
            <p className="text-[22px] leading-snug text-zinc-700 font-bold">
              相较7月，两款产品均在高位小幅波动：古16提及率由85.0%回落至83.3%，Top1提及率48.3%仍领跑首推，竞品排名稳守 NO.1；古20提及率由91.7%回落至85.0%，竞品排名稳守 NO.1。
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
              古16需守住竞品排名 NO.1，并守住婚宴词条的首推表达；古20守住 NO.1 与 85.0% 的提及广度，继续压住梦之蓝M6+与水晶剑。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
