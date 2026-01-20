// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// API Helper class
class API {
    static async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const token = this.getToken();

        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            }
        };

        // Add token if available
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        // Don't set Content-Type for FormData
        if (options.body instanceof FormData) {
            delete config.headers['Content-Type'];
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    static get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    static post(endpoint, body) {
        const options = {
            method: 'POST',
            body: body instanceof FormData ? body : JSON.stringify(body)
        };
        return this.request(endpoint, options);
    }

    static put(endpoint, body) {
        const options = {
            method: 'PUT',
            body: body instanceof FormData ? body : JSON.stringify(body)
        };
        return this.request(endpoint, options);
    }

    static delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    // Token management
    static getToken() {
        return localStorage.getItem('token');
    }

    static setToken(token) {
        localStorage.setItem('token', token);
    }

    static removeToken() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    static getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    static setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    static isAuthenticated() {
        return !!this.getToken();
    }
}

// Export for use in other files
window.API = API;
