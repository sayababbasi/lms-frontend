import api from './api';

export interface Assignment {
    id: number;
    title: string;
    description: string;
    due_date: string;
    course: number; // Course ID
    course_code?: string; // from expand/serializer
    course_name?: string; // from expand/serializer
    status?: 'Draft' | 'Published' | 'Closed';
    max_score?: number;
    submissions_count?: number;
    pending?: number; // Calculated or from backend
}

export interface AssignmentCreateData {
    title: string;
    description: string;
    due_date: string;
    course: number;
    status: 'Draft' | 'Published' | 'Closed';
    max_score: number;
}

export interface SubmissionFile {
    id: number;
    file: string;
    filename: string;
    uploaded_at: string;
}

export interface Submission {
    id: number;
    assignment: number;
    student: number;
    student_name?: string; 
    status?: string;
    attempt_number?: number;
    is_late?: boolean;
    text_content: string | null;
    external_url?: string | null;
    plagiarism_score?: number | null;
    submitted_at: string;
    files?: SubmissionFile[];
    grade?: {
        id: number;
        score: number;
        feedback: string;
    } | null;
}

export const AssignmentsService = {
    getAll: async (courseId?: number) => {
        let url = '/assignments/';
        if (courseId) {
            url += `?course=${courseId}`;
        }
        const response = await api.get<any>(url);
        // Handle pagination
        if (response.data.results) {
            return response.data.results;
        }
        return response.data;
    },

    create: async (data: AssignmentCreateData) => {
        const response = await api.post<Assignment>('/assignments/', data);
        return response.data;
    },

    getSubmissions: async (assignmentId: number) => {
        const response = await api.get<any>(`/submissions/?assignment=${assignmentId}`);
        if (response.data.results) {
            return response.data.results;
        }
        return response.data;
    },

    gradeSubmission: async (submissionId: number, data: { score: number; feedback: string }, gradeId?: number) => {
        // Defensive check: Ensure score is a number and not NaN
        const numScore = Number(data.score);
        if (isNaN(numScore)) {
            throw new Error("Invalid score: not a number");
        }

        // Round to 2 decimals but keep as number
        const payload = {
            ...data,
            score: Math.round(numScore * 100) / 100
        };

        // If gradeId exists, update it (PATCH)
        if (gradeId) {
            const response = await api.patch(`/grades/${gradeId}/`, payload);
            return response.data;
        }

        // Otherwise create new grade (POST)
        const response = await api.post('/grades/', {
            submission: submissionId,
            ...payload
        });
        return response.data;
    }
};
