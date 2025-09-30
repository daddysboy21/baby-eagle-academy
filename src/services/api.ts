// (removed accidental top-level create)
// src/services/api.ts
// API service functions
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://dgfgshlf-5050.euw.devtunnels.ms/api';

// Helper for error handling
async function handleResponse(response: Response) {
  const data = await response.json();
  if (!response.ok) {
    throw (data && data.error) ? new Error(data.error) : new Error('API Error');
  }
  return data;
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(response);
  },

  verifyToken: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  logout: async () => {
    const token = localStorage.getItem('authToken');
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Add profile management functions
  getProfile: async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  updateProfile: async (profileData: { name?: string; email?: string; image?: string }) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });
    return handleResponse(response);
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    return handleResponse(response);
  }
};

// Applications API
export const applicationsAPI = {
  // Player Applications
  getPlayerApplications: async (status?: string, page = 1, limit = 10) => {
    const token = localStorage.getItem('authToken');
    const params = new URLSearchParams();
    if (status && status !== 'all') params.append('status', status);
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    const response = await fetch(`${API_BASE_URL}/applications/player?${params}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  submitPlayer: async (applicationData: Record<string, unknown>) => {
    const response = await fetch(`${API_BASE_URL}/applications/player`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(applicationData)
    });
    return handleResponse(response);
  },

  updatePlayerStatus: async (id: string, status: string, reviewNotes?: string) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/applications/player/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ status, reviewNotes })
    });
    return handleResponse(response);
  },

  // Partner Applications
  getPartnerApplications: async (status?: string, page = 1, limit = 10) => {
    const token = localStorage.getItem('authToken');
    const params = new URLSearchParams();
    if (status && status !== 'all') params.append('status', status);
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    const response = await fetch(`${API_BASE_URL}/applications/partner?${params}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  submitPartner: async (applicationData: Record<string, unknown>) => {
    const response = await fetch(`${API_BASE_URL}/applications/partner`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(applicationData)
    });
    return handleResponse(response);
  },

  updatePartnerStatus: async (id: string, status: string, reviewNotes?: string) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/applications/partner/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ status, reviewNotes })
    });
    return handleResponse(response);
  },

  // Fan Applications
  getFanApplications: async (status?: string, page = 1, limit = 10) => {
    const token = localStorage.getItem('authToken');
    const params = new URLSearchParams();
    if (status && status !== 'all') params.append('status', status);
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    const response = await fetch(`${API_BASE_URL}/applications/fan?${params}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  submitFan: async (applicationData: Record<string, unknown>) => {
    const response = await fetch(`${API_BASE_URL}/applications/fan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(applicationData)
    });
    return handleResponse(response);
  },

  updateFanStatus: async (id: string, status: string, reviewNotes?: string) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/applications/fan/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ status, reviewNotes })
    });
    return handleResponse(response);
  },

  // All Applications Summary
  getAllApplications: async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/applications/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return handleResponse(response);
  }
};

// System Settings API
export const settingsAPI = {
  getAll: async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/settings`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  update: async (key: string, value: string) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ key, value })
    });
    return handleResponse(response);
  }
};

// Users API
export const usersAPI = {
  getAll: async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  create: async (userData: Record<string, unknown>) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  update: async (id: string, userData: Record<string, unknown>) => {
    // TODO: Replace with your backend endpoint
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  delete: async (id: string) => {
    // TODO: Replace with your backend endpoint
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
  }
};

// Players API
export const playersAPI = {
  getAll: async () => {
    // TODO: Replace with your backend endpoint
    const response = await fetch(`${API_BASE_URL}/players`);
    return response.json();
  },

  create: async (playerData: Record<string, unknown>) => {
    // TODO: Replace with your backend endpoint
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/players`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(playerData)
    });
    return response.json();
  },

  update: async (id: string, playerData: Record<string, unknown>) => {
    // TODO: Replace with your backend endpoint
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/players/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(playerData)
    });
    return response.json();
  },

  delete: async (id: string) => {
    // TODO: Replace with your backend endpoint
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/players/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
  }
};

// Staff API
export const staffAPI = {
  getAll: async () => {
    // TODO: Replace with your backend endpoint
    const response = await fetch(`${API_BASE_URL}/staff`);
    return response.json();
  },

  create: async (staffData: Record<string, unknown>) => {
    // TODO: Replace with your backend endpoint
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/staff`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(staffData)
    });
    return response.json();
  },

  update: async (id: string, staffData: Record<string, unknown>) => {
    // TODO: Replace with your backend endpoint
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/staff/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(staffData)
    });
    return response.json();
  },

  delete: async (id: string) => {
    // TODO: Replace with your backend endpoint
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/staff/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
  }
};

// News API
export const newsAPI = {
  getAll: async () => {
    // TODO: Replace with your backend endpoint
    const response = await fetch(`${API_BASE_URL}/news`);
    return response.json();
  },

  create: async (newsData: Record<string, unknown>) => {
    // TODO: Replace with your backend endpoint
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/news`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(newsData)
    });
    return response.json();
  },
  update: async (id: string, newsData: Record<string, unknown>) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/news/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(newsData)
    });
    return response.json();
  },
  delete: async (id: string) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/news/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
  }
};

// Gallery API
export const galleryAPI = {
  create: async (galleryData: Record<string, unknown>) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/gallery/upload`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(galleryData)
    });
    return response.json();
  },
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/gallery`);
    return response.json();
  },
  update: async (id: string, updateData: Record<string, unknown>) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    });
    return response.json();
  },
  remove: async (id: string) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
  }
};