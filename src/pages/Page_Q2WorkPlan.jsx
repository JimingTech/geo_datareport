import React from 'react';
import ReportSlideHeader from '../components/ReportSlideHeader';

const BLUE = '#004CE5';
const BODY_FONT = "'Inter', 'MiSans', sans-serif";
const NUMBER_FONT = "'Montserrat', 'Inter', sans-serif";

const WORK_ITEMS = [
  {
    index: '01',
    title: '存量词条与投放深耕',
    shortTitle: '存量词条与投放',
    tag: '持续推进',
    isNew: false,
    description:
      '围绕现有 ToC 与商超 ToB 核心词条，持续推进场景内容策划及高被引垂直平台筛选，稳固当前提及率与首推优势。',
    focus: '稳住存量高位与有效被引',
    timeline: 'ToC / 商超 ToB 内容更新与高被引渠道持续投放',
    color: '#004CE5',
    barStart: '0%',
    barWidth: '100%',
  },
  {
    index: '02',
    title: '量化与 Agent 协同提效',
    shortTitle: '量化与 Agent',
    tag: '持续推进',
    isNew: false,
    description:
      '依托前期积累的收录与回测数据，通过量化系统识别高效词向与信源，同步复盘迭代 Agent 生成结构以提升单篇利用率。',
    focus: '提升词条命中率与生成效率',
    timeline: '高效词向识别与新场景 Agent 内容模板迭代',
    color: '#1F5FE7',
    barStart: '8%',
    barWidth: '86%',
  },
  {
    index: '03',
    title: '重点竞品动态监测',
    shortTitle: '重点竞品监测',
    tag: '持续推进',
    isNew: false,
    description:
      '持续追踪豪士、曼可顿、宾堡及代工赛道主要对手在内容方向、引用渠道与旺季动作上的变化，及时校准卡位策略。',
    focus: '紧盯竞品渠道与语料动作',
    timeline: '商超 / 代工 / 节令核心竞品内容与信源追踪',
    color: '#3570EA',
    barStart: '18%',
    barWidth: '82%',
  },
  {
    index: '04',
    title: 'ToB 代工场景专项拓展',
    shortTitle: 'ToB 代工拓展',
    tag: '二季度新增',
    isNew: true,
    description:
      '11月完成代工方案对齐与立项确认并搭建定制词库；12月—1月系统铺设 20+ 基地产能与 200 袋柔性起订等权威语料。',
    focus: '打通 AI 采购寻源新入口',
    timeline: '11月立项确认与词库搭建 → 12—1月权威语料铺设与爬坡',
    color: '#004CE5',
    barStart: '5%',
    barWidth: '95%',
  },
  {
    index: '05',
    title: '春节礼盒节点抢占',
    shortTitle: '春节礼盒布局',
    tag: '二季度新增',
    isNew: true,
    description:
      '12月上旬启动春节礼盒词条与内容铺设，围绕年货采购、走亲访友和企业团购布局，1月承接节前礼赠需求。',
    focus: '提前布局春节礼盒采购需求',
    timeline: '12月上旬启动春节礼盒词条铺设 → 1月承接节前礼赠需求',
    color: '#1658E6',
    barStart: '33.33%',
    barWidth: '66.67%',
  },
];

const PERIODS = ['2026年11月', '2026年12月', '2027年1月'];
const PERIOD_WIDTHS = '1fr 1fr 1fr';

