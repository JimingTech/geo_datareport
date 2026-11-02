import React from 'react';
import report from '../data/musiOctReport.json';

const brandName = '慕思智能床';
const data = report.products.smart;

export default function Page_CompetitorAnalysis() {
  const mentionRateData = data.compare.mention_rate;
  const top1RateData = data.compare.top1;
  const influenceData = data.compare.influence;

  const renderTable = (title, headers, rows, { nameWidth = '52%', valueWidth = '30%', valueSize = '32px', headerSize = '18px' } = {}) => {
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
                <th className="py-3 px-2 w-[16%]"></th>
                <th className="py-3 px-2 text-lg font-black text-zinc-500" style={{ width: nameWidth }}>{headers[0]}</th>
                <th className="py-3 px-2 font-black text-zinc-500 text-right whitespace-nowrap" style={{ width: valueWidth, fontSize: headerSize }}>{headers[1]}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item, idx) => {
                const isBrand = item.isTarget || item.name === brandName;
                const rank = item.rank || idx + 1;
                let rankElement;
                if (rank === 1) {
                  rankElement = (
                    <div className="w-10 h-10 rounded-full bg-[#FFD100] text-zinc-900 flex items-center justify-center font-black text-xl shadow-sm">1</div>
                  );
                } else if (rank === 2) {
                  rankElement = (
                    <div className="w-10 h-10 rounded-full bg-zinc-200 text-zinc-600 flex items-center justify-center font-black text-xl">2</div>
                  );
                } else if (rank === 3) {
                  rankElement = (
                    <div className="w-10 h-10 rounded-full bg-[#FFC085] text-zinc-800 flex items-center justify-center font-black text-xl shadow-sm">3</div>
                  );
                } else {
                  rankElement = <div className="text-zinc-400 font-bold text-[22px] text-center w-10">{rank}</div>;
                }

                return (
                  <tr
                    key={idx}
                    className={`border-b border-zinc-100 last:border-none hover:bg-slate-50/50 transition-colors ${isBrand ? 'bg-[#004CE5]/[0.03]' : ''}`}
                  >
                    <td className="py-3 px-2 align-middle">
                      <div className="flex justify-center">{rankElement}</div>
                    </td>
                    <td className="py-3 px-2 align-middle">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`text-[1.4rem] truncate ${isBrand ? 'font-black text-[#004CE5]' : 'font-bold text-zinc-800'}`}>
                          {item.name}
                        </span>
                        {isBrand && (
                          <span className="px-2 py-0.5 text-[0.8rem] font-bold rounded bg-zinc-100 text-zinc-500 border border-zinc-200/50 shrink-0">
                            目标产品
                          </span>
                        )}
                      </div>
                    </td>
                    <td className={`py-3 px-2 text-right align-middle font-black font-['Montserrat',sans-serif] tracking-tight ${isBrand ? 'text-[#004CE5]' : 'text-zinc-700'}`} style={{ fontSize: valueSize }}>
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
          慕思智能床竞品分析
          <span className="text-2xl font-bold text-zinc-400 ml-4">（2026年10月）</span>
        </h1>
      </div>

      <div className="flex-grow flex flex-col min-h-0 justify-start">
        <div className="grid grid-cols-3 gap-6 h-[490px] shrink-0 mt-4">
          {renderTable('提及率排名', ['产品名称', '提及率'], mentionRateData)}
          {renderTable('Top1提及率排名', ['产品名称', 'Top1提及率'], top1RateData)}
          {renderTable('竞品排名', ['产品名称', '行业影响力排名'], influenceData, { valueSize: '28px', headerSize: '16px' })}
        </div>

        <div className="grid grid-cols-2 gap-8 h-[340px] shrink-0 mt-[60px]">
          <div className="flex flex-col gap-3 h-full min-h-0">
            <h2 className="text-2xl font-black text-zinc-900 flex items-center gap-2 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#004CE5]" />
              潜在竞争分析：
            </h2>
            <div className="flex-grow rounded-2xl bg-[#004CE5]/5 border border-[#004CE5]/20 p-5 flex flex-col justify-evenly min-h-0">
              <p className="text-[22px] leading-relaxed text-zinc-800 font-bold">
                1. 本品提及率87.2%、Top3 69.4%、竞品排名NO.1。Top1为31.7%，舒福德为38.3%，首推本月被舒福德超过。
              </p>
              <div className="h-px bg-[#004CE5]/10 my-1" />
              <p className="text-[22px] leading-relaxed text-zinc-800 font-bold">
                2. 舒福德提及率76.1%，是最接近的竞品。喜临门、梦百合、舒达的提及率分别为43.3%、38.3%、32.2%。竞品排名舒福德NO.2，喜临门NO.3，梦百合、舒达分列NO.4、NO.5。
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
                { num: '01', title: '拉回首推', desc: 'Top1为31.7%，舒福德为38.3%。在止鼾、零重力词条补上具体对比，把首推做回第一。' },
                { num: '02', title: '守住竞品排名', desc: '竞品排名仍是NO.1，舒福德为NO.2。2万价位和品质售后词条继续把首选说清楚。' },
                { num: '03', title: '稳住提及', desc: '提及率87.2%，舒福德为76.1%。家庭场景和口碑词条继续覆盖，别让舒福德再靠近。' },
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
