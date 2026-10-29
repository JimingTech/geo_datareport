import React from 'react';
import report from '../data/jingdongReport.json';

const platformData = report.platform_entries;

const PLATFORM_NAMES = {
  1: 'DeepSeek',
  2: '豆包',
  3: '元宝',
  4: '文心',
  5: '通义千问',
  6: 'Kimi',
};

const LOGOS = {
  1: 'https://app.geoindexfuture.com/logo/deepseek.png',
  2: 'https://app.geoindexfuture.com/logo/doubao.png',
  3: 'https://app.geoindexfuture.com/logo/yuanbao.png',
  4: 'https://app.geoindexfuture.com/logo/wenxin.webp',
  5: 'https://app.geoindexfuture.com/logo/qwen.png',
  6: 'https://app.geoindexfuture.com/logo/kimi.png',
};

const PRODUCT_META = {
  5195: { short: '京东口腔①', full: '京东大健康(京东健康、京东买药、京东大药房)' },
};

export default function Page_QueryDataSystemLink({
  projectId = 5195,
  platformId = 1,
  pageIndex = 0,
  pageSize = 19,
}) {
  const allData = platformData[String(platformId)] || [];
  const total = allData.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(pageIndex, totalPages - 1);
  const data = allData.slice(safePage * pageSize, safePage * pageSize + pageSize);
  const startRank = safePage * pageSize;

  const product = PRODUCT_META[projectId] || { short: '京东口腔①', full: '京东大健康(京东健康、京东买药、京东大药房)' };
  const platformName = PLATFORM_NAMES[platformId] || '';
  const slideTitle = `${product.short}词条数据明细（${platformName}）`;

  return (
    <div className="w-full h-full flex flex-col px-10 pt-3 pb-3 text-zinc-900 font-sans justify-start overflow-hidden bg-white">
      <div className="flex items-center shrink-0 mb-2">
        <div className="w-2 h-10 bg-[#004CE5] rounded-full shadow-[0_0_15px_rgba(0,76,229,0.25)]" />
        <h1 className="text-4xl font-black text-zinc-900 tracking-wider ml-4">
          {slideTitle}
          <span className="text-2xl font-bold text-zinc-400 ml-4">（2026年10月）</span>
        </h1>
      </div>

      <div className="flex items-center justify-between p-1 mb-1.5 shrink-0 text-[13px] font-medium text-zinc-500">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white border border-zinc-200/80 rounded-md px-3 py-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <span className="text-zinc-400 text-xs">📅</span>
            <span>日期</span>
            <span className="text-zinc-400 text-[10px] ml-1">{report.meta.october_date.slice(5)}</span>
            <span className="text-zinc-300 text-[9px] ml-1">▼</span>
          </div>

          <div className="flex items-center gap-1.5 bg-white border border-zinc-200/80 rounded-md px-3 py-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <span className="text-zinc-400 text-xs">🤖</span>
            <span>平台</span>
            <span className="text-zinc-800 font-bold ml-1">{platformName}</span>
            <span className="text-zinc-300 text-[9px] ml-1">▼</span>
          </div>

          <div className="flex items-center gap-1.5 bg-white border border-zinc-200/80 rounded-md px-3 py-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <span className="text-zinc-400 text-xs">📝</span>
            <span>词条</span>
            <span className="text-zinc-400 text-[10px] ml-1">全部</span>
            <span className="text-zinc-300 text-[9px] ml-1">▼</span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#f0f4ff] border border-[#dbe4ff] rounded-md px-3 py-1.5 text-[#004CE5] font-extrabold text-[12px] shadow-sm ml-1">
            <span className="text-[#004CE5] text-xs">❖</span>
            <span>目标产品 | {product.full}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-400">平台对比</span>
            <div className="w-8 h-4.5 bg-zinc-200 rounded-full p-0.5 flex items-center justify-start">
              <div className="w-3.5 h-3.5 bg-white rounded-full shadow-sm" />
            </div>
          </div>
          <button type="button" className="border border-zinc-200 bg-white rounded-md px-3 py-1.5 shadow-sm text-zinc-650 flex items-center gap-1">
            ⚙ 管理列
          </button>
        </div>
      </div>

      <div className="flex-grow min-h-0 border border-zinc-150 bg-white rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.015)] flex flex-col">
        <div className="flex-1 overflow-hidden">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="bg-white border-b border-zinc-150 text-[13px] font-extrabold text-zinc-400">
                <th className="py-1.5 px-3 w-[5%] text-center">
                  <div className="w-3.5 h-3.5 rounded-full border border-zinc-300 bg-white mx-auto" />
                </th>
                <th className="py-1.5 px-2 w-[6%] text-center">序号</th>
                <th className="py-1.5 px-4 w-[36%] text-left font-black text-zinc-500">词条</th>
                <th className="py-1.5 px-3 w-[12%] text-center font-black text-zinc-500">提及率 ↓</th>
                <th className="py-1.5 px-3 w-[16%] text-center font-black text-zinc-500 whitespace-nowrap">top1提及率</th>
                <th className="py-1.5 px-3 w-[12%] text-center font-black text-zinc-500">监测平台</th>
                <th className="py-1.5 px-3 w-[11%] text-center font-black text-zinc-500">会话截图</th>
                <th className="py-1.5 px-4 w-[12%] text-center font-black text-zinc-500">最近更新时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-[13px] font-medium text-zinc-650">
              {data.map((row, idx) => (
                <tr key={`${row.entry_name}-${idx}`} className="hover:bg-slate-50/20 transition-colors h-[34px]">
                  <td className="py-0 px-3 text-center">
                    <div className="w-3.5 h-3.5 rounded-full border border-zinc-300 bg-white mx-auto" />
                  </td>
                  <td className="py-0 px-2 text-center text-zinc-400 font-sans text-xs">{startRank + idx + 1}</td>
                  <td className="py-0 px-4 text-zinc-800 truncate font-semibold text-left" title={row.entry_name}>
                    {row.entry_name}
                  </td>
                  <td className="py-0 px-3 text-center font-bold text-zinc-700 font-sans">{row.mention_rate}</td>
                  <td className="py-0 px-3 text-center text-zinc-500 font-sans">{row.top1_mention_rate}</td>
                  <td className="py-0 px-3 text-center">
                    <div className="inline-flex items-center justify-center">
                      <img
                        src={LOGOS[platformId]}
                        alt=""
                        className="w-[16px] h-[16px] rounded-full object-cover border border-white bg-white shadow-sm"
                      />
                    </div>
                  </td>
                  <td className="py-0 px-3 text-center">
                    {row.last_screenshot_url ? (
                      <div className="relative group inline-block leading-none">
                        <img
                          src={row.last_screenshot_url}
                          alt="截图"
                          className="w-[18px] h-[22px] object-cover rounded border border-zinc-200 mx-auto shadow-sm"
                        />
                      </div>
                    ) : (
                      <span className="text-zinc-300 text-xs">--</span>
                    )}
                  </td>
                  <td className="py-0 px-4 text-center text-zinc-400 font-sans text-xs">
                    {row.last_conversation_time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-zinc-150 px-4 py-1.5 bg-white flex items-center justify-between shrink-0 text-xs font-bold text-zinc-500">
          <div className="flex items-center gap-3">
            <span>共 {total} 条数据</span>
            <div className="flex items-center gap-1 bg-white border border-zinc-200 rounded px-1.5 py-0.5 text-zinc-600">
              <span>每页行数 {pageSize}</span>
              <span className="text-[9px] text-zinc-400">▼</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400">
            <button type="button" className="w-6 h-6 flex items-center justify-center text-sm">«</button>
            <button type="button" className="w-6 h-6 flex items-center justify-center text-sm">‹</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                type="button"
                className={`w-6 h-6 rounded flex items-center justify-center font-extrabold text-xs ${
                  i === safePage ? 'bg-zinc-900 text-white shadow-sm' : 'hover:text-zinc-700'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button type="button" className="w-6 h-6 flex items-center justify-center text-sm">›</button>
            <button type="button" className="w-6 h-6 flex items-center justify-center text-sm">»</button>
          </div>
        </div>
      </div>
    </div>
  );
}
