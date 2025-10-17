import React from 'react';
import { Calendar } from 'lucide-react';
import { events, getBadge } from '../../../utils/eventData';

const EventImpactTable = () => {
  return (
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
  );
};

export default EventImpactTable;


