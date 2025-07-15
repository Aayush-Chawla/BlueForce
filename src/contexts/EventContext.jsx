import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockEvents } from '../utils/mockData';

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

  useEffect(() => {
    // Load events from localStorage or use mock data
    const savedEvents = localStorage.getItem('beachCleanupEvents');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    } else {
      setEvents(mockEvents);
      localStorage.setItem('beachCleanupEvents', JSON.stringify(mockEvents));
    }
  }, []);

  const saveEvents = (newEvents) => {
    setEvents(newEvents);
    localStorage.setItem('beachCleanupEvents', JSON.stringify(newEvents));
  };

  const addEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      participants: []
    };
    const newEvents = [...events, newEvent];
    saveEvents(newEvents);
  };

  const updateEvent = (id, eventData) => {
    const newEvents = events.map(event =>
      event.id === id ? { ...event, ...eventData } : event
    );
    saveEvents(newEvents);
  };

  const deleteEvent = (id) => {
    const newEvents = events.filter(event => event.id !== id);
    saveEvents(newEvents);
  };

  const joinEvent = (eventId, userId) => {
    const newEvents = events.map(event => {
      if (event.id === eventId) {
        const userAlreadyJoined = event.participants.some(p => p.id === userId);
        if (!userAlreadyJoined && event.participants.length < event.maxParticipants) {
          // In a real app, we'd fetch the full user data
          const mockUser = {
            id: userId,
            name: 'Current User',
            email: 'user@example.com',
            role: 'participant'
          };
          return {
            ...event,
            participants: [...event.participants, mockUser]
          };
        }
      }
      return event;
    });
    saveEvents(newEvents);
  };

  const leaveEvent = (eventId, userId) => {
    const newEvents = events.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          participants: event.participants.filter(p => p.id !== userId)
        };
      }
      return event;
    });
    saveEvents(newEvents);
  };

  const value = {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    joinEvent,
    leaveEvent
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
}; 