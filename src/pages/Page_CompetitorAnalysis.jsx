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
          <span className="text-2xl font-bold text-zinc-400 ml-4">（2026年11月）</span>
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
              竞争格局分析：
            </h2>
            <div className="flex-grow rounded-2xl bg-[#004CE5]/5 border border-[#004CE5]/20 p-5 flex flex-col justify-evenly min-h-0">
              <p className="text-[22px] leading-relaxed text-zinc-800 font-bold">
                1. 火枫提及率 65.6%、Top1 26.3%，综合竞品排名 NO.1。Awada（34.4%）、挪客（31.3%）、牧高笛（29.4%）、爱路客（28.1%）位列 2–5 名。
              </p>
              <div className="h-px bg-[#004CE5]/10 my-1" />
              <p className="text-[22px] leading-relaxed text-zinc-800 font-bold">
                2. Awada 提及率由 10月的 23.1% 升至 34.4%，提及率排名由 NO.6 跃升至 NO.2；综合竞品排名由 NO.5 升至 NO.2。Top1 达 16.3%，稳居第二。
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 h-full min-h-0">
            <h2 className="text-2xl font-black text-zinc-900 flex items-center gap-2 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#004CE5]" />
              最终竞争地位总结：
            </h2>
            <div className="flex-grow rounded-2xl bg-[#004CE5]/[0.015] border border-[#004CE5]/15 p-5 flex flex-col justify-evenly min-h-0">
              {[
                { num: '01', title: '全榜稳居行业第二', desc: 'Awada 在提及率（34.4%）、Top1 提及率（16.3%）与综合竞品排名中全部稳居行业第 2，竞争地位高度巩固。' },
                { num: '02', title: '大幅超越成熟传统品牌', desc: '全面拉开与挪客（31.3%）、牧高笛（29.4%）、爱路客（28.1%）的竞争差距，成功实现后发先至。' },
                { num: '03', title: '首推竞争壁垒牢固树立', desc: 'Top1 提及率达到 16.3%，是第 3 名牧高笛（5.6%）的近 3 倍，在露营厨具大模型问答中建立起极为稳固的首推心智。' },
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
