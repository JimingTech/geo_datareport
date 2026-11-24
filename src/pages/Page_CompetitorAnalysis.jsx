import React from 'react';
import report from '../data/chuangweiOctoberReport.json';

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

const COPY = {
  all: {
    title: '创维电视（全部词条）竞品分析',
    analysis: [
      '1. 海信提及率 67.6%、Top1 15.8%，综合竞品排名 NO.2，是离创维电视最近的对手；TCL 提及率 60%、Top1 8.6%，排在 NO.3。小米、雷鸟落在 27% 左右。',
      '2. 创维电视 11 月提及率 83.4%，综合竞品排名保持 NO.1。Top1 由 10 月的 29.6% 升至 48.2%，Top3 由 45.7% 升至 65.1%，两项排名都保持 NO.1。',
    ],
    strategies: [
      { num: '01', title: '拉开海信', desc: '全部词条领先海信 15.8 个点。同台对比里继续把创维电视写成更明确的第一选择。' },
      { num: '02', title: '盯住 DeepSeek', desc: '元宝已从 10 月的 67.1% 升到 79.6%。DeepSeek 76.3%，是四端里最低的；通义千问 89.5%，豆包 88.2%。' },
      { num: '03', title: '大词贴得很近', desc: '37 个大词提及率 80.4%→79.7%，综合排名由 NO.2 进至 NO.1，但仍只领先 TCL 3.3 个点。' },
    ],
  },
  ex_form: {
    title: '创维电视（除壁纸、超薄以外）竞品分析',
    analysis: [
      '1. 「除壁纸、超薄以外」这一组里，海信提及率 68.6%、Top1 19.3%，仍是最近的对手；TCL 提及率 63.4%、Top1 9%，排在 NO.3。雷鸟 32%，小米 29.2%。',
      '2. 创维电视提及率由 10 月的 80.3% 升至 80.9%，综合竞品排名保持 NO.1。Top1 22.1%→40.1%，排名保持 NO.1。Top3 由 38.8%（NO.3）升至 57.5%（NO.1）。',
    ],
    strategies: [
      { num: '01', title: '守住对海信的领先', desc: '提及率领先海信 12.3 个点（80.9% 对 68.6%）。综合排名仍是 NO.1，继续把第一选择写清楚。' },
      { num: '02', title: '盯住 DeepSeek', desc: '元宝已从 10 月的 58.8% 升到 76.3%。DeepSeek 从 74.6% 降到 70.2%，现在是这一组里最低的一端。' },
      { num: '03', title: '大词 Top3 还没跟上', desc: '这一组 Top3 已从 NO.3 进到 NO.1。37 个大词的 Top3 仍是 51.4%，排名还是 NO.3。' },
    ],
  },
  big: {
    title: '创维电视（大词）竞品分析',
    analysis: [
      '1. 大词上创维电视提及率 79.7%，综合竞品排名 NO.1。TCL 提及率 76.4%，只差 3.3 个点；海信提及率 74.3%、Top1 23.6%，综合排名仍是 NO.2。',
      '2. 创维电视 Top1 由 10 月的 20.3%（NO.2）升至 33.8%（NO.1），综合竞品排名由 NO.2 进至 NO.1。提及率 80.4%→79.7%。豆包 86.5%，通义千问 97.3%；DeepSeek 64.9%，元宝 70.3%。',
    ],
    strategies: [
      { num: '01', title: '拉开贴身的 TCL', desc: '37 个大词里提及率只领先 TCL 3.3 个点。海信 Top1 23.6%，仍是 Top1 上最近的对手。' },
      { num: '02', title: '先补 DeepSeek', desc: 'DeepSeek 从 10 月的 67.6% 降到 64.9%，元宝从 62.2% 升到 70.3%。通义千问停在 97.3%。先把 DeepSeek 补上去。' },
      { num: '03', title: '把 Top3 做成第一', desc: 'Top3 由 10 月的 33.8% 升至 51.4%，排名仍是 NO.3。大词进了推荐名单，还要再往前排。' },
    ],
  },
};

