const API_BASE_URL = 'http://localhost:9090/api';

class AnalyticsService {
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

  async overview() {
    const resp = await fetch(`${API_BASE_URL}/analytics/overview`, { headers: this.getAuthHeaders() });
    return this.handleResponse(resp);
  }

  async eventStats(eventId) {
    const resp = await fetch(`${API_BASE_URL}/analytics/events?eventId=${eventId}`, { headers: this.getAuthHeaders() });
    return this.handleResponse(resp);
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;


