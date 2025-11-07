import React, { useEffect, useState, useRef } from 'react';
import { Shield, Calendar, RefreshCw, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts';
import { useEvents } from '../../contexts';
import { EventOverviewTable } from '../../features/admin/components';

const AdminEventOverview = () => {
  const { user } = useAuth();
  const { events, loading, error, refreshEvents } = useEvents();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const hasInitialFetch = useRef(false);

  // Check if user is super admin
  const isSuperAdmin = user && user.email === 'admin@blueforce.com';

  // Initial fetch on component mount - only once
  useEffect(() => {
    if (!isSuperAdmin || hasInitialFetch.current) return;

    // Initial fetch only once on mount
    hasInitialFetch.current = true;
    refreshEvents();
    setLastRefresh(new Date());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuperAdmin]); // Only depend on isSuperAdmin, not refreshEvents

  // Manual refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshEvents();
      setLastRefresh(new Date());
    } catch (err) {
      console.error('Error refreshing events:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Format last refresh time
  const formatLastRefresh = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Event Overview</h1>
                <p className="text-gray-600">Monitor all events and their performance</p>
                <p className="text-sm text-gray-500 mt-1">
                  Last updated: {formatLastRefresh(lastRefresh)}
                </p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing || loading}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {isRefreshing || loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <RefreshCw className="w-5 h-5" />
              )}
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && !isRefreshing && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Loader2 className="w-12 h-12 text-green-500 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">Loading events from database...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl shadow-lg p-6 mb-8">
            <p className="text-red-800 font-semibold">Error loading events</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Event Overview Table */}
        {!loading && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <EventOverviewTable events={events} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEventOverview;