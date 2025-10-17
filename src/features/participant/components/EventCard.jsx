import React from 'react';
import { Calendar, Clock, MapPin, Users, Trash2, User } from 'lucide-react';
import { useAuth } from '../../../contexts';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event, onJoin, onLeave, className = '' }) => {
  const { user } = useAuth();
  const isParticipant = user && event.participants.some(p => p.id === user.id);
  const canJoin = user && user.role === 'participant' && !isParticipant && event.participants.length < event.maxParticipants;
  const canLeave = user && user.role === 'participant' && isParticipant;
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer ${className}`}
      onClick={() => navigate(`/events/${event.id}`)}
    >
      <div className="relative">
        <img 
          src={event.imageUrl || 'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=800'} 
          alt={event.title}
          className="w-full h-48 object-cover"
          onError={e => {
            const fallback = 'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=800';
            if (e.target.src !== fallback) {
              e.target.onerror = null;
              e.target.src = fallback;
            }
          }}
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </span>
        </div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-sm font-medium text-gray-700">
            {event.participants.length}/{event.maxParticipants} joined
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm">{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm">{event.time}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">{event.location}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <User className="w-4 h-4 mr-2" />
            <span className="text-sm">Organized by {event.organizer.name}</span>
          </div>
        </div>

        {event.estimatedWaste && (
          <div className="flex items-center text-teal-600 mb-4">
            <Trash2 className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">
              Expected waste: {event.estimatedWaste} kg
              {event.actualWaste && event.status === 'completed' && (
                <span className="text-gray-600"> (Actual: {event.actualWaste} kg)</span>
              )}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {event.participants.length} participants
            </span>
          </div>
          
          <div className="flex space-x-2">
            {canJoin && onJoin && (
              <button
                onClick={e => { e.stopPropagation(); onJoin(event.id); }}
                className="px-4 py-2 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-full hover:from-sky-600 hover:to-teal-600 transition-all transform hover:scale-105 text-sm font-medium"
              >
                Join Event
              </button>
            )}
            {canLeave && onLeave && (
              <button
                onClick={e => { e.stopPropagation(); onLeave(event.id); }}
                className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-sm font-medium"
              >
                Leave Event
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;


