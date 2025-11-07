import React, { useState, useEffect } from 'react';
import { Shield, Users, Loader2 } from 'lucide-react';
import { useAuth, useEvents } from '../../contexts';
import { UserManagementTable } from '../../features/admin/components';
import * as userService from '../../services/userService';

const AdminUserManagement = () => {
  const { user } = useAuth();
  const { events } = useEvents();
  const isSuperAdmin = user && user.email === 'admin@blueforce.com';
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isSuperAdmin) return;

    const fetchAllUsers = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch all users with pagination
        let allUsersData = [];
        let page = 0;
        const pageSize = 100; // Fetch in large batches
        let totalFetched = 0;
        let totalAvailable = null;
        
        console.log('Starting to fetch users from user-service (users database - blueforce_userdb)...');
        
        while (true) {
          console.log(`Fetching page ${page} with size ${pageSize}...`);
          const response = await userService.getAllUsers({ page, size: pageSize });
          
          console.log('API Response from user-service:', response);
          
          // Backend returns: { success: true, users: [...], total: X, page: Y, size: Z }
          // This is from the 'users' table in blueforce_userdb database (user-service)
          // NOT from auth_users table - this is the correct database
          let fetchedUsers = [];
          if (response && typeof response === 'object') {
            fetchedUsers = response.users || response.data?.users || [];
          }
          
          const total = response?.total || response?.data?.total;
          
          if (total !== undefined && totalAvailable === null) {
            totalAvailable = total;
            console.log(`Total users available in users database: ${totalAvailable}`);
          }
          
          if (!Array.isArray(fetchedUsers)) {
            console.error('Invalid response format - users is not an array:', fetchedUsers);
            console.error('Full response:', response);
            break;
          }
          
          console.log(`Fetched ${fetchedUsers.length} users on page ${page}`);
          allUsersData = [...allUsersData, ...fetchedUsers];
          totalFetched += fetchedUsers.length;
          
          // Break conditions:
          // 1. Got fewer users than requested (last page)
          // 2. Fetched all available users
          // 3. No users returned
          if (fetchedUsers.length === 0 || 
              fetchedUsers.length < pageSize || 
              (totalAvailable !== null && totalFetched >= totalAvailable)) {
            console.log(`Finished fetching. Total users: ${allUsersData.length}`);
            break;
          }
          
          page++;
        }
        
        console.log(`Successfully fetched ${allUsersData.length} users total`);
        setUsers(allUsersData);
        
        if (allUsersData.length === 0) {
          console.warn('No users found in database');
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        console.error('Error details:', {
          message: err.message,
          status: err.status,
          response: err.response
        });
        setError(err.message || err.response?.message || 'Failed to fetch users from database');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, [isSuperAdmin]);

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
        <div className="bg-white rounded-xl shadow-lg p-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">Loading users from database...</p>
            </div>
          )}
          {error && (
            <div className="text-center py-8">
              <div className="text-red-600 mb-4">{error}</div>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Retry
              </button>
            </div>
          )}
          {!loading && !error && users.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Users Found</h3>
              <p className="text-gray-500">There are no users in the database yet.</p>
            </div>
          )}
          {!loading && !error && users.length > 0 && <UserManagementTable users={users} events={events} />}
        </div>
      </div>
    </div>
  );
};

export default AdminUserManagement;