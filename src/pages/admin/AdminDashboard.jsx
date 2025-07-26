import React from 'react';
import { Shield, Users, Calendar, BarChart3, MessageSquare, Lightbulb, Trophy, Award, TrendingUp, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useEvents } from '../../contexts/EventContext';
import { mockUsers, mockFeedbacks } from '../../utils/mockData';
import AdminStatsCard from '../../components/admin/AdminStatsCard';
import ImpactDashboard from '../../components/admin/ImpactDashboard';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { events } = useEvents();

  // Check if user is super admin
  const isSuperAdmin = user && user.email === 'admin@blueforce.com';

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-lg p-8">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the admin panel.</p>
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
  const upcomingEvents = events.filter(e => e.status === 'upcoming').length;
  const totalWasteCollected = events.reduce((total, event) => {
    return total + (event.actualWaste || event.estimatedWaste || 0);
  }, 0);
  const totalFeedback = mockFeedbacks.length;

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
                <h1 className="text-3xl font-bold text-gray-800">Super Admin Dashboard</h1>
                <p className="text-gray-600">System overview and management center</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Welcome back</p>
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
            subtitle={`${upcomingEvents} upcoming`}
          />
          <AdminStatsCard
            title="Waste Collected"
            value={`${totalWasteCollected.toFixed(1)} kg`}
            icon={Trash2}
            color="bg-teal-500"
            subtitle="Across all events"
          />
          <AdminStatsCard
            title="Feedback Entries"
            value={totalFeedback}
            icon={MessageSquare}
            color="bg-purple-500"
            subtitle="From participants"
          />
        </div>

        {/* Impact Dashboard */}
        <ImpactDashboard 
          users={allUsers}
          events={events}
          totalWasteCollected={totalWasteCollected}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;