import api from './api';

export const StudentService = {
    getStats: async () => {
        const response = await api.get('/student/stats/');
        return response.data;
    },
    getMyCourses: async () => {
        const response = await api.get('/student/courses/');
        return response.data;
    },

    getCourseDetail: async (id: number) => {
        const response = await api.get(`/courses/${id}/`);
        return response.data;
    },

    getAssignments: async () => {
        const response = await api.get('/assignments/student/list/');
        return response.data;
    },

    getAssignment: async (id: number) => {
        const response = await api.get(`/assignments/${id}/`);
        return response.data;
    },

    getMySubmission: async (assignmentId: number) => {
        const response = await api.get(`/submissions/?assignment=${assignmentId}`);
        return response.data;
    },

    submitAssignment: async (id: number, data: any) => {
        const formData = new FormData();
        if (data.file) {
            formData.append('file', data.file);
        }
        if (data.text_content) {
            formData.append('text_content', data.text_content);
        }

        const response = await api.post(`/assignments/student/${id}/submit/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    getAttendanceStats: async (studentId: number) => {
        const response = await api.get('/attendance/student_stats/', {
            params: { student_id: studentId }
        });
        return response.data;
    },

    getCourseAttendanceDetails: async (courseId: number, studentId: number) => {
        const response = await api.get('/attendance/', {
            params: {
                course: courseId,
                student_id: studentId
            }
        });
        return response.data;
    },

    // Exam Methods
    getExams: async () => {
        const response = await api.get('/exams/student/');
        return response.data;
    },

    startExamAttempt: async (examId: number) => {
        const response = await api.post(`/exams/student/${examId}/start_attempt/`);
        return response.data;
    },

    submitExam: async (examId: number, data: any) => {
        const response = await api.post(`/exams/student/${examId}/submit_exam/`, data);
        return response.data;
    },

    getResults: async () => {
        const response = await api.get('/exams/student/my_results/');
        return response.data;
    },

    getResultDetail: async (attemptId: number) => {
        const response = await api.get('/exams/student/result_detail/', {
            params: { attempt_id: attemptId }
        });
        return response.data;
    }
};
