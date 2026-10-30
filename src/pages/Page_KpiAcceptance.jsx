import React from 'react';
import report from '../data/jingdongReport.json';

const { kpi } = report;
const daily = kpi.daily_trend || [];

function fmtCnDate(d) {
  if (!d) return '';
  const [, month, day] = d.split('-');
  return `${Number(month)}月${Number(day)}日`;
}

// 走势图 SVG 渲染组件（精准、无多余复杂装饰、与项目蓝白风格一致）
function KpiTrendChart({ data, passLine = 60 }) {
  if (!data || data.length === 0) return null;

  const width = 940;
  const height = 480;
  const padding = { top: 48, right: 35, bottom: 42, left: 55 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // Y 轴刻度：30% ~ 85%
  const yMin = 30;
  const yMax = 85;

  const getX = (i) => padding.left + (i / (data.length - 1)) * chartW;
  const getY = (val) => padding.top + ((yMax - val) / (yMax - yMin)) * chartH;

  const y60 = getY(passLine);

  const points = data.map((d, i) => ({
    x: getX(i),
    y: getY(d.mention_rate),
    date: d.date.slice(5),
    rate: d.mention_rate,
    passed: d.passed,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${(padding.top + chartH).toFixed(1)} L ${points[0].x.toFixed(1)} ${(padding.top + chartH).toFixed(1)} Z`;

  const yTicks = [40, 50, 60, 70, 80];

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="kpiAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#004CE5" stopOpacity="0.18" />
            <stop offset="60%" stopColor="#004CE5" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#004CE5" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 水平网格线与 Y 轴刻度 */}
        {yTicks.map((val) => {
          const y = getY(val);
          const isTarget = val === passLine;
          return (
            <g key={val}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke={isTarget ? '#1D4ED8' : '#ECECEE'}
                strokeWidth={isTarget ? 1.8 : 1}
                strokeDasharray={isTarget ? '6 4' : 'none'}
              />
              <text
                x={padding.left - 10}
                y={y + 4.5}
                textAnchor="end"
                className={`text-[13px] font-['Montserrat'] font-bold ${isTarget ? 'fill-[#004CE5] font-black' : 'fill-zinc-400'}`}
              >
                {val}%
              </text>
            </g>
          );
        })}

        {/* 60% 达标基准线文字胶囊标识（置于左上方网格上方，无遮挡） */}
        <g transform={`translate(${padding.left + 8}, ${y60 - 24})`}>
          <rect width="112" height="20" rx="4" fill="#004CE5" fillOpacity="0.08" />
          <text x="56" y="14" textAnchor="middle" className="text-[11px] font-black fill-[#004CE5]">
            60% 达标基准线
          </text>
        </g>

        {/* 渐变阴影填充 */}
        <path d={areaPath} fill="url(#kpiAreaGrad)" />

        {/* 主走势曲线 */}
        <path d={linePath} fill="none" stroke="#004CE5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* 数据圆点与关键里程碑数值 */}
        {points.map((p, i) => {
          // 只在关键拐点显示数值：优化前基准(10-09)、首次达标(10-11)、峰值(10-26)、期末(10-31)
          const isKeyPoint = i === 0 || i === 2 || p.rate === kpi.max_qualified_rate || i === points.length - 1;

          return (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={isKeyPoint ? 5 : 3.5}
                fill={p.passed ? '#004CE5' : '#A1A1AA'}
                stroke="#FFFFFF"
                strokeWidth={isKeyPoint ? 2.5 : 1.5}
              />

              {isKeyPoint && (
                <text
                  x={p.x}
                  y={p.y - 10}
                  textAnchor="middle"
                  className="text-[13px] font-['Montserrat'] font-black fill-zinc-900"
                >
                  {p.rate.toFixed(1)}%
                </text>
              )}

              {/* X 轴日期（隔日展示，端庄清晰） */}
              {(i % 2 === 0 || i === points.length - 1) && (
                <text
                  x={p.x}
                  y={height - padding.bottom + 22}
                  textAnchor="middle"
                  className="text-[12px] font-['Montserrat'] font-bold fill-zinc-400"
                >
                  {p.date}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function Page_KpiAcceptance() {
  const passLine = kpi.pass_line || 60;
  const mid = Math.ceil(daily.length / 2);
  const columns = [daily.slice(0, mid), daily.slice(mid)];

  return (
    <div className="w-full h-full flex flex-col px-12 sm:px-16 pt-[22px] pb-8 text-zinc-900 font-sans bg-white overflow-hidden justify-between">
      {/* 页面主标题 */}
      <div className="flex items-center shrink-0 mb-4">
        <div className="w-2 h-10 bg-[#004CE5] rounded-full shadow-[0_0_15px_rgba(0,76,229,0.25)]" />
        <h1 className="text-4xl font-black text-zinc-900 tracking-wider ml-4 flex items-baseline gap-3">
          <span>KPI 验收情况</span>
          <span className="text-2xl font-bold text-zinc-400">
            （考核标准：任意 {kpi.target_days} 天，单日全平台提及率达到 {passLine}%）
          </span>
        </h1>
      </div>

      {/* 顶部 4 列指标卡片（纯粹统一的蓝白灰商务规范） */}
      <div className="grid grid-cols-4 gap-6 shrink-0 mb-4">
        {/* 卡片 1 */}
        <div className="rounded-2xl border border-zinc-200/90 bg-slate-50/60 p-5 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#004CE5]" />
            <span className="text-xs font-black text-zinc-400 uppercase tracking-wider font-['Montserrat']">
              ACCEPTANCE TYPE
            </span>
          </div>
          <div className="my-1">
            <p className="text-xs font-bold text-zinc-400">验收指标</p>
            <p className="text-2xl font-black text-zinc-900">品牌提及率</p>
          </div>
          <p className="text-xs font-bold text-zinc-500 border-t border-zinc-200/80 pt-2">
            单日全平台提及率达到 <span className="font-black text-[#004CE5] font-['Montserrat']">{passLine}%</span> 计为达标 1 天
          </p>
        </div>

        {/* 卡片 2 */}
        <div className="rounded-2xl border border-zinc-200/90 bg-slate-50/60 p-5 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#004CE5]" />
            <span className="text-xs font-black text-zinc-400 uppercase tracking-wider font-['Montserrat']">
              TARGET GOAL
            </span>
          </div>
          <div className="my-1">
            <p className="text-xs font-bold text-zinc-400">达标条件</p>
            <p className="text-2xl font-black text-zinc-900">
              任意 <span className="text-[#004CE5] font-['Montserrat',sans-serif]">{kpi.target_days}</span> 天达标
            </p>
          </div>
          <p className="text-xs font-bold text-zinc-500 border-t border-zinc-200/80 pt-2">
            优化前基准（10月9日）：<span className="font-['Montserrat',sans-serif] font-black text-zinc-800">{kpi.before_mention_rate}%</span>
          </p>
        </div>

        {/* 卡片 3 */}
        <div className="rounded-2xl border border-zinc-200/90 bg-slate-50/60 p-5 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#004CE5]" />
            <span className="text-xs font-black text-zinc-400 uppercase tracking-wider font-['Montserrat']">
              PERFORMANCE
            </span>
          </div>
          <div className="my-1">
            <p className="text-xs font-bold text-zinc-400">达标期日均提及率</p>
            <p className="text-2xl font-black text-[#004CE5] font-['Montserrat',sans-serif]">
              {kpi.avg_qualified_rate}%
            </p>
          </div>
          <p className="text-xs font-bold text-zinc-500 border-t border-zinc-200/80 pt-2">
            最高 <span className="font-['Montserrat',sans-serif] font-black text-[#004CE5]">{kpi.max_qualified_rate}%</span>
            <span className="text-zinc-300 mx-1.5">|</span>
            最低 <span className="font-['Montserrat',sans-serif] font-black text-zinc-700">{kpi.min_qualified_rate}%</span>
          </p>
        </div>

        {/* 卡片 4 */}
        <div className="rounded-2xl border border-[#004CE5]/25 bg-[#004CE5]/[0.03] p-5 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#004CE5]" />
            <span className="text-xs font-black text-[#004CE5] uppercase tracking-wider font-['Montserrat']">
              FINAL VERDICT
            </span>
          </div>
          <div className="my-1">
            <p className="text-xs font-bold text-[#004CE5]/80">验收结论</p>
            <p className="text-2xl font-black text-zinc-900">
              <span className="text-[#004CE5] font-['Montserrat',sans-serif]">{kpi.qualified_days_count}</span> 天全部达标
            </p>
          </div>
          <p className="text-xs font-bold text-zinc-700 border-t border-[#004CE5]/15 pt-2">
            已超过 {kpi.target_days} 天考核要求，超额达成！
          </p>
        </div>
      </div>

      {/* 底部联动布局：左侧走势图 (58%) + 右侧紧凑明细表 (42%) */}
      <div className="flex-1 min-h-0 grid grid-cols-12 gap-6">
        {/* 左侧：每日提及率走势追踪图 */}
        <div className="col-span-7 rounded-2xl border border-zinc-200 bg-white shadow-[0_4px_25px_rgba(0,0,0,0.01)] p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between shrink-0 mb-1">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#004CE5]" />
              <h2 className="text-lg font-black text-zinc-900">每日提及率走势追踪</h2>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold text-zinc-500">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#004CE5]" /> 每日提及率
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 border-b-2 border-dashed border-blue-600" /> 60% 达标线
              </span>
            </div>
          </div>

          <div className="flex-1 min-h-0 w-full pt-1">
            <KpiTrendChart data={daily} passLine={passLine} />
          </div>
        </div>

        {/* 右侧：每日监测数据明细表 */}
        <div className="col-span-5 rounded-2xl border border-zinc-200 bg-white shadow-[0_4px_25px_rgba(0,0,0,0.01)] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between shrink-0 px-6 py-3.5 bg-slate-50 border-b border-zinc-200">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#004CE5]" />
              <h2 className="text-lg font-black text-zinc-900">每日监测明细</h2>
            </div>
            <span className="text-xs font-bold text-zinc-500 font-['Montserrat']">
              共 {daily.length} 日记录
            </span>
          </div>

          {/* 双列紧凑数据布局，彻底消除单列大间距 */}
          <div className="flex-1 min-h-0 grid grid-cols-2 divide-x divide-zinc-200">
            {columns.map((colRows, colIdx) => (
              <div key={colIdx} className="h-full flex flex-col justify-between px-3 py-2">
                <table className="w-full text-left border-collapse table-fixed h-full">
                  <thead>
                    <tr className="border-b border-zinc-200 text-xs font-black text-zinc-400">
                      <th className="py-1 px-2.5 w-[34%]">日期</th>
                      <th className="py-1 px-1.5 w-[33%] text-center">提及率</th>
                      <th className="py-1 px-2 w-[33%] text-center">结果</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-bold divide-y divide-zinc-100">
                    {colRows.map((r) => (
                      <tr key={r.date} className="hover:bg-slate-50 transition-colors">
                        <td className="py-1 px-2.5 font-['Montserrat',sans-serif] text-zinc-700 whitespace-nowrap">
                          {r.date.slice(5)}
                        </td>
                        <td
                          className={`py-1 px-1.5 text-center font-black font-['Montserrat',sans-serif] ${
                            r.passed ? 'text-[#004CE5]' : 'text-zinc-400'
                          }`}
                        >
                          {r.mention_rate.toFixed(1)}%
                        </td>
                        <td
                          className={`py-1 px-2 text-center font-black ${
                            r.passed ? 'text-[#004CE5]' : 'text-zinc-400'
                          }`}
                        >
                          {r.passed ? '达标' : '未达标'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
