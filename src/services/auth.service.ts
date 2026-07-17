import api from './api';

export const AuthService = {
    login: async (username, password) => {
        const response = await api.post('/login/', { username, password });
        const data = response.data as any; // Type assertion to avoid unknown error
        if (data.access) {
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            return data;
        }
        return data;
    },

    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
    },

    getCurrentUser: async () => {
        try {
            const response = await api.get('/me/');
            return response.data;
        } catch (error) {
            return null;
        }
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('access_token');
    }
};
