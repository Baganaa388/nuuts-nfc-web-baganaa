// api.js — API client for backend communication
const API_BASE = import.meta.env.VITE_API_BASE || '/api';

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    credentials: 'include'
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    // Handle both error formats: { error: "..." } and { error: { message: "..." } }
    const errorMessage = typeof error.error === 'string' 
      ? error.error 
      : error.error?.message || error.message || 'Request failed';
    throw new Error(errorMessage);
  }

  return response.json();
}

export const api = {
  // Leaderboard
  getLeaderboard: async () => {
    const data = await apiRequest('/leaderboard');
    const rows = Array.isArray(data.rows) ? data.rows : [];
    return {
      ...data,
      rows: rows.map((row) => {
        const { avatar_url, total, profession, ...rest } = row;
        return {
          ...rest,
          profession: profession || null,
          avatarUrl: avatar_url || null,
          total:
            typeof total === "number"
              ? total
              : Number.parseFloat(total) || 0,
        };
      }),
    };
  },

  // User profile
  getUserProfile: (id) => apiRequest(`/user/${id}`),
  updateUserProfile: (id, data) => apiRequest(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  // Registration
  checkRegister: (uid) => apiRequest(`/register/check?uid=${encodeURIComponent(uid || '')}`),
  postRegister: (data) => apiRequest('/register', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // NFC resolve
  resolveUID: (uid) => apiRequest(`/resolve/${uid}`),

  // ESP32 / Gateway API
  scan: (data) => apiRequest('/scan', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getLastScan: () => apiRequest('/last-scan'),
  getNdefUrl: (uid) => apiRequest(`/ndef-url?uid=${encodeURIComponent(uid)}`),

  // Admin
  adminLogin: (username, password) => apiRequest('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  }),
  adminLogout: () => apiRequest('/admin/logout', { method: 'POST' }),
  getAdminDashboard: (query) => apiRequest(`/admin/dashboard${query ? `?q=${encodeURIComponent(query)}` : ''}`),
  adminQuickAddTx: (data) => apiRequest('/admin/quick-add-tx', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  adminQuickRegister: (data) => apiRequest('/admin/quick-register-link', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  adminDeleteUser: (userId) => apiRequest('/admin/delete-user', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId })
  })
};

