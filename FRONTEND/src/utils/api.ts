const isDevelopment = import.meta.env.DEV;

export const API_BASE_URL = isDevelopment 
  ? import.meta.env.VITE_API_PROXY_URL || '/api'
  : import.meta.env.VITE_API_BASE_URL || 'https://odoo-hackathon-civic-tracker-5yfm.onrender.com';

export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const token = localStorage.getItem('authToken');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    return response;
  } catch (error) {
    throw error;
  }
};

export const apiGet = (endpoint: string, options: RequestInit = {}) => {
  return apiCall(endpoint, { ...options, method: 'GET' });
};

export const apiPost = (endpoint: string, data?: any, options: RequestInit = {}) => {
  return apiCall(endpoint, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
};

export const apiPut = (endpoint: string, data?: any, options: RequestInit = {}) => {
  return apiCall(endpoint, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
};

export const apiDelete = (endpoint: string, options: RequestInit = {}) => {
  return apiCall(endpoint, { ...options, method: 'DELETE' });
};

export const apiPatch = (endpoint: string, data?: any, options: RequestInit = {}) => {
  return apiCall(endpoint, {
    ...options,
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });
};