const styles = {
  page: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    padding: '22px 64px 24px',
    background: '#FFFFFF',
    color: '#18181B',
    fontFamily: BODY_FONT,
  },
  contentGrid: {
    flex: 1,
    minHeight: 0,
    marginTop: 18,
    display: 'grid',
    gridTemplateRows: 'minmax(0, 1.16fr) minmax(0, 0.96fr)',
    gap: 16,
  },
  cardsRow: {
    display: 'grid',
    gridTemplateColumns: `repeat(${WORK_ITEMS.length}, minmax(0, 1fr))`,
    gap: 16,
    minHeight: 0,
  },
  card: (isNew) => ({
    minWidth: 0,
    minHeight: 0,
    overflow: 'hidden',
    borderRadius: 22,
    border: isNew ? '1.5px solid #BBD2FF' : '1px solid #DCE7F8',
    background: isNew
      ? 'linear-gradient(180deg, #F3F8FF 0%, #FFFFFF 100%)'
      : 'linear-gradient(180deg, #F8FBFF 0%, #FFFFFF 100%)',
    boxShadow: '0 10px 26px rgba(19, 62, 128, 0.065)',
    display: 'flex',
    flexDirection: 'column',
  }),
  cardTopStrip: (color) => ({
    height: 8,
    flexShrink: 0,
    background: `linear-gradient(90deg, ${color}, #A8C7FF)`,
  }),
  cardInner: {
    flex: 1,
    minHeight: 0,
    padding: '16px 20px 16px',
    display: 'flex',
    flexDirection: 'column',
  },
  cardTopRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  cardNum: (color) => ({
    fontFamily: NUMBER_FONT,
    fontSize: 48,
    lineHeight: 1,
    fontWeight: 900,
    color,
  }),
  cardTag: (isNew) => ({
    marginTop: 4,
    padding: '4px 11px',
    borderRadius: 999,
    background: isNew ? BLUE : '#E9F1FF',
    color: isNew ? '#FFFFFF' : '#3165B8',
    fontSize: 13.5,
    fontWeight: 800,
    whiteSpace: 'nowrap',
  }),
  cardTitle: {
    margin: '16px 0 0',
    fontSize: 28,
    lineHeight: 1.28,
    fontWeight: 900,
    color: '#000000',
  },
  cardDesc: {
    margin: '14px 0 0',
    fontSize: 24,
    lineHeight: 1.56,
    fontWeight: 500,
    color: '#000000',
    textWrap: 'pretty',
  },
  cardFooter: {
    marginTop: 'auto',
    paddingTop: 12,
    borderTop: '1px solid #DDE8F7',
  },
  cardFooterKicker: {
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: '0.1em',
    color: '#000000',
  },
  cardFooterFocus: {
    marginTop: 4,
    fontSize: 24,
    lineHeight: 1.25,
    fontWeight: 900,
    color: '#000000',
  },
  ganttSection: {
    minHeight: 0,
    borderRadius: 24,
    border: '1px solid #E4EAF2',
    background: '#F7F9FC',
    padding: '18px 28px',
    display: 'flex',
    flexDirection: 'column',
  },
  ganttHeader: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ganttTitleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
  },
  ganttBar: {
    width: 6,
    height: 28,
    borderRadius: 999,
    background: BLUE,
  },
  ganttTitle: {
    margin: 0,
    fontSize: 28,
    lineHeight: 1,
    fontWeight: 900,
    color: '#18181B',
  },
  ganttSub: {
    fontSize: 22,
    fontWeight: 700,
    color: '#000000',
  },
  ganttRange: {
    fontSize: 22,
    fontWeight: 800,
    color: '#000000',
  },
  ganttAxisRow: {
    marginTop: 14,
    flexShrink: 0,
    display: 'grid',
    gridTemplateColumns: '260px minmax(0, 1fr)',
    alignItems: 'center',
  },
  ganttAxisLabel: {
    fontSize: 22,
    fontWeight: 800,
    color: '#000000',
  },
  ganttPeriodsGrid: {
    display: 'grid',
    gridTemplateColumns: PERIOD_WIDTHS,
  },
  ganttPeriodCell: {
    textAlign: 'center',
    fontSize: 22,
    lineHeight: 1,
    fontWeight: 800,
    color: '#000000',
  },
  ganttRows: {
    marginTop: 10,
    flex: 1,
    minHeight: 0,
    display: 'grid',
    gridTemplateRows: `repeat(${WORK_ITEMS.length}, minmax(0, 1fr))`,
    gap: 8,
  },
  ganttRow: {
    display: 'grid',
    gridTemplateColumns: '260px minmax(0, 1fr)',
    alignItems: 'center',
    minHeight: 0,
  },
  ganttTaskNameWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    paddingRight: 16,
    minWidth: 0,
  },
  ganttTaskIdx: {
    flexShrink: 0,
    fontFamily: NUMBER_FONT,
    fontSize: 22,
    fontWeight: 900,
    color: BLUE,
  },
  ganttTaskName: {
    fontSize: 22,
    fontWeight: 800,
    color: '#000000',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  ganttTrack: {
    position: 'relative',
    height: 48,
    overflow: 'hidden',
    borderRadius: 9,
    background: '#FFFFFF',
    border: '1px solid #EAF0F7',
  },
  ganttGridLines: {
    position: 'absolute',
    inset: 0,
    display: 'grid',
    gridTemplateColumns: PERIOD_WIDTHS,
    pointerEvents: 'none',
  },
  ganttBarFill: (left, width, isNew) => ({
    position: 'absolute',
    top: 4,
    bottom: 4,
    left,
    width,
    borderRadius: 7,
    background: isNew ? 'linear-gradient(90deg, #004CE5, #2568EE)' : BLUE,
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    boxSizing: 'border-box',
    minWidth: 0,
  }),
  ganttBarText: {
    fontSize: 22,
    fontWeight: 700,
    color: '#FFFFFF',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
};

export default function Page_Q2WorkPlan() {
  return (
    <div style={styles.page}>
      <ReportSlideHeader title="二季度工作安排" subtitle="2026年11月—2027年1月" />

      <div style={styles.contentGrid}>
        <section style={styles.cardsRow} aria-label={`二季度${WORK_ITEMS.length}项重点工作`}>
          {WORK_ITEMS.map((item) => (
            <article key={item.index} style={styles.card(item.isNew)}>
              <div style={styles.cardTopStrip(item.color)} />
              <div style={styles.cardInner}>
                <div style={styles.cardTopRow}>
                  <span style={styles.cardNum(item.color)}>{item.index}</span>
                  <span style={styles.cardTag(item.isNew)}>{item.tag}</span>
                </div>
                <h2 style={styles.cardTitle}>{item.title}</h2>
                <p style={styles.cardDesc}>{item.description}</p>
                <div style={styles.cardFooter}>
                  <div style={styles.cardFooterKicker}>本季重点</div>
                  <div style={styles.cardFooterFocus}>{item.focus}</div>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section style={styles.ganttSection} aria-label="二季度执行时间轴">
          <div style={styles.ganttHeader}>
            <div style={styles.ganttTitleGroup}>
              <div style={styles.ganttBar} />
              <h2 style={styles.ganttTitle}>二季度执行时间轴</h2>
              <span style={styles.ganttSub}>常规稳固与新增专项协同推进</span>
            </div>
            <div style={styles.ganttRange}>2026.11 — 2027.01</div>
          </div>

          <div style={styles.ganttAxisRow}>
            <div style={styles.ganttAxisLabel}>工作事项</div>
            <div style={styles.ganttPeriodsGrid}>
              {PERIODS.map((period) => (
                <div key={period} style={styles.ganttPeriodCell}>
                  {period}
                </div>
              ))}
            </div>
          </div>

          <div style={styles.ganttRows}>
            {WORK_ITEMS.map((item) => (
              <div key={item.index} style={styles.ganttRow}>
                <div style={styles.ganttTaskNameWrap}>
                  <span style={styles.ganttTaskIdx}>{item.index}</span>
                  <span style={styles.ganttTaskName}>{item.shortTitle}</span>
                </div>
                <div style={styles.ganttTrack}>
                  <div style={styles.ganttGridLines} aria-hidden="true">
                    {PERIODS.map((period, index) => (
                      <div
                        key={period}
                        style={{
                          borderRight: index < PERIODS.length - 1 ? '1px solid #E6EDF5' : 'none',
                        }}
                      />
                    ))}
                  </div>
                  <div style={styles.ganttBarFill(item.barStart, item.barWidth, item.isNew)}>
                    <span style={styles.ganttBarText}>{item.timeline}</span>
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

