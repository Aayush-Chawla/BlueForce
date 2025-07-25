import React, { useRef, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import html2canvas from 'html2canvas';
import { ArrowUpRight, ArrowDownRight, Download, Award, Users, Trash2, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import GamificationPanel from '../components/GamificationPanel';
const events = [
  {
    id: 'e456',
    name: 'Juhu Beach Cleanup',
    location: 'Juhu Beach, Mumbai',
    date: '2025-07-28',
    wasteCollected: 45,
    volunteers: 32,
    xpDistributed: 1280,
    sponsor: 'Acme Corp',
  },
  {
    id: 'e789',
    name: 'Versova Drive',
    location: 'Versova Beach, Mumbai',
    date: '2025-08-01',
    wasteCollected: 64,
    volunteers: 50,
    xpDistributed: 2100,
    sponsor: 'GreenFuture Ltd',
  },
  {
    id: 'e101',
    name: 'Marine Lines Cleanup',
    location: 'Marine Lines, Mumbai',
    date: '2025-08-15',
    wasteCollected: 18,
    volunteers: 15,
    xpDistributed: 600,
    sponsor: 'Acme Corp',
  },
];

const COLORS = ['#0ea5e9', '#14b8a6', '#f59e42', '#6366f1', '#f43f5e'];

// KPI mock metrics
const kpi = {
  events: events.length,
  waste: events.reduce((sum, e) => sum + e.wasteCollected, 0),
  volunteers: events.reduce((sum, e) => sum + e.volunteers, 0),
  xp: events.reduce((sum, e) => sum + e.xpDistributed, 0),
  // For demo, let's say all are up except volunteers
  growth: {
    events: true,
    waste: true,
    volunteers: false,
    xp: true,
  }
};

function getBadge(event) {
  if (event.wasteCollected > 50) return { label: 'Gold', color: 'bg-yellow-400 text-yellow-900' };
  if (event.wasteCollected >= 25) return { label: 'Silver', color: 'bg-gray-300 text-gray-800' };
  return { label: 'Bronze', color: 'bg-amber-700 text-amber-100' };
}

const CSRImpact = () => {
  const barChartRef = useRef();
  const pieChartRef = useRef();

  const exportChart = async (ref, filename) => {
    if (!ref.current) return;
    const canvas = await html2canvas(ref.current, { backgroundColor: '#fff', scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imgData;
    link.download = filename;
    link.click();
  };

  const [showGamification, setShowGamification] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 py-8 px-4">
      {/* HEADER */}
      <div className="container mx-auto max-w-6xl mb-8">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent">CSR Impact Dashboard</h1>
          <p className="text-gray-600 text-lg mb-4">Track your environmental contribution and social outreach</p>
          <div className="h-1 w-32 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full"></div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Events Sponsored */}
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">Beach Events Sponsored</p>
              <p className="text-3xl font-bold text-gray-800">{kpi.events}</p>
              <span className="mt-2 flex items-center text-green-600 font-semibold text-sm">
                {kpi.growth.events ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1 text-red-500" />} 12%
              </span>
            </div>
            <div className="p-3 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        {/* Waste Collected */}
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">Waste Collected (kg)</p>
              <p className="text-3xl font-bold text-gray-800">{kpi.waste}</p>
              <span className="mt-2 flex items-center text-green-600 font-semibold text-sm">
                {kpi.growth.waste ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1 text-red-500" />} 8%
              </span>
            </div>
            <div className="p-3 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full">
              <Trash2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        {/* Volunteers Engaged */}
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">Volunteers Engaged</p>
              <p className="text-3xl font-bold text-gray-800">{kpi.volunteers}</p>
              <span className="mt-2 flex items-center text-red-500 font-semibold text-sm">
                {kpi.growth.volunteers ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />} 2%
              </span>
            </div>
            <div className="p-3 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        {/* XP Distributed */}
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">XP Distributed</p>
              <p className="text-3xl font-bold text-gray-800">{kpi.xp}</p>
              <span className="mt-2 flex items-center text-green-600 font-semibold text-sm">
                {kpi.growth.xp ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1 text-red-500" />} 15%
              </span>
            </div>
            <div className="p-3 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full">
              <Award className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Gamification Panel Toggle */}
      <div className="container mx-auto max-w-6xl mb-8">
        <button 
          onClick={() => setShowGamification(!showGamification)}
          className="w-full bg-white rounded-xl shadow-md p-4 flex items-center justify-between hover:bg-sky-50 transition-colors"
        >
          <span className="font-semibold text-sky-700 flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Gamification Progress
          </span>
          {showGamification ? 
            <ChevronUp className="w-5 h-5 text-sky-700" /> : 
            <ChevronDown className="w-5 h-5 text-sky-700" />}
        </button>
        
        {/* Gamification Panel - Collapsible */}
        {showGamification && (
          <div className="animate-fade-in transition-opacity duration-700 mt-4">
            <GamificationPanel />
          </div>
        )}  
      </div>
      {/* EVENT IMPACT TABLE */}
      <div className="container mx-auto max-w-6xl bg-white rounded-xl shadow-lg p-6 mb-8 overflow-x-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-sky-500" />
          Event-wise Impact
        </h2>
        <div className="h-0.5 w-16 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full mb-6"></div>
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="bg-sky-50 rounded-lg">
              <th className="py-3 px-4 font-semibold text-sky-700">Event Name</th>
              <th className="py-3 px-4 font-semibold text-sky-700">Location</th>
              <th className="py-3 px-4 font-semibold text-sky-700">Date</th>
              <th className="py-3 px-4 font-semibold text-sky-700">Waste Collected</th>
              <th className="py-3 px-4 font-semibold text-sky-700">XP</th>
              <th className="py-3 px-4 font-semibold text-sky-700">Volunteers</th>
              <th className="py-3 px-4 font-semibold text-sky-700">CSR Sponsor</th>
              <th className="py-3 px-4 font-semibold text-sky-700">Badge</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => {
              const badge = getBadge(event);
              return (
                <tr key={event.id} className="border-b last:border-0 hover:bg-sky-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-800">{event.name}</td>
                  <td className="py-3 px-4 text-gray-600">{event.location}</td>
                  <td className="py-3 px-4 text-gray-600">{event.date}</td>
                  <td className="py-3 px-4 text-gray-600">{event.wasteCollected} kg</td>
                  <td className="py-3 px-4 text-gray-600">{event.xpDistributed}</td>
                  <td className="py-3 px-4 text-gray-600">{event.volunteers}</td>
                  <td className="py-3 px-4 text-gray-600">{event.sponsor}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge.color}`}>{badge.label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* CHARTS SECTION */}
      <div className="container mx-auto max-w-6xl grid md:grid-cols-2 gap-8 mb-8">
        {/* Bar Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-shadow">
          <div className="w-full flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Trash2 className="w-4 h-4 mr-2 text-sky-500" />
              Waste Collected by Event
            </h3>
            <button
              onClick={() => exportChart(barChartRef, 'waste_by_event.png')}
              className="px-3 py-2 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-full hover:from-sky-600 hover:to-teal-600 text-sm flex items-center transition-all transform hover:scale-105"
            >
              <Download className="w-4 h-4 mr-1" /> Download
            </button>
          </div>
          <div className="h-0.5 w-16 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full mb-4 self-start"></div>
          <div ref={barChartRef} className="w-full h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={events} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: '#e0e0e0' }} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: '#e0e0e0' }} />
                <Tooltip cursor={{ fill: 'rgba(14, 165, 233, 0.1)' }} />
                <Legend wrapperStyle={{ paddingTop: 10 }} />
                <Bar dataKey="wasteCollected" fill="#0ea5e9" name="Waste Collected (kg)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-shadow">
          <div className="w-full flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Award className="w-4 h-4 mr-2 text-sky-500" />
              XP Distribution by Event
            </h3>
            <button
              onClick={() => exportChart(pieChartRef, 'xp_distribution.png')}
              className="px-3 py-2 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-full hover:from-sky-600 hover:to-teal-600 text-sm flex items-center transition-all transform hover:scale-105"
            >
              <Download className="w-4 h-4 mr-1" /> Download
            </button>
          </div>
          <div className="h-0.5 w-16 bg-gradient-to-r from-sky-500 to-teal-500 rounded-full mb-4 self-start"></div>
          <div ref={pieChartRef} className="w-full h-[280px] flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <Pie
                  data={events}
                  dataKey="xpDistributed"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={40}
                  paddingAngle={2}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {events.map((entry, index) => (
                    <Cell key={`cell-xp-${index}`} fill={COLORS[index % COLORS.length]} stroke="#fff" strokeWidth={1} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} XP`, 'XP Distributed']} />
                <Legend iconType="circle" layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSRImpact;