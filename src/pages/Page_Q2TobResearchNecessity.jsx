import React from 'react';
import Q2ResearchLayout from '../components/Q2ResearchLayout';
import styles from './Q2TobResearch.module.css';

const DEMAND_ITEMS = [
  {
    title: '商超和茶饮定制增多，需要大厂且起订灵活',
    detail: '商超自有品牌、咖啡茶饮和企业团购都在找代工，\n既要求大厂品控安全，又希望起订量低、出货快。',
  },
  {
    title: '采购找供应商时，习惯先问 AI 要推荐名单',
    detail: '采购和研发找代工厂时，越来越习惯先问 DeepSeek、\n豆包、通义，让 AI 推荐一批靠谱工厂再去联系。',
  },
  {
    title: '客户在 AI 里的常见提问',
    detail: '“支持小批量起订、全国配送的面包代工厂有哪些？”\n“适合给商超或咖啡店做烘焙代工的大厂推荐”',
  },
];

const NECESSITY_ITEMS = [
  {
    title: '代工客户订单体量大，长期商业回报高',
    detail: '签下商超或连锁茶饮客户就是长期稳定的批量订单；\n通过 AI 问答承接采购需求，获客比展会和竞价更划算。',
  },
  {
    title: '桃李自身条件够硬，补齐信息就容易转化',
    detail: '兼具大厂品控、全国短保直配与 200 袋低起订，\n比外资巨头门槛低、比小厂安全，客户看到就有优势。',
  },
  {
    title: '原有商超词已到高位，现成经验能直接用',
    detail: '商超进货词提及率已达 93.9%，继续深挖增量有限；\n切入代工词可直接沿用成熟渠道与写法，起效更快。',
  },
];

export default function Page_Q2TobResearchNecessity() {
  return (
    <Q2ResearchLayout subtitle="（二）采购需求与立项必要性">
      <h2 className={styles.projectFinding}>
        客户正开始用 AI 找代工厂，立项做 GEO 能<strong>让桃李进入推荐名单、接住新订单</strong>
      </h2>

      <main className={styles.projectColumns}>
        <section className={styles.informationPanel}>
          <h2 className={styles.sectionTitle}>代工需求在增加，客户开始用 AI 找工厂</h2>
          <div className={styles.projectRows}>
            {DEMAND_ITEMS.map((item, index) => (
              <article className={styles.projectRow} key={item.title}>
                <span className={styles.itemNumber} aria-hidden="true">0{index + 1}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={`${styles.informationPanel} ${styles.actionsPanel}`}>
          <h2 className={styles.sectionTitle}>立项必要性：为什么现阶段值得做</h2>
          <div className={styles.projectRows}>
            {NECESSITY_ITEMS.map((item, index) => (
              <article className={styles.projectRow} key={item.title}>
                <span className={styles.itemNumber} aria-hidden="true">0{index + 1}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </Q2ResearchLayout>
  );
}
