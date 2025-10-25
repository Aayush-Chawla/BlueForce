import React, { useState } from 'react';
import { Search, Filter, MapPin, Calendar, RefreshCw, AlertCircle } from 'lucide-react';
import { useEvents, useAuth } from '../contexts';

const Events = () => {
  const { events, joinEvent, leaveEvent, loading, error, refreshEvents } = useEvents();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [actionLoading, setActionLoading] = useState(false);

  // Dynamically import the appropriate EventCard based on user role
  const EventCard = React.useMemo(() => {
    if (user?.role === 'ngo') {
      return React.lazy(() => import('../features/ngo/components/EventCard'));
    } else {
      return React.lazy(() => import('../features/participant/components/EventCard'));
    }
  }, [user?.role]);
  const filteredEvents = events
    .filter(event => 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(event => {
      if (statusFilter === 'all') return true;
      if (statusFilter === 'upcoming') return event.isUpcoming;
      if (statusFilter === 'ongoing') return event.status === 'ACTIVE' && !event.isUpcoming;
      if (statusFilter === 'completed') return event.status === 'COMPLETED';
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
      } else if (sortBy === 'participants') {
        return (b.currentParticipants || 0) - (a.currentParticipants || 0);
      }
      return 0;
    });

  const handleJoinEvent = async (eventId) => {
    if (user) {
      setActionLoading(true);
      try {
        console.log('Joining event:', eventId, 'for user:', user?.id);
        console.log('User token:', localStorage.getItem('authToken'));
        await joinEvent(eventId, user?.id);
        console.log('Successfully joined event');
        alert('Successfully joined the event!');
      } catch (error) {
        console.error('Error joining event:', error);
        console.error('Error status:', error.status);
        console.error('Error response:', error.response);
        
        if (error.status === 403) {
          alert('Authentication failed. Please log in again.');
        } else if (error.status === 404) {
          alert('Event not found. Please refresh the page.');
        } else {
          alert(`Failed to join event: ${error.message}`);
        }
      } finally {
        setActionLoading(false);
      }
    } else {
      console.log('No user found, cannot join event');
      alert('Please log in to join events.');
    }
  };

  const handleLeaveEvent = async (eventId) => {
    if (user) {
      setActionLoading(true);
      try {
        await leaveEvent(eventId, user?.id);
      } catch (error) {
        console.error('Error leaving event:', error);
        alert('Failed to leave event. Please try again.');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleRefresh = async () => {
    setActionLoading(true);
    try {
      await refreshEvents();
    } catch (error) {
      console.error('Error refreshing events:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const upcomingEvents = filteredEvents.filter(event => event.isUpcoming);
  const pastEvents = filteredEvents.filter(event => event.status === 'COMPLETED');
  
  // Debug logging
  console.log('Events loaded:', events);
  console.log('Filtered events:', filteredEvents);
  console.log('Upcoming events:', upcomingEvents);
  console.log('Past events:', pastEvents);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-4xl font-bold text-gray-800">Beach Cleaning Events</h1>
            <button
              onClick={handleRefresh}
              disabled={actionLoading}
              className="ml-4 p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
              title="Refresh events"
            >
              <RefreshCw className={`w-5 h-5 ${actionLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover and join beach cleaning events in your area. Together, we can make a real impact.
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center">
            <RefreshCw className="w-5 h-5 text-blue-500 mr-3 animate-spin" />
            <p className="text-blue-700">Loading events...</p>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Events</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent appearance-none"
              >
                <option value="date">Sort by Date</option>
                <option value="participants">Sort by Popularity</option>
              </select>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-sky-500" />
              Upcoming Events ({upcomingEvents.length})
            </h2>
            <React.Suspense fallback={<div>Loading...</div>}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onJoin={user?.role === 'participant' ? handleJoinEvent : undefined}
                    onLeave={user?.role === 'participant' ? handleLeaveEvent : undefined}
                  />
                ))}
              </div>
            </React.Suspense>
          </div>
        )}

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <MapPin className="w-6 h-6 mr-2 text-teal-500" />
              Past Events ({pastEvents.length})
            </h2>
            <React.Suspense fallback={<div>Loading...</div>}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastEvents.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    className="opacity-75"
                  />
                ))}
              </div>
            </React.Suspense>
          </div>
        )}

        {/* All Events (if no upcoming/past events) */}
        {upcomingEvents.length === 0 && pastEvents.length === 0 && filteredEvents.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-sky-500" />
              All Events ({filteredEvents.length})
            </h2>
            <React.Suspense fallback={<div>Loading...</div>}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onJoin={user?.role === 'participant' ? handleJoinEvent : undefined}
                    onLeave={user?.role === 'participant' ? handleLeaveEvent : undefined}
                  />
                ))}
              </div>
            </React.Suspense>
          </div>
        )}

        {/* No Events Found */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No events found</h3>
            <p className="text-gray-500">Try adjusting your search or filters to find events.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events; 