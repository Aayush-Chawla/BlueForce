import React, { useState, useEffect } from 'react';
import { useAuth, useEvents } from '../../contexts';
import { eventService } from '../../services/eventService';
import { 
  Trash2, 
  Users, 
  Calendar, 
  FileText, 
  Image as ImageIcon, 
  Filter,
  Download,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  MapPin
} from 'lucide-react';

const NGOPostSubmissions = () => {
  const { user } = useAuth();
  const { events } = useEvents();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [selectedWasteType, setSelectedWasteType] = useState('all');
  const [expandedSubmission, setExpandedSubmission] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'ngo') {
      return;
    }
    fetchAllSubmissions();
  }, [user, events]);

  useEffect(() => {
    filterSubmissions();
  }, [selectedEvent, selectedWasteType, submissions]);

  const fetchAllSubmissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const userEvents = events.filter(event => event.ngoId === user?.id);
      const allSubmissions = [];

      for (const event of userEvents) {
        try {
          const response = await eventService.getEventParticipants(event.id);
          // Handle both array response and object with participants property
          const participants = Array.isArray(response) ? response : (response.participants || []);
          
          console.log(`Event ${event.id} (${event.title}):`, {
            participantsCount: participants.length,
            participants: participants
          });
          
          participants.forEach(participant => {
            console.log(`Participant ${participant.userId || participant.id}:`, {
              wasteCollectedKg: participant.wasteCollectedKg,
              wasteType: participant.wasteType,
              attended: participant.attended,
              hasWasteData: !!participant.wasteCollectedKg
            });
            
            if (participant.wasteCollectedKg) {
              allSubmissions.push({
                ...participant,
                eventId: event.id,
                eventTitle: event.title,
                eventLocation: event.location,
                eventDate: event.dateTime,
                userName: participant.userName || `Participant ${participant.userId || participant.id}`
              });
            }
          });
        } catch (err) {
          console.error(`Error fetching participants for event ${event.id}:`, err);
        }
      }
      
      console.log('All submissions found:', allSubmissions.length, allSubmissions);

      // Sort by date (most recent first)
      allSubmissions.sort((a, b) => {
        const dateA = new Date(a.attendedAt || a.eventDate);
        const dateB = new Date(b.attendedAt || b.eventDate);
        return dateB - dateA;
      });

      setSubmissions(allSubmissions);
      setFilteredSubmissions(allSubmissions);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setError('Failed to load post-event submissions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterSubmissions = () => {
    let filtered = [...submissions];

    if (selectedEvent !== 'all') {
      filtered = filtered.filter(sub => sub.eventId === parseInt(selectedEvent));
    }

    if (selectedWasteType !== 'all') {
      filtered = filtered.filter(sub => sub.wasteType === selectedWasteType);
    }

    setFilteredSubmissions(filtered);
  };

  const userEvents = events.filter(event => event.ngoId === user?.id);
  const totalWaste = filteredSubmissions.reduce((sum, sub) => sum + (sub.wasteCollectedKg || 0), 0);
  const totalSubmissions = filteredSubmissions.length;
  const uniqueEvents = new Set(filteredSubmissions.map(sub => sub.eventId)).size;
  const uniqueParticipants = new Set(filteredSubmissions.map(sub => sub.userId || sub.id)).size;

  const stats = [
    { icon: FileText, label: 'Total Submissions', value: totalSubmissions },
    { icon: Users, label: 'Participants', value: uniqueParticipants },
    { icon: Calendar, label: 'Events', value: uniqueEvents },
    { icon: Trash2, label: 'Total Waste', value: `${totalWaste.toFixed(1)} kg` }
  ];

  if (!user || user.role !== 'ngo') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600">Only NGO organizers can access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-sky-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchAllSubmissions}
            className="px-6 py-3 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-full font-semibold hover:from-sky-600 hover:to-teal-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
                <FileText className="w-8 h-8 mr-3 text-sky-500" />
                Post-Event Submissions
              </h1>
              <p className="text-gray-600">View all waste collection data from your events</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-gradient-to-r from-sky-50 to-teal-50 rounded-xl p-6 border border-sky-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">{label}</p>
                    <p className="text-2xl font-bold text-gray-800">{value}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event</label>
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="all">All Events</option>
                {userEvents.map(event => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Waste Type</label>
              <select
                value={selectedWasteType}
                onChange={(e) => setSelectedWasteType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="all">All Types</option>
                <option value="Hazardous">Hazardous</option>
                <option value="Human">Human</option>
                <option value="Non-Hazardous">Non-Hazardous</option>
                <option value="Not-Recognized">Not-Recognized</option>
                <option value="Unidentified">Unidentified</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submissions List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Trash2 className="w-6 h-6 mr-2 text-sky-500" />
            Submissions ({filteredSubmissions.length})
          </h2>

          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-12">
              <Trash2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No submissions found</h3>
              <p className="text-gray-500">
                {submissions.length === 0 
                  ? "No post-event submissions have been submitted yet."
                  : "Try adjusting your filters to see more submissions."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSubmissions.map((submission, index) => (
                <div
                  key={`${submission.eventId}-${submission.userId || submission.id}-${index}`}
                  className="bg-gradient-to-r from-sky-50 to-teal-50 rounded-lg p-4 border border-sky-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-800 text-lg">
                          {submission.userName || `Participant ${submission.userId || submission.id}`}
                        </h3>
                        {submission.attended ? (
                          <span className="flex items-center gap-1 text-green-600 text-sm">
                            <CheckCircle className="w-4 h-4" />
                            Attended
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-600 text-sm">
                            <XCircle className="w-4 h-4" />
                            Not Attended
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm font-medium">{submission.eventTitle}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{submission.eventLocation}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-2 text-teal-600">
                          <Trash2 className="w-5 h-5" />
                          <span className="font-semibold text-lg">
                            {submission.wasteCollectedKg} kg
                          </span>
                          {submission.wasteType && (
                            <span className="text-sm text-gray-500">({submission.wasteType})</span>
                          )}
                        </div>
                      </div>

                      {submission.wasteCollectionNotes && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 flex items-start gap-2">
                            <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{submission.wasteCollectionNotes}</span>
                          </p>
                        </div>
                      )}

                      {(submission.imageBase64 || submission.wasteCollectionImageUrl) && (
                        <div className="mb-3">
                          <button
                            onClick={() => setExpandedSubmission(
                              expandedSubmission === `${submission.eventId}-${submission.userId || submission.id}` 
                                ? null 
                                : `${submission.eventId}-${submission.userId || submission.id}`
                            )}
                            className="flex items-center gap-2 text-sky-600 hover:text-sky-800 text-sm font-medium"
                          >
                            <ImageIcon className="w-4 h-4" />
                            {expandedSubmission === `${submission.eventId}-${submission.userId || submission.id}` 
                              ? 'Hide Image' 
                              : 'View Image'}
                          </button>
                          {expandedSubmission === `${submission.eventId}-${submission.userId || submission.id}` && (
                            <div className="mt-2">
                              {submission.imageBase64 ? (
                                <img
                                  src={`data:image/jpeg;base64,${submission.imageBase64}`}
                                  alt="Waste collection"
                                  className="w-full max-w-md h-64 object-cover rounded-lg border border-gray-300"
                                />
                              ) : submission.wasteCollectionImageUrl ? (
                                <img
                                  src={submission.wasteCollectionImageUrl}
                                  alt="Waste collection"
                                  className="w-full max-w-md h-64 object-cover rounded-lg border border-gray-300"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              ) : null}
                            </div>
                          )}
                        </div>
                      )}

                      {submission.attendedAt && (
                        <p className="text-xs text-gray-400 mt-2">
                          Submitted: {new Date(submission.attendedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NGOPostSubmissions;

