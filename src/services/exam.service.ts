import api from './api';

export const ExamService = {
    // Exams
    getExams: async (courseId?: number) => {
        const url = courseId ? `exams/?course=${courseId}` : 'exams/';
        const response = await api.get(url);
        return response.data;
    },
    getExam: async (id: number) => {
        const response = await api.get(`exams/${id}/`);
        return response.data;
    },
    createExam: async (data: any) => {
        const response = await api.post('exams/', data);
        return response.data;
    },

    // Questions
    getQuestions: async (examId?: number) => {
        const url = examId ? `exams/questions/?exam=${examId}` : 'exams/questions/';
        const response = await api.get(url);
        return response.data;
    },
    createQuestion: async (data: any) => {
        const response = await api.post('exams/questions/', data);
        return response.data;
    },

    // Options (MCQ)
    getOptions: async (questionId?: number) => {
        const url = questionId ? `exams/options/?question=${questionId}` : 'exams/options/';
        const response = await api.get(url);
        return response.data;
    }
};
