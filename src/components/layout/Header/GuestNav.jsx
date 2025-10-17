import React from 'react';
import { Link } from 'react-router-dom';

const GuestNav = ({ isActive }) => {
  return (
    <>
      <Link
        to="/"
        className={`text-gray-600 hover:text-sky-600 transition-colors ${isActive('/') ? 'text-sky-600 font-semibold' : ''}`}
      >
        Home
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
        to="/leaderboard"
        className={`text-gray-600 hover:text-sky-600 transition-colors ${isActive('/leaderboard') ? 'text-sky-600 font-semibold' : ''}`}
      >
        Leaderboard
      </Link>
      <Link
        to="/chat-help-center"
        className={`text-gray-600 hover:text-sky-600 transition-colors ${isActive('/chat-help-center') ? 'text-sky-600 font-semibold' : ''}`}
      >
        Help
      </Link>
    </>
  );
};

export default GuestNav;


