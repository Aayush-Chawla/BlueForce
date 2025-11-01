const API_BASE_URL = 'http://localhost:9090/api';

class CertificateService {
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

  async getTemplates(page = 0, limit = 25) {
    const resp = await fetch(`${API_BASE_URL}/certificates/templates?page=${page}&limit=${limit}`, {
      headers: this.getAuthHeaders(),
    });
    const json = await this.handleResponse(resp);
    return json.data || { items: [], total: 0, page, limit };
  }

  async createTemplate(template) {
    const resp = await fetch(`${API_BASE_URL}/certificates/templates`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(template),
    });
    return this.handleResponse(resp);
  }

  async updateTemplate(id, template) {
    const resp = await fetch(`${API_BASE_URL}/certificates/templates/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(template),
    });
    return this.handleResponse(resp);
  }

  async issueCertificate({ participantId, eventId, templateId, type }) {
    const resp = await fetch(`${API_BASE_URL}/certificates/issue`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ participantId, eventId, templateId, type }),
    });
    return this.handleResponse(resp);
  }

  async getMyCertificates(participantId, page = 0, limit = 50) {
    const resp = await fetch(`${API_BASE_URL}/certificates?participantId=${participantId}&page=${page}&limit=${limit}`, {
      headers: this.getAuthHeaders(),
    });
    const json = await this.handleResponse(resp);
    return json.data || { items: [], total: 0, page, limit };
  }
}

export const certificateService = new CertificateService();
export default certificateService;




