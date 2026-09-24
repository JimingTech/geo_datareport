const WORK_ITEMS = [
  {
    index: '01',
    title: '量化系统开始发力',
    shortTitle: '量化系统',
    description:
      '经过前期约1.5个月的数据积累、模型学习和效果回测，量化系统逐步进入稳定应用阶段。10月将进一步用于识别高效词条、内容方向及投放渠道，提高整体优化效率。',
    focus: '识别高效词条与方向',
    timeline: '高效词条、内容方向与渠道识别',
    color: '#004CE5',
    barStart: '0%',
    barWidth: '52%',
  },
  {
    index: '02',
    title: 'Agent 内容能力持续迭代',
    shortTitle: 'Agent 内容',
    description:
      '基于前期已发布内容及AI端实际反馈，持续对内容结构、表达方式和有效信息进行复盘学习，提高内容生成的精准度、准确性和效率，同时提升单篇内容的利用率。',
    focus: '提升生成质量与利用率',
    timeline: '内容复盘与生成能力迭代',
    color: '#2465E8',
    barStart: '38%',
    barWidth: '62%',
  },
  {
    index: '03',
    title: '持续推进内容撰写',
    shortTitle: '内容撰写',
    description:
      '按照不同产品线及重点优化词条，持续完成相关内容的策划与撰写，补充重点场景和核心问题的内容覆盖。',
    focus: '补齐场景与核心问题',
    timeline: '产品线、重点词条与场景内容',
    color: '#3977ED',
    barStart: '0%',
    barWidth: '100%',
  },
  {
    index: '04',
    title: '优化投放策略',
    shortTitle: '投放策略',
    description:
      '分析桃李面包当前AI引用信源结构，持续监测不同平台的收录及引用偏好，进一步筛选引用稳定、收录效果较好的垂直平台，提高有效投放占比。',
    focus: '提高有效投放占比',
    timeline: '信源监测与垂直平台筛选',
    color: '#4C86EE',
    barStart: '20%',
    barWidth: '64%',
  },
  {
    index: '05',
    title: '监测重点竞品动作',
    shortTitle: '竞品监测',
    description:
      '持续关注行业内表现较好的重点竞品，监测其近期在GEO相关内容、渠道及投入方面的动作，为后续优化策略调整提供参考。',
    focus: '为策略调整提供参考',
    timeline: '竞品内容、渠道与投入监测',
    color: '#6095F0',
    barStart: '44%',
    barWidth: '56%',
  },
];

const PERIODS = ['10.7—10.12', '10.13—10.19', '10.20—10.26', '10.27—10.31'];
const PERIOD_WIDTHS = '24% 28% 28% 20%';

export default function Page_OctoberPlanWork() {
  return (
    <div className="w-full h-full flex flex-col px-16 pt-3 pb-3 text-zinc-900 font-sans">
      <header className="h-[68px] shrink-0 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-2.5 h-12 rounded-full bg-[#004CE5] shadow-[0_0_15px_rgba(0,76,229,0.25)]" />
          <h1 className="ml-5 text-[3rem] leading-none font-black tracking-wide">详细工作安排</h1>
        </div>
        <div className="rounded-full bg-[#E9F1FF] px-6 py-2.5 text-[1.35rem] leading-none font-black text-[#004CE5]">
          10月7日—10月31日
        </div>
      </header>

      <div className="mt-4 flex-1 min-h-0 grid grid-rows-[minmax(0,1.16fr)_minmax(0,1fr)] gap-4">
        <section className="grid grid-cols-5 gap-4 min-h-0" aria-label="五项详细工作内容">
          {WORK_ITEMS.map((item) => (
            <article
              key={item.index}
              className="min-w-0 min-h-0 overflow-hidden rounded-[23px] border border-[#DCE7F8] bg-gradient-to-b from-[#F8FBFF] to-white shadow-[0_12px_28px_rgba(19,62,128,0.08)] flex flex-col"
            >
              <div className="h-2 shrink-0" style={{ background: `linear-gradient(90deg, ${item.color}, #A8C7FF)` }} />
              <div className="flex-1 min-h-0 px-5 pt-4 pb-4 flex flex-col">
                <div className="flex items-start justify-between">
                  <span className="text-[3.25rem] leading-none font-black font-['Montserrat',sans-serif]" style={{ color: item.color }}>
                    {item.index}
                  </span>
                  <span className="mt-1 rounded-full bg-[#E9F1FF] px-2.5 py-1 text-[0.88rem] font-extrabold text-[#3165B8]">
                    持续推进
                  </span>
                </div>
                <h2 className="mt-3 min-h-[66px] text-[1.65rem] leading-[1.25] font-black text-[#102B57]">
                  {item.title}
                </h2>
                <p className="mt-3 text-[1.22rem] leading-[1.48] font-semibold text-[#485B76]">
                  {item.description}
                </p>
                <div className="mt-auto pt-3 border-t border-[#DDE8F7]">
                  <div className="text-[0.82rem] font-extrabold tracking-[0.12em] text-[#7C96B8]">本月重点</div>
                  <div className="mt-1 text-[1.05rem] leading-tight font-black" style={{ color: item.color }}>
                    {item.focus}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="min-h-0 rounded-[25px] border border-[#E4EAF2] bg-[#F7F9FC] px-7 py-5 text-zinc-900 flex flex-col" aria-label="10月工作甘特图">
          <div className="shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-8 rounded-full bg-[#004CE5]" />
              <h2 className="text-[1.9rem] leading-none font-black">10月执行时间轴</h2>
              <span className="text-[1.05rem] font-semibold text-zinc-400">五项工作并行推进</span>
            </div>
            <div className="text-[1rem] font-bold text-zinc-400">10.7—10.31</div>
          </div>

          <div className="mt-4 grid grid-cols-[205px_minmax(0,1fr)] items-center shrink-0">
            <div className="text-[0.95rem] font-bold text-zinc-400">工作事项</div>
            <div className="grid" style={{ gridTemplateColumns: PERIOD_WIDTHS }}>
              {PERIODS.map((period) => (
                <div key={period} className="text-center text-[1rem] leading-none font-bold text-zinc-400">
                  {period}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 flex-1 min-h-0 grid grid-rows-5 gap-2">
            {WORK_ITEMS.map((item) => (
              <div key={item.index} className="grid grid-cols-[205px_minmax(0,1fr)] items-center min-h-0">
                <div className="flex items-center gap-3 min-w-0 pr-4">
                  <span className="shrink-0 text-[1rem] font-black text-[#004CE5] font-['Montserrat',sans-serif]">{item.index}</span>
                  <span className="truncate text-[1.1rem] font-bold text-zinc-700">{item.shortTitle}</span>
                </div>
                <div className="relative h-[40px] overflow-hidden rounded-[9px] bg-white">
                  <div className="absolute inset-0 grid" style={{ gridTemplateColumns: PERIOD_WIDTHS }} aria-hidden="true">
                    {PERIODS.map((period, index) => (
                      <div key={period} className={index < PERIODS.length - 1 ? 'border-r border-[#E6EDF5]' : ''} />
                    ))}
                  </div>
                  <div
                    className="absolute top-1 bottom-1 rounded-[7px] bg-[#004CE5] flex items-center px-4 min-w-0"
                    style={{ left: item.barStart, width: item.barWidth }}
                  >
                    <span className="truncate text-[1.02rem] font-bold text-white">{item.timeline}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
