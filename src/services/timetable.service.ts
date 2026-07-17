import api from './api';

export interface TimeSlot {
    id: number;
    course: number;
    course_title: string;
    teacher: number;
    teacher_name: string;
    day: string;
    start_time: string;
    end_time: string;
    room_number: string;
}

export const TimetableService = {
    getTimetable: async (day?: string) => {
        const params = day ? { day } : {};
        const response = await api.get<TimeSlot[]>('/timetable/', { params });
        return response.data;
    },

    createClass: async (data: { course: string; day: string; start_time: string; end_time: string; room_number: string }) => {
        const response = await api.post('/timetable/', data);
        return response.data;
    },

    deleteClass: async (id: number) => {
        const response = await api.delete(`/timetable/${id}/`);
        return response.data;
    }
};
