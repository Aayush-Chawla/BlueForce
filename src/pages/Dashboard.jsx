import React from 'react';
import { Calendar, Users, Award, Trash2, Plus, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEvents } from '../contexts/EventContext';
import { getDailyTip } from '../utils/ecoTipsData';
import EventCard from '../components/EventCard';
import EcoTipCard from '../components/EcoTipCard';

const Dashboard = () => {
  const { user } = useAuth();
  const { events } = useEvents();
  const dailyTip = getDailyTip();
  
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
                <EventCard key={event.id} event={event} className="opacity-75" />
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
      </div>
    </div>
  );
};

export default Dashboard; 