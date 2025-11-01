const API_BASE_URL = 'http://localhost:9090/api/eco-tips';

class EcoTipsService {
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

  async listTips({ page = 0, limit = 25 } = {}) {
    const resp = await fetch(`${API_BASE_URL}/tips?page=${page}&limit=${limit}`, { headers: this.getAuthHeaders() });
    const json = await this.handleResponse(resp);
    return json.data || { items: [], total: 0, page, limit };
  }

  async createTip(tip) {
    const resp = await fetch(`${API_BASE_URL}/tips`, { method: 'POST', headers: this.getAuthHeaders(), body: JSON.stringify(tip) });
    return this.handleResponse(resp);
  }

  async updateTip(id, tip) {
    const resp = await fetch(`${API_BASE_URL}/tips/${id}`, { method: 'PUT', headers: this.getAuthHeaders(), body: JSON.stringify(tip) });
    return this.handleResponse(resp);
  }

  async deleteTip(id) {
    const resp = await fetch(`${API_BASE_URL}/tips/${id}`, { method: 'DELETE', headers: this.getAuthHeaders() });
    if (resp.status === 204) return { success: true };
    return this.handleResponse(resp);
  }

  async listFaqs() {
    const resp = await fetch(`${API_BASE_URL}/faqs`, { headers: this.getAuthHeaders() });
    const json = await this.handleResponse(resp);
    return json.data?.items || [];
  }

  async listQuiz() {
    const resp = await fetch(`${API_BASE_URL}/quiz`, { headers: this.getAuthHeaders() });
    const json = await this.handleResponse(resp);
    return json.data?.items || [];
  }
}

export const ecoTipsService = new EcoTipsService();
export default ecoTipsService;


