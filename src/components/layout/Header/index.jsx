import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Waves, LogOut } from 'lucide-react';
import SuperAdminNav from './SuperAdminNav';
import NgoNav from './NgoNav';
import ParticipantNav from './ParticipantNav';
import GuestNav from './GuestNav';
import { useAuth } from '../../../contexts';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const isSuperAdmin = user && user.email === 'admin@blueforce.com';

  const renderNav = () => {
    if (!user) return <GuestNav isActive={isActive} />;
    if (isSuperAdmin) return <SuperAdminNav isActive={isActive} />;
    if (user.role === 'ngo') return <NgoNav isActive={isActive} />;
    return <ParticipantNav isActive={isActive} />;
  };

  return (
    <header className="bg-white shadow-lg border-b border-sky-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full group-hover:scale-110 transition-transform">
              <Waves className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent">
              BlueForce
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {renderNav()}
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <img
                    src={user.avatar || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={e => {
                      const fallback = 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400';
                      if (e.target.src !== fallback) {
                        e.target.onerror = null;
                        e.target.src = fallback;
                      }
                    }}
                  />
                  <span className="font-medium text-gray-700">{user.name}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.role === 'ngo' 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role === 'ngo' ? 'NGO' : (isSuperAdmin ? 'Super Admin' : 'Participant')}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sky-600 hover:text-sky-700 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-full hover:from-sky-600 hover:to-teal-600 transition-all transform hover:scale-105 font-medium"
                >
                  Join Us
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;


