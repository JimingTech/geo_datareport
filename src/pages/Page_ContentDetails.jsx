import React from 'react';
import report from '../data/jingdongReport.json';

const { overview: ov, platform_totals: plat, top10, generated_at, domain_stats: domains } = report.delivery;
const [year, month, day] = generated_at.split('-');
const sourceDate = `${year}/${Number(month)}/${Number(day)}`;

const channelLead = domains
  .slice()
  .sort((a, b) => b.articles - a.articles || b.citations - a.citations)
  .slice(0, 4)
  .map((d) => `${d.channel} ${d.articles} 篇`)
  .join('、');

const citedLead = domains
  .filter((d) => d.cited > 0)
  .slice()
  .sort((a, b) => b.cited - a.cited || b.citations - a.citations)
  .slice(0, 3)
  .map((d) => d.channel)
  .join('、');

const channelNote = channelLead
  ? `核心投放渠道分布：${channelLead}。`
  : '投放渠道明细见下方 TOP 10 列表。';
const citedNote = citedLead
  ? `被引用文章主要来自${citedLead}等核心渠道。`
  : '截至统计日，投放文章尚未匹配到 AI 引用记录。';

export default function Page_ContentDetails() {
  return (
    <div className="w-full h-full flex flex-col px-12 sm:px-16 pt-[22px] pb-8 text-zinc-900 font-sans bg-white">
      <div className="flex items-center shrink-0 mb-3">
        <div className="w-2 h-10 bg-[#004CE5] rounded-full shadow-[0_0_15px_rgba(0,76,229,0.25)]" />
        <h1 className="text-4xl font-black text-zinc-900 tracking-wider ml-4 flex items-center">
          京东口腔① 投放明细
          <span className="text-2xl font-bold text-zinc-400 ml-4">（2026年10月）</span>
        </h1>
      </div>

      <div className="flex-1 min-h-0 flex flex-col gap-6 justify-between">
        <div className="grid grid-cols-3 gap-6 shrink-0 bg-slate-50/60 border border-zinc-200/80 rounded-[1.5rem] p-6 shadow-sm">
          <div className="flex flex-col gap-2.5 justify-center">
            <div className="flex items-center gap-2">
              <span className="w-2 h-4 rounded-full bg-[#004CE5]" />
              <span className="text-sm font-extrabold text-zinc-400 uppercase tracking-widest font-['Montserrat']">TOTAL CAMPAIGN</span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-6xl font-black text-zinc-900 font-['Montserrat',sans-serif]">{ov.delivery_articles}</span>
              <span className="text-2xl font-black text-zinc-800 ml-1">篇</span>
            </div>
            <div className="text-[1.12rem] font-bold text-zinc-500">全网总投放量 / 高频引用文章</div>
            <p className="text-[1rem] font-bold text-zinc-400 leading-relaxed mt-1">
              {channelNote}
            </p>
          </div>

          <div className="flex flex-col gap-2.5 justify-center border-l border-zinc-200/80 pl-8">
            <div className="flex items-center gap-2">
              <span className="w-2 h-4 rounded-full bg-emerald-500" />
              <span className="text-sm font-extrabold text-zinc-400 uppercase tracking-widest font-['Montserrat']">CITATION RATE</span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-6xl font-black text-emerald-600 font-['Montserrat',sans-serif]">{ov.cited_rate}%</span>
              <span className="text-2xl font-black text-emerald-600 ml-1">被引率</span>
            </div>
            <div className="text-[1.12rem] font-bold text-emerald-600">
              ( {ov.cited_articles} / {ov.delivery_articles} 篇重点文章已被引用 )
            </div>
            <p className="text-[1rem] font-bold text-zinc-400 leading-relaxed mt-1">
              {citedNote}
            </p>
          </div>

          <div className="flex flex-col gap-2.5 justify-center border-l border-zinc-200/80 pl-8">
            <div className="flex items-center gap-2">
              <span className="w-2 h-4 rounded-full bg-zinc-800" />
              <span className="text-sm font-extrabold text-zinc-400 uppercase tracking-widest font-['Montserrat']">EFFECTIVE CITATIONS</span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-6xl font-black text-zinc-900 font-['Montserrat',sans-serif]">{plat.total}</span>
              <span className="text-2xl font-black text-zinc-800 ml-1">次</span>
            </div>
            <div className="text-[1.12rem] font-bold text-zinc-500">TOP 10 文章累计引用频次</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1.5">
              <span className="text-[1rem] font-bold text-zinc-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                DeepSeek：<strong className="text-zinc-800 font-['Montserrat']">{plat.deepseek}</strong>
              </span>
              <span className="text-[1rem] font-bold text-zinc-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                豆包：<strong className="text-zinc-800 font-['Montserrat']">{plat.doubao}</strong>
              </span>
              <span className="text-[1rem] font-bold text-zinc-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                元宝：<strong className="text-zinc-800 font-['Montserrat']">{plat.yuanbao}</strong>
              </span>
              <span className="text-[1rem] font-bold text-zinc-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                通义千问：<strong className="text-zinc-800 font-['Montserrat']">{plat.qwen}</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 flex flex-col">
          <div className="flex-1 min-h-0 rounded-2xl border border-zinc-200/80 bg-white overflow-hidden shadow-sm flex flex-col">
            <div className="bg-slate-50 border-b border-zinc-200 px-6 py-3.5 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-black text-zinc-800">投放文章 TOP 10 引用效能数据</h3>
              <span className="text-sm font-bold text-zinc-400">数据来源：{report.delivery.source}（截至 {sourceDate}）</span>
            </div>

            <div className="flex-grow overflow-hidden w-full">
              <table className="w-full h-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-zinc-200 text-[0.92rem] font-extrabold text-zinc-700">
                    <th className="py-1.5 px-3 w-[5%] text-center">排序</th>
                    <th className="py-1.5 px-3 w-[36%]">文章标题</th>
                    <th className="py-1.5 px-3 w-[14%]">发布渠道</th>
                    <th className="py-1.5 px-3 w-[9%] text-center">发布时间</th>
                    <th className="py-1.5 px-3 w-[7%] text-center">总引用数</th>
                    <th className="py-1.5 px-3 w-[7%] text-center">DeepSeek</th>
                    <th className="py-1.5 px-3 w-[6%] text-center">豆包</th>
                    <th className="py-1.5 px-3 w-[6%] text-center">元宝</th>
                    <th className="py-1.5 px-3 w-[6%] text-center">通义</th>
                    <th className="py-1.5 px-3 w-[4%] text-center">是否被引</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-[0.95rem] font-bold text-zinc-750">
                  <tr className="bg-slate-50/20 font-black text-zinc-900">
                    <td className="py-1.5 px-3 text-center text-zinc-400 text-sm">—</td>
                    <td className="py-1.5 px-3 text-[1rem]">【全量 {ov.delivery_articles} 篇总计】</td>
                    <td className="py-1.5 px-3 text-zinc-400">—</td>
                    <td className="py-1.5 px-3 text-zinc-400 text-center">—</td>
                    <td className="py-1.5 px-3 text-base font-black text-center text-[#004CE5] font-['Montserrat',sans-serif]">{plat.total}</td>
                    <td className="py-1.5 px-3 text-[0.95rem] font-black text-center text-zinc-800 font-['Montserrat',sans-serif]">{plat.deepseek}</td>
                    <td className="py-1.5 px-3 text-[0.95rem] font-black text-center text-zinc-800 font-['Montserrat',sans-serif]">{plat.doubao}</td>
                    <td className="py-1.5 px-3 text-[0.95rem] font-black text-center text-zinc-800 font-['Montserrat',sans-serif]">{plat.yuanbao}</td>
                    <td className="py-1.5 px-3 text-[0.95rem] font-black text-center text-zinc-800 font-['Montserrat',sans-serif]">{plat.qwen}</td>
                    <td className="py-1.5 px-3 text-[0.95rem] font-black text-center text-emerald-600 font-['Montserrat',sans-serif]">{ov.cited_articles}/{ov.delivery_articles}</td>
                  </tr>

                  {top10.map((row) => (
                    <tr key={row.rank} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-2 px-3 text-center text-[0.95rem] font-black font-['Montserrat',sans-serif] text-zinc-900">{row.rank}</td>
                      <td className="py-2 px-3 text-[0.95rem] font-bold text-zinc-900 truncate max-w-0" title={row.title}>{row.title}</td>
                      <td className="py-2 px-3 text-[0.9rem] font-black text-zinc-800 truncate max-w-0" title={row.platform}>{row.platform}</td>
                      <td className="py-2 px-3 text-[0.9rem] font-extrabold text-zinc-400 font-['Montserrat',sans-serif] text-center">{row.date}</td>
                      <td className="py-2 px-3 text-base font-black text-center text-[#004CE5] font-['Montserrat',sans-serif]">{row.total}</td>
                      <td className="py-2 px-3 text-[0.9rem] font-extrabold text-center text-zinc-700 font-['Montserrat',sans-serif]">{row.deepseek}</td>
                      <td className="py-2 px-3 text-[0.9rem] font-extrabold text-center text-zinc-700 font-['Montserrat',sans-serif]">{row.doubao}</td>
                      <td className="py-2 px-3 text-[0.9rem] font-extrabold text-center text-zinc-700 font-['Montserrat',sans-serif]">{row.yuanbao}</td>
                      <td className="py-2 px-3 text-[0.9rem] font-extrabold text-center text-zinc-700 font-['Montserrat',sans-serif]">{row.qwen}</td>
                      <td className={`py-2 px-3 text-[0.9rem] font-black text-center ${row.isCited === '是' ? 'text-emerald-600' : 'text-zinc-300'}`}>{row.isCited}</td>
                    </tr>
                  ))}

                  <tr className="bg-white">
                    <td colSpan={10} className="py-2.5 text-center text-zinc-400 font-black text-xl tracking-widest leading-none select-none border-t border-zinc-200 bg-slate-50/20">
                      •••
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
