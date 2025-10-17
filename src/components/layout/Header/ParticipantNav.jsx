import React from 'react';
import { Link } from 'react-router-dom';

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
    </>
  );
};

export default ParticipantNav;


