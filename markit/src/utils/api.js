import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request interceptor - attach auth token
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('petms_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response) {
            // If 401 and we have a token, it's expired — clear it
            if (error.response.status === 401 && typeof window !== 'undefined') {
                const token = localStorage.getItem('petms_token');
                if (token) {
                    localStorage.removeItem('petms_token');
                    localStorage.removeItem('petms_user');
                    window.location.href = '/';
                }
            }
            return Promise.reject(error.response.data);
        }
        return Promise.reject({ success: false, message: 'Network error. Please check your connection.' });
    }
);

// Auth API
export const authAPI = {
    login: (email, password, role) => api.post('/auth/login', { email, password, role }),
    register: (data) => api.post('/auth/register', data),
    getMe: () => api.get('/auth/me'),
    logout: () => api.post('/auth/logout'),
};

// Projects API
export const projectsAPI = {
    getAll: (params = {}) => api.get('/projects', { params }),
    getOne: (id) => api.get(`/projects/${id}`),
    create: (data) => api.post('/projects', data),
    update: (id, data) => api.put(`/projects/${id}`, data),
    delete: (id) => api.delete(`/projects/${id}`),
    getNearby: (lat, lng, radius) => api.get('/projects/nearby', { params: { latitude: lat, longitude: lng, radius } }),
};

// Complaints API
export const complaintsAPI = {
    getAll: (params = {}) => api.get('/complaints', { params }),
    getOne: (id) => api.get(`/complaints/${id}`),
    submit: (data) => api.post('/complaints', data),
    upvote: (id) => api.post(`/complaints/${id}/upvote`),
    respond: (id, data) => api.put(`/complaints/${id}/respond`, data),
};

// Stats API
export const statsAPI = {
    getOverview: () => api.get('/stats/overview'),
    getDepartmentAllocation: () => api.get('/stats/department-allocation'),
    getMonthlyTrends: () => api.get('/stats/monthly-trends'),
    getContractorStats: () => api.get('/stats/contractor'),
};

export default api;
