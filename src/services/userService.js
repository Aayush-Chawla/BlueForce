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

export async function getAllUsers({role,verified,page=0,size=25}={}) {
  const token = localStorage.getItem('authToken');
  const params = [];
  if (role) params.push(`role=${encodeURIComponent(role)}`);
  if (typeof verified === 'boolean') params.push(`verified=${verified}`);
  if (page !== undefined) params.push(`page=${page}`);
  if (size !== undefined) params.push(`size=${size}`);
  const url = `http://localhost:9090/api/users${params.length ? '?' + params.join('&') : ''}`;
  const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw json || { success:false, message:'Failed to fetch users' };
  return json;
}
