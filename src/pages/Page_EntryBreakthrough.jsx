import React from 'react';
import report from '../data/jingdongReport.json';

const { entries, october } = report;

const covered = entries.filter((e) => Number(e.mention_rate) > 0);

const GROUPS = [
  {
    name: '北京线下自营类',
    match: (n) => n.includes('北京') || n.includes('自营'),
    badgeClass: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
  },
  {
    name: '电商/线上口腔平台类',
    match: (n) => n.includes('电商') || n.includes('线上') || n.includes('互联网'),
    badgeClass: 'bg-sky-50 text-sky-600 border border-sky-100',
  },
  {
    name: '项目与专家预约类',
    match: () => true,
    badgeClass: 'bg-violet-50 text-violet-600 border border-violet-100',
  },
];

const ORDER = [0, 1, 2];
function groupOf(name) {
  for (const i of ORDER) {
    if (GROUPS[i].match(name)) return GROUPS[i];
  }
  return GROUPS[2];
}

const distribution = GROUPS.map((g) => {
  const items = covered.filter((e) => groupOf(e.name) === g);
  const breakthrough = items.filter((e) => !Number(e.before_mention_rate));
  const best = items.slice().sort((a, b) => b.mention_rate - a.mention_rate)[0];
  return {
    name: g.name,
    badgeClass: g.badgeClass,
    count: items.length,
    breakthrough: breakthrough.length,
    best,
  };
}).filter((g) => g.count > 0);

const totalBreakthrough = distribution.reduce((s, g) => s + g.breakthrough, 0);

const coveredList = covered
  .slice()
  .sort((a, b) => b.mention_rate - a.mention_rate)
  .map((e) => ({ ...e, isNew: !Number(e.before_mention_rate), group: groupOf(e.name) }));

