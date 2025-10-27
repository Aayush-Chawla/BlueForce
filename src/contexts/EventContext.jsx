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
      
      // Ensure userId is properly converted to number
      const numericUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
      console.log('Converted userId:', numericUserId);
      
      const enrollmentData = {
        userId: numericUserId, // Convert to number as backend expects Long
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
      
      // Handle specific error cases
      if (err.status === 400 && err.response && err.response.error) {
        if (err.response.error.includes('already enrolled')) {
          setError('You are already enrolled in this event');
        } else if (err.response.error.includes('Event is full')) {
          setError('This event is full and cannot accept more participants');
        } else if (err.response.error.includes('inactive event')) {
          setError('This event is no longer accepting participants');
        } else if (err.response.error.includes('past event')) {
          setError('Cannot join events that have already occurred');
        } else {
          setError(err.response.error);
        }
      } else {
        setError(err.message);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const leaveEvent = async (eventId, userId) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Leaving event:', eventId, 'for user:', userId);
      
      // First check if user is actually enrolled
      const isEnrolled = await eventService.isUserEnrolled(eventId, userId);
      console.log('User enrollment status before leaving:', isEnrolled);
      
      if (!isEnrolled) {
        throw new Error('You are not currently enrolled in this event');
      }
      
      // Use the simplified cancelEnrollment method that extracts user ID from JWT
      await eventService.cancelEnrollment(eventId);
      
      // Refresh the events to get updated participant count
      await loadEvents();
      
      console.log('Successfully left event');
    } catch (err) {
      console.error('Error leaving event:', err);
      console.error('Error details:', err.message, err.status, err.response);
      
      // Handle specific error cases
      if (err.status === 400 && err.response && err.response.error) {
        if (err.response.error.includes('not currently enrolled')) {
          setError('You are not currently enrolled in this event');
        } else if (err.response.error.includes('Enrollment not found')) {
          setError('No enrollment found for this event');
        } else {
          setError(err.response.error);
        }
      } else {
        setError(err.message);
      }
      
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