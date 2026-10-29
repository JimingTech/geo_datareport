import React from 'react';
import ReportSlideHeader from './ReportSlideHeader';
import styles from '../pages/Q2TobResearch.module.css';

export default function Q2ResearchLayout({ subtitle, children }) {
  return (
    <div className={styles.page}>
      <ReportSlideHeader title="ToB代工场景专项调研" subtitle={subtitle} />
      {children}
    </div>
  );
}
