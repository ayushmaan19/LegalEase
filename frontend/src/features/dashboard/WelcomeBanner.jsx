import React from 'react';
import styles from './WelcomeBanner.module.css';

const WelcomeBanner = () => {
  return (
    <div className={styles.bannerContainer}>
      <div className={styles.bannerContent}>
        <h1 className={styles.bannerTitle}>Welcome to LegalEase</h1>
        <p className={styles.bannerSubtitle}>न्यायसेतु - Your Digital Gateway to Justice</p>
        <div className={styles.buttonGroup}>
          <button className={styles.bannerButton}>Multilingual Support</button>
          <button className={styles.bannerButton}>Secure & Confidential</button>
          <button className={styles.bannerButton}>Pro Bono Available</button>
        </div>
      </div>
      {/* You can add an illustration here if you want */}
      {/* <div className={styles.bannerImage}> ... </div> */}
    </div>
  );
};

export default WelcomeBanner;