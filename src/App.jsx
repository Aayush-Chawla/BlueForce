import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, EventProvider } from './contexts';
import { useAuth } from './contexts';
import Header from './components/layout/Header';
import ChatHelpButton from './components/common/ChatHelpButton';
import Home from './pages/Home';
import Events from './pages/Events';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateEvent from './pages/CreateEvent';
import EcoTips from './pages/EcoTips';
import VolunteerLeaderboard from './pages/VolunteerLeaderboard';
import ImpactStoryboard from './pages/ImpactStoryboard';
import PostEventFeedback from './pages/PostEventFeedback';
import ChatHelpCenter from './pages/ChatHelpCenter';
import EventDetails from './pages/EventDetails';
import NGODashboard from './pages/ngo/NGODashboard';
import NGOCertificates from './pages/ngo/NGOCertificates';
import ParticipantDashboard from './pages/participant/ParticipantDashboard';
import ParticipantCertificates from './pages/participant/ParticipantCertificates';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUserManagement from './pages/admin/AdminUserManagement';
import AdminEventOverview from './pages/admin/AdminEventOverview';
import AdminFeedbackViewer from './pages/admin/AdminFeedbackViewer';
import AdminEcoTipsManager from './pages/admin/AdminEcoTipsManager';

// Protected Route component for authenticated users
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

// NGO Route component
const NGORoute = ({ children }) => {
  const { user } = useAuth();
  return user && user.role === 'ngo' ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

// Participant Route component
const ParticipantRoute = ({ children }) => {
  const { user } = useAuth();
  return user && user.role === 'participant' ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

// Super Admin Route component
const SuperAdminRoute = ({ children }) => {
  const { user } = useAuth();
  const isSuperAdmin = user && user.email === 'admin@blueforce.com';
  return isSuperAdmin ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

// Public Route component that redirects authenticated users to dashboard
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return !user ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

// Dashboard Route component that redirects to role-specific dashboard
const DashboardRoute = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user is super admin
  const isSuperAdmin = user && user.email === 'admin@blueforce.com';
  
  if (isSuperAdmin) {
    return <Navigate to="/admin" replace />;
  } else if (user.role === 'ngo') {
    return <NGODashboard />;
  } else if (user.role === 'participant') {
    return <ParticipantDashboard />;
  }
  
  return <Navigate to="/" replace />;
};

// Certificates Route component that redirects to role-specific certificates
const CertificatesRoute = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role === 'ngo') {
    return <NGOCertificates />;
  } else if (user.role === 'participant') {
    return <ParticipantCertificates />;
  }
  
  return <Navigate to="/" replace />;
};

// App content component that uses auth context
const AppContent = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50">
      <Header />
      <main>
        <Routes>
          {/* Public routes - redirect to dashboard if authenticated */}
          <Route path="/" element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          } />
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          
          {/* Semi-public routes - accessible to all but with different content for authenticated users */}
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/eco-tips" element={<EcoTips />} />
          <Route path="/leaderboard" element={<VolunteerLeaderboard />} />
          <Route path="/impact-storyboard" element={<ImpactStoryboard />} />
          <Route path="/events/:eventId/feedback" element={
            <ProtectedRoute>
              <PostEventFeedback />
            </ProtectedRoute>
          } />
          <Route path="/chat-help-center" element={<ChatHelpCenter />} />
          
          {/* Protected routes - require authentication */}
          <Route path="/dashboard" element={<DashboardRoute />} />
          <Route path="/create-event" element={
            <NGORoute>
              <CreateEvent />
            </NGORoute>
          } />
          <Route path="/certificates" element={<CertificatesRoute />} />
          
          {/* Super Admin Routes */}
          <Route path="/admin" element={
            <SuperAdminRoute>
              <AdminDashboard />
            </SuperAdminRoute>
          } />
          <Route path="/admin/users" element={
            <SuperAdminRoute>
              <AdminUserManagement />
            </SuperAdminRoute>
          } />
          <Route path="/admin/events" element={
            <SuperAdminRoute>
              <AdminEventOverview />
            </SuperAdminRoute>
          } />
          <Route path="/admin/feedback" element={
            <SuperAdminRoute>
              <AdminFeedbackViewer />
            </SuperAdminRoute>
          } />
          <Route path="/admin/eco-tips" element={
            <SuperAdminRoute>
              <AdminEcoTipsManager />
            </SuperAdminRoute>
          } />
          
          {/* Catch all route - redirect to appropriate page based on auth status */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <ChatHelpButton />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <Router>
          <AppContent />
        </Router>
      </EventProvider>
    </AuthProvider>
  );
}

export default App;
