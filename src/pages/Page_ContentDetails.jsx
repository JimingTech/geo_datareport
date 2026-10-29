import React from 'react';
import report from '../data/jinjiuOctoberReport.json';

function createContentDetailsPage({ productKey, title }) {
  const data = report.products[productKey];
  const ov = data.delivery.overview;
  const plat = data.delivery.platform_totals;
  const topArticles = data.delivery.top10;
  const topChannels = data.delivery.top_channels || [];
  const channels = topChannels.slice(0, 6).join('、') || '今日头条、搜狐、新浪、网易、百家号、什么值得买';
  const leadChannels = topChannels.slice(0, 3).join('、') || '什么值得买、新浪、网易';

  return function ContentDetailsPage() {
    return (
      <div className="w-full h-full flex flex-col px-12 sm:px-16 pt-[22px] pb-8 text-zinc-900 font-sans bg-white">
        <div className="flex items-center shrink-0 mb-3">
          <div className="w-2 h-10 bg-[#004CE5] rounded-full shadow-[0_0_15px_rgba(0,76,229,0.25)]" />
          <h1 className="text-4xl font-black text-zinc-900 tracking-wider ml-4 flex items-center">
            {title}
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
              <div className="text-[1.12rem] font-bold text-zinc-500">全网总投放量</div>
              <p className="text-[1rem] font-bold text-zinc-400 leading-relaxed mt-1">
                覆盖渠道：{channels}等。
              </p>
            </div>

            <div className="flex flex-col gap-2.5 justify-center border-l border-zinc-200/80 pl-8">
              <div className="flex items-center gap-2">
                <span className="w-2 h-4 rounded-full bg-emerald-500" />
                <span className="text-sm font-extrabold text-zinc-400 uppercase tracking-widest font-['Montserrat']">CITATION RATE</span>
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-6xl font-black text-emerald-600 font-['Montserrat',sans-serif]">{ov.citation_rate}%</span>
                <span className="text-2xl font-black text-emerald-600 ml-1">被引率</span>
              </div>
              <div className="text-[1.12rem] font-bold text-emerald-600">
                ( {ov.cited_articles} / {ov.delivery_articles} 篇投放已被引用 )
              </div>
              <p className="text-[1rem] font-bold text-zinc-400 leading-relaxed mt-1">
                投放到{leadChannels}等渠道已顺利通过大模型检索。
              </p>
            </div>

            <div className="flex flex-col gap-2.5 justify-center border-l border-zinc-200/80 pl-8">
              <div className="flex items-center gap-2">
                <span className="w-2 h-4 rounded-full bg-zinc-800" />
                <span className="text-sm font-extrabold text-zinc-400 uppercase tracking-widest font-['Montserrat']">EFFECTIVE CITATIONS</span>
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-6xl font-black text-zinc-900 font-['Montserrat',sans-serif]">{plat.total.toLocaleString()}</span>
                <span className="text-2xl font-black text-zinc-800 ml-1">次</span>
              </div>
              <div className="text-[1.12rem] font-bold text-zinc-500">累计引用频次</div>
              <div className="grid grid-cols-3 gap-x-4 gap-y-1 mt-1.5">
                <span className="text-sm font-bold text-zinc-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  豆包：<strong className="text-zinc-800 font-['Montserrat']">{plat.doubao}</strong>
                </span>
                <span className="text-sm font-bold text-zinc-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Kimi：<strong className="text-zinc-800 font-['Montserrat']">{plat.kimi}</strong>
                </span>
                <span className="text-sm font-bold text-zinc-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  文心：<strong className="text-zinc-800 font-['Montserrat']">{plat.wenxin}</strong>
                </span>
                <span className="text-sm font-bold text-zinc-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  元宝：<strong className="text-zinc-800 font-['Montserrat']">{plat.yuanbao}</strong>
                </span>
                <span className="text-sm font-bold text-zinc-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  DeepSeek：<strong className="text-zinc-800 font-['Montserrat']">{plat.deepseek}</strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-0 flex flex-col">
            <div className="flex-1 min-h-0 rounded-2xl border border-zinc-200/80 bg-white overflow-hidden shadow-sm flex flex-col">
              <div className="bg-slate-50 border-b border-zinc-200 px-6 py-3.5 flex items-center justify-between shrink-0">
                <h3 className="text-lg font-black text-zinc-800">📊 投放文章 TOP 10 引用效能数据</h3>
              </div>
              <div className="flex-grow overflow-hidden w-full">
                <table className="w-full h-full text-left border-collapse table-fixed">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-zinc-200 text-[0.92rem] font-extrabold text-zinc-700">
                      <th className="py-1.5 px-3 w-[4%] text-center">排序</th>
                      <th className="py-1.5 px-3 w-[50%]">文章标题</th>
                      <th className="py-1.5 px-3 w-[7%]">发布平台</th>
                      <th className="py-1.5 px-3 w-[8%] text-center">发布时间</th>
                      <th className="py-1.5 px-3 w-[6%] text-center">总引用数</th>
                      <th className="py-1.5 px-3 w-[4%] text-center">DeepSeek</th>
                      <th className="py-1.5 px-3 w-[4%] text-center">豆包</th>
                      <th className="py-1.5 px-3 w-[4%] text-center">元宝</th>
                      <th className="py-1.5 px-3 w-[4%] text-center">文心</th>
                      <th className="py-1.5 px-3 w-[4%] text-center">Kimi</th>
                      <th className="py-1.5 px-3 w-[5%] text-center">是否被引</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-[0.95rem] font-bold text-zinc-750">
                    <tr className="bg-slate-50/20 font-black text-zinc-900">
                      <td className="py-1.5 px-3 text-center text-zinc-400 text-sm">—</td>
                      <td className="py-1.5 px-3 text-[1rem]">【总计汇总】</td>
                      <td className="py-1.5 px-3 text-zinc-400">—</td>
                      <td className="py-1.5 px-3 text-zinc-400">—</td>
                      <td className="py-1.5 px-3 text-base font-black text-center text-[#004CE5] font-['Montserrat',sans-serif]">{plat.total}</td>
                      <td className="py-1.5 px-3 text-[0.95rem] font-black text-center text-zinc-800 font-['Montserrat',sans-serif]">{plat.deepseek}</td>
                      <td className="py-1.5 px-3 text-[0.95rem] font-black text-center text-zinc-800 font-['Montserrat',sans-serif]">{plat.doubao}</td>
                      <td className="py-1.5 px-3 text-[0.95rem] font-black text-center text-zinc-800 font-['Montserrat',sans-serif]">{plat.yuanbao}</td>
                      <td className="py-1.5 px-3 text-[0.95rem] font-black text-center text-zinc-800 font-['Montserrat',sans-serif]">{plat.wenxin}</td>
                      <td className="py-1.5 px-3 text-[0.95rem] font-black text-center text-zinc-800 font-['Montserrat',sans-serif]">{plat.kimi}</td>
                      <td className="py-1.5 px-3 text-[0.95rem] font-black text-center text-emerald-600 font-['Montserrat',sans-serif]">{ov.cited_articles}/{ov.delivery_articles}</td>
                    </tr>
                    {topArticles.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-2 px-3 text-center text-[0.95rem] font-black font-['Montserrat',sans-serif] text-zinc-900">{row.rank}</td>
                        <td className="py-2 px-3 text-[0.95rem] font-bold text-zinc-900 truncate max-w-0" title={row.title}>{row.title}</td>
                        <td className="py-2 px-3 text-[0.92rem] font-black text-zinc-800">{row.platform}</td>
                        <td className="py-2 px-3 text-[0.9rem] font-extrabold text-zinc-400 font-['Montserrat',sans-serif] text-center">{row.date}</td>
                        <td className="py-2 px-3 text-base font-black text-center text-[#004CE5] font-['Montserrat',sans-serif]">{row.total}</td>
                        <td className="py-2 px-3 text-[0.9rem] font-extrabold text-center text-zinc-700 font-['Montserrat',sans-serif]">{row.deepseek}</td>
                        <td className="py-2 px-3 text-[0.9rem] font-extrabold text-center text-zinc-700 font-['Montserrat',sans-serif]">{row.doubao}</td>
                        <td className="py-2 px-3 text-[0.9rem] font-extrabold text-center text-zinc-700 font-['Montserrat',sans-serif]">{row.yuanbao}</td>
                        <td className="py-2 px-3 text-[0.9rem] font-extrabold text-center text-zinc-700 font-['Montserrat',sans-serif]">{row.wenxin}</td>
                        <td className="py-2 px-3 text-[0.9rem] font-extrabold text-center text-zinc-700 font-['Montserrat',sans-serif]">{row.kimi}</td>
                        <td className="py-2 px-3 text-[0.9rem] font-black text-center text-emerald-600">{row.isCited}</td>
                      </tr>
                    ))}
                    <tr className="bg-white">
                      <td colSpan={11} className="py-2.5 text-center text-zinc-400 font-black text-xl tracking-widest leading-none select-none border-t border-zinc-200 bg-slate-50/20">
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
  };
}

export default createContentDetailsPage({ productKey: 'jinjiu', title: '劲酒投放明细' });
export { createContentDetailsPage };
