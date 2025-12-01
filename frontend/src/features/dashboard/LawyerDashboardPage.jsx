import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './LawyerDashboard.module.css';
import StatCard from './StatCard';
import NewCaseCard from './NewCaseCard';
import { useAuth } from '../../context/AuthContext';
import { FiBriefcase, FiCheckSquare, FiInbox, FiDollarSign, FiMessageSquare, FiUser, FiCalendar } from 'react-icons/fi';
import CaseDetailModal from '../cases/CaseDetailModal';

// --- ADDING DUMMY DATA FOR A BETTER LOOK ---
const DUMMY_NEW_CASES = [
  { _id: 'dummy1', title: 'fhv (Sample)', description: 'v sdvdvs (Sample Case)', caseType: 'Criminal Law', createdAt: new Date(), amount: '₹under-5000', tags: ['medium'] },
  { _id: 'dummy2', title: 'dcsdcs (Sample)', description: 'v sdvdvs (Sample Case)', caseType: 'Criminal Law', createdAt: new Date(), amount: '₹15000-50000', tags: ['medium'] },
];
const DUMMY_ACTIVE_CASES = [
  { _id: 'dummyA1', title: 'Divorce and Child Custody (Sample)', caseType: 'Family Law', status: 'Assigned' }
];

const LawyerDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0, pendingMessages: 0, earnings: "₹0" });
  const [newCases, setNewCases] = useState(DUMMY_NEW_CASES); // Start with dummy data
  const [activeCases, setActiveCases] = useState(DUMMY_ACTIVE_CASES); // Start with dummy data
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  // --- DATA FETCHING ---
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [myCasesRes, pendingCasesRes] = await Promise.all([
        axios.get('http://localhost:5001/api/cases/mycases'),
        axios.get('http://localhost:5001/api/cases/pending')
      ]);

      const myCases = myCasesRes.data;
      const total = myCases.length;
      const active = myCases.filter(c => c.status === 'In Progress' || c.status === 'Assigned').length;
      const completed = myCases.filter(c => c.status === 'Resolved').length;
      
      setStats(prev => ({ ...prev, total, active, completed }));
      
      // MERGE: Show real + dummy data
      setActiveCases([...myCases.filter(c => c.status === 'Assigned').slice(0, 3), ...DUMMY_ACTIVE_CASES]);
      setNewCases([...pendingCasesRes.data, ...DUMMY_NEW_CASES]);

    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
      // If API fails, we'll just have the dummy data
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user && user.role === 'lawyer') {
      fetchDashboardData();
    }
  }, [user, fetchDashboardData]);

  // --- CASE ACTIONS ---
  const handleAcceptCase = async (caseId) => {
    // If it's a dummy case, just remove it from the list
    if (caseId.startsWith('dummy')) {
      setNewCases(prev => prev.filter(c => c._id !== caseId));
      return;
    }
    // Real case
    try {
      await axios.put(`http://localhost:5001/api/cases/accept/${caseId}`);
      fetchDashboardData(); // Re-fetch all data
    } catch (err) {
      console.error('Failed to accept case', err);
      alert(err.response?.data?.msg || 'This case may no longer be available.');
    }
  };

  const handleDeclineCase = async (caseId) => {
    // If it's a dummy case, just remove it from the list
    if (caseId.startsWith('dummy')) {
      setNewCases(prev => prev.filter(c => c._id !== caseId));
      return;
    }
    // Real case
    try {
      await axios.put(`http://localhost:5001/api/cases/decline/${caseId}`);
      setNewCases(prev => prev.filter(c => c._id !== caseId));
    } catch (err) {
      console.error('Failed to decline case', err);
    }
  };
  const handleOpenModal = (caseData) => {
    setSelectedCase(caseData);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCase(null);
  };

  // --- (Stats array remains the same) ---
  const lawyerStatsData = [
    { title: "Total Cases", value: stats.total, icon: <FiBriefcase />, change: "+15% this month", iconBg: '#e6efff', iconColor: '#2a65f1' },
    { title: "Active Cases", value: stats.active, icon: <FiBriefcase />, change: null, iconBg: '#e8f5e9', iconColor: '#4caf50' },
    { title: "Completed", value: stats.completed, icon: <FiCheckSquare />, change: `Success Rate: ${stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%`, iconBg: '#f3e8fd', iconColor: '#764cf1' },
    { title: "Pending Messages", value: stats.pendingMessages, icon: <FiInbox />, change: "Respond promptly", iconBg: '#fff3e0', iconColor: '#ff9800' },
    { title: "Monthly Earnings", value: stats.earnings, icon: <FiDollarSign />, change: "+22% growth", iconBg: '#e0f7fa', iconColor: '#00bcd4' },
  ];

  return (
    <div className={styles.wrapper}>
      {/* --- 1. WELCOME BANNER --- */}
      <div className={styles.welcomeBanner}>
        <div>
          <h1 className={styles.bannerTitle}>Welcome, Advocate {user?.name || 'Ayushmaan'}</h1>
          <p className={styles.bannerSubtitle}>Your Legal Practice Dashboard - Serve Justice, Earn Respect</p>
        </div>
        <div className={styles.bannerTags}>
          <span><FiCheckSquare /> Verified Professional</span>
          <span>6+ Years Experience</span>
          <span>{stats.total} Cases Handled</span>
        </div>
      </div>

      {/* --- 2. STATS GRID (5 COLS) --- */}
      <div className={styles.statsGrid}>
        {lawyerStatsData.map(stat => (
          <StatCard 
            key={stat.title} 
            title={stat.title} 
            value={stat.value} 
            icon={stat.icon}
            change={stat.change}
            iconBg={stat.iconBg}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      {/* --- 3. MAIN 2-COLUMN LAYOUT --- */}
      <div className={styles.mainLayout}>
        
        {/* --- 3a. Main Content (New Cases) --- */}
        <div className={styles.mainContent}>
          <div className={styles.cardHeader}>
            <h2>New Cases Available ({loading ? '...' : newCases.length})</h2>
            <Link to="/my-cases" className={styles.viewAll}>View All Cases →</Link>
          </div>
          <div className={styles.caseList}>
            {loading ? (
              <p>Loading new cases...</p>
            ) : newCases.length === 0 ? (
              <p className={styles.sidebarPlaceholder}>No new cases are currently available.</p>
            ) : (
              newCases.map(c => (
                <NewCaseCard 
                  key={c._id} 
                  caseData={c} 
                  onAccept={handleAcceptCase}
                  onDecline={handleDeclineCase} // Pass the decline function
                  onViewDetails={() => handleOpenModal(c)}
                />
              ))
            )}
          </div>
        </div>

        {/* --- 3b. Right Sidebar --- */}
        <aside className={styles.rightSidebar}>
          {/* Quick Actions Card */}
          <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarTitle}>Quick Actions</h3>
            <ul className={styles.actionList}>
              <li><Link to="/my-cases" className={`${styles.actionLink} ${styles.actionPrimary}`}><FiBriefcase /> Manage My Cases</Link></li>
              <li><Link to="/communications" className={styles.actionLink}><FiMessageSquare /> Client Communications</Link></li>
              <li><Link to="/schedule" className={styles.actionLink}><FiCalendar /> Schedule & Appointments</Link></li>
              <li><Link to="/settings" className={styles.actionLink}><FiUser /> Profile & Verification</Link></li>
            </ul>
          </div>
          
          {/* Active Cases Card */}
          <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarTitle}>Active Cases ({activeCases.length})</h3>
            {activeCases.length > 0 ? (
              activeCases.map(c => (
                <div key={c._id} className={styles.activeCaseItem}>
                  <div className={styles.activeCaseInfo}>
                    <p>{c.title}</p>
                    <span>{c.caseType}</span>
                  </div>
                  <span className={styles.activeCaseTag}>{c.status}</span>
                </div>
              ))
            ) : (
              <p className={styles.sidebarPlaceholder}>You have no active cases.</p>
            )}
          </div>

          {/* Performance Card */}
          <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarTitle}>This Month's Performance</h3>
            <ul className={styles.performanceList}>
              <li><span>Cases Resolved</span> <strong>{stats.completed}</strong></li>
              <li><span>Client Satisfaction</span> <strong>4.8/5.0</strong></li>
              <li><span>Response Time</span> <strong>&lt; 2 hrs</strong></li>
            </ul>
          </div>
        </aside>
      </div>
      <CaseDetailModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        caseData={selectedCase}
      />
    </div>
  );
};

export default LawyerDashboardPage;