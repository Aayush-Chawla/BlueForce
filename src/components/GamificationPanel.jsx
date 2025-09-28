import React, { useEffect, useState } from 'react';
import { Award, Lock, Gift, Star, Trophy } from 'lucide-react';

const LEVELS = [
  { level: 1, min: 0, max: 100 },
  { level: 2, min: 101, max: 250 },
  { level: 3, min: 251, max: 500 },
  { level: 4, min: 501, max: 750 },
];

const BADGES = [
  {
    key: 'first-step',
    name: 'First Step',
    desc: 'Attended your first event',
    icon: <Star className="w-8 h-8 text-yellow-400" />,
    check: ({ eventsAttended }) => eventsAttended >= 1,
    color: 'bg-yellow-100',
  },
  {
    key: 'waste-warrior',
    name: 'Waste Warrior',
    desc: 'Logged 5+ kg waste',
    icon: <Trophy className="w-8 h-8 text-green-500" />,
    check: ({ totalWaste }) => totalWaste >= 5,
    color: 'bg-green-100',
  },
  {
    key: 'eco-legend',
    name: 'Eco Legend',
    desc: 'Reached 300 XP',
    icon: <Award className="w-8 h-8 text-blue-500" />,
    check: ({ xp }) => xp >= 300,
    color: 'bg-blue-100',
  },
  {
    key: 'consistency-champ',
    name: 'Consistency Champ',
    desc: 'Attended 3 events in a row',
    icon: <Star className="w-8 h-8 text-pink-400" />,
    check: ({ eventsInARow }) => eventsInARow >= 3,
    color: 'bg-pink-100',
  },
];

const REWARDS = [
  {
    key: 'certificate',
    name: 'Certificate of Contribution',
    desc: 'Unlocked at 150 XP',
    xp: 150,
  },
  {
    key: 'hall-of-fame',
    name: 'Volunteer Hall of Fame',
    desc: 'Unlocked at 300 XP',
    xp: 300,
  },
  {
    key: 'top-10',
    name: 'Top 10 Leaderboard Feature',
    desc: 'Unlocked at 500 XP',
    xp: 500,
  },
];

function calculateLevel(xp) {
  if (xp >= 500) return 4;
  if (xp >= 250) return 3;
  if (xp >= 100) return 2;
  return 1;
}

const GamificationPanel = () => {
  const [xp, setXp] = useState(0);
  const [eventsAttended, setEventsAttended] = useState(0);
  const [totalWaste, setTotalWaste] = useState(0);
  const [eventsInARow, setEventsInARow] = useState(0); // Mocked for now
  const [unlockedBadges, setUnlockedBadges] = useState([]);

  useEffect(() => {
    // Get waste logs from localStorage
    const logs = JSON.parse(localStorage.getItem('wasteLogs') || '[]');
    const xpSum = logs.reduce((sum, l) => sum + (l.xpEarned || 0), 0);
    setXp(xpSum);
    setEventsAttended([...new Set(logs.map(l => l.eventId))].length);
    setTotalWaste(logs.reduce((sum, l) => sum + (l.quantity || 0), 0));
    // For demo, mock eventsInARow as 3 if attended >= 3
    setEventsInARow(logs.length >= 3 ? 3 : logs.length);
  }, []);

  // Level logic
  const level = calculateLevel(xp);
  const currentLevel = LEVELS.find(l => l.level === level);
  const nextLevel = LEVELS.find(l => l.level === level + 1);
  const xpToNext = nextLevel ? nextLevel.min - xp : 0;
  const xpBarPercent = nextLevel
    ? ((xp - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100
    : 100;

  // Badge logic
  const badgeState = { xp, eventsAttended, totalWaste, eventsInARow };
  const earnedBadges = BADGES.filter(b => b.check(badgeState));
  const lockedBadges = BADGES.filter(b => !b.check(badgeState));

  // Rewards progress
  const rewardProgress = REWARDS.map(r => ({
    ...r,
    unlocked: xp >= r.xp,
    percent: Math.min(100, (xp / r.xp) * 100),
  }));

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-10 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-sky-700 mb-6 text-center">Gamification Progress</h2>
      {/* XP Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-gray-700">Total XP</span>
          <span className="text-xl font-bold text-green-600">{xp}</span>
        </div>
        <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden mb-2">
          <div
            className="absolute top-0 left-0 h-6 bg-gradient-to-r from-sky-500 to-teal-500 transition-all"
            style={{ width: `${xpBarPercent}%` }}
          ></div>
          {/* Milestone markers */}
          {LEVELS.map(l => (
            <div
              key={l.level}
              className="absolute top-0 h-6 border-l-2 border-dashed border-sky-300"
              style={{ left: `${((l.min) / 750) * 100}%` }}
            >
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-sky-400">Lv{l.level}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>Level {level}</span>
          {nextLevel ? (
            <span>{xpToNext} XP to Level {nextLevel.level}</span>
          ) : (
            <span>Max Level</span>
          )}
        </div>
      </div>
      {/* Badges */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-3">Badges</h3>
        <div className="grid grid-cols-2 gap-4">
          {earnedBadges.map(badge => (
            <div key={badge.key} className={`rounded-xl shadow p-4 flex flex-col items-center ${badge.color} relative group transition-transform hover:scale-105`}>
              {badge.icon}
              <span className="font-bold text-gray-800 mt-2">{badge.name}</span>
              <span className="text-xs text-gray-600 group-hover:block hidden absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-white border rounded shadow px-2 py-1 z-10">{badge.desc}</span>
              <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">Earned</span>
            </div>
          ))}
          {lockedBadges.map(badge => (
            <div key={badge.key} className="rounded-xl shadow p-4 flex flex-col items-center bg-gray-100 opacity-60 relative group">
              {badge.icon}
              <span className="font-bold text-gray-400 mt-2">{badge.name}</span>
              <span className="text-xs text-gray-400 group-hover:block hidden absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-white border rounded shadow px-2 py-1 z-10">{badge.desc}</span>
              <span className="absolute top-2 right-2 bg-gray-400 text-white text-xs px-2 py-1 rounded-full flex items-center"><Lock className="w-3 h-3 mr-1" />Locked</span>
            </div>
          ))}
        </div>
      </div>
      {/* Rewards */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-3">Rewards</h3>
        <div className="space-y-4">
          {rewardProgress.map(r => (
            <div key={r.key} className="bg-gray-50 rounded-lg p-4 flex items-center gap-4 shadow-sm">
              <Gift className={`w-8 h-8 ${r.unlocked ? 'text-green-500' : 'text-gray-400'}`} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${r.unlocked ? 'text-green-700' : 'text-gray-700'}`}>{r.name}</span>
                  {r.unlocked && <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Unlocked</span>}
                </div>
                <span className="text-xs text-gray-500">{r.desc}</span>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                  <div
                    className={`h-2 rounded-full ${r.unlocked ? 'bg-green-400' : 'bg-sky-300'}`}
                    style={{ width: `${r.percent}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-xs text-gray-500 w-16 text-right">{Math.min(100, Math.round(r.percent))}%</span>
            </div>
          ))}
        </div>
      </div>
      {/*
        // For future: Add framer-motion/animation for badge unlock
        // Add react-hot-toast for XP/badge notifications
      */}
    </div>
  );
};

export default GamificationPanel; 