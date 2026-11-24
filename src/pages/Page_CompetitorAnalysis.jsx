import React from 'react';

export default function Page_CompetitorAnalysis() {
  const TARGET = '古井贡酒·古16';

  // 数据口径：2026年11月17日单日（数据系统项目 351）
  const mentionRateData = [
    { name: TARGET, value: '90.0%' },
    { name: '水晶剑', value: '81.7%' },
    { name: '国缘四开', value: '56.7%' },
    { name: '青花20', value: '50.0%' },
    { name: '红花郎10', value: '48.3%' },
  ];

  const top1RateData = [
    { name: TARGET, value: '38.3%' },
    { name: '国缘四开', value: '20.0%' },
    { name: '国缘对开', value: '11.7%' },
    { name: '水晶剑', value: '10.0%' },
    { name: '普五八代', value: '8.3%' },
  ];

  // 竞品排名 = 行业影响力排名，展示 NO. n，不要写影响力指数
  const influenceData = [
    { name: TARGET, value: 'NO. 1' },
    { name: '水晶剑', value: 'NO. 2' },
    { name: '国缘四开', value: 'NO. 3' },
    { name: '青花20', value: 'NO. 4' },
    { name: '红花郎10', value: 'NO. 5' },
  ];

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
                const rank = idx + 1;

                let rankElement;
                if (rank === 1) {
                  rankElement = (
                    <div className="w-10 h-10 rounded-full bg-[#FFD100] text-zinc-900 flex items-center justify-center font-black text-xl shadow-sm">
                      1
                    </div>
                  );
                } else if (rank === 2) {
                  rankElement = (
                    <div className="w-10 h-10 rounded-full bg-zinc-200 text-zinc-600 flex items-center justify-center font-black text-xl">
                      2
                    </div>
                  );
                } else if (rank === 3) {
                  rankElement = (
                    <div className="w-10 h-10 rounded-full bg-[#FFC085] text-zinc-800 flex items-center justify-center font-black text-xl shadow-sm">
                      3
                    </div>
                  );
                } else {
                  rankElement = (
                    <div className="text-zinc-400 font-bold text-[22px] text-center w-10">
                      {rank}
                    </div>
                  );
                }

                return (
                  <tr
                    key={idx}
                    className={`border-b border-zinc-100 last:border-none hover:bg-slate-50/50 transition-colors ${isBrand ? 'bg-[#004CE5]/[0.03]' : ''
                      }`}
                  >
                    <td className="py-3 px-3 align-middle">
                      <div className="flex justify-center">{rankElement}</div>
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
                    <td className={`py-3 px-4 text-right pr-6 align-middle text-[32px] font-black font-['Montserrat',sans-serif] whitespace-nowrap ${isBrand ? 'text-[#004CE5]' : 'text-zinc-700'
                      }`}>
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
      {/* Title Area */}
      <div className="flex items-center shrink-0 mb-3">
        <div className="w-2 h-10 bg-[#004CE5] rounded-full shadow-[0_0_15px_rgba(0,76,229,0.25)]" />
        <h1 className="text-4xl font-black text-zinc-900 tracking-wider ml-4 flex items-center">
          古16竞品分析
          <span className="text-2xl font-bold text-zinc-400 ml-4">（2026年11月17日）</span>
        </h1>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-h-0 justify-start">
        {/* Three Tables Side-by-Side Area (Taller height - 490px, completely untouched) */}
        <div className="grid grid-cols-3 gap-6 h-[490px] shrink-0 mt-4">
          {renderTable('提及率排名', ['产品名称', '提及率'], mentionRateData)}
          {renderTable('Top1提及率排名', ['产品名称', 'Top1提及率'], top1RateData)}
          {renderTable('竞品排名', ['产品名称', '行业影响力排名'], influenceData)}
        </div>

        {/* Bottom Spacious Dashboard Area (Increased to 340px for taller containers, exactly 60px gap below tables) */}
        <div className="grid grid-cols-2 gap-8 h-[340px] shrink-0 mt-[60px]">
          {/* Left Column: 潜在竞争分析 */}
          <div className="flex flex-col gap-3 h-full min-h-0">
            <h2 className="text-2xl font-black text-zinc-900 flex items-center gap-2 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#004CE5]" />
              潜在竞争分析：
            </h2>
            <div className="flex-grow rounded-2xl bg-[#004CE5]/5 border border-[#004CE5]/20 p-5 flex flex-col justify-evenly min-h-0">
              <p className="text-[22px] leading-relaxed text-zinc-800 font-bold">
                1. 古16提及率90.0%仍领先水晶剑（81.7%）8.3个百分点，较上月91.7%回落1.7个百分点；竞品排名稳守 NO.1，水晶剑居 NO.2。
              </p>
              <div className="h-px bg-[#004CE5]/10 my-1" />
              <p className="text-[22px] leading-relaxed text-zinc-800 font-bold">
                2. 古16 Top1提及率由50.0%回落至38.3%，仍领先国缘四开（20.0%）；国缘对开（11.7%）和水晶剑（10.0%）也在分走首推，需要盯住。
              </p>
            </div>
          </div>

          {/* Right Column: 重点优化策略 */}
          <div className="flex flex-col gap-3 h-full min-h-0">
            <h2 className="text-2xl font-black text-zinc-900 flex items-center gap-2 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#004CE5]" />
              重点优化策略：
            </h2>
            <div className="flex-grow rounded-2xl bg-[#004CE5]/[0.015] border border-[#004CE5]/15 p-5 flex flex-col justify-evenly min-h-0">
              {[
                {
                  num: '01',
                  title: '守住提及率优势',
                  desc: '仍领先水晶剑8.3个百分点（90.0% vs 81.7%），继续压住婚宴场景曝光，防止水晶剑回抢。',
                },
                {
                  num: '02',
                  title: '守住竞品排名',
                  desc: '行业影响力稳居 NO.1，需盯住水晶剑（NO.2）与国缘四开（NO.3）。',
                },
                {
                  num: '03',
                  title: '首推回稳',
                  desc: 'Top1回落至38.3%，仍领先国缘四开（20.0%）。守住婚宴高转化词条，压住国缘四开和国缘对开（11.7%）抢首推。',
                },
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
