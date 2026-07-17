import api from './api';

export const ExamsService = {
    // Get all exams (Global or filtered by student)
    getAllExams: async () => {
        const response = await api.get('exams/');
        return response.data;
    },

    // Get all exams for a course
    getExams: async (courseId: number) => {
        const response = await api.get(`exams/?course=${courseId}`);
        return response.data;
    },

    // Create a new exam (Teacher)
    createExam: async (data: any) => {
        const response = await api.post('exams/', data);
        return response.data;
    },

    // Create a full exam with questions and options
    createFullExam: async (examData: any, questions: any[]) => {
        // Create Exam
        const response = await api.post('exams/', examData);
        const exam = response.data as any;
        
        // Create Questions
        for (const q of questions) {
            const qData = {
                exam: exam.id,
                text: q.text,
                question_type: q.question_type,
                marks: q.marks
            };
            const qRes = await api.post('exams/questions/', qData);
            const createdQ = qRes.data as any;
            
            // If MCQ, create Options
            if (q.question_type === 'MCQ' && q.options) {
                for (const opt of q.options) {
                    await api.post('exams/options/', {
                        question: createdQ.id,
                        text: opt.text,
                        is_correct: opt.is_correct
                    });
                }
            }
        }
        return exam;
    },

    // Check Eligibility
    checkEligibility: async (examId: number, studentId?: number) => {
        const url = studentId
            ? `exams/${examId}/check_eligibility/?student_id=${studentId}`
            : `exams/${examId}/check_eligibility/`;
        const response = await api.get(url);
        return response.data;
    },

    // Generate Admit Card
    generateAdmitCard: async (examId: number, studentId?: number) => {
        const payload = studentId ? { student_id: studentId } : {};
        const response = await api.post(`exams/${examId}/generate_admit_card/`, payload);
        return response.data;
    },

    // Get specific exam details
    getExam: async (id: number) => {
        const response = await api.get(`exams/${id}/`);
        return response.data;
    },

    // Student: Start an exam attempt
    startExam: async (examId: number) => {
        const response = await api.post(`exams/student/${examId}/start_attempt/`);
        return response.data;
    },

    // Student: Submit an exam
    submitExam: async (examId: number, formData: FormData) => {
        const response = await api.post(`exams/student/${examId}/submit_exam/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
};
