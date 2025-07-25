import React from 'react';
import { BarChart3, Users, Calendar, TrendingUp } from 'lucide-react';

const AnalyticsChart = ({ data }) => {
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const maxEvents = Math.max(...data.monthlyEvents);
  const maxParticipants = Math.max(...data.monthlyParticipants);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Events</p>
              <p className="text-2xl font-bold">{data.totalEvents}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Participants</p>
              <p className="text-2xl font-bold">{data.totalParticipants}</p>
            </div>
            <Users className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Avg Participants</p>
              <p className="text-2xl font-bold">{Math.round(data.totalParticipants / data.totalEvents)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Growth Rate</p>
              <p className="text-2xl font-bold">+23%</p>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Events Chart */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Events per Month</h3>
          <div className="flex items-end space-x-2 h-40">
            {data.monthlyEvents.map((events, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="bg-gradient-to-t from-sky-500 to-sky-400 rounded-t w-full transition-all duration-300 hover:from-sky-600 hover:to-sky-500"
                  style={{ height: `${(events / maxEvents) * 100}%`, minHeight: '4px' }}
                ></div>
                <div className="text-xs text-gray-600 mt-2">{months[index]}</div>
                <div className="text-sm font-semibold text-gray-800">{events}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Participants Chart */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Participants per Month</h3>
          <div className="flex items-end space-x-2 h-40">
            {data.monthlyParticipants.map((participants, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="bg-gradient-to-t from-teal-500 to-teal-400 rounded-t w-full transition-all duration-300 hover:from-teal-600 hover:to-teal-500"
                  style={{ height: `${(participants / maxParticipants) * 100}%`, minHeight: '4px' }}
                ></div>
                <div className="text-xs text-gray-600 mt-2">{months[index]}</div>
                <div className="text-sm font-semibold text-gray-800">{participants}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-sky-50 to-teal-50 p-6 rounded-lg border border-sky-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-sky-600" />
          Key Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <p className="text-gray-700">Your events are growing by 23% month over month</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <p className="text-gray-700">Average {Math.round(data.totalParticipants / data.totalEvents)} participants per event</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
            <p className="text-gray-700">Peak participation was in October with 60 volunteers</p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
            <p className="text-gray-700">Consider scheduling more events in high-participation months</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;