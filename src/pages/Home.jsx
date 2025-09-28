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
                src="data:image/jpeg;base64,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"
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