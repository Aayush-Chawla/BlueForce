import React, { useState } from 'react';
import { Search, Filter, Eye, ToggleLeft, ToggleRight, Mail, MapPin, Calendar, Award } from 'lucide-react';

const UserManagementTable = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userStatuses, setUserStatuses] = useState({});

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const userStatus = userStatuses[user.id] !== undefined ? userStatuses[user.id] : true;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && userStatus) ||
                         (statusFilter === 'inactive' && !userStatus);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const toggleUserStatus = (userId) => {
    setUserStatuses(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const getUserStatus = (userId) => {
    return userStatuses[userId] !== undefined ? userStatuses[userId] : true;
  };

  const formatUserStats = (user) => {
    if (user.role === 'ngo') {
      return `${user.eventsOrganized || 0} events organized`;
    } else {
      return `${user.eventsJoined || 0} events joined, ${user.totalWasteCollected || 0} kg collected`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <div className="text-sm text-gray-600">
          Total: {filteredUsers.length} users
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
          >
            <option value="all">All Roles</option>
            <option value="ngo">NGOs</option>
            <option value="participant">Participants</option>
          </select>
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => {
                const isActive = getUserStatus(user.id);
                return (
                  <tr key={user.id} className={`hover:bg-gray-50 ${!isActive ? 'opacity-60' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={user.avatar || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400'}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                          onError={e => {
                            const fallback = 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400';
                            if (e.target.src !== fallback) {
                              e.target.onerror = null;
                              e.target.src = fallback;
                            }
                          }}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {user.email}
                          </div>
                          {user.location && (
                            <div className="text-xs text-gray-400 flex items-center mt-1">
                              <MapPin className="w-3 h-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'ngo' 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'ngo' ? 'NGO' : 'Participant'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatUserStats(user)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="text-purple-600 hover:text-purple-900 inline-flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className={`inline-flex items-center ${
                          isActive 
                            ? 'text-red-600 hover:text-red-900' 
                            : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        {isActive ? (
                          <>
                            <ToggleRight className="w-4 h-4 mr-1" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-4 h-4 mr-1" />
                            Activate
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">User Details</h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedUser.avatar || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={selectedUser.name}
                    className="w-20 h-20 rounded-full object-cover"
                    onError={e => {
                      const fallback = 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400';
                      if (e.target.src !== fallback) {
                        e.target.onerror = null;
                        e.target.src = fallback;
                      }
                    }}
                  />
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800">{selectedUser.name}</h4>
                    <p className="text-gray-600">{selectedUser.email}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-2 ${
                      selectedUser.role === 'ngo' 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {selectedUser.role === 'ngo' ? 'NGO' : 'Participant'}
                    </span>
                  </div>
                </div>

                {selectedUser.bio && (
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">Bio</h5>
                    <p className="text-gray-600">{selectedUser.bio}</p>
                  </div>
                )}

                {selectedUser.location && (
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-2">Location</h5>
                    <p className="text-gray-600 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {selectedUser.location}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {selectedUser.role === 'ngo' ? (
                    <>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <Calendar className="w-5 h-5 text-amber-500 mr-2" />
                          <div>
                            <p className="text-sm text-gray-600">Events Organized</p>
                            <p className="text-xl font-bold text-gray-800">{selectedUser.eventsOrganized || 0}</p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <Calendar className="w-5 h-5 text-blue-500 mr-2" />
                          <div>
                            <p className="text-sm text-gray-600">Events Joined</p>
                            <p className="text-xl font-bold text-gray-800">{selectedUser.eventsJoined || 0}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <Award className="w-5 h-5 text-green-500 mr-2" />
                          <div>
                            <p className="text-sm text-gray-600">Waste Collected</p>
                            <p className="text-xl font-bold text-gray-800">{selectedUser.totalWasteCollected || 0} kg</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementTable;