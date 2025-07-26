import React from 'react';
import { Trophy, Award, Users, Calendar, Trash2, TrendingUp } from 'lucide-react';

const ImpactDashboard = ({ users, events, totalWasteCollected }) => {
  // Calculate top NGOs by events created
  const topNGOs = users
    .filter(u => u.role === 'ngo')
    .map(ngo => ({
      ...ngo,
      eventsCreated: events.filter(e => e.organizer.id === ngo.id).length
    }))
    .sort((a, b) => b.eventsCreated - a.eventsCreated)
    .slice(0, 5);

  // Calculate top participants by impact
  const topParticipants = users
    .filter(u => u.role === 'participant')
    .sort((a, b) => {
      const aScore = (a.eventsJoined || 0) * 10 + (a.totalWasteCollected || 0);
      const bScore = (b.eventsJoined || 0) * 10 + (b.totalWasteCollected || 0);
      return bScore - aScore;
    })
    .slice(0, 5);

  // Calculate monthly stats (mock data for demo)
  const monthlyStats = [
    { month: 'Jan', events: 12, participants: 180, waste: 45.2 },
    { month: 'Feb', events: 15, participants: 220, waste: 58.7 },
    { month: 'Mar', events: 18, participants: 280, waste: 72.1 },
    { month: 'Apr', events: 22, participants: 340, waste: 89.5 },
    { month: 'May', events: 25, participants: 380, waste: 95.8 },
    { month: 'Jun', events: 28, participants: 420, waste: 108.3 }
  ];

  const currentMonth = monthlyStats[monthlyStats.length - 1];
  const previousMonth = monthlyStats[monthlyStats.length - 2];

  const calculateGrowth = (current, previous) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Impact Dashboard</h2>
        <div className="text-sm text-gray-600">
          System-wide statistics and performance metrics
        </div>
      </div>

      {/* Growth Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Monthly Events</p>
              <p className="text-3xl font-bold">{currentMonth.events}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm">+{calculateGrowth(currentMonth.events, previousMonth.events)}% from last month</span>
              </div>
            </div>
            <Calendar className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Monthly Participants</p>
              <p className="text-3xl font-bold">{currentMonth.participants}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm">+{calculateGrowth(currentMonth.participants, previousMonth.participants)}% from last month</span>
              </div>
            </div>
            <Users className="w-12 h-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-sm">Monthly Waste (kg)</p>
              <p className="text-3xl font-bold">{currentMonth.waste}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm">+{calculateGrowth(currentMonth.waste, previousMonth.waste)}% from last month</span>
              </div>
            </div>
            <Trash2 className="w-12 h-12 text-teal-200" />
          </div>
        </div>
      </div>

      {/* Leaderboards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top NGOs */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <Trophy className="w-6 h-6 text-amber-500 mr-2" />
            <h3 className="text-xl font-bold text-gray-800">Top NGOs by Events Created</h3>
          </div>
          <div className="space-y-4">
            {topNGOs.map((ngo, index) => (
              <div key={ngo.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-600' : 'bg-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  <img
                    src={ngo.avatar || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={ngo.name}
                    className="w-10 h-10 rounded-full object-cover ml-3"
                    onError={e => {
                      const fallback = 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400';
                      if (e.target.src !== fallback) {
                        e.target.onerror = null;
                        e.target.src = fallback;
                      }
                    }}
                  />
                  <div className="ml-3">
                    <p className="font-semibold text-gray-800">{ngo.name}</p>
                    <p className="text-sm text-gray-500">{ngo.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{ngo.eventsCreated}</p>
                  <p className="text-sm text-gray-500">events</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Participants */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <Award className="w-6 h-6 text-blue-500 mr-2" />
            <h3 className="text-xl font-bold text-gray-800">Top Participants by Impact</h3>
          </div>
          <div className="space-y-4">
            {topParticipants.map((participant, index) => (
              <div key={participant.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-600' : 'bg-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  <img
                    src={participant.avatar || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={participant.name}
                    className="w-10 h-10 rounded-full object-cover ml-3"
                    onError={e => {
                      const fallback = 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400';
                      if (e.target.src !== fallback) {
                        e.target.onerror = null;
                        e.target.src = fallback;
                      }
                    }}
                  />
                  <div className="ml-3">
                    <p className="font-semibold text-gray-800">{participant.name}</p>
                    <p className="text-sm text-gray-500">{participant.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{participant.eventsJoined || 0}</p>
                  <p className="text-sm text-gray-500">{participant.totalWasteCollected || 0} kg</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trend Chart (Simple visualization) */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Monthly Trends</h3>
        <div className="grid grid-cols-6 gap-4">
          {monthlyStats.map((stat, index) => (
            <div key={stat.month} className="text-center">
              <div className="mb-2">
                <div 
                  className="bg-gradient-to-t from-blue-500 to-blue-300 rounded-t mx-auto"
                  style={{ 
                    height: `${(stat.events / Math.max(...monthlyStats.map(s => s.events))) * 100}px`,
                    width: '20px'
                  }}
                />
                <div 
                  className="bg-gradient-to-t from-green-500 to-green-300 mx-auto"
                  style={{ 
                    height: `${(stat.participants / Math.max(...monthlyStats.map(s => s.participants))) * 80}px`,
                    width: '20px'
                  }}
                />
                <div 
                  className="bg-gradient-to-t from-teal-500 to-teal-300 rounded-b mx-auto"
                  style={{ 
                    height: `${(stat.waste / Math.max(...monthlyStats.map(s => s.waste))) * 60}px`,
                    width: '20px'
                  }}
                />
              </div>
              <p className="text-xs font-medium text-gray-600">{stat.month}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2" />
            <span className="text-sm text-gray-600">Events</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2" />
            <span className="text-sm text-gray-600">Participants</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-teal-500 rounded mr-2" />
            <span className="text-sm text-gray-600">Waste (kg)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactDashboard;