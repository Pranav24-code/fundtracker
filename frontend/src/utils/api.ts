import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  timeout: 15000,
});

// Request interceptor: attach Bearer token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('petms_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('petms_token');
      if (window.location.pathname !== '/auth/login') {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error.response?.data || { message: error.message });
  }
);

export const authAPI = {
  login: (credentials: any) => api.post('/auth/login', credentials),
  register: (data: any) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
  changePassword: (data: any) => api.put('/auth/change-password', data),
};

export const projectsAPI = {
  getAll: (params?: any) => api.get('/projects', { params }),
  getOne: (id: string) => api.get(`/projects/${id}`),
  getById: (id: string) => api.get(`/projects/${id}`),
  getNearby: (params: any) => api.get('/projects/nearby', { params }),
  create: (data: any) => api.post('/projects', data),
  update: (id: string, data: any) => api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
  submitUpdate: (id: string, formData: any) =>
    api.post(`/projects/${id}/update`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getUpdates: (id: string, params?: any) => api.get(`/projects/${id}/updates`, { params }),
};

export const complaintsAPI = {
  getAll: (params?: any) => api.get('/complaints', { params }),
  getOne: (id: string) => api.get(`/complaints/${id}`),
  create: (data: any) => {
    if (data instanceof FormData) {
      return api.post('/complaints', data, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return api.post('/complaints', data);
  },
  respond: (id: string, data: any) => api.put(`/complaints/${id}/respond`, data),
  upvote: (id: string) => api.post(`/complaints/${id}/upvote`),
};

export const statsAPI = {
  getOverview: () => api.get('/stats/overview'),
  getDashboardStats: () => api.get('/stats/overview'),
  getDepartmentAllocation: () => api.get('/stats/department-allocation'),
  getMonthlyTrends: () => api.get('/stats/monthly-trends'),
  getContractor: () => api.get('/stats/contractor'),
  getRiskBreakdown: () => api.get('/stats/risk-breakdown'),
};

export const tranchesAPI = {
  getByProject: (projectId: string) => api.get('/tranches', { params: { projectId } }),
  getAll: (projectId: string) => api.get('/tranches', { params: { projectId } }),
  create: (data: any) => api.post('/tranches', data),
  update: (id: string, data: any) => api.put(`/tranches/${id}`, data),
  delete: (id: string) => api.delete(`/tranches/${id}`),
};

export default api;
