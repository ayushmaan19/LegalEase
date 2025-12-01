import React from 'react';
import styles from './CaseDetailModal.module.css'; // We'll create this next
import { FiX, FiFileText, FiUser, FiGlobe, FiDollarSign } from 'react-icons/fi';

const CaseDetailModal = ({ caseData, onClose }) => {
  if (!caseData) {
    return null;
  }

  // Format dates and data
  const { 
    title, 
    description, 
    caseId, 
    caseType, 
    createdAt, 
    language, 
    status,
    amount 
  } = caseData;
  
  const filedOnDate = new Date(createdAt).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div 
        className={styles.modalContent} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <button className={styles.closeButton} onClick={onClose}><FiX /></button>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          <div className_={styles.statusSection}>
            <span className={`${styles.statusTag} ${styles[status.toLowerCase().replace(' ', '')]}`}>
              {status}
            </span>
          </div>
          
          <p className={styles.description}>{description}</p>
          
          <h3 className={styles.detailsTitle}>Case Details</h3>
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <FiFileText />
              <div>
                <span>Case ID</span>
                <strong>{caseId}</strong>
              </div>
            </div>
            <div className={styles.detailItem}>
              <FiUser />
              <div>
                <span>Case Type</span>
                <strong>{caseType}</strong>
              </div>
            </div>
            <div className={styles.detailItem}>
              <FiGlobe />
              <div>
                <span>Language</span>
                <strong>{language}</strong>
              </div>
            </div>
            <div className={styles.detailItem}>
              <FiDollarSign />
              <div>
                <span>Amount</span>
                <strong>{amount}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <p>Filed on: {filedOnDate}</p>
          <button className={styles.primaryButton} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default CaseDetailModal;