import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import all your pages and layouts
import DashboardLayout from './components/layout/DashboardLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './features/auth/LoginPage';
import RoleSelectionPage from './features/auth/RoleSelectionPage';
import SignupPage from './features/auth/SignupPage';
import DashboardPage from './pages/DashboardPage';
import AIAssistantPage from './features/ai-assistant/AIAssistantPage';
import MyCasesPage from './features/cases/MyCasesPage';
import FindLawyerPage from './features/find-lawyer/FindLawyerPage';
import SettingsPage from './pages/SettingsPage'; 
import FileCasePage from './features/cases/FileCasePage';
import LawyerProfilePage from './pages/LawyerProfilePage';
import DummyLawyerProfilePage from './pages/DummyLawyerProfilePage';
import ForgotPasswordPage from './features/auth/ForgotPasswordPage'; 
import ResetPasswordPage from './features/auth/ResetPasswordPage';
import ChatPage from './pages/ChatPage';
import ClientCommunicationsPage from './pages/ClientCommunicationsPage';
import SchedulePage from './pages/SchedulePage'; 
import PaymentsPage from './pages/PaymentsPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/select-role" element={<RoleSelectionPage />} />
        <Route path="/signup" element={<SignupPage />} />
         <Route path="/forgot-password" element={<ForgotPasswordPage />} /> 
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} /> 

        {/* Protected Routes (all render inside the DashboardLayout) */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/ai-assistant" element={<AIAssistantPage />} />
          <Route path="/my-cases" element={<MyCasesPage />} />
          <Route path="/find-lawyer" element={<FindLawyerPage />} />
          <Route path="/settings" element={<SettingsPage />} /> 
          <Route path="/file-new-case" element={<FileCasePage />} />
          <Route path="/lawyer/:id" element={<LawyerProfilePage />} />
          <Route path="/lawyer/dummy" element={<DummyLawyerProfilePage />} />
          <Route path="/chat/:room" element={<ChatPage />} />
          <Route path="/communications" element={<ClientCommunicationsPage />} />
          <Route path="/schedule" element={<SchedulePage />} /> 
          <Route path="/payments" element={<PaymentsPage />} /> 
        </Route>
      </Routes>
    </Router>
  );
}

export default App;