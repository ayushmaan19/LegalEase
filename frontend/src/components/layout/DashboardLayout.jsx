import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar'; // Import the Sidebar
import styles from './Layout.module.css'; // Import the styles
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to landing if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  // Prevent back navigation to this page after logout
  useEffect(() => {
    const handlePopState = () => {
      if (!isAuthenticated) {
        navigate('/', { replace: true });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAuthenticated, navigate]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={styles.dashboardLayout}>
      <Sidebar /> {/* The sidebar component */}
      <main className={styles.mainContent}>
        <Outlet /> {/* All your pages (Dashboard, My Cases, etc.) will render here */}
      </main>
    </div>
  );
};

export default DashboardLayout;