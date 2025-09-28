import React, { useState } from 'react';
import { Trophy, Award, Users, Trash2, Calendar, LayoutGrid } from 'lucide-react';
import { mockUsers } from '../utils/mockData';
import { events, getBadge } from '../utils/eventData';

const getRankedVolunteers = () => {
  return mockUsers
    .filter(u => u.role === 'participant')
    .map(u => ({
      ...u,
      eventsJoined: u.eventsJoined || 0,
      totalWasteCollected: u.totalWasteCollected || 0
    }))
    .sort((a, b) => {
      if (b.eventsJoined !== a.eventsJoined) return b.eventsJoined - a.eventsJoined;
      return b.totalWasteCollected - a.totalWasteCollected;
    });
};

const crownColors = [
  'from-yellow-400 to-yellow-200',
  'from-gray-400 to-gray-200',
  'from-amber-700 to-amber-300'
];

const VolunteerLeaderboard = () => {
  const volunteers = getRankedVolunteers();
  const [view, setView] = useState('leaderboard'); // 'leaderboard' or 'impact'

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 flex items-center justify-center gap-2 mb-2">
            <LayoutGrid className="w-8 h-8 text-teal-600" />
            Impact & Leaderboard Dashboard
          </h1>
          <p className="text-lg text-gray-600">Switch between Volunteer Leaderboard and Event-wise Impact</p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex justify-center gap-4 mb-10">
          <button
            className={`px-6 py-2 rounded-full text-sm font-semibold shadow transition-all duration-200 ${
              view === 'leaderboard'
                ? 'bg-sky-600 text-white shadow-md'
                : 'bg-white text-sky-700 border border-sky-300 hover:bg-sky-100'
            }`}
            onClick={() => setView('leaderboard')}
          >
            <Trophy className="w-4 h-4 inline mr-1" />
            Volunteer Leaderboard
          </button>
          <button
            className={`px-6 py-2 rounded-full text-sm font-semibold shadow transition-all duration-200 ${
              view === 'impact'
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-white text-teal-700 border border-teal-300 hover:bg-teal-100'
            }`}
            onClick={() => setView('impact')}
          >
            <Calendar className="w-4 h-4 inline mr-1" />
            Event-wise Impact
          </button>
        </div>

        {/* View Content */}
        {view === 'leaderboard' ? (
          <div className="bg-white rounded-xl shadow-lg p-6 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold text-sky-700 mb-4">Top Volunteers</h2>
            <div className="flex flex-col gap-6">
              {volunteers.map((v, idx) => {
                const isTopThree = idx < 3;
                return (
                  <div
                    key={v.id}
                    className={`flex items-center gap-6 transition-all duration-200 ${
                      isTopThree
                        ? `bg-gradient-to-r ${crownColors[idx]} bg-clip-padding border-2 border-yellow-200 shadow-xl scale-[1.01] z-10 relative`
                        : 'bg-sky-50 border border-sky-100 hover:shadow-md hover:bg-sky-100'
                    } px-6 py-6 rounded-xl`}
                  >
                    <div className="flex-shrink-0">
                      <div className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-4 ${
                        isTopThree ? 'border-yellow-400' : 'border-sky-200'
                      }`}>
                        <img
                          src={v.avatar || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400'}
                          alt={v.name}
                          className="w-full h-full object-cover"
                          onError={e => {
                            const fallback = 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400';
                            if (e.target.src !== fallback) {
                              e.target.onerror = null;
                              e.target.src = fallback;
                            }
                          }}
                        />
                        {isTopThree && (
                          <span className={`absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r ${crownColors[idx]} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1`}>
                            <Award className="w-4 h-4" />
                            {idx === 0 ? '1st' : idx === 1 ? '2nd' : '3rd'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className={`text-lg md:text-xl font-bold ${isTopThree ? 'text-yellow-700' : 'text-gray-800'}`}>{v.name}</h2>
                      <p className="text-gray-500 text-sm">{v.location}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2 text-sky-700 font-semibold">
                        <Users className="w-5 h-5" />
                        <span>{v.eventsJoined} events</span>
                      </div>
                      <div className="flex items-center gap-2 text-teal-700 font-semibold">
                        <Trash2 className="w-5 h-5" />
                        <span>{v.totalWasteCollected} kg</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-6 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold text-teal-700 mb-4 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-teal-500" />
              Event-wise Impact
            </h2>
            <div className="h-0.5 w-16 bg-gradient-to-r from-teal-500 to-sky-500 rounded-full mb-6"></div>
            <table className="min-w-full text-sm text-left">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="bg-teal-50 rounded-lg text-teal-700">
                  <th className="py-2 px-4 font-semibold">Event</th>
                  <th className="py-2 px-4 font-semibold">Location</th>
                  <th className="py-2 px-4 font-semibold">Date</th>
                  <th className="py-2 px-4 font-semibold">Waste</th>
                  <th className="py-2 px-4 font-semibold">XP</th>
                  <th className="py-2 px-4 font-semibold">Volunteers</th>
                  <th className="py-2 px-4 font-semibold">Sponsor</th>
                  <th className="py-2 px-4 font-semibold">Badge</th>
                </tr>
              </thead>
              <tbody>
                {events.map(event => {
                  const badge = getBadge(event);
                  return (
                    <tr key={event.id} className="border-b hover:bg-teal-50 transition-colors">
                      <td className="py-2 px-4 font-medium text-gray-800">{event.name}</td>
                      <td className="py-2 px-4 text-gray-600">{event.location}</td>
                      <td className="py-2 px-4 text-gray-600">{event.date}</td>
                      <td className="py-2 px-4 text-gray-600">{event.wasteCollected} kg</td>
                      <td className="py-2 px-4 text-gray-600">{event.xpDistributed}</td>
                      <td className="py-2 px-4 text-gray-600">{event.volunteers}</td>
                      <td className="py-2 px-4 text-gray-600">{event.sponsor}</td>
                      <td className="py-2 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge.color}`}>{badge.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerLeaderboard;
