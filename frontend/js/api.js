const API_BASE_URL = 'http://localhost:8000/';

async function sendRequest(endpoint, method, data = null) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
    };

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

const api = {
    sendOtp: (email) => sendRequest('/users/send_otp/', 'POST', { email }),
    register: (userData) => sendRequest('/users/register/', 'POST', userData),
    login: (credentials) => sendRequest('/users/login/', 'POST', credentials),
    googleAuth: (token) => sendRequest('/users/google_auth/', 'POST', { token }),
};

export default api;