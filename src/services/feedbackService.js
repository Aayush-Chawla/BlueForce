const API_BASE_URL = 'http://localhost:9090/api';

class FeedbackService {
  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async handleResponse(response) {
    const json = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(json.message || `HTTP ${response.status}`);
      error.status = response.status;
      error.response = json;
      throw error;
    }
    return json;
  }

  async submit({ eventId, rating, feedback }) {
    const resp = await fetch(`${API_BASE_URL}/feedback`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ eventId, rating, feedback }),
    });
    return this.handleResponse(resp);
  }

  async list({ eventId, page = 0, limit = 50 } = {}) {
    const url = new URL(`${API_BASE_URL}/feedback`);
    if (eventId) url.searchParams.set('eventId', eventId);
    url.searchParams.set('page', page);
    url.searchParams.set('limit', limit);
    const resp = await fetch(url.toString(), { headers: this.getAuthHeaders() });
    const json = await this.handleResponse(resp);
    return json.data || { items: [], total: 0, page, limit };
  }
}

export const feedbackService = new FeedbackService();
export default feedbackService;


