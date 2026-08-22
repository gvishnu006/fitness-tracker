import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const workoutApi = {
  getAll: (params?: { isTemplate?: boolean; limit?: number; offset?: number }) =>
    api.get('/workouts', { params }),
  getById: (id: number) => api.get(`/workouts/${id}`),
  create: (data: any) => api.post('/workouts', data),
  update: (id: number, data: any) => api.put(`/workouts/${id}`, data),
  delete: (id: number) => api.delete(`/workouts/${id}`),
};

export const sessionApi = {
  getAll: (params?: { limit?: number; offset?: number; status?: string }) =>
    api.get('/sessions', { params }),
  getById: (id: number) => api.get(`/sessions/${id}`),
  create: (data: any) => api.post('/sessions', data),
  update: (id: number, data: any) => api.put(`/sessions/${id}`, data),
  complete: (id: number, data?: any) => api.post(`/sessions/${id}/complete`, data),
};

export const statsApi = {
  getProgress: (weeks?: number) => api.get('/stats/progress', { params: { weeks } }),
  getStats: () => api.get('/stats/stats'),
  updateGoals: (data: any) => api.put('/stats/goals', data),
};

export default api;