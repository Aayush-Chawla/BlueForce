import React, { createContext, useContext, useState, useEffect } from 'react';
import { eventService } from '../services/eventService';
import { useAuth } from './AuthContext';

const EventContext = createContext(undefined);

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Load events from API
  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const eventsData = await eventService.getEvents();
      setEvents(eventsData || []);
    } catch (err) {
      console.error('Error loading events:', err);
      setError(err.message);
      // Fallback to empty array if API fails
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const addEvent = async (eventData) => {
    setLoading(true);
    setError(null);
    try {
      // Transform frontend data to match backend API
      const apiEventData = {
        title: eventData.name || eventData.title,
        description: eventData.description,
        location: eventData.location,
        dateTime: eventData.dateTime, // Use the properly formatted dateTime from form
        maxParticipants: eventData.maxParticipants || 50,
        contactEmail: eventData.contactEmail || user?.email,
        contactPhone: eventData.contactPhone || user?.phone
      };

      const newEvent = await eventService.createEvent(apiEventData);
      setEvents(prevEvents => [...prevEvents, newEvent]);
      return newEvent;
    } catch (err) {
      console.error('Error creating event:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (eventId, eventData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedEvent = await eventService.updateEvent(eventId, eventData);
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === eventId ? updatedEvent : event
        )
      );
      return updatedEvent;
    } catch (err) {
      console.error('Error updating event:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId) => {
    setLoading(true);
    setError(null);
    try {
      await eventService.deleteEvent(eventId);
      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
    } catch (err) {
      console.error('Error deleting event:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const joinEvent = async (eventId, userId) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Attempting to join event:', eventId, 'for user:', userId);
      console.log('Auth token:', localStorage.getItem('authToken'));
      console.log('User from context:', user);
      
      const enrollmentData = {
        userId: parseInt(userId), // Convert to number as backend expects Long
        message: 'Joining the event' // Optional message
      };
      
      console.log('Enrollment data:', enrollmentData);
      const result = await eventService.enrollInEvent(eventId, enrollmentData);
      console.log('Join event result:', result);
      
      // Refresh the events to get updated participant count
      await loadEvents();
      
      return result;
    } catch (err) {
      console.error('Error joining event:', err);
      console.error('Error details:', err.message, err.status, err.response);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const leaveEvent = async (eventId, userId) => {
    setLoading(true);
    setError(null);
    try {
      // First get participants to find the participant ID
      const participants = await eventService.getEventParticipants(eventId);
      const participant = participants.find(p => p.userId === userId);
      
      if (participant) {
        await eventService.cancelEnrollment(eventId, participant.id);
        // Refresh the events to get updated participant count
        await loadEvents();
      }
    } catch (err) {
      console.error('Error leaving event:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getEventParticipants = async (eventId) => {
    try {
      return await eventService.getEventParticipants(eventId);
    } catch (err) {
      console.error('Error fetching participants:', err);
      setError(err.message);
      throw err;
    }
  };

  const updateParticipantStatus = async (eventId, participantId, statusData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await eventService.updateParticipantStatus(eventId, participantId, statusData);
      // Refresh events to get updated data
      await loadEvents();
      return result;
    } catch (err) {
      console.error('Error updating participant status:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshEvents = () => {
    return loadEvents();
  };

  const value = {
    events,
    loading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    joinEvent,
    leaveEvent,
    getEventParticipants,
    updateParticipantStatus,
    refreshEvents
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
}; 