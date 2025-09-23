// src/services/api.ts
// API service functions
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';

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
  }
};

// Applications API
export const applicationsAPI = {
  submitPlayer: async (applicationData: Record<string, unknown>) => {
    const response = await fetch(`${API_BASE_URL}/applications/player`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(applicationData)
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

  submitFan: async (applicationData: Record<string, unknown>) => {
    const response = await fetch(`${API_BASE_URL}/applications/fan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(applicationData)
    });
    return handleResponse(response);
  },
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
    // TODO: Replace with your backend endpoint
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
    // TODO: Replace with your backend endpoint
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
  getAll: async () => {
    // TODO: Replace with your backend endpoint
    const response = await fetch(`${API_BASE_URL}/gallery`);
    return response.json();
  },

  upload: async (formData: FormData) => {
    // TODO: Replace with your backend endpoint
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/gallery/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    return response.json();
  },

  delete: async (id: string) => {
    // TODO: Replace with your backend endpoint
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
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
  }
};