import api from './api';

export const UsersService = {
    // Generic User
    getUsers: async (role?: string) => {
        const url = role ? `users/?role=${role}` : 'users/';
        const response = await api.get(url);
        return response.data;
    },

    // Students
    getStudents: async () => {
        const response = await api.get('students/');
        return response.data;
    },
    createStudent: async (data: any) => {
        const response = await api.post('students/', data);
        return response.data;
    },

    // Teachers
    getTeachers: async () => {
        const response = await api.get('teachers/');
        return response.data;
    },
    createTeacher: async (data: any) => {
        const response = await api.post('teachers/', data);
        return response.data;
    },

    // Staff
    getStaff: async () => {
        const response = await api.get('staff/');
        return response.data;
    },
    createStaff: async (data: any) => {
        const response = await api.post('staff/', data);
        return response.data;
    },

    // Delete methods
    deleteStudent: async (id: number) => {
        await api.delete(`students/${id}/`);
    },
    deleteTeacher: async (id: number) => {
        await api.delete(`teachers/${id}/`);
    },
    deleteStaff: async (id: number) => {
        await api.delete(`staff/${id}/`);
    },

    // Update methods
    updateStudent: async (id: number, data: any) => {
        const response = await api.patch(`students/${id}/`, data);
        return response.data;
    },
    updateTeacher: async (id: number, data: any) => {
        const response = await api.patch(`teachers/${id}/`, data);
        return response.data;
    },
    updateStaff: async (id: number, data: any) => {
        const response = await api.patch(`staff/${id}/`, data);
        return response.data;
    }
};
