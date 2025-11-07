import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

const ParticipantNav = ({ isActive }) => {
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
        to="/participant/chat"
        className={`text-gray-600 hover:text-sky-600 transition-colors ${isActive('/participant/chat') ? 'text-sky-600 font-semibold' : ''}`}
      >
        <MessageCircle className="w-4 h-4 inline mr-1" />
        Chat
      </Link>
    </>
  );
};

export default ParticipantNav;


