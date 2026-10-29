import React from 'react';
import styles from './ReportSlideHeader.module.css';

export default function ReportSlideHeader({ title, subtitle, subtitleId }) {
  return (
    <header className={styles.header}>
      <span className={styles.rule} aria-hidden="true" />
      <h1>{title}</h1>
      {subtitle && <p id={subtitleId}>{subtitle}</p>}
    </header>
  );
}
