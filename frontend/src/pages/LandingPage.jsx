import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css'; // We will create this file next
import { FiArrowRight } from 'react-icons/fi';

const LandingPage = () => {
  return (
    <div className={styles.pageWrapper}>
      {/* Header Section */}
      <header className={styles.header}>
        <div className={styles.logo}>
          {/* You might want to use an <img> tag if you have a logo file */}
          <span className={styles.logoIcon}>⚖️</span>
          <span>LegalEase</span>
        </div>
        <nav className={styles.nav}>
          <Link to="/login" className={styles.signInBtn}>Sign In</Link>
          <Link to="/select-role" className={styles.getStartedBtn}>Get Started</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className={styles.hero}>
        <h1 className={styles.heroTitle}>Accessible Legal Aid for Every Indian Citizen</h1>
        <p className={styles.heroSubtitle}>
          Bridging the gap between citizens and legal professionals. Get AI-powered guidance and connect with verified lawyers, all in your own language.
        </p>
        <div className={styles.heroActions}>
          <Link to="/select-role" className={`${styles.getStartedBtn} ${styles.heroBtn}`}>
            Get Started Now <FiArrowRight />
          </Link>
          <Link to="/login" className={`${styles.secondaryBtn} ${styles.heroBtn}`}>
            I am a Lawyer
          </Link>
        </div>
      </main>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statValue}>50,000+</span>
          <span className={styles.statLabel}>Citizens Helped</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>2,500+</span>
          <span className={styles.statLabel}>Verified Lawyers</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>15+</span>
          <span className={styles.statLabel}>Legal Domains</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>6+</span>
          <span className={styles.statLabel}>Languages Supported</span>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;