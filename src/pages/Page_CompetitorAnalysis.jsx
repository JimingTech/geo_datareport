import React from 'react';
import report from '../data/taoliSeptemberReport.json';

const TARGET = '桃李面包';
const compare = report.products.toc.compare;

function displayName(item) {
  return item.isTarget ? TARGET : item.name;
}

function parsePct(value) {
  return Number(String(value).replace('%', ''));
}

const mentionRateData = [...compare.mention_rate]
  .sort((a, b) => parsePct(b.value) - parsePct(a.value))
  .map((item, i) => ({ name: displayName(item), value: `${parsePct(item.value).toFixed(1)}%`, rank: i + 1 }));

const top1RateData = [...compare.top1]
  .sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99))
  .map((item) => ({ name: displayName(item), value: `${parsePct(item.value).toFixed(1)}%`, rank: item.rank }));

const influenceData = [...compare.influence]
  .sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99))
  .map((item) => ({ name: displayName(item), value: `NO. ${item.rank}`, rank: item.rank }));

export default function Page_CompetitorAnalysis() {
  const renderRank = (rank) => {
    if (rank === 1) {
      return <div className="w-10 h-10 rounded-full bg-[#FFD100] text-zinc-900 flex items-center justify-center font-black text-xl shadow-sm">1</div>;
    }
    if (rank === 2) {
      return <div className="w-10 h-10 rounded-full bg-zinc-200 text-zinc-600 flex items-center justify-center font-black text-xl">2</div>;
    }
    if (rank === 3) {
      return <div className="w-10 h-10 rounded-full bg-[#FFC085] text-zinc-800 flex items-center justify-center font-black text-xl shadow-sm">3</div>;
    }
    return <div className="text-zinc-400 font-bold text-[22px] text-center w-10">{rank}</div>;
  };

  const renderTable = (title, headers, data) => {
    return (
      <div className="flex flex-col gap-3 h-full min-h-0">
        <h3 className="text-2xl font-extrabold text-zinc-800 tracking-wide pl-1.5 flex items-center gap-2 shrink-0">
          <span className="w-1.5 h-4.5 bg-[#004CE5] rounded-full shadow-[0_0_8px_rgba(0,76,229,0.25)]" />
          {title}
        </h3>
        <div className="flex-grow rounded-2xl border border-zinc-200 bg-white shadow-[0_6px_25px_rgba(0,0,0,0.01)] overflow-hidden flex flex-col p-4">
          <table className="w-full text-left border-collapse table-fixed flex-grow h-full">
            <thead>
              <tr className="border-b border-zinc-200 bg-slate-50/50">
                <th className="py-3 px-3 w-[18%]"></th>
                <th className="py-3 px-2 text-lg font-black text-zinc-500 w-[52%]">{headers[0]}</th>
                <th className="py-3 px-4 text-lg font-black text-zinc-500 w-[30%] text-right pr-6 whitespace-nowrap">{headers[1]}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => {
                const isBrand = item.name === TARGET;
                const rank = item.rank ?? idx + 1;
                return (
                  <tr
                    key={`${item.name}-${rank}`}
                    className={`border-b border-zinc-100 last:border-none hover:bg-slate-50/50 transition-colors ${isBrand ? 'bg-[#004CE5]/[0.03]' : ''}`}
                  >
                    <td className="py-3 px-3 align-middle">
                      <div className="flex justify-center">{renderRank(rank)}</div>
                    </td>
                    <td className="py-3 px-2 align-middle">
                      <div className="flex items-center flex-wrap gap-2">
                        <span className={`text-[1.4rem] ${isBrand ? 'font-black text-[#004CE5]' : 'font-bold text-zinc-800'}`}>
                          {item.name}
                        </span>
                        {isBrand && (
                          <span className="px-2 py-0.5 text-[0.8rem] font-bold rounded bg-zinc-100 text-zinc-500 border border-zinc-200/50">
                            目标产品
                          </span>
                        )}
                      </div>
                    </td>
                    <td className={`py-3 px-4 text-right pr-6 align-middle text-[32px] font-black font-['Montserrat',sans-serif] whitespace-nowrap ${isBrand ? 'text-[#004CE5]' : 'text-zinc-700'}`}>
                      {item.value}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col px-12 sm:px-16 pt-[22px] pb-8 text-zinc-800 font-sans justify-between overflow-hidden">
      <div className="flex items-center shrink-0 mb-3">
        <div className="w-2 h-10 bg-[#004CE5] rounded-full shadow-[0_0_15px_rgba(0,76,229,0.25)]" />
        <h1 className="text-4xl font-black text-zinc-900 tracking-wider ml-4 flex items-center">
          ToC 竞品分析
          <span className="text-2xl font-bold text-zinc-400 ml-4">（2026年10月）</span>
        </h1>
      </div>

      <div className="flex-grow flex flex-col min-h-0 justify-start">
        <div className="grid grid-cols-3 gap-6 h-[490px] shrink-0 mt-4">
          {renderTable('提及率排名', ['产品名称', '提及率'], mentionRateData)}
          {renderTable('Top1提及率排名', ['产品名称', 'Top1提及率'], top1RateData)}
          {renderTable('综合竞品排名', ['产品名称', '综合排名'], influenceData)}
        </div>

        <div className="grid grid-cols-2 gap-8 h-[340px] shrink-0 mt-[60px]">
          <div className="flex flex-col gap-3 h-full min-h-0">
            <h2 className="text-2xl font-black text-zinc-900 flex items-center gap-2 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#004CE5]" />
              潜在竞争分析：
            </h2>
            <div className="flex-grow rounded-2xl bg-[#004CE5]/5 border border-[#004CE5]/20 p-5 flex flex-col justify-evenly min-h-0">
              <p className="text-[22px] leading-relaxed text-zinc-800 font-bold">
                1. 桃李已拿下曝光与影响力双第一：提及率 82.8% 领先豪士 25.6 个百分点，综合竞品排名稳居 NO.1。
              </p>
              <div className="h-px bg-[#004CE5]/10 my-1" />
              <p className="text-[22px] leading-relaxed text-zinc-800 font-bold">
                2. 首推领先最接近的竞品：Top1 51.1%，高于豪士 40.0 个百分点；义利、山姆、盒马已进入首推分流。
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
                {
                  num: '01',
                  title: '扩大首推领先',
                  desc: 'Top1 现为 51.1%，高于 9月 42.2%，继续在早餐、早八、平价短保词条强化「首选桃李」表述。',
                },
                {
                  num: '02',
                  title: '拦截豪士',
                  desc: '豪士是最接近的竞品（提及率 57.2%、Top1 11.1%），需在同台推荐中明确桃李更优的结论。',
                },
                {
                  num: '03',
                  title: '守住综合竞品排名',
                  desc: '综合竞品排名现居 NO.1，继续在推荐清单类语料中前置桃李，防止曼可顿、嘉顿继续贴近。',
                },
              ].map((strat) => (
                <div key={strat.num} className="flex items-start gap-3">
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
