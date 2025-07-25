import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { EventProvider } from './contexts/EventContext';
import { useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Events from './pages/Events';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import EcoTips from './pages/EcoTips';
import Certificates from './pages/Certificates';
import VolunteerLeaderboard from './pages/VolunteerLeaderboard';
import ImpactStoryboard from './pages/ImpactStoryboard';
import PostEventFeedback from './pages/PostEventFeedback';
import ChatHelpButton from './components/ChatHelpButton';
import ChatHelpCenter from './pages/ChatHelpCenter';
import CSRImpact from './pages/CSRImpact';

// Protected Route component for authenticated users
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public Route component that redirects authenticated users to dashboard
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return !user ? <>{children}</> : <Navigate to="/dashboard" replace />;
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
          <Route path="/eco-tips" element={<EcoTips />} />
          <Route path="/leaderboard" element={<VolunteerLeaderboard />} />
          <Route path="/csr-impact" element={<CSRImpact />} />
          <Route path="/impact-storyboard" element={<ImpactStoryboard />} />
          <Route path="/events/:eventId/feedback" element={
            <ProtectedRoute>
              <PostEventFeedback />
            </ProtectedRoute>
          } />
          <Route path="/chat-help-center" element={<ChatHelpCenter />} />
          
          {/* Protected routes - require authentication */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/create-event" element={
            <ProtectedRoute>
              <CreateEvent />
            </ProtectedRoute>
          } />
          <Route path="/certificates" element={
            <ProtectedRoute>
              <Certificates />
            </ProtectedRoute>
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
