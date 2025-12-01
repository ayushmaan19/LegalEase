import React from 'react';
import { useAuth } from '../context/AuthContext';

// Import the two separate dashboard components
import CitizenDashboardPage from '../features/dashboard/CitizenDashboardPage';
import LawyerDashboardPage from '../features/dashboard/LawyerDashboardPage';

const DashboardPage = () => {
  const { user, loading } = useAuth(); // Get the logged-in user and loading state

  // If the context is loading, show the message
  if (loading) {
    return (
      <div style={{ padding: '40px', fontFamily: 'Inter, sans-serif' }}>
        Loading User Profile...
      </div>
    );
  }

  // If loading is done AND there is no user, they shouldn't be here.
  // We'll add a <ProtectedRoute> later to fix this, but for now:
  if (!user) {
     return <div>Error: You are not logged in.</div>
  }

  // Check the user's role and render the correct dashboard
  switch (user.role) {
    case 'citizen':
      return <CitizenDashboardPage />;
    case 'lawyer':
      return <LawyerDashboardPage />;
    case 'admin':
      return <div>Admin Dashboard Coming Soon</div>;
    default:
      // This will catch the case where user.role is null
      return <div>Error: User role not set.</div>;
  }
};

export default DashboardPage;