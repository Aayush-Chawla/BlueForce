import React, { useMemo } from 'react';
import { Trophy, Award, Users, Calendar, Trash2, TrendingUp } from 'lucide-react';
import { isNgoRole, isParticipantRole } from '../../../utils/roleUtils';

const ImpactDashboard = ({ users, events, totalWasteCollected }) => {
  // Calculate top NGOs by events created (using ngoId from events)
  const topNGOs = useMemo(() => {
    const ngoEventCounts = {};
    
    // Count events per NGO
    events.forEach(event => {
      if (event.ngoId) {
        ngoEventCounts[event.ngoId] = (ngoEventCounts[event.ngoId] || 0) + 1;
      }
    });
    
    // Map to NGO objects with event counts
    return users
      .filter(u => isNgoRole(u.role))
      .map(ngo => ({
        ...ngo,
        eventsCreated: ngoEventCounts[ngo.id] || 0,
        name: ngo.organizationName || ngo.name || ngo.email,
        location: ngo.address || ngo.location || 'N/A'
      }))
      .sort((a, b) => b.eventsCreated - a.eventsCreated)
      .slice(0, 5);
  }, [users, events]);

  // Calculate top participants (using points or other metrics)
  const topParticipants = useMemo(() => {
    return users
      .filter(u => isParticipantRole(u.role))
      .map(participant => ({
        ...participant,
        name: participant.name || participant.email,
        location: participant.address || participant.location || 'N/A',
        points: participant.points || 0
      }))
      .sort((a, b) => (b.points || 0) - (a.points || 0))
      .slice(0, 5);
  }, [users]);

  // Calculate monthly stats from real events data
  const monthlyStats = useMemo(() => {
    const now = new Date();
    const months = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Get last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      const monthEvents = events.filter(e => {
        if (!e.dateTime) return false;
        const eventDate = new Date(e.dateTime);
        return eventDate.getFullYear() === date.getFullYear() && 
               eventDate.getMonth() === date.getMonth();
      });
      
      const monthWaste = monthEvents.reduce((sum, e) => sum + (e.wasteCollected || 0), 0);
      const monthParticipants = monthEvents.reduce((sum, e) => sum + (e.currentParticipants || 0), 0);
      
      months.push({
        month: monthNames[date.getMonth()],
        events: monthEvents.length,
        participants: monthParticipants,
        waste: monthWaste
      });
    }
    
    return months;
  }, [events]);

  const currentMonth = monthlyStats[monthlyStats.length - 1] || { events: 0, participants: 0, waste: 0 };
  const previousMonth = monthlyStats[monthlyStats.length - 2] || { events: 0, participants: 0, waste: 0 };

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
            {topNGOs.length > 0 ? topNGOs.map((ngo, index) => (
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
            )) : (
              <div className="text-center py-8 text-gray-500">
                No NGOs found
              </div>
            )}
          </div>
        </div>

        {/* Top Participants */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <Award className="w-6 h-6 text-blue-500 mr-2" />
            <h3 className="text-xl font-bold text-gray-800">Top Participants by Impact</h3>
          </div>
          <div className="space-y-4">
            {topParticipants.length > 0 ? topParticipants.map((participant, index) => (
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
                  <p className="font-bold text-gray-800">{participant.points || 0}</p>
                  <p className="text-sm text-gray-500">points</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                No participants found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Trend Chart (Simple visualization) */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Monthly Trends (Last 6 Months)</h3>
        {monthlyStats.length > 0 ? (
          <>
            <div className="grid grid-cols-6 gap-4">
              {monthlyStats.map((stat) => {
                const maxEvents = Math.max(...monthlyStats.map(s => s.events), 1);
                const maxParticipants = Math.max(...monthlyStats.map(s => s.participants), 1);
                const maxWaste = Math.max(...monthlyStats.map(s => s.waste), 1);
                
                return (
                  <div key={stat.month} className="text-center">
                    <div className="mb-2 flex items-end justify-center h-32">
                      <div className="flex flex-col items-center gap-1">
                        <div 
                          className="bg-gradient-to-t from-blue-500 to-blue-300 rounded-t"
                          style={{ 
                            height: `${(stat.events / maxEvents) * 100}px`,
                            width: '20px',
                            minHeight: stat.events > 0 ? '4px' : '0px'
                          }}
                          title={`${stat.events} events`}
                        />
                        <div 
                          className="bg-gradient-to-t from-green-500 to-green-300"
                          style={{ 
                            height: `${(stat.participants / maxParticipants) * 80}px`,
                            width: '20px',
                            minHeight: stat.participants > 0 ? '4px' : '0px'
                          }}
                          title={`${stat.participants} participants`}
                        />
                        <div 
                          className="bg-gradient-to-t from-teal-500 to-teal-300 rounded-b"
                          style={{ 
                            height: `${(stat.waste / maxWaste) * 60}px`,
                            width: '20px',
                            minHeight: stat.waste > 0 ? '4px' : '0px'
                          }}
                          title={`${stat.waste} kg waste`}
                        />
                      </div>
                    </div>
                    <p className="text-xs font-medium text-gray-600">{stat.month}</p>
                  </div>
                );
              })}
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
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No event data available for the last 6 months
          </div>
        )}
      </div>
    </div>
  );
};

export default ImpactDashboard;


