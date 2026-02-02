import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to inject token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle different error scenarios
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;

            // Extract error message
            const errorMessage = data?.error || data?.message || 'An error occurred';
            const errorDetails = data?.details || [];

            // Create enhanced error object
            const enhancedError = {
                message: errorMessage,
                status,
                details: errorDetails,
                originalError: error
            };

            // Handle specific status codes
            switch (status) {
                case 401:
                    // Unauthorized - clear token and redirect to login
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    if (window.location.pathname !== '/login') {
                        window.location.href = '/login';
                    }
                    break;
                case 403:
                    // Forbidden
                    console.error('Access forbidden:', errorMessage);
                    break;
                case 404:
                    // Not found
                    console.error('Resource not found:', errorMessage);
                    break;
                case 422:
                case 400:
                    // Validation error - details available
                    console.error('Validation error:', errorDetails);
                    break;
                case 500:
                case 503:
                    // Server error
                    console.error('Server error:', errorMessage);
                    break;
            }

            return Promise.reject(enhancedError);
        } else if (error.request) {
            // Request made but no response
            return Promise.reject({
                message: 'No response from server. Please check your connection.',
                status: 0,
                details: [],
                originalError: error
            });
        } else {
            // Something else happened
            return Promise.reject({
                message: error.message || 'Request failed',
                status: 0,
                details: [],
                originalError: error
            });
        }
    }
);

export default api;
