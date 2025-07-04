import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Event } from '../types';
import { mockEvents } from '../utils/mockData';

interface EventContextType {
  events: Event[];
  addEvent: (event: Omit<Event, 'id' | 'createdAt'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  joinEvent: (eventId: string, userId: string) => void;
  leaveEvent: (eventId: string, userId: string) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

interface EventProviderProps {
  children: ReactNode;
}

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);

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

  const saveEvents = (newEvents: Event[]) => {
    setEvents(newEvents);
    localStorage.setItem('beachCleanupEvents', JSON.stringify(newEvents));
  };

  const addEvent = (eventData: Omit<Event, 'id' | 'createdAt'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      participants: []
    };
    const newEvents = [...events, newEvent];
    saveEvents(newEvents);
  };

  const updateEvent = (id: string, eventData: Partial<Event>) => {
    const newEvents = events.map(event =>
      event.id === id ? { ...event, ...eventData } : event
    );
    saveEvents(newEvents);
  };

  const deleteEvent = (id: string) => {
    const newEvents = events.filter(event => event.id !== id);
    saveEvents(newEvents);
  };

  const joinEvent = (eventId: string, userId: string) => {
    const newEvents = events.map(event => {
      if (event.id === eventId) {
        const userAlreadyJoined = event.participants.some(p => p.id === userId);
        if (!userAlreadyJoined && event.participants.length < event.maxParticipants) {
          // In a real app, we'd fetch the full user data
          const mockUser = {
            id: userId,
            name: 'Current User',
            email: 'user@example.com',
            role: 'participant' as const
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

  const leaveEvent = (eventId: string, userId: string) => {
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