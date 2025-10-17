import React from 'react';
import { Shield, Users } from 'lucide-react';
import { useAuth } from '../../contexts';
import { mockUsers } from '../../utils/mockData';
import { UserManagementTable } from '../../features/admin/components';

const AdminUserManagement = () => {
  const { user } = useAuth();

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

  // Get all users (mock + registered)
  const savedUsers = localStorage.getItem('beachCleanupRegisteredUsers');
  const registeredUsers = savedUsers ? JSON.parse(savedUsers) : [];
  const allUsers = [...mockUsers, ...registeredUsers];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
              <p className="text-gray-600">Manage all NGOs and Participants</p>
            </div>
          </div>
        </div>

        {/* User Management Table */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <UserManagementTable users={allUsers} />
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;