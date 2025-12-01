import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';
import { FaUser, FaGavel } from 'react-icons/fa';

const RoleSelectionPage = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    navigate(`/signup?role=${role}`);
  };

  return (
    <div className={styles.authPage}>
      
      {/* --- Left Branding Column --- */}
      <div className={styles.brandingContainer}>
        <div className={styles.logoCircle}>LN</div>
        <h1 className={styles.brandingTitle}>Join LegalEase</h1>
        <p className={styles.brandingSubtitle}>
          Bridging the gap between citizens and legal professionals. Start by selecting your role.
        </p>
      </div>

      {/* --- Right Form Column --- */}
      <div className={styles.formContainer}>
        <div className={styles.formWrapper}>
          <header className={styles.welcomeHeader}>
            <h1>Select Your Role</h1>
            <p>Please choose how you will be using the platform.</p>
          </header>

          {/* Role selection cards now live on the right side */}
          <div className={styles.roleSelection}>
            <div className={styles.roleCard} onClick={() => handleRoleSelect('citizen')}>
              <div className={styles.cardHeader}>
                <FaUser />
                <h3>Citizen</h3>
              </div>
              <p>I need legal assistance, want to file a case, or consult with a lawyer.</p>
              <button className={styles.roleButton}>Sign up as a Citizen →</button>
            </div>

            <div className={styles.roleCard} onClick={() => handleRoleSelect('lawyer')}>
              <div className={styles.cardHeader}>
                <FaGavel />
                <h3>Lawyer</h3>
              </div>
              <p>I am a legal professional looking to offer services, find cases, and manage clients.</p>
              <button className={styles.roleButton}>Sign up as a Lawyer →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;