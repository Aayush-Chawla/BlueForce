const API_BASE_URL = 'http://localhost:9090/api';

class MediaService {
  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
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

  async upload(file) {
    const form = new FormData();
    form.append('file', file);
    const resp = await fetch(`${API_BASE_URL}/media/upload`, { method: 'POST', headers: this.getAuthHeaders(), body: form });
    const json = await this.handleResponse(resp);
    return json.data?.url;
  }
}

export const mediaService = new MediaService();
export default mediaService;


