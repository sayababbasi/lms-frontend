import api from './api';

export interface Message {
    id: number;
    sender: number;
    sender_name: string;
    recipient: number;
    recipient_name: string;
    content: string;
    is_read: boolean;
    created_at: string;
}

export const MessagesService = {
    // Messaging API
    getConversation: async (recipientId: number): Promise<Message[]> => {
        const response = await api.get('/notifications/messages/', {
            params: { recipient: recipientId }
        });
        // Handle pagination if results key exists
        return (response.data as any).results || response.data;
    },

    sendMessage: async (recipientId: number, content: string): Promise<Message> => {
        const response = await api.post('/notifications/messages/', {
            recipient: recipientId,
            content: content
        });
        return response.data as Message;
    },

    getAllLogs: async (): Promise<Message[]> => {
        const response = await api.get('/notifications/messages/');
        return (response.data as any).results || response.data;
    },

    getConversations: async (): Promise<any[]> => {
        const response = await api.get('/notifications/messages/conversations/');
        return response.data as any[];
    },

    markConversationRead: async (senderId: number) => {
        const response = await api.post('/notifications/messages/mark_conversation_read/', {
            sender_id: senderId
        });
        return response.data;
    },

    // Email API
    sendEmail: async (data: { email: string; subject: string; message: string }) => {
        const response = await api.post('/notifications/messages/send_email/', data);
        return response.data;
    }
};
