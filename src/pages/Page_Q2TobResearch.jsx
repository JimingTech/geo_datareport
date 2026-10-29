import React from 'react';
import Q2ResearchLayout from '../components/Q2ResearchLayout';
import styles from './Q2TobResearch.module.css';

const CAPABILITIES = [
  { value: '20+', unit: '座基地', title: '全国就近直配', detail: '覆盖东北、华北、华东、华南、西南' },
  { value: '4', unit: '大温层', title: '覆盖核心烘焙品类', detail: '常温、冷藏、冷冻烘焙及节令糕点' },
  { value: '200', unit: '袋起订', title: '支持小批量定制', detail: '约 7 天打样，最快约 30 天量产' },
];

const COMPETITORS = [
  {
    camp: '短保工业巨头', channel: '连锁快餐、大型商超',
    brands: ['曼可顿', '宾堡'],
  },
  {
    camp: '定制与冷冻龙头', channel: '商超定制、新茶饮',
    brands: ['立高', '恩喜村', '南侨'],
  },
  {
    camp: '柔性代工阵营', channel: '量贩零食、线上品牌',
    brands: ['美焙辰'], other: '及产业带代工厂',
  },
];

export default function Page_Q2TobResearch() {
  return (
    <Q2ResearchLayout subtitle="（一）自身现状与竞争格局">
      <section className={styles.premiseBlock} aria-label="调研前提与现有成绩">
        <div className={styles.premise}>
          <div className={styles.premiseTitle}><h2>调研前提</h2><p>商超铺货词<br />已取得领先成绩</p></div>
          <div className={styles.premiseMetric}><strong>93.9%</strong><span>商超铺货词提及率</span></div>
          <div className={styles.premiseMetric}><strong>82.2%</strong><span>Top1 提及率</span></div>
          <div className={styles.premiseMetric}><strong>NO.1</strong><span>排名稳居第一</span></div>
        </div>
        <p className={styles.growthDirection}>下一阶段增长方向：<strong>扩展至代工定制</strong></p>
      </section>

      <main className={styles.researchComparison}>
        <section className={styles.informationPanel}>
          <h2 className={styles.sectionTitle}>桃李代工能力成熟，但外部认知少</h2>
          <div className={styles.capabilityRows}>
            {CAPABILITIES.map((capability, index) => (
              <article className={styles.capabilityRow} key={capability.value}>
                <span className={styles.itemNumber} aria-hidden="true">0{index + 1}</span>
                <div>
                  <div className={styles.capabilityHeading}>
                    <div className={styles.capabilityNumber}><strong>{capability.value}</strong><span>{capability.unit}</span></div>
                    <h3>{capability.title}</h3>
                  </div>
                  <p>{capability.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className={`${styles.informationPanel} ${styles.competitionPanel}`}>
          <h2 className={styles.sectionTitle}>主流代工推荐已被竞品占据</h2>
          <div className={styles.competitorRows}>
            {COMPETITORS.map((competitor) => (
              <article className={styles.competitorRow} key={competitor.camp}>
                <div className={styles.competitorHeading}><h3>{competitor.camp}</h3><p>{competitor.channel}</p></div>
                <div className={styles.brandList}>
                  {competitor.brands.map((brand) => (
                    <span className={styles.brand} key={brand}>{brand}</span>
                  ))}
                  {competitor.other && <span className={styles.otherCompetitors}>{competitor.other}</span>}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <p className={styles.reportConclusion}><strong>核心判断：</strong>代工能力已具备，需用 GEO 补齐采购与 AI 的代工认知。</p>
    </Q2ResearchLayout>
  );
}
