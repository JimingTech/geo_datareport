import React from 'react';
import report from '../data/musiOctReport.json';
import delivery from '../data/delivery_excel_1029.json';

const BLUE = '#0050F0';
const GRAY = '#808080';
const INK = '#1A1A1A';

const ROWS = [
  { key: 'smart', deliveryKey: 'smart' },
  { key: 'ai', deliveryKey: 'ai' },
  { key: 'mattress', deliveryKey: 'mattress' },
];

function fmtPct(v) {
  return `${Number(v)}%`;
}

function fmtRank(v) {
  return `NO.${v}`;
}

function VerticalProductName({ name }) {
  const parts = name.split(/(AI)/).filter(Boolean);
  return (
    <div className="flex flex-col items-center justify-center text-white font-black leading-none">
      {parts.map((part, pi) =>
        part === 'AI' ? (
          <span key={pi} className="text-[15px] tracking-normal my-[2px]">
            AI
          </span>
        ) : (
          [...part].map((ch, i) => (
            <span key={`${pi}-${i}`} className="text-[17px] my-[1px]">
              {ch}
            </span>
          ))
        ),
      )}
    </div>
  );
}

function GradientArrow() {
  const id = React.useId().replace(/:/g, '');
  return (
    <svg width="108" height="32" viewBox="0 0 108 32" aria-hidden="true" className="mx-auto">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#B9D4FF" stopOpacity="0" />
          <stop offset="38%" stopColor="#7AADFF" stopOpacity="0.28" />
          <stop offset="72%" stopColor="#2B6EF6" stopOpacity="0.72" />
          <stop offset="100%" stopColor="#0050F0" stopOpacity="1" />
        </linearGradient>
      </defs>
      <path d="M0 11.2h62V3.4L108 16 62 28.6V20.8H0z" fill={`url(#${id})`} />
    </svg>
  );
}

function MetricRow({ label, before, after, format = fmtPct, last = false }) {
  return (
    <div
      className={`grid items-center h-full text-center ${last ? '' : 'border-b border-[#E6EBF2]'}`}
      style={{ gridTemplateColumns: '1.25fr 0.55fr 0.85fr 0.32fr 0.55fr 1fr' }}
    >
      <div className="text-[1.85rem] font-black" style={{ color: BLUE }}>
        {label}
      </div>
      <div className="text-[17px] font-bold" style={{ color: INK }}>
        9月
      </div>
      <div className="text-[1.7rem] font-black font-['Montserrat',sans-serif]" style={{ color: INK }}>
        {format(before)}
      </div>
      <div className="flex items-center justify-center">
        <GradientArrow />
      </div>
      <div className="text-[17px] font-bold" style={{ color: INK }}>
        10月
      </div>
      <div className="text-[2.65rem] font-black font-['Montserrat',sans-serif] leading-none" style={{ color: BLUE }}>
        {format(after)}
      </div>
    </div>
  );
}

export default function Page_PhaseSummary() {
  const { platforms, entries, conversations } = report.scope;
  const articleTotal = ROWS.reduce(
    (sum, { deliveryKey }) => sum + delivery[deliveryKey].overview.delivery_articles,
    0,
  );
  const citationTotal = ROWS.reduce(
    (sum, { deliveryKey }) => sum + delivery[deliveryKey].overview.delivery_citations,
    0,
  );

  return (
    <div
      className="w-full h-full flex flex-col px-12 pt-8 pb-7 font-sans overflow-hidden bg-[#F3F5F8] text-[#1C2430]"
    >
      <div className="flex items-center shrink-0">
        <div className="w-[7px] h-9 rounded-full" style={{ backgroundColor: BLUE }} />
        <h1 className="text-[2.15rem] font-black tracking-wide ml-4 text-[#1A1F2B]">慕思GEO优化阶段性总结</h1>
      </div>

      <div className="shrink-0 mt-4 rounded-2xl bg-white border border-[#E6EBF2] px-8 py-4 text-center shadow-[0_4px_16px_rgba(20,30,50,0.03)]">
        <p className="text-[1.45rem] font-black leading-relaxed text-[#1A1A1A]">
          10月三组产品对照9月，竞品排名仍为NO.1，提及率保持高位。
        </p>
        <ul className="mt-1.5 mx-auto w-fit text-left text-[1.05rem] font-bold leading-[1.7] text-[#3A4352]">
          <li>
            · 覆盖{platforms}个核心AI平台、{entries}个监测词条，平台查询{conversations}次
          </li>
          <li>
            · 共产出{articleTotal.toLocaleString('zh-CN')}篇文章，累计被引用{citationTotal.toLocaleString('zh-CN')}次
          </li>
          <li>· 三组产品竞品排名均保持NO.1。智能床Top1为31.7%，低于舒福德的38.3%；普通床垫Top1为21.1%，与喜临门相同，排在第一。</li>
        </ul>
      </div>

      <div className="flex-1 min-h-0 mt-4 flex flex-col gap-3">
        {ROWS.map(({ key, deliveryKey }) => {
          const product = report.products[key];
          const articles = delivery[deliveryKey].overview;
          return (
            <div
              key={key}
              className="flex-1 min-h-0 flex items-stretch rounded-2xl bg-white border border-[#E5EAF1] px-3 py-2.5"
            >
              <div
                className="w-[58px] shrink-0 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: BLUE }}
              >
                <VerticalProductName name={product.name} />
              </div>

              <div className="w-[250px] shrink-0 flex items-center justify-center gap-3 border-r border-[#E6EBF2] mx-2">
                <div className="flex flex-col font-black text-[1.7rem] leading-[1.12]" style={{ color: BLUE }}>
                  <span>发</span>
                  <span>文</span>
                  <span>量</span>
                </div>
                <div>
                  <div className="flex items-baseline leading-none" style={{ color: INK }}>
                    <span className="text-[3.15rem] font-black font-['Montserrat',sans-serif]">
                      {articles.delivery_articles}
                    </span>
                    <span className="text-[1.55rem] font-black ml-0.5">篇</span>
                  </div>
                  <div className="mt-1 text-[15px] font-bold" style={{ color: GRAY }}>
                    被引率 {fmtPct(articles.citation_rate)}
                  </div>
                </div>
              </div>

              <div className="flex-1 min-w-0 grid pl-2 pr-2" style={{ gridTemplateRows: '1fr 1fr 1fr' }}>
                <MetricRow label="提及率" before={product.september.mention_rate} after={product.october.mention_rate} />
                <MetricRow
                  label="TOP1提及率"
                  before={product.september.top1_mention_rate}
                  after={product.october.top1_mention_rate}
                />
                <MetricRow
                  label="竞品排名"
                  before={product.september.influence_rank}
                  after={product.october.influence_rank}
                  format={fmtRank}
                  last
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Page_PhaseSummary.fullBleed = true;
