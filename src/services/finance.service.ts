import api from './api';

export interface FeeChallan {
    id: number;
    amount: string;
    arrears: string;
    due_date: string;
    paid: boolean;
    created_at: string;
    total_due: number;
    proof_status: string | null;
    student_detail: {
        id: number;
        name: string;
        roll_number: string;
        department: string;
        program: string;
        semester: string;
    };
}

export interface FinanceSummary {
    total_fees: number;
    total_paid: number;
    total_pending: number;
    pending_verifications: number;
    unpaid_challans: number;
    paid_challans: number;
}

export interface PaymentProof {
    id: number;
    challan: number;
    proof_image: string;
    transaction_reference: string;
    submitted_at: string;
    status: 'pending' | 'verified' | 'rejected';
    remarks: string;
    challan_detail: {
        id: number;
        amount: string;
        arrears: string;
        total_due: string;
        due_date: string;
    };
    student_detail: {
        id: number;
        name: string;
        email: string;
    };
}

export const FinanceService = {
    // Student endpoints
    getMyChallans: async () => {
        const response = await api.get<FeeChallan[]>('/finance/student/');
        return response.data;
    },

    getSummary: async () => {
        const response = await api.get<FinanceSummary>('/finance/student/summary/');
        return response.data;
    },

    submitPaymentProof: async (challanId: number, proofImage: File, transactionRef?: string) => {
        const formData = new FormData();
        formData.append('proof_image', proofImage);
        if (transactionRef) formData.append('transaction_reference', transactionRef);

        const response = await api.post(`/finance/student/${challanId}/submit_proof/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    getMyProofs: async () => {
        const response = await api.get<PaymentProof[]>('/finance/student/my_proofs/');
        return response.data;
    },

    rerequestVerification: async (challanId: number) => {
        const response = await api.post(`/finance/student/${challanId}/rerequest_verification/`);
        return response.data;
    },

    getAllChallans: async () => {

        const response = await api.get<FeeChallan[]>('/finance/challans/');
        return response.data;
    },

    getChallans: async (search?: string) => {
        const params = search ? { search } : {};
        const response = await api.get<FeeChallan[]>('/finance/challans/', { params });
        return response.data;
    },

    updateChallan: async (challanId: number, data: Partial<{ paid: boolean }>) => {
        const response = await api.patch(`/finance/challans/${challanId}/`, data);
        return response.data;
    },

    getPendingProofs: async () => {
        const response = await api.get<PaymentProof[]>('/finance/proofs/', { params: { status: 'pending' } });
        return response.data;
    },

    getAllProofs: async () => {
        const response = await api.get<PaymentProof[]>('/finance/proofs/');
        return response.data;
    },

    verifyProof: async (proofId: number, action: 'approve' | 'reject', remarks?: string) => {
        const response = await api.post(`/finance/proofs/${proofId}/verify/`, { action, remarks });
        return response.data;
    },

    createChallan: async (data: { student: number; amount: number; due_date: string }) => {
        const response = await api.post('/finance/challans/', data);
        return response.data;
    }
};
