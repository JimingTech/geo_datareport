import React from 'react';
import platformData from '../data/platform_entries.json';

const PLATFORM_NAMES = {
  1: 'DeepSeek',
  2: '豆包',
  4: '文心',
  6: 'Kimi'
};

const LOGOS = {
  1: 'https://app.geoindexfuture.com/logo/deepseek.png',
  2: 'https://app.geoindexfuture.com/logo/doubao.png',
  4: 'https://app.geoindexfuture.com/logo/wenxin.webp',
  6: 'https://app.geoindexfuture.com/logo/kimi.png'
};

/** 词条明细按当月口径展示。标题和筛选栏只写月份，不要写具体日，也不要「最近更新时间」列。 */

export default function Page_QueryDataSystemLink({ projectId = 123, platformId = 1 }) {
  const data = platformData[String(projectId)]?.[String(platformId)] || [];
  const productName = projectId === 123 ? '古井贡酒古16' : '古井贡酒古20';
  const platformName = PLATFORM_NAMES[platformId] || '';

  const dateLabel = '2026年10月';
  const dateRangeLabel = '10月';
  const slideTitle = `${projectId === 123 ? '古16' : '古20'}词条数据明细（${platformName}）`;

  return (
    <div className="w-full h-full flex flex-col px-10 pt-5 pb-5 text-zinc-900 font-sans justify-start overflow-hidden bg-white">
      {/* Slide H1 Title (PPT Deck Standard) */}
      <div className="flex items-center shrink-0 mb-4">
        <div className="w-2 h-10 bg-[#004CE5] rounded-full shadow-[0_0_15px_rgba(0,76,229,0.25)]" />
        <h1 className="text-4xl font-black text-zinc-900 tracking-wider ml-4">
          {slideTitle}
          <span className="text-2xl font-bold text-zinc-400 ml-4">（{dateLabel}）</span>
        </h1>
      </div>

      {/* Title (Matches user screenshot: simple text "词条", no extra header bars) */}
      <div className="flex items-center shrink-0 mb-1">
        <h2 className="text-[20px] font-black text-zinc-900 tracking-tight">
          词条
        </h2>
      </div>

      {/* Filter Bar (Matches user screenshot exactly) */}
      <div className="flex items-center justify-between p-1.5 mb-3 shrink-0 text-[13px] font-medium text-zinc-500">
        <div className="flex items-center gap-3">
          {/* Date Picker */}
          <div className="flex items-center gap-1.5 bg-white border border-zinc-200/80 rounded-md px-3 py-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer hover:border-zinc-300 transition-colors">
            <span className="text-zinc-400 text-xs">📅</span>
            <span className="text-zinc-550">日期</span>
            <span className="text-zinc-400 text-[10px] ml-1">{dateRangeLabel}</span>
            <span className="text-zinc-300 text-[9px] ml-1">▼</span>
          </div>

          {/* Platform Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-zinc-200/80 rounded-md px-3 py-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer hover:border-zinc-300 transition-colors">
            <span className="text-zinc-400 text-xs">🤖</span>
            <span className="text-zinc-550">平台</span>
            <span className="text-zinc-800 font-bold ml-1">{platformName}</span>
            <span className="text-zinc-300 text-[9px] ml-1">▼</span>
          </div>

          {/* Keyword Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-zinc-200/80 rounded-md px-3 py-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] cursor-pointer hover:border-zinc-300 transition-colors">
            <span className="text-zinc-400 text-xs">📝</span>
            <span className="text-zinc-550">词条</span>
            <span className="text-zinc-400 text-[10px] ml-1">全部</span>
            <span className="text-zinc-300 text-[9px] ml-1">▼</span>
          </div>

          {/* Blue Product Pill Badge */}
          <div className="flex items-center gap-1.5 bg-[#f0f4ff] border border-[#dbe4ff] rounded-md px-3 py-1.5 text-[#004CE5] font-extrabold text-[12px] shadow-sm ml-1">
            <span className="text-[#004CE5] text-xs">❖</span>
            <span>目标产品 | {productName}</span>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-400">平台对比</span>
            <div className="w-8 h-4.5 bg-zinc-200 rounded-full p-0.5 cursor-pointer flex items-center justify-start">
              <div className="w-3.5 h-3.5 bg-white rounded-full shadow-sm" />
            </div>
          </div>
          <button className="border border-zinc-200 bg-white rounded-md px-3 py-1.5 shadow-sm hover:bg-slate-50 transition-colors text-zinc-650 flex items-center gap-1">
            ⚙ 管理列
          </button>
        </div>
      </div>

      {/* Keyword Table (Clean White Table, No Grey Header background, Overlapping Logos) */}
      <div className="flex-grow min-h-0 border border-zinc-150 bg-white rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.015)] flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-white border-b border-zinc-150 text-[13px] font-extrabold text-zinc-400 sticky top-0 z-10">
                <th className="py-3 px-3 w-[5%] text-center">
                  <div className="w-3.5 h-3.5 rounded-full border border-zinc-300 bg-white cursor-pointer mx-auto" />
                </th>
                <th className="py-3 px-2 w-[6%] text-center">序号</th>
                <th className="py-3 px-4 w-[44%] text-left font-black text-zinc-500">词条</th>
                <th className="py-3 px-3 w-[14%] text-center font-black text-zinc-500">提及率 ↓</th>
                <th className="py-3 px-3 w-[16%] text-center font-black text-zinc-500">top1提及率</th>
                <th className="py-3 px-3 w-[12%] text-center font-black text-zinc-500">监测平台</th>
                <th className="py-3 px-3 w-[13%] text-center font-black text-zinc-500">会话截图</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-[13px] font-medium text-zinc-650">
              {data.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/20 transition-colors h-[38px]">
                  <td className="py-1 px-3 text-center">
                    <div className="w-3.5 h-3.5 rounded-full border border-zinc-300 bg-white cursor-pointer mx-auto hover:border-[#004CE5] transition-colors" />
                  </td>
                  <td className="py-1 px-2 text-center text-zinc-400 font-sans text-xs">{idx + 1}</td>
                  <td className="py-1 px-4 text-zinc-800 truncate font-semibold text-left" title={row.entry_name}>
                    {row.entry_name}
                  </td>
                  <td className="py-1 px-3 text-center font-bold text-zinc-700 font-sans">
                    {row.mention_rate}
                  </td>
                  <td className="py-1 px-3 text-center text-zinc-500 font-sans">
                    {row.top1_mention_rate}
                  </td>
                  <td className="py-1 px-3 text-center">
                    {/* 本页数据已按 platformId 过滤，监测平台只渲染当前这一个图标 */}
                    <img
                      src={LOGOS[platformId]}
                      alt={platformName}
                      title={platformName}
                      className="w-[18px] h-[18px] rounded-full object-cover border border-white bg-white shadow-sm mx-auto"
                    />
                  </td>
                  <td className="py-1 px-3 text-center">
                    {row.last_screenshot_url ? (
                      <div className="relative group inline-block leading-none">
                        <img 
                          src={row.last_screenshot_url}
                          alt="截图"
                          className="w-[24px] h-[30px] object-cover rounded border border-zinc-200 cursor-pointer hover:border-[#004CE5] transition-colors mx-auto shadow-sm"
                          onClick={() => window.open(row.last_screenshot_url, '_blank')}
                        />
                        <div className="hidden group-hover:flex absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] px-1.5 py-0.5 rounded shadow whitespace-nowrap z-20 pointer-events-none">
                          点击查看大图
                        </div>
                      </div>
                    ) : (
                      <span className="text-zinc-300 text-xs">--</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination bar (Matches user screenshot exactly) */}
        <div className="border-t border-zinc-150 px-4 py-2.5 bg-white flex items-center justify-between shrink-0 text-xs font-bold text-zinc-500">
          <div className="flex items-center gap-3">
            <span>共 {data.length} 条数据</span>
            <div className="flex items-center gap-1 bg-white border border-zinc-200 rounded px-1.5 py-0.5 text-zinc-600 cursor-pointer hover:border-zinc-300">
              <span>每页行数 20</span>
              <span className="text-[9px] text-zinc-400">▼</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400">
            <button className="w-6 h-6 flex items-center justify-center hover:text-zinc-700 cursor-pointer text-sm">«</button>
            <button className="w-6 h-6 flex items-center justify-center hover:text-zinc-700 cursor-pointer text-sm">‹</button>
            <button className="w-6 h-6 bg-zinc-900 text-white rounded flex items-center justify-center font-extrabold text-xs shadow-sm">1</button>
            <button className="w-6 h-6 flex items-center justify-center hover:text-zinc-700 cursor-pointer text-sm">›</button>
            <button className="w-6 h-6 flex items-center justify-center hover:text-zinc-700 cursor-pointer text-sm">»</button>
          </div>
        </div>
      </div>
    </div>
  );
}
