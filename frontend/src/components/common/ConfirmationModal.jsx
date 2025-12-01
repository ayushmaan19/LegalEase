import React from 'react';
import styles from './ConfirmationModal.module.css';
import { FiAlertTriangle } from 'react-icons/fi';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) {
    return null;
  }

  return (
    // The semi-transparent background
    <div className={styles.modalOverlay} onClick={onClose}>
      <div 
        className={styles.modalContent} 
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className={styles.iconWrapper}>
          <FiAlertTriangle />
        </div>
        
        <h2 className={styles.modalTitle}>{title}</h2>
        <p className={styles.modalMessage}>{message}</p>
        
        <div className={styles.modalActions}>
          <button className={`${styles.modalButton} ${styles.cancelButton}`} onClick={onClose}>
            No, Cancel
          </button>
          <button className={`${styles.modalButton} ${styles.confirmButton}`} onClick={onConfirm}>
            Yes, Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;