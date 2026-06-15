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
    if (error.response?.status === 401) {
      // Handle unauthorized (e.g., clear token and redirect to login)
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/register', userData)
};

export const mentorService = {
  getSlots: () => api.get('/api/mentor/slot'),
  createSlot: (slotData) => api.post('/api/mentor/slot', slotData),
  getBookings: (mentorId) => api.get(`/api/booking/mentor/${mentorId}`),
  confirmBooking: (bookingId) => api.post(`/api/booking/${bookingId}/confirm`),
  rejectBooking: (bookingId) => api.post(`/api/booking/${bookingId}/reject`),
};

export const studentService = {
  getMentors: () => api.get('/api/student/mentors'),
  bookSession: (bookingData) => api.post('/api/booking/book', bookingData),
  getBookings: (studentId) => api.get(`/api/booking/student/${studentId}`),
  cancelBooking: (bookingId) => api.post(`/api/booking/${bookingId}/cancel`),
};

export default api;
