import api from './api';

export interface StudentProfile {
    id: number;
    user: {
        id: number;
        username: string;
        email: string;
        first_name: string;
        last_name: string;
    };
    roll_number: string;
    department: string;
    program: string;
    semester: string;
    section: string;
    enrolled_courses: string[];
}

export const UsersService = {
    getStudents: async (): Promise<StudentProfile[]> => {
        const response = await api.get('/students/');
        return (response.data as any).results || response.data;
    }
};