export default function Page_CompetitorAnalysis({ productKey = 'all' }) {
  const product = report.products[productKey];
  const copy = COPY[productKey];
  const compare = product.compare;

  const renderTable = (title, headers, rows) => {
    const display = withGap(rows);
    return (
      <div className="flex flex-col gap-3 h-full min-h-0">
        <h3 className="text-2xl font-extrabold text-zinc-800 tracking-wide pl-1.5 flex items-center gap-2 shrink-0">
          <span className="w-1.5 h-4.5 bg-[#004CE5] rounded-full shadow-[0_0_8px_rgba(0,76,229,0.25)]" />
          {title}
        </h3>
        <div className="flex-grow rounded-2xl border border-zinc-200 bg-white shadow-[0_6px_25px_rgba(0,0,0,0.01)] overflow-hidden flex flex-col p-4">
          <table className="w-full text-left border-collapse table-fixed">
            <thead>
              <tr className="border-b border-zinc-200 bg-slate-50/50">
                <th className="py-3 px-3 w-[16%]"></th>
                <th className="py-3 px-2 text-lg font-black text-zinc-500 w-[54%]">{headers[0]}</th>
                <th className="py-3 px-4 text-lg font-black text-zinc-500 w-[30%] text-right pr-6">{headers[1]}</th>
              </tr>
            </thead>
            <tbody>
              {display.map((item, idx) => {
                if (item.type === 'gap') {
                  return (
                    <tr key={`gap-${idx}`}>
                      <td colSpan={3} className="h-8 text-center text-zinc-300 font-black text-xl tracking-[0.4em] leading-none select-none">
                        ···
                      </td>
                    </tr>
                  );
                }
                const isBrand = !!item.isTarget;
                return (
                  <tr
                    key={`${item.name}-${item.rank ?? idx}`}
                    className={`border-b border-zinc-100 last:border-none hover:bg-slate-50/50 transition-colors ${isBrand ? 'bg-[#004CE5]/[0.03]' : ''}`}
                  >
                    <td className="h-[68px] py-0 px-3 align-middle">
                      <div className="flex justify-center">
                        <RankBadge rank={item.rank} index={idx} />
                      </div>
                    </td>
                    <td className="h-[68px] py-0 px-2 align-middle">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`text-[1.25rem] truncate ${isBrand ? 'font-black text-[#004CE5]' : 'font-bold text-zinc-800'}`}>
                          {item.name}
                        </span>
                        {isBrand && (
                          <span className="px-2 py-0.5 text-[0.75rem] font-bold rounded bg-zinc-100 text-zinc-500 border border-zinc-200/50 shrink-0">
                            目标产品
                          </span>
                        )}
                      </div>
                    </td>
                    <td className={`h-[68px] py-0 px-4 text-right pr-6 align-middle text-[30px] font-black font-['Montserrat',sans-serif] ${isBrand ? 'text-[#004CE5]' : 'text-zinc-700'}`}>
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
          {copy.title}
          <span className="text-2xl font-bold text-zinc-400 ml-4">（{report.meta.label}）</span>
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
              <p className="text-[22px] leading-relaxed text-zinc-800 font-bold">{copy.analysis[0]}</p>
              <div className="h-px bg-[#004CE5]/10 my-1" />
              <p className="text-[22px] leading-relaxed text-zinc-800 font-bold">{copy.analysis[1]}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 h-full min-h-0">
            <h2 className="text-2xl font-black text-zinc-900 flex items-center gap-2 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#004CE5]" />
              重点优化策略：
            </h2>
            <div className="flex-grow rounded-2xl bg-[#004CE5]/[0.015] border border-[#004CE5]/15 p-5 flex flex-col justify-evenly min-h-0">
              {copy.strategies.map((strat) => (
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
