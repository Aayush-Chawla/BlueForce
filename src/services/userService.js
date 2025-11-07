// Fetch current user's profile
export async function getProfile() {
  const token = localStorage.getItem('authToken');
  const res = await fetch('http://localhost:9090/api/users/me', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw (data && data.message) ? data : { message: 'Failed to fetch profile' };
  }
  return await res.json();
}

// Update user profile (participant)
export async function updateProfileParticipant(profile) {
  const token = localStorage.getItem('authToken');
  const res = await fetch('http://localhost:9090/api/users/me/participant', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(profile)
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw json || { message: 'Failed to update profile', success: false };
  }
  return json;
}

export async function getUserById(id) {
  const token = localStorage.getItem('authToken');
  const res = await fetch(`http://localhost:9090/api/users/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw json || { success:false, message:'User not found' };
  return json;
}

/**
 * Fetches all users from the users database (blueforce_userdb)
 * This endpoint routes through API Gateway to user-service which queries the 'users' table
 * NOT the auth_users table - this is the correct database for user management
 * 
 * @param {Object} options - Query parameters
 * @param {string} options.role - Filter by role (NGO, PARTICIPANT, ADMIN, etc.)
 * @param {boolean} options.verified - Filter by verification status
 * @param {number} options.page - Page number (0-indexed)
 * @param {number} options.size - Page size
 * @returns {Promise<Object>} Response with { success: true, users: [...], total: number, page: number, size: number }
 */
export async function getAllUsers({role,verified,page=0,size=25}={}) {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    console.error('No auth token found');
    throw { success: false, message: 'Authentication required. Please log in.' };
  }
  
  const params = [];
  if (role) params.push(`role=${encodeURIComponent(role)}`);
  if (typeof verified === 'boolean') params.push(`verified=${verified}`);
  if (page !== undefined) params.push(`page=${page}`);
  if (size !== undefined) params.push(`size=${size}`);
  
  // This endpoint routes to user-service which queries the 'users' table in blueforce_userdb database
  const url = `http://localhost:9090/api/users${params.length ? '?' + params.join('&') : ''}`;
  
  console.log('Fetching users from user-service (users database):', url);
  console.log('Database: blueforce_userdb, Table: users');
  console.log('With token:', token ? 'Token present' : 'No token');
  
  try {
    const res = await fetch(url, { 
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      } 
    });
    
    console.log('Response status:', res.status, res.statusText);
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: `HTTP ${res.status}: ${res.statusText}` }));
      console.error('API Error:', errorData);
      throw errorData || { success: false, message: `Failed to fetch users: ${res.status} ${res.statusText}` };
    }
    
    const json = await res.json();
    console.log('API Response received:', json);
    return json;
  } catch (error) {
    console.error('Fetch error:', error);
    if (error.message) {
      throw error;
    }
    throw { success: false, message: 'Network error. Please check your connection.' };
  }
}
