const API_BASE_URL = 'http://localhost:9090/api/chat';

class ChatService {
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

  async health() {
    const resp = await fetch(`${API_BASE_URL}/health`, { headers: this.getAuthHeaders() });
    return this.handleResponse(resp);
  }

  async listMessages() {
    const resp = await fetch(`${API_BASE_URL}/messages`, { headers: this.getAuthHeaders() });
    const json = await this.handleResponse(resp);
    return json.data?.items || [];
  }

  async sendMessage({ sender = 'user', text }) {
    const resp = await fetch(`${API_BASE_URL}/messages`, { method: 'POST', headers: this.getAuthHeaders(), body: JSON.stringify({ sender, text }) });
    return this.handleResponse(resp);
  }
}

export const chatService = new ChatService();
export default chatService;


