const API_BASE_URL = 'http://localhost:9090/api';

class NgoService {
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

  async list({ verified, page = 0, limit = 25 } = {}) {
    const params = new URLSearchParams();
    if (verified !== undefined) params.set('verified', verified);
    params.set('page', String(page));
    params.set('limit', String(limit));
    const resp = await fetch(`${API_BASE_URL}/ngos?${params.toString()}`, { headers: this.getAuthHeaders() });
    return this.handleResponse(resp);
  }

  async create(ngo) {
    const resp = await fetch(`${API_BASE_URL}/ngos`, { method: 'POST', headers: this.getAuthHeaders(), body: JSON.stringify(ngo) });
    return this.handleResponse(resp);
  }
}

export const ngoService = new NgoService();
export default ngoService;


