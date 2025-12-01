import React from 'react';
// import { Link } from 'react-router-dom'; // No longer a link
import styles from './MyCases.module.css';
import { FiFileText, FiCalendar, FiGlobe } from 'react-icons/fi';

// Now receives an 'onClick' prop
const CaseCard = ({ caseData, onClick }) => {
  const { title, description, caseId, caseType, createdAt, language, status } = caseData;

  const getStatusStyle = () => {
    switch (status) {
      case 'Pending': return styles.statusPending;
      case 'In Progress': return styles.statusInProgress;
      case 'Assigned': return styles.statusAssigned;
      case 'Resolved': return styles.statusResolved;
      default: return '';
    }
  };

  const filedOnDate = new Date(createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    // This is now a div with an onClick handler
    <div className={`${styles.caseCard} ${styles.clickableCard}`} onClick={onClick}>
      <div className={styles.caseLeftContent}>
        <h4 className={styles.caseTitle}>{title}</h4>
        <p className={styles.caseDescription}>{description.substring(0, 100)}...</p>
        
        <div className={styles.caseMeta}>
          <span className={styles.metaItem}>
            <FiFileText size={16} />
            Case ID: <span className={styles.metaValue}>{caseId}</span>
          </span>
          <span className={styles.metaItem}>
            <span className={styles.bulletPoint}></span>
            Type: <span className={styles.metaValue}>{caseType}</span>
          </span>
          <span className={styles.metaItem}>
            <FiCalendar size={16} />
            Filed: <span className={styles.metaValue}>{filedOnDate}</span>
          </span>
          <span className={styles.metaItem}>
            <span className={styles.bulletPoint}></span>
            Language: <span className={styles.metaValue}>{language}</span>
          </span>
        </div>
      </div>

      <div className={styles.caseRightContent}>
        <span className={`${styles.caseStatus} ${getStatusStyle()}`}>{status}</span>
      </div>
    </div>
  );
};

export default CaseCard;