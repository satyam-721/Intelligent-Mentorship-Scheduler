import axios from 'axios';

// API Base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
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
  // Additional endpoints if needed based on original setup
  getUpcomingSessions: (mentorId) => api.get(`/api/booking/mentor/${mentorId}`),
  getPendingRequests: (mentorId) => api.get(`/api/booking/mentor/${mentorId}/pending`),
};

export const studentService = {
  getMentorSlots: () => api.get('/api/student/mentorslots'),
  bookSlot: (bookingData) => api.post('/api/student/bookslot', bookingData),
  // Additional endpoints if needed based on original setup
  getUpcomingSessions: (studentId) => api.get(`/api/booking/student/${studentId}`),
};

export default api;
