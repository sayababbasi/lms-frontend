import api from './api';

export const ResultService = {
    getResults: async (studentId?: number, examId?: number) => {
        let url = 'results/';
        const params = [];
        if (studentId) params.push(`student=${studentId}`);
        if (examId) params.push(`exam=${examId}`);
        if (params.length > 0) url += `?${params.join('&')}`;

        const response = await api.get(url);
        return response.data;
    },
    createResult: async (data: any) => {
        const response = await api.post('results/', data);
        return response.data;
    },
    updateResult: async (id: number, data: any) => {
        const response = await api.patch(`results/${id}/`, data);
        return response.data;
    },
    deleteResult: async (id: number) => {
        const response = await api.delete(`results/${id}/`);
        return response.data;
    }
};
