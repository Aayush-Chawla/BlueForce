const API_BASE_URL = 'http://localhost:9090/api';

class EventService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Helper method to handle API responses
  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
      error.status = response.status;
      error.response = errorData;
      throw error;
    }
    return response.json();
  }

  // Get all events
  async getEvents() {
    try {
      const response = await fetch(`${this.baseURL}/events`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }

  // Get event by ID
  async getEventById(eventId) {
    try {
      const response = await fetch(`${this.baseURL}/events/${eventId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching event:', error);
      throw error;
    }
  }

  // Create new event with imageUrl
  async createEvent(eventData) {
    try {
      const response = await fetch(`${this.baseURL}/events`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(eventData)
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  // Update event with imageUrl
  async updateEvent(eventId, eventData) {
    try {
      const response = await fetch(`${this.baseURL}/events/${eventId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(eventData)
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }

  // Delete event
  async deleteEvent(eventId) {
    try {
      const response = await fetch(`${this.baseURL}/events/${eventId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }

  // Enroll in event
  async enrollInEvent(eventId, enrollmentData) {
    try {
      const response = await fetch(`${this.baseURL}/events/${eventId}/enroll`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(enrollmentData)
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error enrolling in event:', error);
      throw error;
    }
  }

  // Leave/cancel participation
  async leaveEvent(eventId) {
    try {
      const response = await fetch(`${this.baseURL}/events/${eventId}/enroll`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error leaving event:', error);
      throw error;
    }
  }

  // Get event participants
  async getEventParticipants(eventId) {
    try {
      const response = await fetch(`${this.baseURL}/events/${eventId}/participants`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      const json = await this.handleResponse(response);
      return json.participants || [];
    } catch (error) {
      throw error;
    }
  }

  // Cancel enrollment
  async cancelEnrollment(eventId) {
    try {
      const response = await fetch(`${this.baseURL}/events/${eventId}/enroll`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error canceling enrollment:', error);
      throw error;
    }
  }

  // Update participant status
  async updateParticipantStatus(eventId, participantId, status, reason='') {
    try {
      const response = await fetch(`${this.baseURL}/events/${eventId}/participants/${participantId}`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ status, reason })
      });
      return await this.handleResponse(response);
    } catch (error) {
      throw error;
    }
  }

  // Check user enrolled
  async isUserEnrolled(eventId, userId) {
    try {
      const response = await fetch(`${this.baseURL}/events/${eventId}/enrolled/${userId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      if (!response.ok) return false;
      const result = await response.json();
      return !!result.enrolled || (result === true);
    } catch (error) {
      return false;
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/events/health`);
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error checking service health:', error);
      throw error;
    }
  }

  // Get event stats for admin/NGO dashboard
  async getStatsOverview() {
    try {
      const response = await fetch(`${this.baseURL}/events/stats/overview`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      const json = await this.handleResponse(response);
      return json.stats || {};
    } catch(error) {
      throw error;
    }
  }
}

// Create and export a singleton instance
export const eventService = new EventService();
export default eventService;
