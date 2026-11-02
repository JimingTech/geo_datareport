import React from 'react';
import smart from '../data/geoReport_182_2026-10-25.json';
import ai from '../data/geoReport_181_2026-10-27.json';
import mattress from '../data/geoReport_239_2026-10-25.json';

const PRODUCTS = [
  { name: '慕思智能床', stats: smart.stats.platform_stats },
  { name: '慕思AI床垫', stats: ai.stats.platform_stats },
  { name: '慕思床垫', stats: mattress.stats.platform_stats },
];

function fmtPct(v) {
  return `${Number(v)}%`;
}

export default function Page_PlatformMentionRates() {
  return (
    <div className="w-full h-full flex flex-col px-14 pt-[22px] pb-8 text-zinc-800 font-sans overflow-hidden bg-slate-50">
      <div className="flex items-center shrink-0 mb-5">
        <div className="w-2 h-10 bg-[#004CE5] rounded-full" />
        <h1 className="text-4xl font-black text-zinc-900 tracking-wider ml-4">
          三产品各AI平台提及率现状
          <span className="text-2xl font-bold text-zinc-400 ml-4">（2026年10月）</span>
        </h1>
      </div>

      <div className="flex-1 min-h-0 flex flex-col gap-4">
        {PRODUCTS.map((product) => (
          <div key={product.name} className="flex-1 min-h-0 flex rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
            <div className="w-[72px] shrink-0 bg-[#004CE5] text-white flex items-center justify-center">
              <span className="font-black text-xl tracking-[0.25em]" style={{ writingMode: 'vertical-rl' }}>
                {product.name}
              </span>
            </div>
            <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-3 p-4">
              {product.stats.map((platform) => (
                <div
                  key={platform.platform_id}
                  className="rounded-xl border border-zinc-100 bg-slate-50/80 px-4 flex items-center gap-3"
                >
                  <img
                    src={platform.platform_logo}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover bg-white border border-white shadow-sm shrink-0"
                  />
                  <div className="text-lg font-bold text-zinc-600 shrink-0">
                    {platform.platform_name.toLowerCase() === 'kimi' ? 'Kimi' : platform.platform_name}
                  </div>
                  <div className="ml-auto text-4xl font-black text-[#004CE5] font-['Montserrat',sans-serif] leading-none">
                    {fmtPct(platform.brand_mention_rate)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
