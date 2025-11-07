import React, { useState, useEffect } from 'react';
import { Shield, Users, Calendar, MessageSquare, Trash2, Loader2 } from 'lucide-react';
import { useAuth, useEvents } from '../../contexts';
import { AdminStatsCard, ImpactDashboard } from '../../features/admin/components';
import * as userService from '../../services/userService';
import { feedbackService } from '../../services/feedbackService';
import { isNgoRole, isParticipantRole } from '../../utils/roleUtils';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { events, loading: eventsLoading } = useEvents();
  
  const [allUsers, setAllUsers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is super admin
  const isSuperAdmin = user && user.email === 'admin@blueforce.com';

  // Fetch all users from database (with pagination)
  useEffect(() => {
    if (!isSuperAdmin) return;

    const fetchAllUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all users with pagination
        let allUsersData = [];
        let page = 0;
        const pageSize = 100; // Fetch in large batches
        
        while (true) {
          const response = await userService.getAllUsers({ page, size: pageSize });
          const users = response.users || [];
          allUsersData = [...allUsersData, ...users];
          
          // If we got fewer users than pageSize, we've reached the end
          if (users.length < pageSize) {
            break;
          }
          page++;
        }
        
        setAllUsers(allUsersData);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.message || 'Failed to fetch users');
        setAllUsers([]);
      }
    };

    // Fetch all feedback from database (with pagination)
    const fetchAllFeedback = async () => {
      try {
        let allFeedbackData = [];
        let page = 0;
        const limit = 100;
        
        while (true) {
          const response = await feedbackService.list({ page, limit });
          const items = response.items || [];
          allFeedbackData = [...allFeedbackData, ...items];
          
          // If we got fewer items than limit, we've reached the end
          if (items.length < limit || allFeedbackData.length >= response.total) {
            break;
          }
          page++;
        }
        
        setFeedbacks(allFeedbackData);
      } catch (err) {
        console.error('Error fetching feedback:', err);
        // Don't set error for feedback, just log it
        setFeedbacks([]);
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchAllUsers(), fetchAllFeedback()]);
      setLoading(false);
    };

    fetchData();
  }, [isSuperAdmin]);

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

  // Calculate system stats from real data
  const totalUsers = allUsers.length;
  const totalNGOs = allUsers.filter(u => isNgoRole(u.role)).length;
  const totalParticipants = allUsers.filter(u => isParticipantRole(u.role)).length;
  
  const totalEvents = events.length;
  
  // Calculate upcoming events (events with dateTime in the future)
  const now = new Date();
  const upcomingEvents = events.filter(e => {
    if (!e.dateTime) return false;
    const eventDate = new Date(e.dateTime);
    return eventDate > now;
  }).length;
  
  // Calculate total waste collected from events
  const totalWasteCollected = events.reduce((total, event) => {
    return total + (event.wasteCollected || event.actualWaste || event.estimatedWaste || 0);
  }, 0);
  
  const totalFeedback = feedbacks.length;

  // Show loading state
  if (loading || eventsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-lg p-8">
          <Loader2 className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-xl shadow-lg p-8 max-w-md">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
              <p className="font-semibold text-gray-800">{user.name || user.email}</p>
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