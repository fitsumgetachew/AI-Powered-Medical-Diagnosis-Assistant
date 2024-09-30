// Base URL for your API
const API_BASE_URL = 'http://localhost:8000/';

// Helper function to handle API requests
async function sendRequest(endpoint, method = 'GET', data = null) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
    };

    // Check if there's an access token and include it in headers
    const token = localStorage.getItem('access_token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
        method,
        headers,
        body: data ? JSON.stringify(data) : null,
    };

    try {
        const response = await fetch(url, options);
        const responseData = await response.json();
        return { ok: response.ok, status: response.status, data: responseData };
    } catch (error) {
        console.error('API request error:', error);
        return { ok: false, status: 500, data: { message: 'An error occurred while processing your request.' } };
    }
}

// Define reusable API methods for different actions
const api = {
    // User login
    login: (credentials) => sendRequest('/users/login/', 'POST', credentials),

    // User registration
    register: (userData) => sendRequest('/users/register/', 'POST', userData),

    // Send OTP to user email
    sendOtp: (email) => sendRequest('/users/send_otp/', 'POST', { email }),

    // Google Authentication
    googleAuth: (token) => sendRequest('/users/google_auth/', 'POST', { token }),

    // Fetch User Profile
    fetchUserProfile: () => sendRequest('/users/profile/', 'GET'),

    // Update User Profile
    updateUserProfile: (profileData) => sendRequest('/users/profile/', 'PUT', profileData),
};

export default api;
