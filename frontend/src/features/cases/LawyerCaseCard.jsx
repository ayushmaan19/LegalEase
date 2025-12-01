import React from 'react';
import styles from './MyCases.module.css';
import { FiFileText, FiCalendar, FiGlobe, FiCheckCircle, FiPlay } from 'react-icons/fi'; // <-- 1. Import FiPlay

// 2. Add 'onStartWork' to the props
const LawyerCaseCard = ({ caseData, onComplete, onStartWork, onClick }) => {
  const { _id, title, description, caseId, caseType, createdAt, language, status } = caseData;

  const getStatusStyle = () => {
    switch (status) {
      case 'Assigned': return styles.statusAssigned;
      case 'In Progress': return styles.statusInProgress;
      case 'Resolved': return styles.statusResolved;
      default: return '';
    }
  };

  const filedOnDate = new Date(createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // 3. Create separate handlers to stop click propagation
  const handleStartClick = (e) => {
    e.stopPropagation(); // Stop the click from opening the modal
    onStartWork(_id);
  };

  const handleCompleteClick = (e) => {
    e.stopPropagation(); // Stop the click from opening the modal
    onComplete(_id);
  };

  return (
    <div className={`${styles.caseCard} ${styles.clickableCard}`} onClick={onClick}>
      {/* --- (Left content is unchanged) --- */}
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
        </div>
      </div>

      {/* --- 4. CONDITIONAL BUTTONS --- */}
      <div className={styles.caseRightContent}>
        <span className={`${styles.caseStatus} ${getStatusStyle()}`}>{status}</span>
        
        {/* Show "Start Work" button if status is 'Assigned' */}
        {status === 'Assigned' && (
          <button 
            onClick={handleStartClick}
            className={styles.startButton}
          >
            <FiPlay /> Start Work
          </button>
        )}
        
        {/* Show "Mark as Complete" button if status is 'In Progress' */}
        {status === 'In Progress' && (
          <button 
            onClick={handleCompleteClick}
            className={styles.completeButton}
          >
            <FiCheckCircle /> Mark as Complete
          </button>
        )}

        {/* If status is 'Resolved', no button will appear */}
      </div>
    </div>
  );
};

export default LawyerCaseCard;