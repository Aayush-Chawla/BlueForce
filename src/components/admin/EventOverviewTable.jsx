import React, { useState } from 'react';
import { Search, Filter, Calendar, MapPin, Users, Trash2, Eye } from 'lucide-react';

const EventOverviewTable = ({ events }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Event Overview</h2>
        <div className="text-sm text-gray-600">
          Total: {filteredEvents.length} events
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, location, or organizer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organizer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participants
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
              {filteredEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={event.imageUrl || 'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=800'}
                        alt={event.title}
                        className="w-12 h-12 rounded-lg object-cover"
                        onError={e => {
                          const fallback = 'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=800';
                          if (e.target.src !== fallback) {
                            e.target.onerror = null;
                            e.target.src = fallback;
                          }
                        }}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{event.title}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={event.organizer.avatar || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400'}
                        alt={event.organizer.name}
                        className="w-8 h-8 rounded-full object-cover"
                        onError={e => {
                          const fallback = 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400';
                          if (e.target.src !== fallback) {
                            e.target.onerror = null;
                            e.target.src = fallback;
                          }
                        }}
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{event.organizer.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <div>
                        <div>{formatDate(event.date)}</div>
                        <div className="text-xs text-gray-500">{event.time}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      {event.participants.length}/{event.maxParticipants}
                    </div>
                    {(event.actualWaste || event.estimatedWaste) && (
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Trash2 className="w-3 h-3 mr-1" />
                        {event.actualWaste || event.estimatedWaste} kg
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="text-purple-600 hover:text-purple-900 inline-flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Event Details</h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedEvent.imageUrl || 'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=800'}
                    alt={selectedEvent.title}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={e => {
                      const fallback = 'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=800';
                      if (e.target.src !== fallback) {
                        e.target.onerror = null;
                        e.target.src = fallback;
                      }
                    }}
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800">{selectedEvent.title}</h4>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-2 ${getStatusColor(selectedEvent.status)}`}>
                      {selectedEvent.status.charAt(0).toUpperCase() + selectedEvent.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{formatDate(selectedEvent.date)} at {selectedEvent.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{selectedEvent.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{selectedEvent.participants.length}/{selectedEvent.maxParticipants} participants</span>
                    </div>
                    {(selectedEvent.actualWaste || selectedEvent.estimatedWaste) && (
                      <div className="flex items-center text-gray-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        <span>
                          {selectedEvent.actualWaste ? `${selectedEvent.actualWaste} kg collected` : `${selectedEvent.estimatedWaste} kg estimated`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h5 className="font-semibold text-gray-800 mb-2">Description</h5>
                <p className="text-gray-600">{selectedEvent.description}</p>
              </div>
              
              <div className="mt-6">
                <h5 className="font-semibold text-gray-800 mb-2">Organizer</h5>
                <div className="flex items-center">
                  <img
                    src={selectedEvent.organizer.avatar || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={selectedEvent.organizer.name}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={e => {
                      const fallback = 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400';
                      if (e.target.src !== fallback) {
                        e.target.onerror = null;
                        e.target.src = fallback;
                      }
                    }}
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">{selectedEvent.organizer.name}</div>
                    <div className="text-sm text-gray-500">{selectedEvent.organizer.email}</div>
                  </div>
                </div>
              </div>
              
              {selectedEvent.participants.length > 0 && (
                <div className="mt-6">
                  <h5 className="font-semibold text-gray-800 mb-2">Participants ({selectedEvent.participants.length})</h5>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {selectedEvent.participants.map((participant) => (
                      <div key={participant.id} className="flex items-center text-sm">
                        <img
                          src={participant.avatar || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400'}
                          alt={participant.name}
                          className="w-6 h-6 rounded-full object-cover"
                          onError={e => {
                            const fallback = 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400';
                            if (e.target.src !== fallback) {
                              e.target.onerror = null;
                              e.target.src = fallback;
                            }
                          }}
                        />
                        <span className="ml-2 text-gray-700">{participant.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventOverviewTable;