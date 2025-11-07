import React, { useState } from 'react';
import { Search, Filter, Calendar, MapPin, Users, Trash2, Eye } from 'lucide-react';

const EventOverviewTable = ({ events }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Ensure events is an array and filter with safe property access
  const filteredEvents = (Array.isArray(events) ? events : []).filter(event => {
    if (!event) return false;
    
    const title = event.title || '';
    const location = event.location || '';
    const organizerName = event.organizer?.name || '';
    const searchLower = searchTerm.toLowerCase();
    
    const matchesSearch = title.toLowerCase().includes(searchLower) ||
                         location.toLowerCase().includes(searchLower) ||
                         organizerName.toLowerCase().includes(searchLower);
    // Normalize status for filtering (backend uses ACTIVE, CANCELLED, COMPLETED)
    const eventStatus = (event.status || '').toLowerCase();
    const normalizedStatus = eventStatus === 'active' ? 'upcoming' : eventStatus;
    const matchesStatus = statusFilter === 'all' || normalizedStatus === statusFilter || eventStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    // Handle both backend status (ACTIVE, CANCELLED, COMPLETED) and frontend status (lowercase)
    const statusLower = (status || '').toLowerCase();
    switch (statusLower) {
      case 'active':
      case 'upcoming': 
        return 'bg-blue-100 text-blue-800';
      case 'ongoing': 
        return 'bg-green-100 text-green-800';
      case 'completed': 
        return 'bg-gray-100 text-gray-800';
      case 'cancelled': 
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default: 
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return { date: 'Date not specified', time: '' };
    
    try {
      let date;
      
      // Handle different date formats from backend
      if (typeof dateTimeString === 'string') {
        // Check if it's an array format (sometimes LocalDateTime is serialized as array)
        if (dateTimeString.startsWith('[') && dateTimeString.endsWith(']')) {
          // Format: [2024, 1, 15, 14, 30, 0]
          const parts = JSON.parse(dateTimeString);
          if (Array.isArray(parts) && parts.length >= 3) {
            date = new Date(parts[0], parts[1] - 1, parts[2], parts[3] || 0, parts[4] || 0, parts[5] || 0);
          }
        } 
        // Handle ISO 8601 format: "2024-01-15T14:30:00" or "2024-01-15T14:30:00.000"
        else if (dateTimeString.includes('T')) {
          // Remove milliseconds if present
          const cleanString = dateTimeString.split('.')[0];
          const [datePart, timePart] = cleanString.split('T');
          
          if (datePart && timePart) {
            const [year, month, day] = datePart.split('-').map(Number);
            const [hours, minutes, seconds = 0] = timePart.split(':').map(Number);
            
            // Validate the numbers
            if (!isNaN(year) && !isNaN(month) && !isNaN(day) && 
                !isNaN(hours) && !isNaN(minutes) && !isNaN(seconds)) {
              date = new Date(year, month - 1, day, hours, minutes, seconds);
            } else {
              date = new Date(dateTimeString);
            }
          } else {
            date = new Date(dateTimeString);
          }
        }
        // Handle other string formats
        else {
          date = new Date(dateTimeString);
        }
      } 
      // Handle Date object or timestamp
      else if (dateTimeString instanceof Date) {
        date = dateTimeString;
      } 
      // Handle array format directly
      else if (Array.isArray(dateTimeString)) {
        // Format: [2024, 1, 15, 14, 30, 0]
        if (dateTimeString.length >= 3) {
          date = new Date(
            dateTimeString[0], 
            dateTimeString[1] - 1, 
            dateTimeString[2], 
            dateTimeString[3] || 0, 
            dateTimeString[4] || 0, 
            dateTimeString[5] || 0
          );
        }
      }
      // Handle number (timestamp)
      else if (typeof dateTimeString === 'number') {
        date = new Date(dateTimeString);
      }
      // Fallback
      else {
        date = new Date(dateTimeString);
      }

      // Check if date is valid
      if (!date || isNaN(date.getTime())) {
        console.warn('Invalid date format:', dateTimeString, typeof dateTimeString);
        return { date: 'Invalid date', time: '' };
      }

      // Format date and time in local timezone
      return {
        date: date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        time: date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      };
    } catch (error) {
      console.error('Error formatting date:', dateTimeString, error);
      return { date: 'Invalid date', time: '' };
    }
  };

  const normalizeStatus = (status) => {
    if (!status) return 'Unknown';
    const statusLower = status.toLowerCase();
    // Map backend statuses to display format
    if (statusLower === 'active') {
      // Check if it's upcoming based on dateTime
      return 'Active';
    }
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
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
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Calendar className="w-12 h-12 text-gray-400 mb-4" />
                      <p className="text-gray-600 font-medium">No events found</p>
                      <p className="text-gray-500 text-sm mt-1">
                        {(Array.isArray(events) ? events : []).length === 0 
                          ? 'No events in the database yet.' 
                          : 'Try adjusting your search or filter criteria.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event) => (
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
                        <div className="text-sm font-medium text-gray-900">{event.title || 'Untitled Event'}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {event.location || 'Location not specified'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={event.organizer?.avatar || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400'}
                        alt={event.organizer?.name || 'Unknown Organizer'}
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
                        <div className="text-sm font-medium text-gray-900">
                          {event.organizer?.name || event.contactEmail || `NGO ID: ${event.ngoId || 'N/A'}`}
                        </div>
                        {event.contactEmail && event.organizer?.name && (
                          <div className="text-xs text-gray-500">{event.contactEmail}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <div>
                        {(() => {
                          // Try multiple possible date field names
                          const dateTimeValue = event.dateTime || event.date || event.eventDate || event.startDate;
                          if (!dateTimeValue) {
                            console.warn('Event missing dateTime:', event.id, event);
                          }
                          const { date, time } = formatDateTime(dateTimeValue);
                          return (
                            <>
                              <div>{date}</div>
                              {time && <div className="text-xs text-gray-500">{time}</div>}
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      {event.currentParticipants || (Array.isArray(event.participants) ? event.participants.length : 0)}/{event.maxParticipants || 0}
                    </div>
                    {event.wasteCollected && (
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Trash2 className="w-3 h-3 mr-1" />
                        {event.wasteCollected} kg
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status || 'unknown')}`}>
                      {normalizeStatus(event.status)}
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
              ))
              )}
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
                    <h4 className="text-xl font-semibold text-gray-800">{selectedEvent.title || 'Untitled Event'}</h4>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-2 ${getStatusColor(selectedEvent.status || 'unknown')}`}>
                      {normalizeStatus(selectedEvent.status)}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>
                        {(() => {
                          const dateTimeValue = selectedEvent.dateTime || selectedEvent.date || selectedEvent.eventDate || selectedEvent.startDate;
                          const { date, time } = formatDateTime(dateTimeValue);
                          return time ? `${date} at ${time}` : date;
                        })()}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{selectedEvent.location || 'Location not specified'}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span>
                        {selectedEvent.currentParticipants || (Array.isArray(selectedEvent.participants) ? selectedEvent.participants.length : 0)}/{selectedEvent.maxParticipants || 0} participants
                      </span>
                    </div>
                    {selectedEvent.wasteCollected && (
                      <div className="flex items-center text-gray-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        <span>{selectedEvent.wasteCollected} kg collected</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h5 className="font-semibold text-gray-800 mb-2">Description</h5>
                <p className="text-gray-600">{selectedEvent.description || 'No description available'}</p>
              </div>
              
              <div className="mt-6">
                <h5 className="font-semibold text-gray-800 mb-2">Organizer</h5>
                <div className="flex items-center">
                  <img
                    src={selectedEvent.organizer?.avatar || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={selectedEvent.organizer?.name || 'Unknown Organizer'}
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
                    <div className="text-sm font-medium text-gray-900">
                      {selectedEvent.organizer?.name || selectedEvent.contactEmail || `NGO ID: ${selectedEvent.ngoId || 'N/A'}`}
                    </div>
                    <div className="text-sm text-gray-500">
                      {selectedEvent.organizer?.email || selectedEvent.contactEmail || 'No email'}
                    </div>
                    {selectedEvent.contactPhone && (
                      <div className="text-sm text-gray-500">{selectedEvent.contactPhone}</div>
                    )}
                  </div>
                </div>
              </div>
              
              {Array.isArray(selectedEvent.participants) && selectedEvent.participants.length > 0 && (
                <div className="mt-6">
                  <h5 className="font-semibold text-gray-800 mb-2">Participants ({selectedEvent.participants.length})</h5>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {selectedEvent.participants.filter(p => p).map((participant) => (
                      <div key={participant.id || Math.random()} className="flex items-center text-sm">
                        <img
                          src={participant.avatar || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400'}
                          alt={participant.name || 'Participant'}
                          className="w-6 h-6 rounded-full object-cover"
                          onError={e => {
                            const fallback = 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400';
                            if (e.target.src !== fallback) {
                              e.target.onerror = null;
                              e.target.src = fallback;
                            }
                          }}
                        />
                        <span className="ml-2 text-gray-700">{participant.name || 'Unknown'}</span>
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


