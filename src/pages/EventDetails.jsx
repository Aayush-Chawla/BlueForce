// EventDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from '../contexts';
import { useAuth } from '../contexts';
import QRCode from 'react-qr-code';
import { QrCode, ArrowLeft, Star, Users, MapPin, Calendar as CalendarIcon, Clock, Waves, Trash2, Share2 } from 'lucide-react';
import { mockFeedbacks } from '../utils/mockData';

const EventDetails = () => {
  const { id } = useParams();
  const { events, joinEvent, leaveEvent, loading } = useEvents();
  const { user } = useAuth();
  const [showQR, setShowQR] = useState(false);
  const [feedbackFilter, setFeedbackFilter] = useState('all'); // all, good, bad
  const navigate = useNavigate();
  
  // Always call hooks at the top level
  const event = events.find(e => e.id == id); // Use == instead of === to handle string/number comparison
  
  // Debug logging
  console.log('EventDetails - Looking for event ID:', id);
  console.log('EventDetails - Available events:', events);
  console.log('EventDetails - Found event:', event);
  console.log('EventDetails - Event properties:', event ? Object.keys(event) : 'No event found');
  console.log('EventDetails - User object:', user);
  console.log('EventDetails - User properties:', user ? Object.keys(user) : 'No user found');
  console.log('EventDetails - User name:', user?.name);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Show loading state while events are being fetched
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Event not found</h2>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate('/events')} 
            className="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const isParticipant = false; // We'll need to check this from the backend
  const canJoin = user && user.role === 'participant' && !isParticipant && (event.currentParticipants || 0) < (event.maxParticipants || 0);
  const canLeave = user && user.role === 'participant' && isParticipant;

  const qrData = user && event ? JSON.stringify({
    userId: user?.id,
    userName: user?.name || 'Unknown User',
    eventId: event.id,
    eventTitle: event.title || 'Untitled Event',
    eventDate: Array.isArray(event.dateTime) ? 
      new Date(event.dateTime[0], event.dateTime[1] - 1, event.dateTime[2], event.dateTime[3], event.dateTime[4] || 0).toISOString() :
      event.dateTime
  }) : '';

  // Find previous events by the same NGO (excluding this event, and only completed/past events)
  const previousEvents = events.filter(e =>
    e.ngoId === event.ngoId &&
    e.id !== event.id &&
    e.status === 'COMPLETED'
  );

  // Gather feedbacks for previous events
  const previousEventIds = previousEvents.map(e => e.id);
  const allFeedbacks = mockFeedbacks.filter(fb => previousEventIds.includes(fb.eventId));

  // Calculate average rating
  const avgRating = allFeedbacks.length > 0 ? (allFeedbacks.reduce((sum, fb) => sum + fb.rating, 0) / allFeedbacks.length).toFixed(1) : null;

  // Feedback filter state (moved to top level)
  const filteredFeedbacks = allFeedbacks.filter(fb => {
    if (feedbackFilter === 'good') return fb.rating >= 4;
    if (feedbackFilter === 'bad') return fb.rating <= 2;
    return true;
  });

  // About Organizer info  
  const organizer = { 
    name: `NGO ${event.ngoId || 'Unknown'}`, 
    id: event.ngoId || 'unknown',
    avatar: 'https://images.pexels.com/photos/7456339/pexels-photo-7456339.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Community organization dedicated to environmental conservation'
  };

  // Feedbacks for this event
  const eventFeedbacks = mockFeedbacks.filter(fb => fb.eventId === event.id);

  // Participants avatars (limit to 6, show count if more)
  const participantAvatars = []; // We'll need to get this from the backend
  const extraParticipants = (event.currentParticipants || 0) - participantAvatars.length;

  // Share event handler
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('Event link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 flex flex-col">
      {/* Hero Section */}
      <div className="relative w-full h-64 md:h-80 flex items-end justify-center mb-0">
        <img src={event.imageUrl || 'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=800'} alt={event.title} className="absolute inset-0 w-full h-full object-cover object-center z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-sky-900/80 via-sky-700/40 to-transparent z-10" />
        <div className="relative z-20 w-full max-w-4xl mx-auto px-6 pb-6 flex flex-col md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow mb-2 flex items-center gap-2">
              <CalendarIcon className="w-7 h-7 text-white/80" /> {event.title || 'Untitled Event'}
            </h1>
            <div className="flex items-center gap-4 text-white/90 text-lg font-medium">
              <span className="flex items-center gap-1"><Clock className="w-5 h-5" />{(() => {
                if (!event.dateTime) return 'Time not set';
                let date;
                if (Array.isArray(event.dateTime)) {
                  date = new Date(event.dateTime[0], event.dateTime[1] - 1, event.dateTime[2], event.dateTime[3], event.dateTime[4] || 0);
                } else {
                  date = new Date(event.dateTime);
                }
                return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
              })()}</span>
              <span className="flex items-center gap-1"><MapPin className="w-5 h-5" />{event.location || 'Location not set'}</span>
              <span className="flex items-center gap-1"><CalendarIcon className="w-5 h-5" />{(() => {
                if (!event.dateTime) return 'Date not set';
                let date;
                if (Array.isArray(event.dateTime)) {
                  date = new Date(event.dateTime[0], event.dateTime[1] - 1, event.dateTime[2], event.dateTime[3], event.dateTime[4] || 0);
                } else {
                  date = new Date(event.dateTime);
                }
                return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
              })()}</span>
            </div>
          </div>
          <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-full shadow hover:from-sky-600 hover:to-teal-600 transition-all font-semibold mt-4 md:mt-0">
            <Share2 className="w-5 h-5" /> Share Event
          </button>
        </div>
      </div>
      {/* Main content */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl mx-auto px-2 md:px-6 py-8">
        {/* Left: Event Details */}
        <div className="flex-1 min-w-0">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-4 text-sky-600 hover:text-sky-800 font-medium transition-colors duration-200">
            <ArrowLeft className="w-5 h-5" /> Back to Events
          </button>
          <div className="bg-white rounded-xl shadow-lg p-8 border border-sky-100 relative overflow-hidden animate-fade-in-up">
            <div className="absolute -top-8 -right-8 opacity-10 text-sky-400 text-[8rem] pointer-events-none select-none"><Waves className="w-32 h-32" /></div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <Users className="w-6 h-6 text-sky-400" />
                <span className="font-semibold text-gray-700">Participants:</span>
                <div className="flex -space-x-2">
                  {participantAvatars.map((p, i) => (
                    <img key={i} src={p.avatar} alt={p.name || 'Participant'} className="w-8 h-8 rounded-full border-2 border-white shadow" />
                  ))}
                  {extraParticipants > 0 && (
                    <span className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-bold border-2 border-white">+{extraParticipants}</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {canJoin && (
                  <button
                    onClick={() => joinEvent(event.id, user?.id)}
                    className="px-5 py-2 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-full hover:from-sky-600 hover:to-teal-600 transition-all font-semibold shadow"
                  >
                    Join Event
                  </button>
                )}
                {canLeave && (
                  <button
                    onClick={() => leaveEvent(event.id, user?.id)}
                    className="px-5 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors font-semibold shadow"
                  >
                    Leave Event
                  </button>
                )}
                {isParticipant && (
                  <button
                    onClick={() => setShowQR(true)}
                    className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-transform duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400 animate-bounce-once"
                    style={{ willChange: 'transform' }}
                  >
                    <QrCode className="w-5 h-5" /> Show My QR Code
                  </button>
                )}
              </div>
            </div>
            <p className="text-gray-600 mb-4 text-lg">{event.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2"><CalendarIcon className="w-4 h-4 text-sky-400" /><span className="block text-gray-500 text-xs">Date</span><span className="font-medium text-gray-800 ml-1">{(() => {
                if (!event.dateTime) return 'Date not set';
                let date;
                if (Array.isArray(event.dateTime)) {
                  date = new Date(event.dateTime[0], event.dateTime[1] - 1, event.dateTime[2], event.dateTime[3], event.dateTime[4] || 0);
                } else {
                  date = new Date(event.dateTime);
                }
                return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
              })()}</span></div>
              <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-sky-400" /><span className="block text-gray-500 text-xs">Time</span><span className="font-medium text-gray-800 ml-1">{(() => {
                if (!event.dateTime) return 'Time not set';
                let date;
                if (Array.isArray(event.dateTime)) {
                  date = new Date(event.dateTime[0], event.dateTime[1] - 1, event.dateTime[2], event.dateTime[3], event.dateTime[4] || 0);
                } else {
                  date = new Date(event.dateTime);
                }
                return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
              })()}</span></div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-sky-400" /><span className="block text-gray-500 text-xs">Location</span><span className="font-medium text-gray-800 ml-1">{event.location}</span></div>
              <div className="flex items-center gap-2"><Users className="w-4 h-4 text-sky-400" /><span className="block text-gray-500 text-xs">Organizer</span><span className="font-medium text-gray-800 ml-1">{organizer.name}</span></div>
              <div className="flex items-center gap-2"><Users className="w-4 h-4 text-sky-400" /><span className="block text-gray-500 text-xs">Participants</span><span className="font-medium text-gray-800 ml-1">{event.currentParticipants || 0} / {event.maxParticipants || 0}</span></div>
              {event.estimatedWaste && (
                <div className="flex items-center gap-2"><Trash2 className="w-4 h-4 text-sky-400" /><span className="block text-gray-500 text-xs">Expected Waste</span><span className="font-medium text-gray-800 ml-1">{event.estimatedWaste} kg</span></div>
              )}
            </div>
            {/* QR Code Modal */}
            {showQR && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center relative animate-fade-in-up">
                  <button
                    onClick={() => setShowQR(false)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
                    aria-label="Close"
                  >
                    ×
                  </button>
                  <h3 className="text-lg font-bold mb-4">Your Event QR Code</h3>
                  <QRCode value={qrData} size={180} />
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-700 font-medium">{user?.name}</p>
                    <p className="text-xs text-gray-500">{event.title}</p>
                    <p className="text-xs text-gray-400">{event.date}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Right: About Organizer and Previous Events */}
        <div className="w-full md:w-80 flex-shrink-0 flex flex-col gap-6">
          {/* About Organizer Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-sky-100 flex flex-col items-center animate-fade-in-up">
            <img src={organizer.avatar} alt={organizer.name} className="w-16 h-16 rounded-full object-cover border-4 border-sky-100 shadow mb-2" />
            <h3 className="text-lg font-bold text-sky-700 mb-1 flex items-center gap-2"><Users className="w-5 h-5 text-sky-400" />{organizer.name}</h3>
            <p className="text-gray-600 text-center mb-2">{organizer.bio}</p>
            <div className="flex flex-wrap gap-2 text-xs text-gray-500 justify-center mb-2">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-sky-400" />{organizer.location}</span>
              <span className="flex items-center gap-1"><CalendarIcon className="w-4 h-4 text-sky-400" />Events: <span className="font-semibold text-gray-700 ml-1">{organizer.eventsOrganized}</span></span>
              {avgRating && (
                <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />{avgRating}</span>
              )}
            </div>
          </div>
          {/* Previous Events by this NGO + Feedbacks + Rating */}
          <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in-up border border-sky-100">
            <h2 className="text-xl font-bold text-gray-800 mb-2 border-b pb-2 flex items-center gap-2">
              Previous Events
            </h2>
            {avgRating && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg font-semibold text-sky-600">NGO Rating:</span>
                <span className="flex items-center">
                  {[...Array(Math.round(avgRating))].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />)}
                  {[...Array(5 - Math.round(avgRating))].map((_, i) => <Star key={i} className="w-5 h-5 text-gray-300" />)}
                  <span className="ml-2 text-gray-700 font-bold">{avgRating}</span>
                </span>
              </div>
            )}
            {previousEvents.length === 0 ? (
              <div className="text-gray-500 text-sm">No previous events found.</div>
            ) : (
              <ul className="space-y-4 mb-6">
                {previousEvents.map(prev => (
                  <li key={prev.id} className="flex items-center gap-4 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition">
                    <img src={prev.imageUrl || 'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=800'} alt={prev.title} className="w-12 h-12 object-cover rounded-lg border" />
                    <div>
                      <div className="font-semibold text-gray-700 text-base">{prev.title}</div>
                      <div className="text-xs text-gray-500">{prev.date}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {/* Feedback filter */}
            <div className="mb-2 flex gap-2 items-center">
              <span className="text-sm text-gray-600">Filter feedbacks:</span>
              <button onClick={() => setFeedbackFilter('all')} className={`px-3 py-1 rounded-full text-xs font-semibold border ${feedbackFilter==='all'?'bg-sky-500 text-white border-sky-500':'bg-gray-100 text-gray-700 border-gray-200'} transition`}>All</button>
              <button onClick={() => setFeedbackFilter('good')} className={`px-3 py-1 rounded-full text-xs font-semibold border ${feedbackFilter==='good'?'bg-sky-500 text-white border-sky-500':'bg-gray-100 text-gray-700 border-gray-200'} transition`}>Good</button>
              <button onClick={() => setFeedbackFilter('bad')} className={`px-3 py-1 rounded-full text-xs font-semibold border ${feedbackFilter==='bad'?'bg-sky-500 text-white border-sky-500':'bg-gray-100 text-gray-700 border-gray-200'} transition`}>Bad</button>
            </div>
            {/* Feedbacks */}
            {filteredFeedbacks.length === 0 ? (
              <div className="text-gray-400 text-sm">No feedbacks found for this filter.</div>
            ) : (
              <ul className="space-y-3">
                {filteredFeedbacks.map((fb, i) => (
                  <li key={i} className="bg-sky-50 rounded-lg p-3 border border-sky-100">
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(fb.rating)].map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                      {[...Array(5 - fb.rating)].map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 text-gray-300" />
                      ))}
                    </div>
                    <div className="text-gray-700 text-sm">{fb.feedback}</div>
                    <div className="text-xs text-gray-400 mt-1">{new Date(fb.createdAt).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      {/* Feedbacks for this event - horizontal block below main card */}
      {eventFeedbacks.length > 0 && (
        <div className="w-full max-w-5xl mx-auto mt-8">
          <h3 className="text-lg font-bold text-sky-700 mb-2 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />Feedbacks for this Event
          </h3>
          <div className="flex flex-row flex-nowrap gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-sky-200 scrollbar-track-transparent">
            {eventFeedbacks.map((fb, i) => {
              // Try to find the participant avatar by matching user id
              const participant = event.participants.find(p => p.id === fb.participantId);
              return (
                <div
                  key={i}
                  className="min-w-[260px] max-w-xs bg-white rounded-xl p-4 border border-sky-100 flex-shrink-0 shadow flex flex-col justify-between"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {participant && (
                      <img src={participant.avatar} alt={participant.name || 'Participant'} className="w-8 h-8 rounded-full border-2 border-sky-100 shadow" />
                    )}
                    <div className="flex items-center gap-1">
                      {[...Array(fb.rating)].map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                      {[...Array(5 - fb.rating)].map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 text-gray-300" />
                      ))}
                    </div>
                  </div>
                  <div className="text-gray-700 text-sm mb-2 line-clamp-4">{fb.feedback}</div>
                  <div className="text-xs text-gray-400 mt-auto">{new Date(fb.createdAt).toLocaleString()}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails; 