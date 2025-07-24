import React, { useState } from 'react';
import { Shield, Users, Calendar, BarChart3, MessageSquare, Search, Filter, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useEvents } from '../contexts/EventContext';
import { mockUsers, mockFeedbacks } from '../utils/mockData';
import AdminStatsCard from '../components/admin/AdminStatsCard';
import UserManagementTable from '../components/admin/UserManagementTable';
import EventOverviewTable from '../components/admin/EventOverviewTable';
import ImpactDashboard from '../components/admin/ImpactDashboard';
import FeedbackViewer from '../components/admin/FeedbackViewer';

const SuperAdminPanel = () => {
  const { user } = useAuth();
  const { events } = useEvents();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock admin check - in real app, this would be a proper role check
  const isAdmin = user && user.email === 'admin@blueforce.com';

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-lg p-8">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the admin panel.</p>
          <p className="text-sm text-gray-500 mt-2">
            Demo admin access: <code>admin@blueforce.com</code> / <code>password</code>
          </p>
        </div>
      </div>
    );
  }

  // Get all users (mock + registered)
  const savedUsers = localStorage.getItem('beachCleanupRegisteredUsers');
  const registeredUsers = savedUsers ? JSON.parse(savedUsers) : [];
  const allUsers = [...mockUsers, ...registeredUsers];

  // Calculate system stats
  const totalUsers = allUsers.length;
  const totalNGOs = allUsers.filter(u => u.role === 'ngo').length;
  const totalParticipants = allUsers.filter(u => u.role === 'participant').length;
  const totalEvents = events.length;
  const totalWasteCollected = events.reduce((total, event) => {
    return total + (event.actualWaste || event.estimatedWaste || 0);
  }, 0);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'events', label: 'Event Overview', icon: Calendar },
    { id: 'feedback', label: 'Feedback Viewer', icon: MessageSquare }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Super Admin Panel</h1>
                <p className="text-gray-600">Manage and oversee all NGOs and Participants</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Logged in as</p>
              <p className="font-semibold text-gray-800">{user.name}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AdminStatsCard
            title="Total Users"
            value={totalUsers}
            icon={Users}
            color="bg-blue-500"
            subtitle={`${totalNGOs} NGOs, ${totalParticipants} Participants`}
          />
          <AdminStatsCard
            title="Total Events"
            value={totalEvents}
            icon={Calendar}
            color="bg-green-500"
            subtitle={`${events.filter(e => e.status === 'upcoming').length} upcoming`}
          />
          <AdminStatsCard
            title="Waste Collected"
            value={`${totalWasteCollected.toFixed(1)} kg`}
            icon={BarChart3}
            color="bg-teal-500"
            subtitle="Across all events"
          />
          <AdminStatsCard
            title="Feedback Entries"
            value={mockFeedbacks.length}
            icon={MessageSquare}
            color="bg-purple-500"
            subtitle="From participants"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'dashboard' && (
              <ImpactDashboard 
                users={allUsers}
                events={events}
                totalWasteCollected={totalWasteCollected}
              />
            )}
            
            {activeTab === 'users' && (
              <UserManagementTable users={allUsers} />
            )}
            
            {activeTab === 'events' && (
              <EventOverviewTable events={events} />
            )}
            
            {activeTab === 'feedback' && (
              <FeedbackViewer feedbacks={mockFeedbacks} events={events} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminPanel;