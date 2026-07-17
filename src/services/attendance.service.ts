import api from './api';

export const AttendanceService = {
    getAttendance: async (date?: string, courseId?: number) => {
        let url = 'attendance/';
        const params = [];
        if (date) params.push(`date=${date}`);
        if (courseId) params.push(`course=${courseId}`);
        if (params.length > 0) url += `?${params.join('&')}`;

        const response = await api.get(url);
        return response.data;
    },
    markAttendance: async (data: any) => {
        const response = await api.post('attendance/', data);
        return response.data;
    },
    updateAttendance: async (id: number, data: any) => {
        const response = await api.patch(`attendance/${id}/`, data);
        return response.data;
    },
    bulkUpdate: async (data: any) => {
        const response = await api.post('attendance/bulk-update/', data);
        return response.data;
    },
    getStats: async (courseId: number) => {
        const response = await api.get(`attendance/stats/?course=${courseId}`);
        return response.data;
    },
    getStudentStats: async (studentId: number) => {
        const response = await api.get(`attendance/student_stats/?student_id=${studentId}`);
        return response.data;
    },
    getStudentHistory: async (courseId: number, studentId: number) => {
        const response = await api.get(`attendance/?course=${courseId}&student_id=${studentId}`);
        return response.data;
    }
};
