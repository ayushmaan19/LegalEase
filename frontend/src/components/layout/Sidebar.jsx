import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Layout.module.css';
import { RxDashboard } from 'react-icons/rx';
import { FiMessageSquare, FiBriefcase, FiSearch, FiSettings, FiLogOut, FiDollarSign, FiCalendar } from 'react-icons/fi'; // <-- Added new icons
import { useDetectOutsideClick } from '../../hooks/useDetectOutsideClick';
import ConfirmationModal from '../common/ConfirmationModal';

const Sidebar = () => {
  const { triggerRef, nodeRef, isActive, setIsActive } = useDetectOutsideClick(false);
  const { user, logoutAction } = useAuth();
  const navigate = useNavigate();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsActive(false);
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    logoutAction();
    setIsLogoutModalOpen(false);
    navigate('/login');
  };

  const fallbackUser = {
    name: 'Ayushmaan Yadav',
    role: 'Citizen'
  }
  
  const displayName = user?.name || fallbackUser.name;
  const displayRole = user?.role || fallbackUser.role;
  const displayPicture = user?.picture || `https://ui-avatars.com/api/?name=${displayName.replace(' ', '+')}&background=e6efff&color=2a65f1&font-size=0.45`;

  return (
    <aside className={styles.sidebar}>
      
      <div className={styles.logo}>
        <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="8" fill="#2A65F1"/>
          <path d="M20 9L8 14.5V25.5L20 31L32 25.5V14.5L20 9Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M8 14.5L20 20M20 31V20M32 14.5L20 20M27 12L13 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div>
          <h2 className={styles.logoTitle}>LegalEase</h2>
          <p className={styles.logoSubtitle}>न्यायसेतु Digital Platform</p>
        </div>
      </div>

      {/* --- THIS IS THE FIX --- */}
      <nav className={styles.nav}>
        {user?.role === 'lawyer' ? (
          /* --- LAWYER LINKS --- */
          <>
            <NavLink to="/dashboard" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
              <RxDashboard /> Dashboard
            </NavLink>
            <NavLink to="/my-cases" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
              <FiBriefcase /> My Cases
            </NavLink>
            <NavLink to="/schedule" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
              <FiCalendar /> Scheduled Appointments
            </NavLink>
            <NavLink to="/payments" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
              <FiDollarSign /> Payments Earned
            </NavLink>
          </>
        ) : (
          /* --- CITIZEN LINKS --- */
          <>
            <NavLink to="/dashboard" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
              <RxDashboard /> Dashboard
            </NavLink>
            <NavLink to="/ai-assistant" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
              <FiMessageSquare /> AI Assistant
            </NavLink>
            <NavLink to="/my-cases" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
              <FiBriefcase /> My Cases
            </NavLink>
            <NavLink to="/find-lawyer" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
              <FiSearch /> Find a Lawyer
            </NavLink>
          </>
        )}
      </nav>
      {/* --- END OF FIX --- */}

      <div className={styles.userProfile}>
        <div ref={triggerRef} className={styles.userTrigger}>
          <img 
            src={displayPicture} 
            alt={displayName} 
            className={styles.avatar} 
          />
          <div>
            <p className={styles.userName}>{displayName}</p>
            <p className={styles.userRole}>{displayRole}</p>
          </div>
        </div>

        <nav ref={nodeRef} className={`${styles.popupMenu} ${isActive ? styles.activeMenu : ''}`}>
          <NavLink to="/settings" className={styles.popupLink}><FiSettings /> Settings</NavLink>
          <button onClick={handleLogoutClick} className={styles.popupLink}>
            <FiLogOut /> Logout
          </button>
        </nav>
      </div>

      <ConfirmationModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Want to logout?"
        message="You will be returned to the login page."
      />
    </aside>
  );
};

export default Sidebar;