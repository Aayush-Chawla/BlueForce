const API_BASE_URL = 'http://localhost:9090/api';

class BadgeService {
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

  async getUserBadges(userId) {
    const resp = await fetch(`${API_BASE_URL}/badges/users/${userId}`, { headers: this.getAuthHeaders() });
    const json = await this.handleResponse(resp);
    return json.data?.badges || [];
  }
}

export const badgeService = new BadgeService();
export default badgeService;


