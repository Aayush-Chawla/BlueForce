import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEvents } from '../contexts/EventContext';
import { getDailyTip } from '../utils/ecoTipsData';
import EventCard from '../components/EventCard';
import EcoTipCard from '../components/EcoTipCard';
import { mockFeedbacks } from '../utils/mockData';
import React, { useRef, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import html2canvas from 'html2canvas';
import {
  ArrowUpRight, ArrowDownRight, Download, Award, Users, Trash2, Calendar, ChevronDown, ChevronUp, Plus, MapPin, Clock
} from 'lucide-react';
import GamificationPanel from '../components/GamificationPanel';

// FIX: Renamed to avoid conflict with context `events`
const staticEvents = [
  {
    id: 'e456',
    name: 'Juhu Beach Cleanup',
    location: 'Juhu Beach, Mumbai',
    date: '2025-07-28',
    wasteCollected: 45,
    volunteers: 32,
    xpDistributed: 1280,
    sponsor: 'Acme Corp',
  },
  {
    id: 'e789',
    name: 'Versova Drive',
    location: 'Versova Beach, Mumbai',
    date: '2025-08-01',
    wasteCollected: 64,
    volunteers: 50,
    xpDistributed: 2100,
    sponsor: 'GreenFuture Ltd',
  },
  {
    id: 'e101',
    name: 'Marine Lines Cleanup',
    location: 'Marine Lines, Mumbai',
    date: '2025-08-15',
    wasteCollected: 18,
    volunteers: 15,
    xpDistributed: 600,
    sponsor: 'Acme Corp',
  },
];


const COLORS = ['#0ea5e9', '#14b8a6', '#f59e42', '#6366f1', '#f43f5e'];


function getBadge(event) {
  if (event.wasteCollected > 50) return { label: 'Gold', color: 'bg-yellow-400 text-yellow-900' };
  if (event.wasteCollected >= 25) return { label: 'Silver', color: 'bg-gray-300 text-gray-800' };
  return { label: 'Bronze', color: 'bg-amber-700 text-amber-100' };
}

const Dashboard = () => {
  const { user } = useAuth();
  const { events } = useEvents();
  const dailyTip = getDailyTip();
  const barChartRef = useRef();
  const pieChartRef = useRef();
const kpi = {
    events: events.length,
    waste: events.reduce((sum, e) => sum + e.wasteCollected, 0),
    volunteers: events.reduce((sum, e) => sum + e.volunteers, 0),
    xp: events.reduce((sum, e) => sum + e.xpDistributed, 0),
    growth: {
      events: true,
      waste: true,
      volunteers: false,
      xp: true,
    }};
  const exportChart = async (ref, filename) => {
    if (!ref.current) return;
    const canvas = await html2canvas(ref.current, { backgroundColor: '#fff', scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imgData;
    link.download = filename;
    link.click();
  };

  const [showGamification, setShowGamification] = useState(true);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please log in to view your dashboard</h2>
        </div>
      </div>
    );
  }

  const userEvents = events.filter(event =>
    user.role === 'ngo'
      ? event.organizer.id === user.id
      : event.participants.some(p => p.id === user.id)
  );

  const upcomingEvents = userEvents.filter(event => event.status === 'upcoming');
  const completedEvents = userEvents.filter(event => event.status === 'completed');

  const stats = user.role === 'ngo'
    ? [
      { icon: Calendar, label: 'Events Organized', value: events.filter(e => e.organizer.id === user.id).length },
      { icon: Users, label: 'Total Participants', value: events.filter(e => e.organizer.id === user.id).reduce((total, event) => total + event.participants.length, 0) },
      { icon: Trash2, label: 'Waste Collected', value: '3.2 tons' },
      { icon: Award, label: 'Impact Score', value: '95%' }
    ]
    : [
      { icon: Calendar, label: 'Events Joined', value: userEvents.length },
      { icon: Trash2, label: 'Waste Collected', value: `${user.totalWasteCollected || 0} kg` },
      { icon: Award, label: 'Eco Score', value: user.ecoScore || 850 },
      { icon: Users, label: 'Community Impact', value: '12.5 tons' }
    ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={user.avatar || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400'}
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
                <p className="text-gray-600">
                  {user.role === 'ngo' ? 'NGO Organizer' : 'Environmental Participant'}
                </p>
                {user.location && (
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {user.location}
                  </p>
                )}
              </div>
            </div>

            {user.role === 'ngo' && (
              <Link
                to="/create-event"
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-full hover:from-sky-600 hover:to-teal-600 transition-all transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                <span>Create Event</span>
              </Link>
            )}
          </div>
        </div>


        {/* Daily Eco Tip */}
        <div className="mb-8">
          <EcoTipCard tip={dailyTip} isDaily={true} />
        </div>

        {/* Impact Storyboard Link */}
        <div className="mb-8">
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
        </div>
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

        {/* Bio Section */}
        {user.bio && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">About</h2>
            <p className="text-gray-600 leading-relaxed">{user.bio}</p>
          </div>
        )}

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Clock className="w-6 h-6 mr-2 text-sky-500" />
              {user.role === 'ngo' ? 'Your Upcoming Events' : 'Events You\'re Joining'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}

        {/* Completed Events */}
        {completedEvents.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Award className="w-6 h-6 mr-2 text-teal-500" />
              {user.role === 'ngo' ? 'Your Completed Events' : 'Events You\'ve Completed'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedEvents.map(event => (
                <div key={event.id} className="relative">
                  <EventCard event={event} className="opacity-75" />
                  {/* Feedback button for eligible volunteers */}
                  {user.role === 'participant' &&
                    !mockFeedbacks.some(fb => fb.eventId === event.id) &&
                    event.participants.some(p => p.id === user.id) && (
                      <a
                        href={`/events/${event.id}/feedback`}
                        className="absolute bottom-4 right-4 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-full shadow hover:from-yellow-500 hover:to-yellow-600 font-semibold text-sm transition-all"
                      >
                        Give Feedback
                      </a>
                    )}
                  {/* Show feedback to organizer */}
                  {user.role === 'ngo' &&
                    mockFeedbacks.filter(fb => fb.eventId === event.id).length > 0 && (
                      <div className="mt-4 bg-sky-50 border border-sky-100 rounded-lg p-4">
                        <h4 className="font-semibold text-sky-700 mb-2 text-sm">Volunteer Feedback</h4>
                        <ul className="space-y-2">
                          {mockFeedbacks.filter(fb => fb.eventId === event.id).map((fb, i) => (
                            <li key={i} className="bg-white rounded p-3 shadow-sm border border-sky-50">
                              <div className="flex items-center gap-1 mb-1">
                                {[...Array(fb.rating)].map((_, idx) => (
                                  <span key={idx} className="text-yellow-400">★</span>
                                ))}
                                {[...Array(5 - fb.rating)].map((_, idx) => (
                                  <span key={idx} className="text-gray-300">★</span>
                                ))}
                              </div>
                              <div className="text-gray-700 text-sm">{fb.feedback}</div>
                              <div className="text-xs text-gray-400 mt-1">{new Date(fb.createdAt).toLocaleString()}</div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Events Message */}
        {userEvents.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {user.role === 'ngo' ? 'No events organized yet' : 'No events joined yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {user.role === 'ngo'
                ? 'Start organizing your first beach cleaning event to make a difference!'
                : 'Join your first beach cleaning event to start making a difference!'
              }
            </p>
            <Link
              to={user.role === 'ngo' ? '/create-event' : '/events'}
              className="px-6 py-3 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-full hover:from-sky-600 hover:to-teal-600 transition-all transform hover:scale-105"
            >
              {user.role === 'ngo' ? 'Create Your First Event' : 'Browse Events'}
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
                <BarChart data={staticEvents} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
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
                    data={staticEvents}
                    dataKey="xpDistributed"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {staticEvents.map((entry, index) => (
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

export default Dashboard; 