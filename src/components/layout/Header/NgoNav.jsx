import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

const NgoNav = ({ isActive }) => {
  return (
    <>
      <Link
        to="/dashboard"
        className={`text-gray-600 hover:text-sky-600 transition-colors ${isActive('/dashboard') ? 'text-sky-600 font-semibold' : ''}`}
      >
        Dashboard
      </Link>
      <Link
        to="/events"
        className={`text-gray-600 hover:text-sky-600 transition-colors ${isActive('/events') ? 'text-sky-600 font-semibold' : ''}`}
      >
        Events
      </Link>
      <Link
        to="/eco-tips"
        className={`text-gray-600 hover:text-sky-600 transition-colors ${isActive('/eco-tips') ? 'text-sky-600 font-semibold' : ''}`}
      >
        Eco Tips
      </Link>
      <Link
        to="/certificates"
        className={`text-gray-600 hover:text-sky-600 transition-colors ${isActive('/certificates') ? 'text-sky-600 font-semibold' : ''}`}
      >
        Certificates
      </Link>
      <Link
        to="/create-event"
        className={`inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-full hover:from-sky-600 hover:to-teal-600 transition-all transform hover:scale-105 text-sm ${isActive('/create-event') ? 'ring-2 ring-offset-2 ring-sky-300' : ''}`}
      >
        <Plus className="w-4 h-4 mr-1" /> Create Event
      </Link>
    </>
  );
};

export default NgoNav;


