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
      const error = new Error(json.message || json.error || `HTTP ${response.status}`);
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

  /**
   * Get all conversations for a user
   */
  async getConversations(userId) {
    const resp = await fetch(`${API_BASE_URL}/conversations?userId=${userId}`, { 
      headers: this.getAuthHeaders() 
    });
    const json = await this.handleResponse(resp);
    return json.data?.items || [];
  }

  /**
   * Get messages for a specific conversation
   */
  async getMessages(conversationId) {
    const resp = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`, { 
      headers: this.getAuthHeaders() 
    });
    const json = await this.handleResponse(resp);
    return json.data?.items || [];
  }

  /**
   * Send a message in a conversation
   */
  async sendMessage({ senderId, receiverId, text, ngoId, participantId }) {
    const payload = {
      senderId,
      receiverId,
      text,
      ...(ngoId && { ngoId }),
      ...(participantId && { participantId }),
    };
    const resp = await fetch(`${API_BASE_URL}/messages`, { 
      method: 'POST', 
      headers: this.getAuthHeaders(), 
      body: JSON.stringify(payload) 
    });
    return this.handleResponse(resp);
  }

  /**
   * Get or create a conversation between NGO and Participant
   */
  async getOrCreateConversation(ngoId, participantId) {
    const resp = await fetch(`${API_BASE_URL}/conversations`, { 
      method: 'POST', 
      headers: this.getAuthHeaders(), 
      body: JSON.stringify({ ngoId, participantId }) 
    });
    const json = await this.handleResponse(resp);
    return json.data;
  }

  // Legacy methods for backward compatibility
  async listMessages() {
    // This is deprecated - use getMessages(conversationId) instead
    const resp = await fetch(`${API_BASE_URL}/messages`, { headers: this.getAuthHeaders() });
    const json = await this.handleResponse(resp);
    return json.data?.items || [];
  }
}

export const chatService = new ChatService();
export default chatService;


