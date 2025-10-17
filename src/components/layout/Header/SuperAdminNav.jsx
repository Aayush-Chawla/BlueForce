import React from 'react';
import { Link } from 'react-router-dom';

const SuperAdminNav = ({ isActive }) => {
  return (
    <>
      <Link
        to="/admin"
        className={`text-gray-600 hover:text-sky-600 transition-colors ${isActive('/admin') ? 'text-sky-600 font-semibold' : ''}`}
      >
        Admin
      </Link>
      <Link
        to="/admin/users"
        className={`text-gray-600 hover:text-sky-600 transition-colors ${isActive('/admin/users') ? 'text-sky-600 font-semibold' : ''}`}
      >
        Users
      </Link>
      <Link
        to="/admin/events"
        className={`text-gray-600 hover:text-sky-600 transition-colors ${isActive('/admin/events') ? 'text-sky-600 font-semibold' : ''}`}
      >
        Events
      </Link>
      <Link
        to="/admin/feedback"
        className={`text-gray-600 hover:text-sky-600 transition-colors ${isActive('/admin/feedback') ? 'text-sky-600 font-semibold' : ''}`}
      >
        Feedback
      </Link>
      <Link
        to="/admin/eco-tips"
        className={`text-gray-600 hover:text-sky-600 transition-colors ${isActive('/admin/eco-tips') ? 'text-sky-600 font-semibold' : ''}`}
      >
        Eco Tips
      </Link>
    </>
  );
};

export default SuperAdminNav;


