/**
 * Normalizes user roles to handle any case (lowercase, uppercase, mixed case)
 * @param {string} role - The role to normalize
 * @returns {string} - Normalized role in lowercase
 */
export const normalizeRole = (role) => {
  if (!role || typeof role !== 'string') return '';
  return role.trim().toLowerCase();
};

/**
 * Checks if a role is an NGO role (handles any case)
 * @param {string} role - The role to check
 * @returns {boolean}
 */
export const isNgoRole = (role) => {
  const normalized = normalizeRole(role);
  return normalized === 'ngo';
};

/**
 * Checks if a role is a Participant role (handles any case)
 * @param {string} role - The role to check
 * @returns {boolean}
 */
export const isParticipantRole = (role) => {
  const normalized = normalizeRole(role);
  return normalized === 'participant' || normalized === 'volunteer';
};

/**
 * Checks if a role is an Admin role (handles any case)
 * @param {string} role - The role to check
 * @returns {boolean}
 */
export const isAdminRole = (role) => {
  const normalized = normalizeRole(role);
  return normalized === 'admin' || normalized === 'superadmin';
};

/**
 * Gets the display name for a role (handles any case)
 * @param {string} role - The role to get display name for
 * @returns {string} - Display name for the role
 */
export const getRoleDisplayName = (role) => {
  const normalized = normalizeRole(role);
  
  if (normalized === 'ngo') return 'NGO';
  if (normalized === 'participant' || normalized === 'volunteer') return 'Participant';
  if (normalized === 'admin') return 'Admin';
  if (normalized === 'superadmin') return 'Super Admin';
  
  // Return capitalized version if unknown
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

/**
 * Normalizes role for filtering (returns lowercase 'ngo' or 'participant')
 * @param {string} role - The role to normalize for filtering
 * @returns {string} - Normalized role for filtering
 */
export const normalizeRoleForFilter = (role) => {
  const normalized = normalizeRole(role);
  
  if (normalized === 'ngo') return 'ngo';
  if (normalized === 'participant' || normalized === 'volunteer') return 'participant';
  if (normalized === 'admin' || normalized === 'superadmin') return 'admin';
  
  return normalized;
};


