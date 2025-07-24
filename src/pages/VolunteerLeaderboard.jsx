import React from 'react';
import { Trophy, Award, Users, Trash2 } from 'lucide-react';
import { mockUsers } from '../utils/mockData';

// Helper to get sorted volunteers (participants only)
const getRankedVolunteers = () => {
  return mockUsers
    .filter(u => u.role === 'participant')
    .map(u => ({
      ...u,
      eventsJoined: u.eventsJoined || 0,
      totalWasteCollected: u.totalWasteCollected || 0
    }))
    .sort((a, b) => {
      // Sort by events attended, then by waste collected
      if (b.eventsJoined !== a.eventsJoined) return b.eventsJoined - a.eventsJoined;
      return b.totalWasteCollected - a.totalWasteCollected;
    });
};

const crownColors = [
  'from-yellow-400 to-yellow-200', // 1st
  'from-gray-400 to-gray-200',     // 2nd
  'from-amber-700 to-amber-300'    // 3rd
];

const VolunteerLeaderboard = () => {
  const volunteers = getRankedVolunteers();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Volunteer Leaderboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Celebrating our top volunteers for their dedication to cleaner beaches!
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex flex-col gap-6">
              {volunteers.map((v, idx) => {
                const isTopThree = idx < 3;
                return (
                  <div
                    key={v.id}
                    className={`flex items-center gap-6 transition-all duration-200 ${
                      isTopThree
                        ? `bg-gradient-to-r ${crownColors[idx]} bg-clip-padding border-2 border-yellow-200 shadow-xl scale-105 z-10 relative` 
                        : 'bg-sky-50 border border-sky-100 hover:shadow-lg hover:bg-sky-100'
                    } ${idx === 0 ? 'rounded-t-xl' : ''} ${idx === volunteers.length - 1 ? 'rounded-b-xl' : ''} px-6 py-6 md:py-8`}
                    style={{ minHeight: '110px' }}
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
                      <h2 className={`text-lg md:text-2xl font-bold ${isTopThree ? 'text-yellow-700' : 'text-gray-800'}`}>{v.name}</h2>
                      <p className="text-gray-500 text-sm md:text-base">{v.location}</p>
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
        </div>
      </div>
    </div>
  );
};

export default VolunteerLeaderboard; 