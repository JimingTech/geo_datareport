import React from 'react';

const BLUE = '#004CE5';
const BORDER = '#E3EAF5';
const BODY_FONT = "'Inter', 'MiSans', sans-serif";
const NUMBER_FONT = "'Montserrat', 'Inter', sans-serif";

const LINES = [
  {
    name: 'ToB 产品线',
    index: '01',
    metrics: [
      { label: '提及率', value: '90%' },
      { label: 'TOP1 入选率', value: '80%' },
    ],
  },
  {
    name: 'ToC 产品线',
    index: '02',
    metrics: [
      { label: '提及率', value: '75%' },
      { label: 'TOP1 入选率', value: '50%' },
    ],
  },
];

const PATHS = ['内容优化', '量化分析', '投放策略持续执行'];

// Keep the slide's layout in the component. A long-running Vite session can serve
// updated JSX before Tailwind regenerates classes from a newly added page file.
const styles = {
  page: {
    width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
    boxSizing: 'border-box', padding: '24px 64px 32px', background: '#fff',
    color: '#18181B', fontFamily: BODY_FONT,
  },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 },
  titleGroup: { display: 'flex', alignItems: 'center' },
  titleBar: { width: 8, height: 48, borderRadius: 999, background: BLUE, boxShadow: '0 0 15px rgba(0,76,229,.2)' },
  title: { margin: '0 0 0 20px', fontSize: 44, lineHeight: 1, fontWeight: 900, letterSpacing: '0.025em' },
  date: { border: '1px solid #C8D9FF', borderRadius: 999, background: '#F1F6FF', padding: '10px 24px', color: BLUE, fontSize: 20, fontWeight: 900, letterSpacing: '0.025em' },
  main: { display: 'grid', gridTemplateColumns: 'minmax(0, 0.92fr) minmax(0, 1.65fr)', gap: 24, flex: 1, minHeight: 0, marginTop: 24 },
  hero: { position: 'relative', display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden', boxSizing: 'border-box', borderRadius: 28, padding: '40px 44px', background: BLUE, color: '#fff', boxShadow: '0 18px 38px rgba(0,76,229,.16)' },
  heroRing: { position: 'absolute', width: 320, height: 320, right: -112, top: -112, boxSizing: 'border-box', borderRadius: '50%', border: '46px solid rgba(255,255,255,.06)', pointerEvents: 'none' },
  heroGlow: { position: 'absolute', width: 384, height: 384, right: -96, bottom: -144, borderRadius: '50%', background: 'rgba(255,255,255,.04)', pointerEvents: 'none' },
  heroKicker: { position: 'relative', display: 'flex', alignItems: 'center', gap: 12, color: 'rgba(255,255,255,.65)', fontFamily: NUMBER_FONT, fontSize: 15, fontWeight: 800, letterSpacing: '.19em' },
  heroDot: { width: 8, height: 8, borderRadius: '50%', background: '#fff' },
  heroCenter: { position: 'relative', marginTop: 'auto' },
  heroLead: { margin: 0, color: 'rgba(255,255,255,.85)', fontSize: 36, lineHeight: 1.25, fontWeight: 700 },
  heroNumberRow: { display: 'flex', alignItems: 'flex-end', marginTop: 8, lineHeight: 1 },
  heroNumber: { fontFamily: NUMBER_FONT, fontSize: 180, fontWeight: 900, letterSpacing: '-.075em' },
  heroDay: { margin: '0 0 20px 20px', fontSize: 44, fontWeight: 900 },
  heroBottom: { position: 'relative', marginTop: 'auto', paddingTop: 32, borderTop: '1px solid rgba(255,255,255,.25)' },
  heroDateRow: { display: 'flex', alignItems: 'baseline', gap: 12 },
  heroDate: { fontSize: 42, lineHeight: 1, fontWeight: 900 },
  heroDateLabel: { color: 'rgba(255,255,255,.65)', fontSize: 19, fontWeight: 700 },
  heroNote: { maxWidth: 470, margin: '16px 0 0', color: 'rgba(255,255,255,.85)', fontSize: 25, lineHeight: 1.35, fontWeight: 700 },
  kpiSection: { display: 'flex', flexDirection: 'column', minHeight: 0 },
  kpiHeader: { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexShrink: 0, paddingBottom: 16 },
  kicker: { color: BLUE, fontFamily: NUMBER_FONT, fontSize: 14, fontWeight: 800, letterSpacing: '.2em' },
  kpiTitle: { margin: '8px 0 0', fontSize: 32, lineHeight: 1, fontWeight: 900 },
  kpiCaption: { paddingBottom: 4, color: '#A1A1AA', fontSize: 18, fontWeight: 700 },
  cards: { display: 'grid', gridTemplateRows: 'repeat(2, minmax(0, 1fr))', gap: 16, flex: 1, minHeight: 0 },
  card: { display: 'grid', gridTemplateColumns: '245px repeat(2, minmax(0, 1fr))', minHeight: 0, overflow: 'hidden', border: `1px solid ${BORDER}`, borderRadius: 26, background: '#fff', boxShadow: '0 10px 30px rgba(15,23,42,.045)' },
  product: { display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 32px', borderRight: `1px solid ${BORDER}`, background: '#F5F8FD' },
  productKicker: { color: BLUE, fontFamily: NUMBER_FONT, fontSize: 14, fontWeight: 800, letterSpacing: '.16em' },
  productRule: { width: 40, height: 4, marginTop: 16, borderRadius: 999, background: BLUE },
  productName: { margin: '20px 0 0', fontSize: 32, lineHeight: 1.25, fontWeight: 900, letterSpacing: '.025em' },
  metric: { display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0, padding: '0 40px' },
  metricLabel: { color: '#71717A', fontSize: 24, fontWeight: 700 },
  metricValue: { marginTop: 20, color: BLUE, fontFamily: NUMBER_FONT, fontSize: 83, lineHeight: 1, fontWeight: 900, letterSpacing: '-.055em', whiteSpace: 'nowrap' },
  metricRule: { width: 44, height: 4, marginTop: 20, borderRadius: 999, background: '#D6E4FF' },
  footer: { display: 'grid', gridTemplateColumns: '235px repeat(3, minmax(0, 1fr))', alignItems: 'center', flexShrink: 0, boxSizing: 'border-box', height: 126, marginTop: 20, padding: '0 32px', border: `1px solid ${BORDER}`, borderRadius: 24, background: '#F7F9FD' },
  footerKicker: { color: BLUE, fontFamily: NUMBER_FONT, fontSize: 14, fontWeight: 800, letterSpacing: '.19em' },
  footerTitle: { marginTop: 8, fontSize: 26, fontWeight: 900 },
  path: { display: 'flex', alignItems: 'center', gap: 16, height: 56, paddingLeft: 36, borderLeft: '1px solid #DDE6F2' },
  pathNumber: { display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, width: 40, height: 40, borderRadius: '50%', background: BLUE, color: '#fff', fontFamily: NUMBER_FONT, fontSize: 17, fontWeight: 900 },
  pathText: { color: '#27272A', fontSize: 23, fontWeight: 900, letterSpacing: '.025em', whiteSpace: 'nowrap' },
};

export default function Page_OctoberPlanKpi() {
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.titleGroup}>
          <div style={styles.titleBar} />
          <h1 style={styles.title}>冲击合同设定目标 KPI</h1>
        </div>
        <div style={styles.date}>10 月底目标</div>
      </header>

      <main style={styles.main}>
        <section style={styles.hero}>
          <div style={styles.heroRing} />
          <div style={styles.heroGlow} />
          <div style={styles.heroKicker}><span style={styles.heroDot} />OCTOBER TARGET</div>
          <div style={styles.heroCenter}>
            <p style={styles.heroLead}>争取较原计划提前</p>
            <div style={styles.heroNumberRow}>
              <span style={styles.heroNumber}>15</span>
              <span style={styles.heroDay}>天</span>
            </div>
          </div>
          <div style={styles.heroBottom}>
            <div style={styles.heroDateRow}>
              <span style={styles.heroDate}>10 月底前</span>
              <span style={styles.heroDateLabel}>目标节点</span>
            </div>
            <p style={styles.heroNote}>推动核心指标达到合同目标</p>
          </div>
        </section>

        <section style={styles.kpiSection}>
          <div style={styles.kpiHeader}>
            <div>
              <div style={styles.kicker}>CONTRACT KPI</div>
              <h2 style={styles.kpiTitle}>两条产品线 · 四项核心指标</h2>
            </div>
            <span style={styles.kpiCaption}>合同设定目标</span>
          </div>

          <div style={styles.cards}>
            {LINES.map((line) => (
              <div key={line.name} style={styles.card}>
                <div style={styles.product}>
                  <div style={styles.productKicker}>PRODUCT LINE {line.index}</div>
                  <div style={styles.productRule} />
                  <h3 style={styles.productName}>{line.name}</h3>
                </div>
                {line.metrics.map((metric, index) => (
                  <div key={metric.label} style={{ ...styles.metric, borderRight: index === 0 ? `1px solid ${BORDER}` : undefined }}>
                    <div style={styles.metricLabel}>{metric.label}</div>
                    <div style={styles.metricValue}>{metric.value}</div>
                    <div style={styles.metricRule} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer style={styles.footer}>
        <div>
          <div style={styles.footerKicker}>ACTION PATH</div>
          <div style={styles.footerTitle}>执行路径</div>
        </div>
        {PATHS.map((path, index) => (
          <div key={path} style={styles.path}>
            <span style={styles.pathNumber}>{index + 1}</span>
            <span style={styles.pathText}>{path}</span>
          </div>
        ))}
      </footer>
    </div>
  );
}
