import axios from 'axios';

// API Base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://backend-yxgd.onrender.com/',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Handle unauthorized/forbidden
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth:unauthorized'));
      // We will rely on AuthContext or a global listener to handle redirect or modal
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/register', userData)
};

export const mentorService = {
  createSlot: (slotData) => api.post('/api/mentor/slot', slotData),
  getUpcomingSessions: (mentorId) => api.get(`/api/booking/mentor/${mentorId}`),
  getPendingRequests: (mentorId) => api.get(`/api/booking/mentor/${mentorId}/pending`),
  confirmBooking: (bookingId) => api.post(`/api/booking/${bookingId}/confirm`),
  rejectBooking: (bookingId) => api.post(`/api/booking/${bookingId}/reject`),
};

export const studentService = {
  getMentorSlots: () => api.get('/api/student/mentorslots'),
  bookSlot: (bookingData) => api.post('/api/student/bookslot', bookingData),
  getUpcomingSessions: (studentId) => api.get(`/api/booking/student/${studentId}`),
  cancelBooking: (bookingId) => api.post(`/api/booking/${bookingId}/cancel`),
};

export default api;
