import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { FinanceService, PaymentProof } from '../../../services/finance.service';
import { CheckCircle, XCircle, Eye, Clock, User, DollarSign, FileText, X } from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE = process.env.API_URL ? process.env.API_URL.replace('/api', '') : 'http://localhost:8000';

const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${API_BASE}${url}`;
};

export default function PaymentVerificationPage() {
    const [proofs, setProofs] = useState<PaymentProof[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProof, setSelectedProof] = useState<PaymentProof | null>(null);
    const [remarks, setRemarks] = useState('');
    const [processing, setProcessing] = useState(false);
    const [filter, setFilter] = useState<'pending' | 'all'>('pending');


    useEffect(() => {
        fetchProofs();
    }, [filter]);

    const fetchProofs = async () => {
        setLoading(true);
        try {
            const data = filter === 'pending'
                ? await FinanceService.getPendingProofs()
                : await FinanceService.getAllProofs();
            setProofs(Array.isArray(data) ? data : (data as any).results || []);
        } catch (error) {
            console.error("Failed to fetch proofs", error);
            toast.error("Failed to load payment proofs");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (action: 'approve' | 'reject') => {
        if (!selectedProof) return;
        setProcessing(true);
        try {
            await FinanceService.verifyProof(selectedProof.id, action, remarks);
            toast.success(`Payment ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
            setSelectedProof(null);
            setRemarks('');
            fetchProofs();
        } catch (error: any) {
            const msg = error.response?.data?.error || `Failed to ${action} payment`;
            toast.error(msg);
        } finally {
            setProcessing(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700"><Clock className="w-3 h-3" /> Pending</span>;
            case 'verified':
                return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700"><CheckCircle className="w-3 h-3" /> Verified</span>;
            case 'rejected':
                return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700"><XCircle className="w-3 h-3" /> Rejected</span>;
            default:
                return null;
        }
    };

    return (
        <DashboardLayout title="Payment Verification">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-dark-text">Payment Verification</h1>
                    <p className="text-slate-600 mt-1">Review and verify student payment proofs</p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'pending'
                            ? 'bg-primary-600 text-white'
                            : 'bg-dark-surface text-slate-600 hover:bg-dark-border'
                            }`}
                    >
                        Pending Only
                    </button>
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all'
                            ? 'bg-primary-600 text-white'
                            : 'bg-dark-surface text-slate-600 hover:bg-dark-border'
                            }`}
                    >
                        All Proofs
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-32">
                    <div className="w-8 h-8 border-2 border-slate-200 border-t-primary-600 rounded-full animate-spin"></div>
                </div>
            ) : proofs.length === 0 ? (
                <div className="bg-dark-surface/50 border border-dark-border rounded-xl p-12 text-center">
                    <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-600 text-lg font-medium">No payment proofs found</p>
                    <p className="text-slate-500 mt-1">
                        {filter === 'pending' ? 'All pending proofs have been reviewed' : 'No payment proofs have been submitted yet'}
                    </p>
                </div>
            ) : (
                <div className="bg-dark-surface/50 border border-dark-border rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-dark-surface border-b border-dark-border text-slate-600 text-sm uppercase tracking-wider">
                                <th className="p-4 font-medium">Student</th>
                                <th className="p-4 font-medium">Challan</th>
                                <th className="p-4 font-medium">Amount</th>
                                <th className="p-4 font-medium">Submitted</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-border">
                            {proofs.map((proof) => (
                                <tr key={proof.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary-600/20 flex items-center justify-center text-primary-400">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-dark-text">{proof.student_detail.name}</p>
                                                <p className="text-xs text-slate-500">{proof.student_detail.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 font-mono text-slate-600">#{proof.challan}</td>
                                    <td className="p-4">
                                        <p className="font-bold text-dark-text">Rs. {proof.challan_detail.total_due}</p>
                                        {proof.transaction_reference && (
                                            <p className="text-xs text-slate-500">Ref: {proof.transaction_reference}</p>
                                        )}
                                    </td>
                                    <td className="p-4 text-slate-600">
                                        {new Date(proof.submitted_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">{getStatusBadge(proof.status)}</td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => setSelectedProof(proof)}
                                            className="px-3 py-1.5 bg-primary-600/10 text-primary-400 rounded-lg text-sm font-medium hover:bg-primary-600/20 transition-colors inline-flex items-center gap-1"
                                        >
                                            <Eye className="w-4 h-4" /> View Proof
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Proof Modal */}
            {selectedProof && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-dark-surface border border-dark-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
                        <div className="p-6 border-b border-dark-border flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold text-dark-text">Payment Proof Review</h3>
                                <p className="text-sm text-slate-500">
                                    {selectedProof.student_detail.name} - Challan #{selectedProof.challan}
                                </p>
                            </div>
                            <button onClick={() => { setSelectedProof(null); setRemarks(''); }} className="text-slate-500 hover:text-dark-text">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Proof Image */}
                            <div className="mb-6 bg-dark-bg rounded-xl p-4 text-center">
                                <img
                                    src={getImageUrl(selectedProof.proof_image)}
                                    alt="Payment Proof"
                                    className="max-w-full max-h-[400px] mx-auto rounded-lg border border-dark-border"
                                />
                            </div>


                            {/* Details */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-dark-bg rounded-lg p-4">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Amount Due</p>
                                    <p className="text-xl font-bold text-dark-text">Rs. {selectedProof.challan_detail.total_due}</p>
                                </div>
                                <div className="bg-dark-bg rounded-lg p-4">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Transaction Ref</p>
                                    <p className="text-xl font-bold text-dark-text">{selectedProof.transaction_reference || 'N/A'}</p>
                                </div>
                            </div>

                            {selectedProof.status === 'pending' && (
                                <>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Remarks (Optional)</label>
                                        <textarea
                                            value={remarks}
                                            onChange={(e) => setRemarks(e.target.value)}
                                            placeholder="Add any notes about this verification..."
                                            className="w-full px-4 py-3 rounded-lg bg-dark-bg border border-dark-border text-dark-text focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                            rows={3}
                                        />
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleVerify('reject')}
                                            disabled={processing}
                                            className="flex-1 px-4 py-3 bg-red-600/10 text-red-500 border border-red-600/20 rounded-lg font-medium hover:bg-red-600/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            <XCircle className="w-5 h-5" /> Reject
                                        </button>
                                        <button
                                            onClick={() => handleVerify('approve')}
                                            disabled={processing}
                                            className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle className="w-5 h-5" /> Approve
                                        </button>
                                    </div>
                                </>
                            )}

                            {selectedProof.status !== 'pending' && (
                                <div className={`p-4 rounded-lg ${selectedProof.status === 'verified' ? 'bg-green-600/10 border border-green-600/20' : 'bg-red-600/10 border border-red-600/20'}`}>
                                    <p className={`font-medium ${selectedProof.status === 'verified' ? 'text-green-500' : 'text-red-500'}`}>
                                        This proof has been {selectedProof.status}
                                    </p>
                                    {selectedProof.remarks && (
                                        <p className="text-sm text-slate-500 mt-1">Remarks: {selectedProof.remarks}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
