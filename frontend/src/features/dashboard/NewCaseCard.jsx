import React from 'react';
// import { Link } from 'react-router-dom'; // No longer need Link here
import styles from './LawyerDashboard.module.css';
import { FiEye } from 'react-icons/fi';

// Updated to receive 'onViewDetails'
const NewCaseCard = ({ caseData, onAccept, onDecline, onViewDetails }) => {
  const { _id, title, description, caseType, createdAt, amount } = caseData;
  
  const tag = 'medium'; 
  const getTagStyle = (tag) => {
    switch (tag.toLowerCase()) {
      case 'medium': return styles.tagMedium;
      case 'high': return styles.tagHigh;
      case 'low': return styles.tagLow;
      default: return styles.tagMedium;
    }
  };
  
  // Stop propagation on the action buttons
  const handleAccept = (e) => {
    e.stopPropagation();
    onAccept(_id);
  };
  const handleDecline = (e) => {
    e.stopPropagation();
    onDecline(_id);
  };

  return (
    // Make the whole card clickable as a fallback
    <div className={styles.newCaseCard} onClick={onViewDetails}>
      <div className={styles.cardTop}>
        <h4 className={styles.caseTitle}>{title}</h4>
        <span className={`${styles.caseTag} ${getTagStyle(tag)}`}>{tag}</span>
      </div>
      <p className={styles.caseDescription}>{description.substring(0, 150)}...</p>
      
      <div className={styles.caseMeta}>
        <span>{caseType}</span>
        <span>•</span>
        <span>{new Date(createdAt).toLocaleDateString('en-IN')}</span>
        <span>•</span>
        <span className={styles.caseAmount}>{amount}</span>
      </div>
      
      <div className={styles.cardActions}>
        {/* --- THIS IS THE FIX --- */}
        {/* Changed from <Link> to <button> */}
        <button onClick={onViewDetails} className={styles.detailsBtn}>
          <FiEye /> View Details
        </button>
        {/* --- END OF FIX --- */}
        
        <button 
          onClick={handleDecline} 
          className={styles.declineBtn}
        >
          Decline
        </button>
        <button 
          onClick={handleAccept} 
          className={styles.acceptBtn}
        >
          Accept Case
        </button>
      </div>
    </div>
  );
};

export default NewCaseCard;