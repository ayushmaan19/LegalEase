import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './MyCases.module.css';
import { FiPlus } from 'react-icons/fi';
import CaseCard from './CaseCard';
import LawyerCaseCard from './LawyerCaseCard';
import { useAuth } from '../../context/AuthContext';
import CaseDetailModal from './CaseDetailModal';

const MyCasesPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('All Cases');
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  const navigate = useNavigate();

  // Fetch function (unchanged)
  const fetchCases = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:5001/api/cases/mycases');
      setCases(res.data);
    } catch (err) {
      console.error('Failed to fetch cases', err);
      setError('Failed to fetch your cases. Please try again.');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  // "Complete" handler (unchanged)
  const handleCompleteCase = async (caseId) => {
    try {
      await axios.put(`http://localhost:5001/api/cases/complete/${caseId}`);
      fetchCases(); // Refresh the list
    } catch (err) {
      console.error('Failed to complete case', err);
      alert(err.response?.data?.msg || 'Error completing case');
    }
  };
  
  // --- 1. ADD NEW "START WORK" HANDLER ---
  const handleStartWork = async (caseId) => {
    try {
      await axios.put(`http://localhost:5001/api/cases/start/${caseId}`);
      fetchCases(); // Refresh the list
    } catch (err) {
      console.error('Failed to start case', err);
      alert(err.response?.data?.msg || 'Error starting case');
    }
  };

  // Modal handlers (unchanged)
  const handleOpenModal = (caseData) => {
    setSelectedCase(caseData);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCase(null);
  };

  const tabs = (user?.role === 'lawyer')
    ? ['All Cases', 'Assigned', 'In Progress', 'Resolved']
    : ['All Cases', 'Pending', 'Assigned', 'In Progress', 'Resolved'];
  
  const filteredCases = cases.filter(c => 
    activeTab === 'All Cases' || 
    c.status === activeTab
  );

  return (
    <div className={styles.pageWrapper}>
      {/* --- (Header and Tabs are unchanged) --- */}
      <header className={styles.header}>
        <div><h1>My Legal Cases</h1><p>Track and manage your legal matters</p></div>
        {user?.role === 'citizen' && (
          <Link to="/file-new-case" className={styles.newCaseBtn}>
            <FiPlus /> File New Case
          </Link>
        )}
      </header>
      <nav className={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* --- 2. UPDATE JSX TO PASS THE NEW HANDLER --- */}
      <div className={styles.contentArea}>
        {loading ? (
          <div className={styles.emptyState}>Loading your cases...</div>
        ) : error ? (
          <div className={styles.emptyState}>{error}</div>
        ) : filteredCases.length === 0 ? (
          <div className={styles.emptyState}>
            <h4>No Cases Found for '{activeTab}'</h4>
            {user?.role === 'citizen' && (
              <Link to="/file-new-case" className={styles.fileNewCaseBtn}>
                <FiPlus /> File New Case
              </Link>
            )}
          </div>
        ) : (
          <div className={styles.caseList}>
            {filteredCases.map(caseData => (
              user?.role === 'citizen' ? (
                <CaseCard 
                  key={caseData._id} 
                  caseData={caseData} 
                  onClick={() => handleOpenModal(caseData)}
                />
              ) : (
                <LawyerCaseCard 
                  key={caseData._id} 
                  caseData={caseData} 
                  onComplete={handleCompleteCase}
                  onStartWork={handleStartWork} // <-- Pass new handler
                  onClick={() => handleOpenModal(caseData)}
                />
              )
            ))}
          </div>
        )}
      </div>

      <CaseDetailModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        caseData={selectedCase} 
      />
    </div>
  );
};

export default MyCasesPage;