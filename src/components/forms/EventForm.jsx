import React, { useState } from 'react';

export default function EventForm({ onSubmit, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    date: '',
    description: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (typeof onSubmit === 'function') {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Event Name</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          placeholder="Beach Cleanup"
        />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
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

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
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
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          name="description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          placeholder="Share details about the cleanup plan, volunteers, etc."
        />
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-60"
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Event'}
        </button>
      </div>
    </form>
  );
}

