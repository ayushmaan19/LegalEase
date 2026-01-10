import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';
import { FaUser, FaGavel } from 'react-icons/fa';
import Auth3DScene from '../../components/common/Auth3DScene';

const RoleSelectionPage = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    navigate(`/signup?role=${role}`);
  };

  return (
    <div className={styles.authPage}>
      
      {/* --- Left Branding Column --- */}
      <div className={styles.brandingContainer}>
        {/* --- Subtle Background --- */}
        <div className={styles.sceneContainer}>
          <Auth3DScene />
        </div>
        <div className={styles.brandingContent}>
          <div className={styles.logoCircle}>LE</div>
          <h1 className={styles.brandingTitle}>Join LegalEase</h1>
          <p className={styles.brandingSubtitle}>
            Select how you'd like to use our platform to get started.
          </p>
        </div>
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