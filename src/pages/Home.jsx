import React from 'react';
import { Link } from 'react-router-dom';
import { Waves, Users, Calendar, Award, ArrowRight, Leaf, Fish, Recycle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  const stats = [
    { icon: Users, label: 'Active Volunteers', value: '2,400+' },
    { icon: Calendar, label: 'Events Organized', value: '180+' },
    { icon: Recycle, label: 'Waste Collected', value: '12.5 tons' },
    { icon: Fish, label: 'Beaches Cleaned', value: '45+' }
  ];

  const features = [
    {
      icon: Calendar,
      title: 'Discover Events',
      description: 'Find beach cleaning events in your area and join a community of environmental advocates.'
    },
    {
      icon: Users,
      title: 'Connect & Collaborate',
      description: 'Meet like-minded individuals and organizations working towards cleaner oceans.'
    },
    {
      icon: Award,
      title: 'Track Impact',
      description: 'Monitor your contribution and see the collective impact of our community efforts.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 to-teal-500/10" />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
                  Clean Our
                  <span className="block bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent">
                    Beautiful Beaches
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Join thousands of volunteers in protecting our marine ecosystems. 
                  Organize or participate in beach cleaning events and make a real difference.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <Link
                    to="/events"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-full font-semibold hover:from-sky-600 hover:to-teal-600 transition-all transform hover:scale-105 shadow-lg"
                  >
                    Explore Events
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-full font-semibold hover:from-sky-600 hover:to-teal-600 transition-all transform hover:scale-105 shadow-lg"
                    >
                      Get Started
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                    <Link
                      to="/events"
                      className="inline-flex items-center px-8 py-4 border-2 border-sky-500 text-sky-600 rounded-full font-semibold hover:bg-sky-50 transition-colors"
                    >
                      View Events
                    </Link>
                  </>
                )}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-teal-400 rounded-3xl opacity-20 blur-3xl" />
              <img
                src="https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Beach cleanup volunteers"
                className="relative rounded-3xl shadow-2xl w-full h-96 object-cover"
                onError={e => {
                  const fallback = 'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=800';
                  if (e.target.src !== fallback) {
                    e.target.onerror = null;
                    e.target.src = fallback;
                  }
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">{value}</div>
                <div className="text-gray-600">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-br from-sky-50 to-teal-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our community-driven platform to organize and participate in beach cleaning events
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow group">
                <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-teal-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-sky-500 to-teal-500">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Waves className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-sky-100 mb-8">
              Join thousands of volunteers working together to protect our oceans and beaches
            </p>
            {!user && (
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-white text-sky-600 rounded-full font-semibold hover:bg-sky-50 transition-colors transform hover:scale-105"
              >
                Join the Movement
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 