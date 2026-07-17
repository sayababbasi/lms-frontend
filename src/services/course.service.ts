import api from './api';

export const CourseService = {
    // Courses
    getCourses: async () => {
        const response = await api.get('courses/');
        return response.data;
    },
    getCourse: async (id: number) => {
        const response = await api.get(`courses/${id}/`);
        return response.data;
    },
    createCourse: async (data: any) => {
        const response = await api.post('courses/', data);
        return response.data;
    },
    updateCourse: async (id: number, data: any) => {
        const response = await api.put(`courses/${id}/`, data);
        return response.data;
    },
    deleteCourse: async (id: number) => {
        const response = await api.delete(`courses/${id}/`);
        return response.data;
    },

    // Modules
    getModules: async (courseId?: number) => {
        const url = courseId ? `modules/?course=${courseId}` : 'modules/';
        const response = await api.get(url);
        return response.data;
    },

    // Lessons
    getLessons: async (moduleId?: number) => {
        const url = moduleId ? `lessons/?module=${moduleId}` : 'lessons/';
        const response = await api.get(url);
        return response.data;
    }
};
