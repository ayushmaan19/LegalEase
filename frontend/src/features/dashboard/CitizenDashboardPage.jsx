import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './Dashboard.module.css';
import WelcomeBanner from './WelcomeBanner';
import StatCard from './StatCard';
import { FiBriefcase, FiClock, FiCheckCircle, FiMessageSquare, FiSearch, FiPlusCircle } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

// --- NEW COMPONENT FOR QUICK ACTIONS & CHATS ---
const QuickActions = ({ chats }) => {
  const { user } = useAuth(); // Get the logged-in citizen

  // Function to create the unique chat room ID
  const getRoomId = (lawyerId) => {
    const citizenId = user.id || user._id;
    return [lawyerId, citizenId].sort().join('_');
  };

  return (
    <div className={styles.quickActionsCard}>
      <h2>Quick Actions</h2>
      <ul className={styles.actionList}>
        <li>
          <Link to="/ai-assistant" className={`${styles.actionLink} ${styles.actionPrimary}`}>
            <FiMessageSquare /> Ask AI Legal Assistant
          </Link>
        </li>
        <li>
          <Link to="/find-lawyer" className={styles.actionLink}>
            <FiSearch /> Find a Lawyer
          </Link>
        </li>
        <li>
          <Link to="/file-new-case" className={styles.actionLink}>
            <FiPlusCircle /> File New Case
          </Link>
        </li>
      </ul>

      {/* --- ONGOING CHATS SECTION --- */}
      {/* This only renders if there are chats */}
      {chats.length > 0 && (
        <>
          <h2 className={styles.chatsTitle}>Ongoing Chats</h2>
          <ul className={styles.actionList}>
            {chats.map(chat => (
              <li key={chat._id}>
                {/* We can now get the lawyer's name from the populated data */}
                <Link to={`/chat/${getRoomId(chat.lawyer._id)}`} className={styles.actionLink}>
                  <FiMessageSquare /> Chat with {chat.lawyer.name}
                  {/* TODO: Add notification bubble */}
                  {/* <span className={styles.notificationBadge}>1</span> */}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
      {/* --- END OF ONGOING CHATS SECTION --- */}
    </div>
  );
};
// --- END OF NEW COMPONENT ---


// --- MAIN DASHBOARD PAGE ---
const CitizenDashboardPage = () => {
  const [stats, setStats] = useState({ total: 0, active: 0, resolved: 0, consultations: 5 });
  const [recentCases, setRecentCases] = useState([]);
  const [ongoingChats, setOngoingChats] = useState([]); // State for chats
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5001/api/cases/mycases');
        const cases = res.data;

        // Calculate stats (unchanged)
        const total = cases.length;
        const active = cases.filter(c => c.status === 'In Progress' || c.status === 'Assigned').length;
        const resolved = cases.filter(c => c.status === 'Resolved').length;
        setStats(prevStats => ({ ...prevStats, total, active, resolved }));
        
        // Set recent cases (unchanged)
        setRecentCases(cases.slice(0, 3));

        // --- THIS IS THE FIX ---
        // Find cases that have a lawyer (are "Assigned" or "In Progress")
        const chats = cases.filter(c => 
          (c.status === 'Assigned' || c.status === 'In Progress') && c.lawyer
        );
        setOngoingChats(chats);
        // --- END FIX ---

      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
      setLoading(false);
    };

    fetchDashboardData();
  }, []); // Runs once on page load

  const statsData = [
    { title: "Total Cases", value: stats.total, icon: <FiBriefcase />, change: "+12% increase", iconBg: '#e6efff', iconColor: '#2a65f1' },
    { title: "Active Cases", value: stats.active, icon: <FiClock />, change: null, iconBg: '#e8f5e9', iconColor: '#4caf50' },
    { title: "Resolved Cases", value: stats.resolved, icon: <FiCheckCircle />, change: `Success Rate: ${stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%`, iconBg: '#f3e8fd', iconColor: '#764cf1' },
    { title: "Consultations", value: stats.consultations, icon: <FiMessageSquare />, change: "AI + Human Help", iconBg: '#fff3e0', iconColor: '#ff9800' }
  ];

  return (
    <div className={styles.dashboardPage}>
      <WelcomeBanner />

      <div className={styles.statsGrid}>
        {statsData.map(stat => (
          <StatCard 
            key={stat.title}
            {...stat}
          />
        ))}
      </div>

      <div className={styles.bottomGrid}>
        <div className={styles.mainCard}>
          <div className={styles.cardHeader}>
            <h2>Recent Cases</h2>
            <Link to="/my-cases" className={styles.viewAll}>View All →</Link>
          </div>
          
          {loading ? (
            <div className={styles.noCases}>Loading cases...</div>
          ) : recentCases.length === 0 ? (
            <div className={styles.noCases}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.noCasesIcon}>
                 <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#cbd5e0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                 <path d="M14 2V8H20" stroke="#cbd5e0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                 <path d="M12 18L12 12" stroke="#cbd5e0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                 <path d="M9 15H15" stroke="#cbd5e0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h3>No Cases Found</h3>
              <p>You haven't filed any cases yet. Get started by filing your first case.</p>
              <Link to="/file-new-case" className={styles.createCaseButton}>Create Your First Case</Link>
            </div>
          ) : (
            <div className={styles.recentCasesList}>
              {recentCases.map(caseItem => (
                <div key={caseItem._id} className={styles.caseRow}>
                  <div className={styles.caseRowInfo}>
                    <h4>{caseItem.title}</h4>
                    <span>{caseItem.caseType} • Filed on {new Date(caseItem.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                  <span className={`${styles.caseStatus} ${styles[caseItem.status.toLowerCase().replace(' ', '')]}`}>
                    {caseItem.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* We now pass the live chat data to the QuickActions component */}
        <QuickActions chats={ongoingChats} />
        
      </div>
    </div>
  );
};

export default CitizenDashboardPage;