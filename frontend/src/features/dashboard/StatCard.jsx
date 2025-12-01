import React from 'react';
import styles from './Dashboard.module.css';

const StatCard = ({ title, value, icon, change, iconBg, iconColor }) => {
  return (
    <div className={styles.statCard}>
      <div className={styles.statIcon} style={{ backgroundColor: iconBg, color: iconColor }}>
        {icon}
      </div>
      <div className={styles.statInfo}>
        <p className={styles.statLabel}>{title}</p>
        <h3 className={styles.statNumber}>{value}</h3>
        {change && (
          <p className={change.includes('increase') ? styles.statGrowth : styles.statDetail}>
            {change}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;