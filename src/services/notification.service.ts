import api from './api';

export const NotificationService = {
    getNotifications: async () => {
        const response = await api.get('notifications/');
        return response.data;
    },
    markAsRead: async (id: number) => {
        const response = await api.post(`notifications/${id}/read/`);
        return response.data;
    }
};
