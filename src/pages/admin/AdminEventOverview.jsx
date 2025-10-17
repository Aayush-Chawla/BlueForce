import React from 'react';
import { Shield, Calendar } from 'lucide-react';
import { useAuth } from '../../contexts';
import { useEvents } from '../../contexts';
import { EventOverviewTable } from '../../features/admin/components';

const AdminEventOverview = () => {
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
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Event Overview</h1>
              <p className="text-gray-600">Monitor all events and their performance</p>
            </div>
          </div>
        </div>

        {/* Event Overview Table */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <EventOverviewTable events={events} />
        </div>
      </div>
    </div>
  );
};

export default AdminEventOverview;