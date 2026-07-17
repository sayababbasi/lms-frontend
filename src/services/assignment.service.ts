import api from './api';

export const AssignmentService = {
    // Assignments
    getAssignments: async (courseId?: number) => {
        const url = courseId ? `assignments/?course=${courseId}` : 'assignments/';
        const response = await api.get(url);
        return response.data;
    },
    getAssignment: async (id: number) => {
        const response = await api.get(`assignments/${id}/`);
        return response.data;
    },
    createAssignment: async (data: any) => {
        const response = await api.post('assignments/', data);
        return response.data;
    },
    updateAssignment: async (id: number, data: any) => {
        const response = await api.patch(`assignments/${id}/`, data);
        return response.data;
    },
    deleteAssignment: async (id: number) => {
        await api.delete(`assignments/${id}/`);
    },

    getCourseStats: async () => {
        const response = await api.get('assignment-stats/');
        return response.data;
    },

    // Submissions
    getSubmissions: async (assignmentId?: number) => {
        const url = assignmentId ? `submissions/?assignment=${assignmentId}` : 'submissions/';
        const response = await api.get(url);
        return response.data;
    },
    gradeSubmission: async (submissionId: number, gradeData: any) => {
        // Check if grade already exists - if so, we need to update it
        // For now, try to create a new grade
        const payload = {
            submission: submissionId,
            score: gradeData.score,
            feedback: gradeData.feedback || ''
        };
        const response = await api.post('grades/', payload);
        return response.data;
    }

};
