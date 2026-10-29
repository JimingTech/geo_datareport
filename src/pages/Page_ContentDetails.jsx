import React from 'react';
import contentDetails from '../data/content_details.json';

const PLATFORMS = [
  { key: 'deepseek', label: 'DeepSeek', color: 'bg-emerald-500' },
  { key: 'doubao', label: '豆包', color: 'bg-blue-500' },
  { key: 'qwen', label: '通义千问', color: 'bg-purple-500' },
];

export function ContentDetailsPage({ productKey, title }) {
  const detail = contentDetails[productKey];
  const topArticles = detail.top10;
  const {
    total_articles: totalArticles,
    cited_articles: citedArticles,
    citation_rate: citationRate,
    total_citations: totalCitations,
    by_platform: byPlatform,
    channels,
  } = detail;
  const citedModels = PLATFORMS.filter((p) => (byPlatform[p.key] || 0) > 0).map((p) => p.label);

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
              <span className="text-6xl font-black text-zinc-900 font-['Montserrat',sans-serif]">{totalArticles}</span>
              <span className="text-2xl font-black text-zinc-800 ml-1">篇</span>
            </div>
            <div className="text-[1.12rem] font-bold text-zinc-500">全网总投放量</div>
            <p className="text-[1rem] font-bold text-zinc-400 leading-relaxed mt-1">
              覆盖渠道：{channels.join('、')}等。
            </p>
          </div>

          <div className="flex flex-col gap-2.5 justify-center border-l border-zinc-200/80 pl-8">
            <div className="flex items-center gap-2">
              <span className="w-2 h-4 rounded-full bg-emerald-500" />
              <span className="text-sm font-extrabold text-zinc-400 uppercase tracking-widest font-['Montserrat']">CITATION RATE</span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-6xl font-black text-emerald-600 font-['Montserrat',sans-serif]">{citationRate}%</span>
              <span className="text-2xl font-black text-emerald-600 ml-1">被引率</span>
            </div>
            <div className="text-[1.12rem] font-bold text-emerald-600">
              ( {citedArticles} / {totalArticles} 篇投放已被引用 )
            </div>
            <p className="text-[1rem] font-bold text-zinc-400 leading-relaxed mt-1">
              投放到{channels.slice(0, 3).join('、')}等渠道已顺利通过{citedModels.join('、')}等大模型的检索。
            </p>
          </div>

          <div className="flex flex-col gap-2.5 justify-center border-l border-zinc-200/80 pl-8">
            <div className="flex items-center gap-2">
              <span className="w-2 h-4 rounded-full bg-zinc-800" />
              <span className="text-sm font-extrabold text-zinc-400 uppercase tracking-widest font-['Montserrat']">EFFECTIVE CITATIONS</span>
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-6xl font-black text-zinc-900 font-['Montserrat',sans-serif]">{totalCitations.toLocaleString()}</span>
              <span className="text-2xl font-black text-zinc-800 ml-1">次</span>
            </div>
            <div className="text-[1.12rem] font-bold text-zinc-500">累计引用频次</div>
            <div className="grid grid-cols-3 gap-x-4 gap-y-1 mt-1.5">
              {PLATFORMS.map((p) => (
                <span key={p.key} className="text-sm font-bold text-zinc-500 flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${p.color}`} />
                  {p.label}：<strong className="text-zinc-800 font-['Montserrat']">{byPlatform[p.key] || 0}</strong>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 flex flex-col">
          <div className="flex-1 min-h-0 rounded-2xl border border-zinc-200/80 bg-white overflow-hidden shadow-sm flex flex-col">
            <div className="bg-slate-50 border-b border-zinc-200 px-6 py-3.5 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-black text-zinc-800">投放文章 TOP 10 引用效能数据</h3>
            </div>

            <div className="flex-grow overflow-hidden w-full">
              <table className="w-full h-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-zinc-200 text-[0.92rem] font-extrabold text-zinc-700">
                    <th className="py-1.5 px-3 w-[5%] text-center">排序</th>
                    <th className="py-1.5 px-3 w-[38%]">文章标题</th>
                    <th className="py-1.5 px-3 w-[12%]">发布平台</th>
                    <th className="py-1.5 px-3 w-[9%] text-center">发布时间</th>
                    <th className="py-1.5 px-3 w-[8%] text-center">总引用数</th>
                    <th className="py-1.5 px-3 w-[8%] text-center">DeepSeek</th>
                    <th className="py-1.5 px-3 w-[6%] text-center">豆包</th>
                    <th className="py-1.5 px-3 w-[8%] text-center">通义</th>
                    <th className="py-1.5 px-3 w-[6%] text-center">是否被引</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-[0.95rem] font-bold">
                  <tr className="bg-slate-50/20 font-black text-zinc-900">
                    <td className="py-1.5 px-3 text-center text-zinc-400 text-sm">—</td>
                    <td className="py-1.5 px-3 text-[1rem]">【总计汇总】</td>
                    <td className="py-1.5 px-3 text-zinc-400">—</td>
                    <td className="py-1.5 px-3 text-zinc-400">—</td>
                    <td className="py-1.5 px-3 text-base font-black text-center text-[#004CE5] font-['Montserrat',sans-serif]">{totalCitations}</td>
                    <td className="py-1.5 px-3 text-[0.95rem] font-black text-center text-zinc-800 font-['Montserrat',sans-serif]">{byPlatform.deepseek || 0}</td>
                    <td className="py-1.5 px-3 text-[0.95rem] font-black text-center text-zinc-800 font-['Montserrat',sans-serif]">{byPlatform.doubao || 0}</td>
                    <td className="py-1.5 px-3 text-[0.95rem] font-black text-center text-zinc-800 font-['Montserrat',sans-serif]">{byPlatform.qwen || 0}</td>
                    <td className="py-1.5 px-3 text-[0.95rem] font-black text-center text-emerald-600 font-['Montserrat',sans-serif]">{citedArticles}/{totalArticles}</td>
                  </tr>
                  {topArticles.map((row) => (
                    <tr key={`${row.rank}-${row.title}`} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-2 px-3 text-center text-[0.95rem] font-black font-['Montserrat',sans-serif] text-zinc-900">{row.rank}</td>
                      <td className="py-2 px-3 text-[0.95rem] font-bold text-zinc-900 truncate max-w-0" title={row.title}>{row.title}</td>
                      <td className="py-2 px-3 text-[0.92rem] font-black text-zinc-800 truncate">{row.platform}</td>
                      <td className="py-2 px-3 text-[0.9rem] font-extrabold text-zinc-400 font-['Montserrat',sans-serif] text-center">{row.date}</td>
                      <td className="py-2 px-3 text-base font-black text-center text-[#004CE5] font-['Montserrat',sans-serif]">{row.total}</td>
                      <td className="py-2 px-3 text-[0.9rem] font-extrabold text-center text-zinc-700 font-['Montserrat',sans-serif]">{row.deepseek}</td>
                      <td className="py-2 px-3 text-[0.9rem] font-extrabold text-center text-zinc-700 font-['Montserrat',sans-serif]">{row.doubao}</td>
                      <td className="py-2 px-3 text-[0.9rem] font-extrabold text-center text-zinc-700 font-['Montserrat',sans-serif]">{row.qwen}</td>
                      <td className="py-2 px-3 text-[0.9rem] font-black text-center text-emerald-600">{row.isCited}</td>
                    </tr>
                  ))}
                  <tr className="bg-white">
                    <td colSpan={9} className="py-2.5 text-center text-zinc-400 font-black text-xl tracking-widest leading-none select-none border-t border-zinc-200 bg-slate-50/20">
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

export default function Page_ContentDetails() {
  return <ContentDetailsPage productKey="toc" title="桃李面包 ToC 投放明细" />;
}
