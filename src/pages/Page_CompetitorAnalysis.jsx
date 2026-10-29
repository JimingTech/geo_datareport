import React from 'react';
import report from '../data/awadaOctoberReport.json';

const { compare } = report;

function RankBadge({ rank, index }) {
  const n = rank || index + 1;
  if (n === 1) {
    return (
      <div className="w-10 h-10 rounded-full bg-[#FFD100] text-zinc-900 flex items-center justify-center font-black text-xl shadow-sm">1</div>
    );
  }
  if (n === 2) {
    return (
      <div className="w-10 h-10 rounded-full bg-zinc-200 text-zinc-600 flex items-center justify-center font-black text-xl">2</div>
    );
  }
  if (n === 3) {
    return (
      <div className="w-10 h-10 rounded-full bg-[#FFC085] text-zinc-800 flex items-center justify-center font-black text-xl shadow-sm">3</div>
    );
  }
  return <div className="text-zinc-400 font-bold text-[22px] text-center w-10">{n}</div>;
}

function withGap(rows) {
  const out = [];
  rows.forEach((row, i) => {
    const prevRank = i > 0 ? (rows[i - 1].rank ?? i) : 0;
    const currRank = row.rank ?? i + 1;
    if (i > 0 && currRank > prevRank + 1) out.push({ type: 'gap' });
    out.push({ type: 'row', ...row });
  });
  return out;
}

export default function Page_CompetitorAnalysis() {
  const renderTable = (title, headers, rows) => {
    const display = withGap(rows);
    return (
      <div className="flex flex-col gap-3 h-full min-h-0">
        <h3 className="text-2xl font-extrabold text-zinc-800 tracking-wide pl-1.5 flex items-center gap-2 shrink-0">
          <span className="w-1.5 h-4.5 bg-[#004CE5] rounded-full shadow-[0_0_8px_rgba(0,76,229,0.25)]" />
          {title}
        </h3>
        <div className="flex-grow rounded-2xl border border-zinc-200 bg-white shadow-[0_6px_25px_rgba(0,0,0,0.01)] overflow-hidden flex flex-col min-h-0 px-4 pt-2 pb-3">
          <div className="grid grid-cols-[44px_minmax(0,1fr)_138px] items-center border-b border-zinc-200 shrink-0">
            <div />
            <div className="py-3 px-2 text-lg font-black text-zinc-500">{headers[0]}</div>
            <div className="py-3 pr-1 text-lg font-black text-zinc-500 text-right whitespace-nowrap">{headers[1]}</div>
          </div>
          <div className="flex-1 flex flex-col min-h-0">
            {display.map((item, idx) => {
              if (item.type === 'gap') {
                return (
                  <div key={`gap-${idx}`} className="h-7 shrink-0 flex items-center justify-center text-zinc-300 font-black text-xl tracking-[0.4em] leading-none select-none">
                    ···
                  </div>
                );
              }
              const isBrand = !!item.isTarget;
              return (
                <div
                  key={`${item.name}-${item.rank ?? idx}`}
                  className={`flex-1 min-h-0 grid grid-cols-[44px_minmax(0,1fr)_138px] items-center border-b border-zinc-100 last:border-none ${isBrand ? 'bg-[#004CE5]/[0.04] -mx-4 px-4' : ''}`}
                >
                  <div className="flex justify-center">
                    <RankBadge rank={item.rank} index={idx} />
                  </div>
                  <div className="min-w-0 px-2 flex items-center gap-2">
                    <span className={`truncate text-[1.25rem] leading-none ${isBrand ? 'font-black text-[#004CE5]' : 'font-bold text-zinc-800'}`}>
                      {item.name}
                    </span>
                    {isBrand && (
                      <span className="shrink-0 px-2 py-0.5 text-[0.75rem] font-bold leading-none rounded bg-zinc-100 text-zinc-500 border border-zinc-200/50">
                        目标产品
                      </span>
                    )}
                  </div>
                  <div className={`pr-2 text-right text-[30px] font-black font-['Montserrat',sans-serif] leading-none whitespace-nowrap ${isBrand ? 'text-[#004CE5]' : 'text-zinc-700'}`}>
                    {item.value}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col px-12 sm:px-16 pt-[22px] pb-8 text-zinc-800 font-sans justify-between overflow-hidden">
      <div className="flex items-center shrink-0 mb-3">
        <div className="w-2 h-10 bg-[#004CE5] rounded-full shadow-[0_0_15px_rgba(0,76,229,0.25)]" />
        <h1 className="text-4xl font-black text-zinc-900 tracking-wider ml-4 flex items-center">
          Awada竞品分析
          <span className="text-2xl font-bold text-zinc-400 ml-4">（2026年10月）</span>
        </h1>
      </div>

      <div className="flex-grow flex flex-col min-h-0 justify-start">
        <div className="grid grid-cols-3 gap-6 h-[490px] shrink-0 mt-4">
          {renderTable('提及率排名', ['产品名称', '提及率'], compare.mention_rate)}
          {renderTable('Top1提及率排名', ['产品名称', 'Top1提及率'], compare.top1)}
          {renderTable('综合竞品排名', ['产品名称', '综合竞品排名'], compare.influence)}
        </div>

        <div className="grid grid-cols-2 gap-8 h-[340px] shrink-0 mt-[60px]">
          <div className="flex flex-col gap-3 h-full min-h-0">
            <h2 className="text-2xl font-black text-zinc-900 flex items-center gap-2 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#004CE5]" />
              潜在竞争分析：
            </h2>
            <div className="flex-grow rounded-2xl bg-[#004CE5]/5 border border-[#004CE5]/20 p-5 flex flex-col justify-evenly min-h-0">
              <p className="text-[22px] leading-relaxed text-zinc-800 font-bold">
                1. 火枫提及率 71.9%、Top1 30%，综合竞品排名 NO.1。爱路客、Snow Peak、挪客的提及率分别是 35.6%、28.1%、27.5%。
              </p>
              <div className="h-px bg-[#004CE5]/10 my-1" />
              <p className="text-[22px] leading-relaxed text-zinc-800 font-bold">
                2. Awada 提及率 23.1%，提及率排名 NO.6；综合竞品排名由 9月的 NO.16 进至 NO.4。Top1 为 12.5%，排在火枫之后。
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 h-full min-h-0">
            <h2 className="text-2xl font-black text-zinc-900 flex items-center gap-2 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#004CE5]" />
              重点优化策略：
            </h2>
            <div className="flex-grow rounded-2xl bg-[#004CE5]/[0.015] border border-[#004CE5]/15 p-5 flex flex-col justify-evenly min-h-0">
              {[
                { num: '01', title: '对着火枫补首推', desc: '火枫 Top1 30%，Awada 12.5%。专业餐厨和精致露营的推荐里写明首选 Awada。' },
                { num: '02', title: '跟上爱路客', desc: '爱路客提及率 35.6%，提及率排名第 2。泛选购大词继续铺。' },
                { num: '03', title: '继续抬排名', desc: '综合竞品排名现为 NO.4。推荐里把首选 Awada 写清楚，先把提及率往挪客的 27.5% 靠。' },
              ].map((strat, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-[#004CE5] font-black text-2xl shrink-0 mt-0.5">{strat.num}</span>
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
    </div>
  );
}
