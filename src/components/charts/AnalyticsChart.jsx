import React from 'react';
import { BarChart3, Users, Calendar, TrendingUp } from 'lucide-react';

const AnalyticsChart = ({ data = {} }) => {
  const labels = Array.isArray(data.labels) && data.labels.length > 0
    ? data.labels
    : (Array.isArray(data.monthlyEvents) ? data.monthlyEvents.map((_, idx) => `M${idx + 1}`) : []);

  const monthlyEvents = Array.isArray(data.monthlyEvents) ? data.monthlyEvents : [];
  const monthlyParticipants = Array.isArray(data.monthlyParticipants) ? data.monthlyParticipants : [];

  const maxEvents = monthlyEvents.length ? Math.max(...monthlyEvents) : 0;
  const maxParticipants = monthlyParticipants.length ? Math.max(...monthlyParticipants) : 0;
  const totalEvents = data.totalEvents ?? 0;
  const totalParticipants = data.totalParticipants ?? 0;
  const averageParticipants = totalEvents > 0 ? Math.round(totalParticipants / totalEvents) : 0;

  const growthRate = monthlyEvents.length >= 2
    ? Math.round(((monthlyEvents[monthlyEvents.length - 1] - monthlyEvents[monthlyEvents.length - 2]) /
        Math.max(monthlyEvents[monthlyEvents.length - 2], 1)) * 100)
    : null;
  const growthDisplay = growthRate === null ? '—' : `${growthRate > 0 ? '+' : ''}${growthRate}%`;

  const topEventIndex = monthlyEvents.length ? monthlyEvents.indexOf(Math.max(...monthlyEvents)) : null;
  const topParticipantsIndex = monthlyParticipants.length ? monthlyParticipants.indexOf(Math.max(...monthlyParticipants)) : null;

  const insights = [];
  if (totalEvents > 0 && averageParticipants >= 0) {
    insights.push(`Average ${averageParticipants} participants per event`);
  }
  if (topEventIndex !== null && monthlyEvents[topEventIndex] > 0) {
    insights.push(`Most events were organized in ${labels[topEventIndex] ?? 'this period'} (${monthlyEvents[topEventIndex]})`);
  }
  if (topParticipantsIndex !== null && monthlyParticipants[topParticipantsIndex] > 0) {
    insights.push(`Peak volunteer turnout was in ${labels[topParticipantsIndex] ?? 'this period'} (${monthlyParticipants[topParticipantsIndex]} volunteers)`);
  }
  if (growthDisplay !== '—') {
    insights.push(`Events changed ${growthDisplay} compared to last month`);
  }
  if (insights.length === 0) {
    insights.push('Add more events to unlock analytics insights.');
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Events</p>
              <p className="text-2xl font-bold">{totalEvents}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Participants</p>
              <p className="text-2xl font-bold">{totalParticipants}</p>
            </div>
            <Users className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Avg Participants</p>
              <p className="text-2xl font-bold">{averageParticipants}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Growth Rate</p>
              <p className="text-2xl font-bold">{growthDisplay}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Events per Month</h3>
          {monthlyEvents.length ? (
            <div className="flex items-end space-x-2 h-40">
              {monthlyEvents.map((events, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="bg-gradient-to-t from-sky-500 to-sky-400 rounded-t w-full transition-all duration-300 hover:from-sky-600 hover:to-sky-500"
                    style={{ height: maxEvents ? `${(events / maxEvents) * 100}%` : '4px', minHeight: '4px' }}
                  ></div>
                  <div className="text-xs text-gray-600 mt-2">{labels[index] ?? `M${index + 1}`}</div>
                  <div className="text-sm font-semibold text-gray-800">{events}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No monthly event data yet.</p>
          )}
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Participants per Month</h3>
          {monthlyParticipants.length ? (
            <div className="flex items-end space-x-2 h-40">
              {monthlyParticipants.map((participants, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="bg-gradient-to-t from-teal-500 to-teal-400 rounded-t w-full transition-all duration-300 hover:from-teal-600 hover:to-teal-500"
                    style={{ height: maxParticipants ? `${(participants / maxParticipants) * 100}%` : '4px', minHeight: '4px' }}
                  ></div>
                  <div className="text-xs text-gray-600 mt-2">{labels[index] ?? `M${index + 1}`}</div>
                  <div className="text-sm font-semibold text-gray-800">{participants}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No participant data yet.</p>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-sky-50 to-teal-50 p-6 rounded-lg border border-sky-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-sky-600" />
          Key Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {insights.map((insight, idx) => (
            <div key={idx} className="flex items-start space-x-2">
              <div className={`w-2 h-2 rounded-full mt-2 ${idx % 4 === 0 ? 'bg-green-500' : idx % 4 === 1 ? 'bg-blue-500' : idx % 4 === 2 ? 'bg-purple-500' : 'bg-orange-500'}`}></div>
              <p className="text-gray-700">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;


