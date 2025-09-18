// API service functions - replace these with your actual backend endpoints

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    // TODO: Replace with your backend endpoint
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },

  verifyToken: async (token: string) => {
    // TODO: Replace with your backend endpoint
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
  },

  logout: async () => {
    // TODO: Replace with your backend endpoint
    const token = localStorage.getItem('authToken');
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};

// Users API
export const usersAPI = {
  getAll: async () => {
    // TODO: Replace with your backend endpoint
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
  },

  create: async (userData: any) => {
    // TODO: Replace with your backend endpoint
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  update: async (id: string, userData: any) => {
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

  create: async (playerData: any) => {
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

  update: async (id: string, playerData: any) => {
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

  create: async (staffData: any) => {
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

  update: async (id: string, staffData: any) => {
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

  create: async (newsData: any) => {
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

  update: async (id: string, newsData: any) => {
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
  }
};