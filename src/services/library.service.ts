import api from './api';

export const LibraryService = {
    getBooks: async () => {
        const response = await api.get('/library/books/');
        return response.data;
    },

    uploadBook: async (formData: FormData) => {
        const response = await api.post('/library/books/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    deleteBook: async (id: number) => {
        const response = await api.delete(`/library/books/${id}/`);
        return response.data;
    },

    // Legacy/Optional
    getIssues: async () => {
        const response = await api.get('/library/issues/');
        return response.data;
    }
};
