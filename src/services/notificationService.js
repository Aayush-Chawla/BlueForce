const API_BASE_URL = 'http://localhost:9090/api';

class NotificationService {
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

  async getMyNotifications(page = 0, limit = 25) {
    const resp = await fetch(`${API_BASE_URL}/notifications?page=${page}&limit=${limit}`, { headers: this.getAuthHeaders() });
    const json = await this.handleResponse(resp);
    return json.data || { items: [], total: 0, page, limit };
  }
}

export const notificationService = new NotificationService();
export default notificationService;


