import React, { useState, useEffect } from 'react';
import { Users, CheckCircle, XCircle, Trash2, FileText, Image as ImageIcon } from 'lucide-react';
import { eventService } from '../../../services/eventService';

const EventParticipantsList = ({ eventId }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetchParticipants();
  }, [eventId]);

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const response = await eventService.getEventParticipants(eventId);
      setParticipants(response.participants || response || []);
    } catch (err) {
      console.error('Error fetching participants:', err);
      setError('Failed to load participants');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-sky-50 border border-sky-100 rounded-lg p-4">
        <p className="text-sm text-gray-600">Loading participants...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-lg p-4">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (participants.length === 0) {
    return (
      <div className="bg-sky-50 border border-sky-100 rounded-lg p-4">
        <p className="text-sm text-gray-600">No participants enrolled yet.</p>
      </div>
    );
  }

  const attendedCount = participants.filter(p => p.attended).length;
  const totalWaste = participants
    .filter(p => p.wasteCollectedKg)
    .reduce((sum, p) => sum + (p.wasteCollectedKg || 0), 0);

  return (
    <div className="bg-sky-50 border border-sky-100 rounded-lg p-4 mt-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-sky-600" />
          <h4 className="font-semibold text-sky-700">Participants ({participants.length})</h4>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-sky-600 hover:text-sky-800 font-medium"
        >
          {expanded ? 'Hide' : 'Show'} Details
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
        <div>
          <div className="text-gray-600">Total</div>
          <div className="font-semibold text-gray-800">{participants.length}</div>
        </div>
        <div>
          <div className="text-gray-600">Attended</div>
          <div className="font-semibold text-green-600">{attendedCount}</div>
        </div>
        <div>
          <div className="text-gray-600">Not Attended</div>
          <div className="font-semibold text-red-600">{participants.length - attendedCount}</div>
        </div>
        <div>
          <div className="text-gray-600">Total Waste</div>
          <div className="font-semibold text-teal-600">{totalWaste.toFixed(1)} kg</div>
        </div>
      </div>

      {expanded && (
        <div className="space-y-3 mt-4 max-h-96 overflow-y-auto">
          {participants.map((participant) => (
            <div
              key={participant.userId || participant.id}
              className="bg-white rounded-lg p-3 shadow-sm border border-sky-50"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-800">
                    {participant.userName || `Participant ${participant.userId}`}
                  </span>
                  {participant.attended ? (
                    <span className="flex items-center gap-1 text-green-600 text-xs">
                      <CheckCircle className="w-4 h-4" />
                      Attended
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-600 text-xs">
                      <XCircle className="w-4 h-4" />
                      Not Attended
                    </span>
                  )}
                </div>
              </div>

              {participant.wasteCollectedKg && (
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-teal-600">
                    <Trash2 className="w-4 h-4" />
                    <span className="font-medium">
                      {participant.wasteCollectedKg} kg
                    </span>
                    {participant.wasteType && (
                      <span className="text-gray-500">({participant.wasteType})</span>
                    )}
                  </div>
                  
                  {participant.wasteCollectionNotes && (
                    <div className="flex items-start gap-2 text-gray-600 mt-1">
                      <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <p className="text-xs">{participant.wasteCollectionNotes}</p>
                    </div>
                  )}
                  
                  {participant.wasteCollectionImageUrl && (
                    <div className="mt-2">
                      <a
                        href={participant.wasteCollectionImageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-sky-600 hover:text-sky-800"
                      >
                        <ImageIcon className="w-4 h-4" />
                        View Image
                      </a>
                    </div>
                  )}
                </div>
              )}

              {participant.attendedAt && (
                <div className="text-xs text-gray-400 mt-2">
                  Attended: {new Date(participant.attendedAt).toLocaleString()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventParticipantsList;

