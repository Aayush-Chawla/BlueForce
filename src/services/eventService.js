// Use relative path so Vite dev proxy forwards to backend without CORS
const API_BASE_URL = '/api';

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
      const json = await this.handleResponse(response);
      // Backend returns { success: true, events: [...], total: X, page: Y, size: Z }
      // Extract the events array from the response
      return json.events || json || [];
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
      console.log('Sending event creation request:', eventData);
      const response = await fetch(`${this.baseURL}/events`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(eventData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Event creation failed:', response.status, errorData);
        const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
        error.status = response.status;
        error.response = errorData;
        throw error;
      }
      
      const result = await response.json();
      console.log('Event creation response:', result);
      return result;
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
      // Backend returns Boolean directly
      if (typeof result === 'boolean') {
        return result;
      }
      // Fallback: check if result has enrolled property
      return result.enrolled === true;
    } catch (error) {
      console.error('Error checking enrollment:', error);
      return false;
    }
  }

  // Get user's enrolled events
  async getUserEnrolledEvents(userId) {
    try {
      const response = await fetch(`${this.baseURL}/events/user/${userId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching user enrolled events:', error);
      throw error;
    }
  }

  // Get user's upcoming enrolled events
  async getUserUpcomingEvents(userId) {
    try {
      const response = await fetch(`${this.baseURL}/events/user/${userId}/upcoming`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching user upcoming events:', error);
      throw error;
    }
  }

  // Get user's past enrolled events
  async getUserPastEvents(userId) {
    try {
      const response = await fetch(`${this.baseURL}/events/user/${userId}/past`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching user past events:', error);
      throw error;
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

  // Submit waste collection data after attendance
  async submitWasteCollection(eventId, userId, wasteData) {
    try {
      // First, handle image upload if present
      let imageUrl = null;
      if (wasteData.image) {
        // Upload image to media service first
        const imageFormData = new FormData();
        imageFormData.append('file', wasteData.image);
        imageFormData.append('type', 'waste_collection');
        
        try {
          const token = localStorage.getItem('authToken');
          const imageResponse = await fetch(`${this.baseURL}/media/upload`, {
            method: 'POST',
            headers: {
              ...(token && { 'Authorization': `Bearer ${token}` })
              // Don't set Content-Type - browser will set it with boundary for FormData
            },
            body: imageFormData
          });
          
          if (imageResponse.ok) {
            const imageResult = await imageResponse.json();
            // Handle different response structures
            imageUrl = imageResult.data?.url || imageResult.url || imageResult.imageUrl || imageResult.data?.imageUrl;
            console.log('Image uploaded successfully:', imageUrl);
            console.log('Full image response:', imageResult);
          } else {
            const errorText = await imageResponse.text();
            console.warn('Image upload failed:', imageResponse.status, errorText);
            // Continue without image - don't fail the whole submission
          }
        } catch (imgError) {
          console.warn('Image upload error:', imgError);
          // Continue without image - don't fail the whole submission
        }
      }

      // Submit waste collection to backend
      const payload = {
        wasteCollected: wasteData.wasteCollected,
        wasteType: wasteData.wasteType || 'mixed',
        notes: wasteData.notes || null,
        imageUrl: imageUrl // This will be null if upload failed or no image provided
      };
      
      console.log('Submitting waste collection with payload:', { ...payload, imageUrl: imageUrl ? 'present' : 'null' });
      
      const response = await fetch(`${this.baseURL}/events/${eventId}/participants/${userId}/waste-collection`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      const result = await this.handleResponse(response);
      console.log('Waste collection submitted successfully:', result);
      return result;
    } catch (error) {
      console.error('Error submitting waste collection:', error);
      throw error;
    }
  }

  // Mark participant as attended
  async markAttendance(eventId, userId) {
    try {
      const response = await fetch(`${this.baseURL}/events/${eventId}/participants/${userId}/attendance`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ attended: true })
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error marking attendance:', error);
      // Don't throw error if endpoint doesn't exist yet
      console.warn('Attendance marking endpoint may not be implemented yet');
      return { success: true, message: 'Attendance marked (mock)' };
    }
  }

  // Get participant details for a specific event (to check if waste collection submitted)
  async getParticipantDetails(eventId, userId) {
    try {
      // Get all user's enrolled events and find the one matching this eventId
      const enrolledEvents = await this.getUserEnrolledEvents(userId);
      const participant = enrolledEvents.find(ep => ep.eventId === eventId || ep.eventId == eventId);
      return participant || null;
    } catch (error) {
      console.error('Error fetching participant details:', error);
      return null;
    }
  }
}

// Create and export a singleton instance
export const eventService = new EventService();
export default eventService;
