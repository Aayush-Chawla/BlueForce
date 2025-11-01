const AUTH_API_BASE_URL = 'http://localhost:9090/api';

class AuthService {
  constructor() {
    this.baseURL = AUTH_API_BASE_URL;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Helper method to handle API responses
  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Login user
  async login(email, password) {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      const data = await this.handleResponse(response);
      // Store token and user data
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      // Compose user object from returned fields
      const user = {
        id: data.userId,
        email: data.email,
        role: data.role,
        verified: data.verified
      };
      localStorage.setItem('beachCleanupUser', JSON.stringify(user));
      return { user, token: data.token };
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  // Register user
  async register(userData) {
    try {
      const response = await fetch(`${this.baseURL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      const data = await this.handleResponse(response);
      // For registration, AuthResponse returns userId, email, role, verified but not token
      const user = {
        id: data.userId,
        email: data.email,
        role: data.role,
        verified: data.verified
      };
      localStorage.setItem('beachCleanupUser', JSON.stringify(user));
      return { user };
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  }

  // Logout user
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('beachCleanupUser');
  }

  // Get current user
  getCurrentUser() {
    const userStr = localStorage.getItem('beachCleanupUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }

  // Get auth token
  getToken() {
    return localStorage.getItem('authToken');
  }
}

// Create and export a singleton instance
export const authService = new AuthService();
export default authService;