export default function Page_EntryBreakthrough() {
  return (
    <div className="w-full h-full flex flex-col px-12 sm:px-16 pt-[22px] pb-8 text-zinc-900 font-sans bg-white overflow-hidden">
      <div className="flex items-center shrink-0 mb-4">
        <div className="w-2 h-10 bg-[#004CE5] rounded-full shadow-[0_0_15px_rgba(0,76,229,0.25)]" />
        <h1 className="text-4xl font-black text-zinc-900 tracking-wider ml-4 flex items-center">
          词条突破分布分析
          <span className="text-2xl font-bold text-zinc-400 ml-4">（2026年10月）</span>
        </h1>
      </div>

      <div className="grid grid-cols-3 gap-5 shrink-0 mb-5">
        {[
          { label: '监测词条总数', value: report.scope.entries, unit: '个', tone: 'text-zinc-900' },
          { label: '有效覆盖词条', value: october.covered_entries, unit: '个', tone: 'text-[#004CE5]' },
          { label: '本月新破零词条', value: totalBreakthrough, unit: '个', tone: 'text-emerald-600' },
        ].map((m) => (
          <div key={m.label} className="rounded-2xl border border-[#004CE5]/15 bg-[#004CE5]/[0.02] py-4 px-6 flex flex-col justify-center">
            <span className="text-[1.15rem] font-bold text-zinc-500 tracking-wider mb-1">{m.label}</span>
            <span className={`text-[2.6rem] font-black leading-tight font-['Montserrat',sans-serif] ${m.tone}`}>
              {m.value}
              <span className="text-lg font-extrabold text-zinc-500 font-sans ml-2">{m.unit}</span>
            </span>
          </div>
        ))}
      </div>

      <div className="flex-1 min-h-0 flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
          <div className="flex flex-col gap-3 min-h-0">
            <h2 className="text-[1.7rem] font-black text-zinc-900 flex items-center gap-2.5 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#004CE5]" />
              按词条方向分布
            </h2>
            <div className="flex-1 min-h-0 rounded-[1.25rem] border border-zinc-200 bg-white shadow-[0_6px_30px_rgba(0,0,0,0.015)] overflow-hidden flex flex-col">
              {distribution.map((row) => (
                <div key={row.name} className="flex-1 min-h-0 border-b border-zinc-100 last:border-none px-7 py-4 flex flex-col justify-center gap-2">
                  <div className="flex items-center gap-4">
                    <span className={`inline-block px-3.5 py-1.5 rounded-lg text-[1.2rem] font-extrabold tracking-wide ${row.badgeClass}`}>
                      {row.name}
                    </span>
                    <span className="text-[1.45rem] font-black text-zinc-800 font-['Montserrat',sans-serif]">{row.count} 个</span>
                    <span className="text-[1.2rem] font-bold text-emerald-600">新破零 {row.breakthrough} 个</span>
                  </div>
                  <p className="text-[1.3rem] font-semibold text-zinc-600 leading-relaxed">
                    代表词条「{row.best.name}」提及率
                    <strong className="text-[#004CE5] font-black mx-1 font-['Montserrat',sans-serif]">{row.best.mention_rate}%</strong>
                    <span className="text-zinc-400 ml-2">（优化前 {Number(row.best.before_mention_rate) || 0}%）</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 min-h-0">
            <h2 className="text-[1.7rem] font-black text-zinc-900 flex items-center gap-2.5 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#004CE5]" />
              已覆盖词条明细（前20）
              <span className="text-[1.15rem] font-bold text-zinc-400 ml-1">共 {coveredList.length} 个，标注「新」为新破零</span>
            </h2>
            <div className="flex-1 min-h-0 rounded-[1.25rem] border border-zinc-200 bg-white shadow-[0_6px_30px_rgba(0,0,0,0.015)] overflow-y-auto">
              <table className="w-full h-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="bg-slate-50 border-b border-zinc-200 text-[1.1rem] font-black text-zinc-600">
                    <th className="py-2.5 px-6">词条</th>
                    <th className="py-2.5 px-2 w-[20%] text-center">提及率</th>
                    <th className="py-2.5 px-2 w-[20%] text-center">优化前</th>
                  </tr>
                </thead>
                <tbody>
                  {coveredList.slice(0, 20).map((e) => (
                    <tr key={e.name} className="border-b border-zinc-100 last:border-none even:bg-slate-50/25">
                      <td className="py-0.5 px-6 text-[1.1rem] font-bold text-zinc-700 truncate" title={e.name}>
                        {e.isNew && (
                          <span className="inline-block mr-2 px-1.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100 text-[0.88rem] font-black align-middle">
                            新
                          </span>
                        )}
                        {e.name}
                      </td>
                      <td className="py-0.5 px-2 text-center text-[1.18rem] font-black text-[#004CE5] font-['Montserrat',sans-serif]">{e.mention_rate}%</td>
                      <td className="py-0.5 px-2 text-center text-[1.12rem] font-bold text-zinc-500 font-['Montserrat',sans-serif]">
                        {e.before_mention_rate != null ? `${e.before_mention_rate}%` : '0%'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="shrink-0 rounded-[1.25rem] border-l-[6px] border-[#004CE5] border-y border-r border-zinc-200 bg-gradient-to-r from-blue-50/40 via-white to-white py-4 px-8 flex flex-col gap-2">
          <h3 className="text-[1.6rem] font-black text-zinc-900 tracking-wider">分布解读</h3>
          <p className="text-[1.32rem] leading-relaxed text-zinc-700 font-bold">
            1. 北京线下自营与电商平台口腔服务类词条表现最为突出，多个核心词条提及率达到 100%。
          </p>
          <p className="text-[1.32rem] leading-relaxed text-zinc-700 font-bold">
            2. 76 个监测词条已有效覆盖 {october.covered_entries} 个（覆盖率 {((october.covered_entries / report.scope.entries) * 100).toFixed(1)}%），较优化前的 55 个净增 {october.covered_entries - 55} 个。
          </p>
        </div>
      </div>
    </div>
  );
}
