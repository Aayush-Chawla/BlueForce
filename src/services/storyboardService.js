const API_BASE_URL = 'http://localhost:9090/api/stories';

class StoryboardService {
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

  async list({ page = 0, limit = 25 } = {}) {
    const resp = await fetch(`${API_BASE_URL}?page=${page}&limit=${limit}`, { headers: this.getAuthHeaders() });
    const json = await this.handleResponse(resp);
    return json.data?.items || [];
  }
}

export const storyboardService = new StoryboardService();
export default storyboardService;


