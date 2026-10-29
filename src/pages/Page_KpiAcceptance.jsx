import React from 'react';
import report from '../data/jingdongReport.json';

const { kpi } = report;
const daily = kpi.daily_trend || [];

function fmtCnDate(d) {
  const [, month, day] = d.split('-');
  return `${Number(month)}月${Number(day)}日`;
}

export default function Page_KpiAcceptance() {
  const passLine = kpi.pass_line || 60;
  const columns = [daily.slice(0, 12), daily.slice(12)];

  return (
    <div className="w-full h-full flex flex-col px-12 sm:px-16 pt-[22px] pb-8 text-zinc-900 font-sans bg-white overflow-hidden">
      <div className="flex items-center shrink-0 mb-5">
        <div className="w-2 h-10 bg-[#004CE5] rounded-full shadow-[0_0_15px_rgba(0,76,229,0.25)]" />
        <h1 className="text-4xl font-black text-zinc-900 tracking-wider ml-4">
          KPI验收情况
          <span className="text-2xl font-bold text-zinc-400 ml-4">（连续 20 天，单日提及率达到 60%）</span>
        </h1>
      </div>

      <div className="grid grid-cols-4 gap-6 shrink-0 bg-slate-50/60 border border-zinc-200/80 rounded-[1.5rem] p-6 shadow-[0_4px_20px_rgba(15,23,42,0.01)] mb-5 overflow-hidden">
        <div className="flex flex-col gap-2 justify-start">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-5 rounded-full bg-[#004CE5]" />
            <span className="text-base font-extrabold text-zinc-600">验收类型</span>
          </div>
          <p className="text-2xl font-black text-zinc-800 mt-1">提及率</p>
          <p className="text-lg font-bold text-zinc-500 leading-snug">
            单日全平台提及率达到 {passLine}%，计为达标 1 天
          </p>
        </div>

        <div className="flex flex-col gap-2 justify-start border-l border-zinc-200/80 pl-6">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-5 rounded-full bg-[#004CE5]" />
            <span className="text-base font-extrabold text-zinc-600">达标条件</span>
          </div>
          <p className="text-2xl font-black text-zinc-800 mt-1">
            连续 <span className="text-[#004CE5] font-['Montserrat',sans-serif]">{kpi.target_days}</span> 天
          </p>
          <p className="text-lg font-bold text-zinc-500 leading-snug">
            优化前基准为 10月9日的 {kpi.before_mention_rate}%
          </p>
        </div>

        <div className="flex flex-col gap-2 justify-start border-l border-zinc-200/80 pl-6">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-5 rounded-full bg-[#004CE5]" />
            <span className="text-base font-extrabold text-zinc-600">达标表现</span>
          </div>
          <p className="text-2xl font-black text-zinc-800 mt-1">
            日均 <span className="text-[#004CE5] font-['Montserrat',sans-serif]">{kpi.avg_qualified_rate}%</span>
          </p>
          <p className="text-lg font-bold text-zinc-500 leading-snug">
            {fmtCnDate(kpi.qualified_start_date)}至{fmtCnDate(kpi.qualified_end_date)}，最高 {kpi.max_qualified_rate}%，最低 {kpi.min_qualified_rate}%
          </p>
        </div>

        <div className="flex flex-col gap-2 justify-start border-l border-zinc-200/80 pl-6 bg-[#004CE5]/[0.04] -my-6 -mr-6 p-6 rounded-r-[1.5rem]">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-5 rounded-full bg-[#004CE5]" />
            <span className="text-base font-extrabold text-[#004CE5]">结论</span>
          </div>
          <p className="text-2xl font-black text-zinc-900 mt-1 leading-snug">
            <span className="text-[#004CE5] font-['Montserrat',sans-serif]">{kpi.qualified_days_count}</span> 天全部达标
          </p>
          <p className="text-lg font-bold text-zinc-700 leading-snug">
            已超过 {kpi.target_days} 天的考核要求
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-0 rounded-2xl border border-zinc-200 bg-white shadow-[0_4px_25px_rgba(0,0,0,0.015)] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between shrink-0 px-6 py-4 border-b border-zinc-200">
          <h2 className="text-xl font-black text-zinc-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#004CE5]" />
            每日提及率
          </h2>
          <p className="text-base font-bold text-zinc-500">
            {fmtCnDate(kpi.qualified_start_date)}起连续 {kpi.qualified_days_count} 天不低于 {passLine}%
          </p>
        </div>

        <div className="flex-1 min-h-0 grid grid-cols-2">
          {columns.map((colRows, colIdx) => (
            <table key={colIdx} className={`w-full h-full text-left border-collapse table-fixed ${colIdx === 0 ? 'border-r border-zinc-200' : ''}`}>
              <thead>
                <tr className="bg-slate-50 text-base font-black text-zinc-500">
                  <th className="py-3 px-6 w-[34%] font-black">日期</th>
                  <th className="py-3 px-4 w-[33%] text-center">提及率</th>
                  <th className="py-3 px-6 w-[33%] text-center">结果</th>
                </tr>
              </thead>
              <tbody className="text-lg font-bold">
                {colRows.map((r) => {
                  const isPeak = r.passed && r.mention_rate === kpi.max_qualified_rate;
                  const isBefore = r.date === kpi.before_date;
                  return (
                    <tr key={r.date} className="border-t border-zinc-100">
                      <td className="px-6 font-['Montserrat',sans-serif] text-zinc-700 whitespace-nowrap">
                        {r.date.slice(5)}
                        {isBefore && <span className="ml-2 text-sm font-bold text-zinc-400">基准</span>}
                        {isPeak && <span className="ml-2 text-sm font-bold text-[#004CE5]">最高</span>}
                      </td>
                      <td className={`px-4 text-center font-black font-['Montserrat',sans-serif] ${r.passed ? 'text-[#004CE5]' : 'text-zinc-400'}`}>
                        {r.mention_rate.toFixed(1)}%
                      </td>
                      <td className={`px-6 text-center ${r.passed ? 'text-[#004CE5]' : 'text-zinc-400'}`}>
                        {r.passed ? '达标' : '未达标'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ))}
        </div>
      </div>
    </div>
  );
}
