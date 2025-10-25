import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useEvents } from '../contexts';
import EventForm from '../components/forms/EventForm';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const CreateEvent = () => {
  const { user } = useAuth();
  const { addEvent, loading, error } = useEvents();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      await addEvent(eventData);
      setSuccessMessage('Event created successfully!');
      // Navigate to events page after a short delay
      setTimeout(() => {
        navigate('/events');
      }, 2000);
    } catch (error) {
      console.error('Error creating event:', error);
      setErrorMessage(error.message || 'Failed to create event. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/events');
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

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
              <p className="text-green-700">{successMessage}</p>
            </div>
          )}

          {/* Error Messages */}
          {(errorMessage || error) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <XCircle className="w-5 h-5 text-red-500 mr-3" />
              <p className="text-red-700">{errorMessage || error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-blue-500 mr-3 animate-spin" />
              <p className="text-blue-700">Creating event...</p>
            </div>
          )}

          <EventForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateEvent; 