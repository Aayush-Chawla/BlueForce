import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useEvents } from '../contexts';
import { EventForm } from '../features/ngo/components';

const CreateEvent = () => {
  const { user } = useAuth();
  const { addEvent } = useEvents();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  if (!user || user.role !== 'ngo') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600">Only NGO organizers can create events.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (eventData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Add the event with organizer information
      addEvent({
        ...eventData,
        organizer: user,
        participants: [],
        status: 'upcoming'
      });
      // Show success message
      alert('Event created successfully!');
      // Navigate to events page to see the created event
      navigate('/events');
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Create Beach Cleaning Event</h1>
            <p className="text-gray-600">
              Organize a new beach cleaning event and inspire others to join your cause
            </p>
          </div>
          <EventForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateEvent; 