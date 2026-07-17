import api from './api';

export const CoursesService = {
    getAll: async () => {
        const response = await api.get('/courses/');
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get(`/courses/${id}/`);
        return response.data;
    },

    createModule: async (data: any) => {
        const response = await api.post('/modules/', data);
        return response.data;
    },

    createLesson: async (data: any) => {
        const response = await api.post('/lessons/', data);
        return response.data;
    },
    
    updateLesson: async (id: number, data: any) => {
        const response = await api.patch(`/lessons/${id}/`, data);
        return response.data;
    },

    uploadVideo: async (lessonId: number, videoFile: File) => {
        const formData = new FormData();
        formData.append('lessonId', lessonId.toString());
        formData.append('video', videoFile);
        
        // Use native fetch to bypass Axios global headers entirely
        const token = localStorage.getItem('access_token');
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        
        const res = await fetch(`${baseUrl}/youtube/upload/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
                // DO NOT set Content-Type here; fetch generates it with the boundary automatically
            },
            body: formData
        });
        
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || 'Failed to upload video');
        }
        
        return res.json();
    },

    uploadResource: async (lessonId: number, file: File) => {
        const formData = new FormData();
        formData.append('lesson_id', lessonId.toString());
        formData.append('file', file);
        formData.append('title', file.name); // Default title to filename
        
        // Use native fetch to bypass Axios global headers entirely
        const token = localStorage.getItem('access_token');
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        
        const res = await fetch(`${baseUrl}/resources/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
                // DO NOT set Content-Type here; fetch generates it with the boundary automatically
            },
            body: formData
        });
        
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || 'Failed to upload resource');
        }
        
        return res.json();
    },

    create: async (data: any) => {
        // Handle file uploads (thumbnail)
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key === 'thumbnail') {
                if (data[key] && data[key][0]) {
                    formData.append(key, data[key][0]);
                }
            } else if (Array.isArray(data[key])) {
                data[key].forEach((value: any) => {
                    formData.append(key, value);
                });
            } else {
                formData.append(key, data[key]);
            }
        });

        const response = await api.post('/courses/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    update: async (id: number, data: any) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key === 'thumbnail') {
                // Only append if it's a new file (FileList)
                if (data[key] instanceof FileList && data[key].length > 0) {
                    formData.append(key, data[key][0]);
                } else if (data[key] instanceof File) {
                    formData.append(key, data[key]);
                }
            } else if (Array.isArray(data[key])) {
                data[key].forEach((value: any) => {
                    formData.append(key, value);
                });
            } else {
                formData.append(key, data[key]);
            }
        });

        const response = await api.patch(`/courses/${id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    delete: async (id: number) => {
        const response = await api.delete(`/courses/${id}/`);
        return response.data;
    },

    // Enrollment Management
    addStudent: async (courseId: number, studentId: number) => {
        const response = await api.post(`/courses/${courseId}/add_student/`, { student_id: studentId });
        return response.data;
    },

    removeStudent: async (courseId: number, studentId: number) => {
        const response = await api.post(`/courses/${courseId}/remove_student/`, { student_id: studentId });
        return response.data;
    },

    getEnrollmentRequests: async (courseId: number) => {
        const response = await api.get(`/enrollment-requests/?course=${courseId}&status=PENDING`);
        return response.data;
    },

    approveRequest: async (requestId: number) => {
        const response = await api.post(`/enrollment-requests/${requestId}/approve/`);
        return response.data;
    },

    rejectRequest: async (requestId: number) => {
        const response = await api.post(`/enrollment-requests/${requestId}/reject/`);
        return response.data;
    },

    requestEnrollment: async (courseId: number, paymentProof: File, transactionId: string) => {
        const formData = new FormData();
        formData.append('course', courseId.toString());
        formData.append('payment_proof', paymentProof);
        formData.append('transaction_id', transactionId);

        const response = await api.post('/enrollment-requests/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // ----- MODULE CRUD -----
    deleteModule: async (moduleId: number) => {
        const response = await api.delete(`/modules/${moduleId}/`);
        return response.data;
    },

    updateModule: async (moduleId: number, data: { title: string }) => {
        const response = await api.patch(`/modules/${moduleId}/`, data);
        return response.data;
    },

    // ----- LESSON CRUD -----
    deleteLesson: async (lessonId: number) => {
        const response = await api.delete(`/lessons/${lessonId}/`);
        return response.data;
    },

    updateLessonTitle: async (lessonId: number, title: string) => {
        const response = await api.patch(`/lessons/${lessonId}/`, { title });
        return response.data;
    },

    // Delete the video from a lesson (keeps lesson, just clears video fields)
    deleteVideo: async (lessonId: number) => {
        const response = await api.post(`/lessons/${lessonId}/delete-video/`);
        return response.data;
    },

    // ----- RESOURCE CRUD -----
    deleteResource: async (resourceId: number) => {
        const response = await api.delete(`/resources/${resourceId}/`);
        return response.data;
    },

    // ----- STUDENT CURRICULUM -----
    getCurriculum: async (courseId: number) => {
        const response = await api.get(`/courses/${courseId}/`);
        return response.data; // Returns full course with modules -> lessons -> resources
    },
};
