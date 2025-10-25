import React, { useState } from 'react';

export default function EventForm({ onSubmit, onCancel, isLoading, initialData = {} }) {
  const [formData, setFormData] = useState({
    name: initialData.name || initialData.title || '',
    location: initialData.location || '',
    date: initialData.date || initialData.dateTime || '',
    time: initialData.time || '',
    description: initialData.description || '',
    maxParticipants: initialData.maxParticipants || 50,
    contactEmail: initialData.contactEmail || '',
    contactPhone: initialData.contactPhone || '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (typeof onSubmit === 'function') {
      // Combine date and time for the API in proper ISO format
      let dateTime = formData.date;
      if (formData.time) {
        // Ensure time is in HH:MM format and combine with date
        dateTime = `${formData.date}T${formData.time}:00`;
      } else {
        // If no time provided, default to 09:00 AM
        dateTime = `${formData.date}T09:00:00`;
      }
      
      const eventData = {
        ...formData,
        dateTime: dateTime
      };
      onSubmit(eventData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Event Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            placeholder="Beach Cleanup Drive"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location *</label>
          <input
            id="location"
            name="location"
            type="text"
            required
            value={formData.location}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            placeholder="Juhu Beach, Mumbai"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date *</label>
          <input
            id="date"
            name="date"
            type="date"
            required
            value={formData.date}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          />
        </div>

        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
          <input
            id="time"
            name="time"
            type="time"
            value={formData.time}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description *</label>
        <textarea
          id="description"
          name="description"
          rows="4"
          required
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          placeholder="Share details about the cleanup plan, what volunteers should bring, safety guidelines, etc."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700">Max Participants</label>
          <input
            id="maxParticipants"
            name="maxParticipants"
            type="number"
            min="1"
            max="1000"
            value={formData.maxParticipants}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          />
        </div>

        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">Contact Email</label>
          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            value={formData.contactEmail}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            placeholder="contact@ngo.org"
          />
        </div>

        <div>
          <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">Contact Phone</label>
          <input
            id="contactPhone"
            name="contactPhone"
            type="tel"
            value={formData.contactPhone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            placeholder="+91 98765 43210"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-60 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Event'}
        </button>
      </div>
    </form>
  );
}

