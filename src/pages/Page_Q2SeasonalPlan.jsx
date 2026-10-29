import React from 'react';
import ReportSlideHeader from '../components/ReportSlideHeader';
import styles from './Q2SeasonalPlan.module.css';

const PRIORITIES = {
  high: '高',
  medium: '中',
  low: '低',
};

const SCHEDULE_ROWS = [
  {
    node: '春节',
    period: '1月—2月',
    priority: 'medium',
    launch: '12月上旬',
    products: ['春节礼盒'],
    strategy: '围绕「春节送礼礼盒」「年货礼盒推荐」布局问答，覆盖走亲访友、家庭分享与企业团购场景。',
  },
  {
    node: '春游与五一',
    period: '4月—5月初',
    priority: 'medium',
    launch: '3月上旬',
    products: ['醇熟切片面包', '芝士肉松蛋糕'],
    strategy: '围绕「学生春游零食清单」「露营野餐三明治吐司」布局问答，将旺季流量沉淀为日常复购。',
  },
  {
    node: '六一儿童节',
    period: '6月1日',
    priority: 'low',
    launch: '4月下旬',
    products: ['奶棒面包', '铜锣烧'],
    strategy: '聚焦「儿童节班级分享零食」「学生课间点心推荐」等家长高频提问，突出国民经典单品与分享装。',
  },
  {
    node: '端午节',
    period: '6月',
    priority: 'high',
    launch: '5月上旬',
    products: ['桃李粽子'],
    strategy: '避开高溢价礼品粽竞争，主攻「高性价比家庭口粮粽」「平价早餐粽推荐」及企业团购词条。',
  },
  {
    node: '开学季与教师节',
    period: '9月上旬',
    priority: 'medium',
    launch: '7月下旬',
    products: ['醇熟切片', '芝士肉松', '奶棒面包'],
    strategy: '抢占「开学快手营养早餐囤货」核心词，结合「桃李满天下」天然品牌关联布局教师节礼赠问答。',
  },
  {
    node: '中秋与国庆',
    period: '9月中—10月初',
    priority: 'high',
    launch: '8月中旬',
    products: ['桃李蛋月烧（月饼）', '巧乐角'],
    strategy: '主打「平价解馋月饼、蛋糕口感蛋月烧」差异化种草词；国庆无缝承接长途出游便携充饥词条。',
  },
];

function PriorityBadge({ priority }) {
  return (
    <span className={`${styles.priorityBadge} ${styles[priority]}`}>
      <i aria-hidden="true" />{PRIORITIES[priority]}
    </span>
  );
}

function StrategyText({ text }) {
  return text.split(/(「[^」]+」)/g).map((part, index) => (
    part.startsWith('「') ? <strong key={index}>{part}</strong> : part
  ));
}

export default function Page_Q2SeasonalPlan() {
  return (
    <div className={styles.page}>
      <ReportSlideHeader title="季节性产品规划" subtitle="全年重点节点 GEO 排期表" subtitleId="seasonal-schedule-title" />

      <section className={styles.planningBanner} aria-label="排期原则">
        <div className={styles.principle}>
          <h2><span>排期原则</span>聚焦真实动销旺季与核心产线</h2>
          <p>各节点提前布局词条与内容，预留收录与效果爬坡周期。</p>
        </div>
        <div className={styles.leadTime}>
          <span>提前启动</span><strong>4–6</strong><span>周</span>
        </div>
      </section>

      <section className={styles.schedule} aria-labelledby="seasonal-schedule-title">
        <div className={styles.tableWrap} role="region" aria-label="季节性产品全年 GEO 排期表">
          <table className={styles.table}>
            <colgroup>
              <col style={{ width: '18%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '13%' }} />
              <col style={{ width: '22%' }} />
              <col style={{ width: '39%' }} />
            </colgroup>
            <thead>
              <tr>
                <th scope="col">营销节点 / 档期</th>
                <th scope="col" className={styles.centered}>优先级</th>
                <th scope="col">GEO 启动时间</th>
                <th scope="col">主打产品</th>
                <th scope="col">GEO 核心策略</th>
              </tr>
            </thead>
            <tbody>
              {SCHEDULE_ROWS.map((row) => (
                <tr key={row.node} className={row.priority === 'high' ? styles.focusRow : undefined}>
                  <th scope="row">
                    <div className={styles.nodeName}>{row.node}</div>
                    <div className={styles.nodePeriod}>{row.period}</div>
                  </th>
                  <td className={styles.centered}><PriorityBadge priority={row.priority} /></td>
                  <td>
                    <div className={styles.launchText}>{row.launch}</div>
                  </td>
                  <td className={styles.products}>
                    {row.products.map((product, index) => (
                      <span className={styles.productItem} key={product}>
                        {product}{index < row.products.length - 1 ? '、' : ''}
                      </span>
                    ))}
                  </td>
                  <td className={styles.strategy}><StrategyText text={row.strategy} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <footer className={styles.footer}>
        <strong>重点投入</strong>
        <span>{SCHEDULE_ROWS.filter((row) => row.priority === 'high').map((row) => row.node).join('、')}</span>
        <span className={styles.footerDivider} aria-hidden="true" />
        <span>将旺季流量沉淀为日常复购</span>
      </footer>
    </div>
  );
}
