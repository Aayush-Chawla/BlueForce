import React from 'react';
import { Calendar, Users, Award, Trash2, MapPin, Clock, ChevronUp, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth, useEvents } from '../../contexts';
import { getDailyTip } from '../../utils/ecoTipsData';
import { EventCard } from '../../features/participant/components';
import EcoTipCard from '../../components/common/EcoTipCard';
import GamificationPanel from '../../features/shared/components/GamificationPanel';
import { mockFeedbacks } from '../../utils/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import html2canvas from 'html2canvas';
import { COLORS } from '../../utils/chartColors';
import { Download } from 'lucide-react';
import * as userService from '../../services/userService';
import { eventService } from '../../services/eventService';

const ParticipantDashboard = () => {
  const { user } = useAuth();
  const { events } = useEvents();
  const dailyTip = getDailyTip();
  const [showGamification, setShowGamification] = React.useState(true);
  const barChartRef = React.useRef();
  const pieChartRef = React.useRef();
  const [editing, setEditing] = React.useState(false);
  const [form, setForm] = React.useState({ avatar: '', bio: '', address: '' });
  const [errors, setErrors] = React.useState({});
  const [apiError, setApiError] = React.useState('');
  const [successMsg, setSuccessMsg] = React.useState('');
  const [enrolledEvents, setEnrolledEvents] = React.useState([]);
  const [loadingEnrolledEvents, setLoadingEnrolledEvents] = React.useState(true);

  React.useEffect(() => {
    if (user) {
      setForm({
        avatar: user.avatar || '',
        bio: user.bio || '',
        address: user.address || ''
      });
    }
  }, [user]);

  // Fetch user's enrolled events
  React.useEffect(() => {
    const fetchEnrolledEvents = async () => {
      if (!user || user.role !== 'participant') return;
      
      setLoadingEnrolledEvents(true);
      try {
        // Fetch enrolled event participants
        const enrolledParticipants = await eventService.getUserEnrolledEvents(user.id);
        
        // Fetch full event details for each enrolled event
        const eventDetailsPromises = enrolledParticipants
          .filter(ep => ep.status === 'ENROLLED' || ep.status === 'COMPLETED')
          .map(async (participant) => {
            try {
              const eventDetails = await eventService.getEventById(participant.eventId);
              return {
                ...eventDetails,
                enrolledAt: participant.enrolledAt,
                enrollmentStatus: participant.status,
                attended: participant.attended
              };
            } catch (error) {
              console.error(`Error fetching event ${participant.eventId}:`, error);
              return null;
            }
          });
        
        const eventDetails = await Promise.all(eventDetailsPromises);
        const validEvents = eventDetails.filter(e => e !== null);
        
        setEnrolledEvents(validEvents);
      } catch (error) {
        console.error('Error fetching enrolled events:', error);
        setEnrolledEvents([]);
      } finally {
        setLoadingEnrolledEvents(false);
      }
    };

    fetchEnrolledEvents();
  }, [user]);

  const handleEdit = () => {
    setForm({ avatar: user.avatar || '', bio: user.bio || '', address: user.address || '' });
    setEditing(true); setErrors({}); setApiError(''); setSuccessMsg('');
  };
  const handleCancel = () => { setEditing(false); setErrors({}); setApiError(''); setSuccessMsg(''); };

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = async e => {
    e.preventDefault(); setApiError(''); setErrors({}); setSuccessMsg('');
    // Frontend validation
    let newErrs = {};
    if (form.address && form.address.length < 3) newErrs.address = 'Address must be at least 3 characters';
    if (Object.keys(newErrs).length > 0) { setErrors(newErrs); return; }
    try {
      const updated = await userService.updateProfileParticipant({
        fullName: user.name, phone: user.phone,
        address: form.address, avatar: form.avatar, bio: form.bio
      });
      setEditing(false); setSuccessMsg('Profile updated');
      window.location.reload(); // Or refresh context state if possible
    } catch(err) {
      if (err && typeof err === 'object') {
        setApiError(err.message || 'Profile update failed');
        setErrors(err.errors || {});
      } else {
        setApiError('Profile update failed');
      }
    }
  };
  
  if (!user || user.role !== 'participant') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600">Only participants can access this dashboard.</p>
        </div>
      </div>
    );
  }

  // Use enrolled events from API, fallback to filtered events if API fails
  const userEvents = enrolledEvents.length > 0 ? enrolledEvents : events.filter(event =>
    event.isUpcoming || event.status === 'COMPLETED'
  );

  // Determine if event is upcoming based on dateTime
  const now = new Date();
  const upcomingEvents = userEvents.filter(event => {
    if (!event.dateTime) return false;
    const eventDate = Array.isArray(event.dateTime) 
      ? new Date(event.dateTime[0], event.dateTime[1] - 1, event.dateTime[2], event.dateTime[3], event.dateTime[4] || 0)
      : new Date(event.dateTime);
    return eventDate > now && (event.enrollmentStatus === 'ENROLLED' || event.status === 'ACTIVE');
  });

  const completedEvents = userEvents.filter(event => {
    if (!event.dateTime) return event.status === 'COMPLETED';
    const eventDate = Array.isArray(event.dateTime) 
      ? new Date(event.dateTime[0], event.dateTime[1] - 1, event.dateTime[2], event.dateTime[3], event.dateTime[4] || 0)
      : new Date(event.dateTime);
    return (eventDate < now || event.status === 'COMPLETED') && (event.enrollmentStatus === 'COMPLETED' || event.enrollmentStatus === 'ENROLLED');
  });

  // Build live analytics from user's real events
  const analyticsEvents = (completedEvents.length > 0 ? completedEvents : userEvents).map(ev => ({
    id: ev.id,
    name: ev.title || ev.name || `Event ${ev.id}`,
    wasteCollected: Number(ev.wasteCollected || 0),
    volunteers: Number(ev.currentParticipants || ev.participantCount || 0),
    // Approximate XP distribution if not provided by backend: 50 XP per volunteer + 5 XP per kg
    xpDistributed: Number((ev.currentParticipants || ev.participantCount || 0) * 50 + (ev.wasteCollected || 0) * 5),
  }));

  const stats = [
    { icon: Calendar, label: 'Events Joined', value: enrolledEvents.length || userEvents.length },
    { icon: Trash2, label: 'Waste Collected', value: `${user.totalWasteCollected || 0} kg` },
    { icon: Award, label: 'Eco Score', value: user.ecoScore || 850 },
    { icon: Users, label: 'Community Impact', value: '12.5 tons' }
  ];

  const exportChart = async (chartRef, filename) => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={form.avatar || user.avatar || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400'}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover"
                onError={e => {
                  const fallback = 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400';
                  if (e.target.src !== fallback) {
                    e.target.onerror = null;
                    e.target.src = fallback;
                  }
                }}
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user.name}!</h1>
                <p className="text-gray-600">Environmental Participant</p>
                {(user.address || form.address) && (
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {editing ? (
                      <input
                        name="address" value={form.address} onChange={handleChange}
                        className="border px-2 py-1 rounded text-sm ml-1" placeholder="Address"
                      />
                    ) : (
                      user.address
                    )}
                  </p>
                )}
                {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
              </div>
            </div>
            <div>
              {!editing ? (
                <button onClick={handleEdit} className="px-4 py-2 rounded bg-sky-600 text-white">Edit Profile</button>
              ) : (
                <button onClick={handleCancel} className="px-4 py-2 rounded bg-gray-200 text-gray-700 ml-2">Cancel</button>
              )}
            </div>
          </div>
        </div>
        {editing && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 mb-8 flex flex-col gap-3 max-w-xl">
            <label className="block text-gray-700 font-semibold mb-1">Avatar Image URL
              <input name="avatar" value={form.avatar} onChange={handleChange} className="w-full border rounded px-2 py-1 mt-1" placeholder="Image URL" />
              {errors.avatar && <span className="text-xs text-red-500">{errors.avatar}</span>}
            </label>
            <label className="block text-gray-700 font-semibold mb-1">Bio/About
              <textarea name="bio" value={form.bio} onChange={handleChange} rows={3} className="w-full border rounded px-2 py-1 mt-1" placeholder="Share something about you!" />
              {errors.bio && <span className="text-xs text-red-500">{errors.bio}</span>}
            </label>
            <button type="submit" className="px-6 py-2 rounded bg-teal-600 text-white mt-2 max-w-xs">Save</button>
            {apiError && <div className="text-red-600 text-sm mt-1">{apiError}</div>}
            {successMsg && <div className="text-green-600 text-sm mt-1">{successMsg}</div>}
          </form>
        )}

        {/* Bio Section */}
        {!editing && user.bio && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">About</h2>
            <p className="text-gray-600 leading-relaxed">{user.bio}</p>
          </div>
        )}

        

        {/* Impact Storyboard Link */}
        {/* <div className="mb-8">
          <div className="bg-gradient-to-r from-sky-100 to-teal-100 rounded-xl shadow flex flex-col md:flex-row items-center justify-between p-6 md:p-8 gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-1">See Our Public Impact Storyboard</h2>
                <p className="text-gray-600 text-sm max-w-md">Explore real stories and images from our community cleanups, powered by volunteers and AI. Share your impact with the world!</p>
              </div>
            </div>
            <a
              href="/impact-storyboard"
              className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-full hover:from-sky-600 hover:to-teal-600 transition-all transform hover:scale-105 font-semibold shadow"
            >
              View Storyboard
            </a>
          </div>
        </div> */}

        {/* Gamification Panel Toggle */}
        <div className="container mx-auto max-w-6xl mb-8">
          <button
            onClick={() => setShowGamification(!showGamification)}
            className="w-full bg-white rounded-xl shadow-md p-4 flex items-center justify-between hover:bg-sky-50 transition-colors"
          >
            <span className="font-semibold text-sky-700 flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Gamification Progress
            </span>
            {showGamification ?
              <ChevronUp className="w-5 h-5 text-sky-700" /> :
              <ChevronDown className="w-5 h-5 text-sky-700" />}
          </button>

          {/* Gamification Panel - Collapsible */}
          {showGamification && (
            <div className="animate-fade-in transition-opacity duration-700 mt-4">
              <GamificationPanel />
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">{label}</p>
                  <p className="text-3xl font-bold text-gray-800">{value}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full">
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Daily Eco Tip */}
        <div className="mb-8">
          <EcoTipCard tip={dailyTip} isDaily={true} />
        </div>

        {/* Upcoming Events */}
        {loadingEnrolledEvents ? (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Clock className="w-6 h-6 mr-2 text-sky-500" />
              Events You're Joining
            </h2>
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your events...</p>
            </div>
          </div>
        ) : upcomingEvents.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Clock className="w-6 h-6 mr-2 text-sky-500" />
              Events You're Joining ({upcomingEvents.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        ) : null}

        {/* Completed Events */}
        {!loadingEnrolledEvents && completedEvents.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Award className="w-6 h-6 mr-2 text-teal-500" />
              Events You've Completed ({completedEvents.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedEvents.map(event => (
                <div key={event.id} className="relative">
                  <EventCard event={event} className="opacity-75" />
                  {/* Feedback button for eligible volunteers */}
                  {!mockFeedbacks.some(fb => fb.eventId === event.id) && (
                    <a
                      href={`/events/${event.id}/feedback`}
                      className="absolute bottom-4 right-4 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-full shadow hover:from-yellow-500 hover:to-yellow-600 font-semibold text-sm transition-all"
                    >
                      Give Feedback
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Events Message */}
        {!loadingEnrolledEvents && userEvents.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No events joined yet</h3>
            <p className="text-gray-500 mb-6">
              Join your first beach cleaning event to start making a difference!
            </p>
            <Link
              to="/events"
              className="px-6 py-3 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-full hover:from-sky-600 hover:to-teal-600 transition-all transform hover:scale-105"
            >
              Browse Events
            </Link>
          </div>
        )}

        {/* CHARTS SECTION */}
        <div className="container mx-auto max-w-6xl grid md:grid-cols-2 gap-8 mb-8">
          {/* Bar Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-shadow">
            <div className="w-full flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <Trash2 className="w-4 h-4 mr-2 text-sky-500" />
                Waste Collected by Event
              </h3>
              <button
                onClick={() => exportChart(barChartRef, 'waste_by_event.png')}
                className="px-3 py-2 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-full hover:from-sky-600 hover:to-teal-600 text-sm flex items-center transition-all transform hover:scale-105"
              >
                <Download className="w-4 h-4 mr-1" /> Download
              </button>
            </div>
            <div ref={barChartRef} className="w-full h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsEvents} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="wasteCollected" fill="#0ea5e9" name="Waste Collected (kg)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-shadow">
            <div className="w-full flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <Award className="w-4 h-4 mr-2 text-sky-500" />
                XP Distribution by Event
              </h3>
              <button
                onClick={() => exportChart(pieChartRef, 'xp_distribution.png')}
                className="px-3 py-2 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-full hover:from-sky-600 hover:to-teal-600 text-sm flex items-center transition-all transform hover:scale-105"
              >
                <Download className="w-4 h-4 mr-1" /> Download
              </button>
            </div>
            <div ref={pieChartRef} className="w-full h-[310px] flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsEvents}
                    dataKey="xpDistributed"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {analyticsEvents.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantDashboard;