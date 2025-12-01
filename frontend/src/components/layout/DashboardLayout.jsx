import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; // Import the Sidebar
import styles from './Layout.module.css'; // Import the styles

const DashboardLayout = () => {
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