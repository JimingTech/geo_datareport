import {
  ArrowRight,
  CalendarCheck,
  CalendarClock,
  Factory,
  Flag,
} from 'lucide-react';

const RESEARCH_POINTS = [
  { index: '01', title: '用户需求', question: '需求是否明确' },
  { index: '02', title: '关键词空间', question: '搜索机会是否充足' },
  { index: '03', title: '竞争现状', question: '竞品布局如何' },
  { index: '04', title: '实际优化价值', question: '投入是否值得' },
];

const PRODUCTS = ['月饼', '端午', '春节礼包'];

const PLAN_STEPS = [
  { index: '01', title: '锁定全年重点营销节点' },
  { index: '02', title: '确定 GEO 启动时间' },
  { index: '03', title: '预留内容、投放与效果爬坡周期' },
];

export default function Page_OctoberPlanResearch() {
  return (
    <div className="flex h-full w-full flex-col bg-white px-16 pb-8 pt-6 font-sans text-zinc-900">
      <header className="flex shrink-0 items-end justify-between border-b border-[#E4EBF5] pb-5">
        <div className="flex items-center">
          <div className="h-12 w-2 rounded-full bg-[#004CE5] shadow-[0_0_15px_rgba(0,76,229,0.2)]" />
          <h1 className="ml-5 text-[2.75rem] font-black leading-none tracking-wide">调研与策略</h1>
        </div>
        <div className="flex items-center gap-4 pb-1 text-[1.13rem] font-bold text-zinc-400">
          <span>专项调研</span>
          <span className="h-4 w-px bg-zinc-300" />
          <span>提前规划</span>
        </div>
      </header>

      <main className="mt-6 grid min-h-0 flex-1 grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] gap-6">
        <section className="relative flex min-h-0 flex-col overflow-hidden rounded-[30px] border border-[#DCE6F5] bg-[#F7FAFF] p-9 shadow-[0_12px_36px_rgba(22,49,93,0.045)]" aria-label="ToB 代工场景专项调研">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full border-[44px] border-[#004CE5]/[0.035]" />
          <div className="relative flex shrink-0 items-start justify-between">
            <div>
              <div className="flex items-center gap-3 text-[0.95rem] font-extrabold tracking-[0.18em] text-[#004CE5] font-['Montserrat',sans-serif]">
                <span className="h-2 w-2 rounded-full bg-[#004CE5]" />
                01 / TOB RESEARCH
              </div>
              <h2 className="mt-4 text-[2.45rem] font-black leading-tight tracking-wide">ToB 代工场景专项调研</h2>
            </div>
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] bg-white text-[#004CE5] shadow-[0_6px_20px_rgba(0,76,229,0.08)]">
              <Factory size={31} strokeWidth={1.9} />
            </div>
          </div>

          <p className="relative mt-5 max-w-[820px] shrink-0 text-[1.45rem] font-semibold leading-[1.5] text-zinc-600">
            针对 ToB 产品线，评估代工场景 GEO 项目的必要性与可行性，为后续是否立项提供依据。
          </p>

          <div className="relative mt-7 flex shrink-0 items-center gap-4">
            <span className="text-[1.04rem] font-extrabold tracking-[0.12em] text-[#004CE5]">四项评估重点</span>
            <span className="h-px flex-1 bg-[#CBDCF3]" />
          </div>

          <div className="relative mt-4 grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-4">
            {RESEARCH_POINTS.map((point) => (
              <div key={point.index} className="flex min-h-0 flex-col justify-between rounded-[20px] border border-[#E2EAF5] bg-white px-6 py-5 shadow-[0_6px_18px_rgba(24,58,111,0.035)]">
                <div className="flex items-start justify-between">
                  <span className="text-[1.05rem] font-black text-[#004CE5] font-['Montserrat',sans-serif]">{point.index}</span>
                  <span className="h-1.5 w-9 rounded-full bg-[#DCE9FF]" />
                </div>
                <div>
                  <h3 className="text-[1.88rem] font-black leading-tight text-zinc-900">{point.title}</h3>
                  <p className="mt-2 text-[1.14rem] font-semibold leading-snug text-zinc-500">{point.question}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative mt-5 flex min-h-[108px] shrink-0 items-center gap-5 rounded-[22px] bg-[#004CE5] px-7 text-white shadow-[0_12px_25px_rgba(0,76,229,0.16)]">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] bg-white/15">
              <Flag size={24} strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[0.92rem] font-bold tracking-[0.14em] text-white/65">立项判断</div>
              <p className="mt-1 text-[1.48rem] font-black leading-snug">判断代工场景是否具备单独立项的优化价值</p>
            </div>
            <ArrowRight size={27} strokeWidth={2} className="shrink-0 text-white/70" />
          </div>
        </section>

        <section className="flex min-h-0 flex-col overflow-hidden rounded-[30px] border border-[#E0E8F3] bg-white p-9 shadow-[0_12px_36px_rgba(22,49,93,0.045)]" aria-label="季节性产品提前规划">
          <div className="flex shrink-0 items-start justify-between">
            <div>
              <div className="flex items-center gap-3 text-[0.95rem] font-extrabold tracking-[0.18em] text-[#004CE5] font-['Montserrat',sans-serif]">
                <span className="h-2 w-2 rounded-full bg-[#004CE5]" />
                02 / SEASONAL PLAN
              </div>
              <h2 className="mt-4 text-[2.45rem] font-black leading-tight tracking-wide">季节性产品提前规划</h2>
            </div>
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] bg-[#EDF4FF] text-[#004CE5]">
              <CalendarClock size={31} strokeWidth={1.9} />
            </div>
          </div>

          <p className="mt-5 shrink-0 text-[1.45rem] font-semibold leading-[1.5] text-zinc-600">
            提前规划季节性产品的 GEO 工作，避免临近旺季再启动。
          </p>

          <div className="mt-7 shrink-0">
            <div className="text-[1.04rem] font-extrabold tracking-[0.12em] text-zinc-500">覆盖产品</div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {PRODUCTS.map((product) => (
                <div key={product} className="flex h-[68px] items-center justify-center rounded-[17px] border border-[#DCE8F8] bg-[#F5F8FE] text-[1.45rem] font-black text-[#004CE5]">
                  {product}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-7 flex min-h-0 flex-1 flex-col rounded-[23px] bg-[#F6F9FD] px-7 py-6">
            <div className="shrink-0 text-[1.04rem] font-extrabold tracking-[0.12em] text-zinc-500">提前规划路径</div>
            <div className="relative mt-5 grid min-h-0 flex-1 grid-rows-3">
              <span className="absolute bottom-[16.666%] left-[22px] top-[16.666%] w-px bg-[#C7D9F5]" />
              {PLAN_STEPS.map((step) => (
                <div key={step.index} className="relative flex min-h-0 items-center gap-5">
                  <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#004CE5] text-[1.04rem] font-black text-white font-['Montserrat',sans-serif]">
                    {step.index}
                  </span>
                  <span className="text-[1.43rem] font-bold leading-snug text-zinc-800">{step.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex min-h-[108px] shrink-0 items-center gap-4 rounded-[22px] border border-[#DDE8F7] bg-[#F1F6FF] px-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] bg-white text-[#004CE5]">
              <CalendarCheck size={24} strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <div className="text-[0.92rem] font-bold tracking-[0.14em] text-[#004CE5]">规划产出</div>
              <p className="mt-1 text-[1.48rem] font-black leading-snug text-zinc-800">形成季节性产品计划表</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
