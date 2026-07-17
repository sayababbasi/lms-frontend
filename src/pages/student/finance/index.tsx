import React, { useEffect, useState } from 'react';
import StudentLayout from '../../../components/layout/StudentLayout';
import { FinanceService, FeeChallan, FinanceSummary, PaymentProof } from '../../../services/finance.service';
import { DollarSign, Download, Upload, CheckCircle, XCircle, Clock, AlertTriangle, CreditCard, FileText, ChevronRight, Eye, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE = 'http://localhost:8000';

export default function StudentFinancePage() {
    const [challans, setChallans] = useState<FeeChallan[]>([]);
    const [summary, setSummary] = useState<FinanceSummary | null>(null);
    const [myProofs, setMyProofs] = useState<PaymentProof[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [selectedChallan, setSelectedChallan] = useState<FeeChallan | null>(null);
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [transactionRef, setTransactionRef] = useState('');
    const [uploading, setUploading] = useState(false);
    const [selectedProof, setSelectedProof] = useState<PaymentProof | null>(null);
    const [rerequesting, setRerequesting] = useState<number | null>(null);



    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [challanData, summaryData, proofsData] = await Promise.all([
                FinanceService.getMyChallans(),
                FinanceService.getSummary(),
                FinanceService.getMyProofs()
            ]);
            setChallans(Array.isArray(challanData) ? challanData : (challanData as any).results || []);
            setSummary(summaryData);
            setMyProofs(Array.isArray(proofsData) ? proofsData : (proofsData as any).results || []);
        } catch (error) {
            console.error("Failed to fetch finance data", error);
            toast.error("Failed to load finance data");
        } finally {
            setLoading(false);
        }
    };

    const handleUploadProof = async () => {
        if (!selectedChallan || !proofFile) return;
        setUploading(true);
        try {
            await FinanceService.submitPaymentProof(selectedChallan.id, proofFile, transactionRef);
            toast.success("Payment proof submitted successfully!");
            setUploadModalOpen(false);
            setProofFile(null);
            setTransactionRef('');
            fetchData();
        } catch (error: any) {
            const msg = error.response?.data?.error || "Failed to submit proof";
            toast.error(msg);
        } finally {
            setUploading(false);
        }
    };

    const handleRerequest = async (challanId: number) => {
        setRerequesting(challanId);
        try {
            await FinanceService.rerequestVerification(challanId);
            toast.success("Verification re-requested successfully!");
            fetchData();
        } catch (error: any) {
            const msg = error.response?.data?.error || "Failed to re-request verification";
            toast.error(msg);
        } finally {
            setRerequesting(null);
        }
    };

    const getImageUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `${API_BASE}${url}`;
    };

    const printChallan = (challan: FeeChallan) => {

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            toast.error("Please allow popups to download challan");
            return;
        }

        const student = challan.student_detail as any || {};
        const arrears = parseFloat(challan.arrears) || 0;
        const currentFee = parseFloat(challan.amount);
        const totalDue = currentFee + arrears;


        const challanCopy = (title: string) => `
            <div class="challan-copy">
                <div class="header">
                    <div class="copy-title">${title}</div>
                    <div class="bank-name">Habib Bank Limited</div>
                    <div class="sub-header">
                        <div>Dated: <u>${new Date().toLocaleDateString()}</u></div>
                        <div>Challan No: <u>${challan.id.toString().padStart(6, '0')}</u></div>
                    </div>
                    <div class="account-info">
                        <div>Credit: Tuition Fee</div>
                        <div>Account No: <strong>00427991775503</strong></div>
                    </div>
                </div>

                <div class="student-info">
                    <div class="row">
                        <span class="label">Name:</span>
                        <span class="value underline">${student.name || 'Student'}</span>
                    </div>
                    <div class="row">
                        <span class="label">Due Date:</span>
                        <span class="value underline">${challan.due_date}</span>
                    </div>
                </div>

                <div class="program-info">
                    <div class="row"><span class="label">Department:</span> <span class="value">${student.department || 'N/A'}</span></div>
                    <div class="row"><span class="label">Program:</span> <span class="value">${student.program || 'N/A'}</span></div>
                    <div class="row"><span class="label">Semester:</span> <span class="value">${student.semester || 'N/A'}</span></div>
                    <div class="row"><span class="label">Roll No:</span> <span class="value">${student.roll_number || 'N/A'}</span></div>
                </div>

                <table class="fee-table">
                    <thead>
                        <tr>
                            <th style="text-align: left;">Particulars</th>
                            <th style="text-align: right; width: 100px;">Rs.</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Tuition / Course Fee</td>
                            <td style="text-align: right;">${currentFee.toLocaleString()}</td>
                        </tr>
                        ${arrears > 0 ? `
                        <tr>
                            <td><strong>Arrears / Previous Dues</strong></td>
                            <td style="text-align: right;"><strong>${arrears.toLocaleString()}</strong></td>
                        </tr>
                        ` : ''}
                        <tr><td>&nbsp;</td><td></td></tr>
                        <tr><td>&nbsp;</td><td></td></tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <th>Total Payable Rs.</th>
                            <th style="text-align: right;">${totalDue.toLocaleString()}</th>
                        </tr>
                    </tfoot>
                </table>

                <div class="amount-words">
                    Total (Rs. in Words): <u>Rupees ${totalDue.toLocaleString()} only.</u>
                </div>

                <div class="footer">
                    <div class="signature">
                        <span>Officer</span>
                        <span>CASHIER</span>
                    </div>
                    <div class="note">
                        Note: This voucher can be deposited in any HBL branch throughout Pakistan.
                    </div>
                </div>
            </div>
        `;

        const getStamp = () => challan.paid ? '<div class="paid-stamp">PAID</div>' : '';

        const fullHtml = `
            <html>
            <head>
                <title>Fee Challan #${challan.id}</title>
                <style>
                    body { font-family: 'Times New Roman', Times, serif; background: white; margin: 0; padding: 20px; }
                    .challan-container { display: flex; justify-content: space-between; max-width: 100%; }
                    .challan-copy { width: 32%; border: 2px solid #000; padding: 12px; box-sizing: border-box; font-size: 11px; position: relative; }
                    .header { text-align: center; margin-bottom: 10px; }
                    .copy-title { font-weight: bold; margin-bottom: 5px; font-size: 10px; }
                    .bank-name { font-weight: bold; font-size: 14px; margin-bottom: 5px; }
                    .sub-header { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 10px; }
                    .account-info { text-align: center; margin-bottom: 10px; font-size: 10px; }
                    .student-info { margin-bottom: 10px; }
                    .program-info { border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 5px 0; margin-bottom: 10px; }
                    .row { display: flex; margin-bottom: 2px; }
                    .label { width: 80px; font-weight: bold; }
                    .value { flex: 1; }
                    .underline { text-decoration: underline; }
                    .fee-table { width: 100%; border-collapse: collapse; margin-bottom: 5px; }
                    .fee-table th, .fee-table td { border: 1px solid #000; padding: 3px 5px; font-size: 10px; }
                    .fee-table th { background: #f0f0f0; }
                    .amount-words { font-size: 10px; margin-bottom: 20px; }
                    .footer .signature { display: flex; justify-content: space-between; margin-top: 30px; margin-bottom: 10px; font-weight: bold; }
                    .footer .note { font-size: 8px; text-align: left; }
                    .paid-stamp {
                        position: absolute; top: 40%; left: 50%; transform: translate(-50%, -50%) rotate(-30deg);
                        font-size: 2.5rem; font-weight: 900; color: rgba(22, 163, 74, 0.6);
                        border: 5px solid rgba(22, 163, 74, 0.6); padding: 10px 20px; border-radius: 10px;
                        text-transform: uppercase; pointer-events: none; z-index: 10;
                    }
                </style>
            </head>
            <body>
                <div class="challan-container">
                    ${challanCopy("Depositor's Copy") + getStamp()}
                    ${challanCopy("Bank Copy") + getStamp()}
                    ${challanCopy("University's Copy") + getStamp()}
                </div>
            </body>
            <script>window.onload = function() { window.print(); }</script>
            </html>
        `;

        printWindow.document.write(fullHtml);
        printWindow.document.close();
    };

    const getStatusBadge = (challan: FeeChallan) => {
        if (challan.paid) {
            return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"><CheckCircle className="w-3 h-3" /> Paid</span>;
        }
        if (challan.proof_status === 'pending') {
            return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"><Clock className="w-3 h-3" /> Pending Verification</span>;
        }
        if (challan.proof_status === 'rejected') {
            return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"><XCircle className="w-3 h-3" /> Rejected</span>;
        }
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"><AlertTriangle className="w-3 h-3" /> Unpaid</span>;
    };

    return (

        <StudentLayout title="Fee Challans">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Finance & Fee Management</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your fee challans and payment history</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-32">
                    <div className="w-8 h-8 border-2 border-slate-200 dark:border-slate-700 border-t-primary-600 rounded-full animate-spin"></div>
                </div>
            ) : (
                <>
                    {/* Summary Cards */}
                    {summary && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl p-5">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600">
                                        <DollarSign className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-medium text-slate-500">Total Fees</span>
                                </div>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">Rs. {summary.total_fees.toLocaleString()}</p>
                            </div>

                            <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl p-5">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-medium text-slate-500">Total Paid</span>
                                </div>
                                <p className="text-2xl font-bold text-green-600">Rs. {summary.total_paid.toLocaleString()}</p>
                            </div>

                            <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl p-5">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600">
                                        <AlertTriangle className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-medium text-slate-500">Outstanding</span>
                                </div>
                                <p className="text-2xl font-bold text-red-600">Rs. {summary.total_pending.toLocaleString()}</p>
                            </div>

                            <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl p-5">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center text-amber-600">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-medium text-slate-500">Pending Verification</span>
                                </div>
                                <p className="text-2xl font-bold text-amber-600">{summary.pending_verifications}</p>
                            </div>
                        </div>
                    )}

                    {/* Challans List */}
                    <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-dark-border">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Fee Challans</h2>
                        </div>

                        {challans.length === 0 ? (
                            <div className="p-12 text-center">
                                <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                                <p className="text-slate-500">No fee challans found</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {challans.map((challan) => (
                                    <div key={challan.id} className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-semibold text-slate-900 dark:text-white">
                                                        Fee Challan #{challan.id}
                                                    </h3>
                                                    {getStatusBadge(challan)}
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                                    <span>Due: {new Date(challan.due_date).toLocaleDateString()}</span>
                                                    <span>•</span>
                                                    <span>Amount: Rs. {parseFloat(challan.amount).toLocaleString()}</span>
                                                    {parseFloat(challan.arrears) > 0 && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="text-red-500">Arrears: Rs. {parseFloat(challan.arrears).toLocaleString()}</span>
                                                        </>
                                                    )}
                                                </div>
                                                <p className="text-lg font-bold text-slate-900 dark:text-white mt-2">
                                                    Total: Rs. {challan.total_due.toLocaleString()}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => printChallan(challan)}
                                                    className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg flex items-center gap-2 transition-colors"
                                                >
                                                    <Download className="w-4 h-4" /> Download
                                                </button>
                                                {!challan.paid && challan.proof_status !== 'pending' && (
                                                    <button
                                                        onClick={() => { setSelectedChallan(challan); setUploadModalOpen(true); }}
                                                        className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg flex items-center gap-2 transition-colors"
                                                    >
                                                        <Upload className="w-4 h-4" /> Upload Proof
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* My Payment Submissions */}
                    {myProofs.length > 0 && (
                        <div className="mt-8 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-200 dark:border-dark-border">
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">My Payment Submissions</h2>
                                <p className="text-sm text-slate-500 mt-1">Track the status of your submitted payment proofs</p>
                            </div>

                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {myProofs.map((proof) => (
                                    <div key={proof.id} className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-semibold text-slate-900 dark:text-white">
                                                        Challan #{proof.challan}
                                                    </h3>
                                                    {proof.status === 'pending' && (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                                            <Clock className="w-3 h-3" /> Pending Review
                                                        </span>
                                                    )}
                                                    {proof.status === 'verified' && (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                            <CheckCircle className="w-3 h-3" /> Verified
                                                        </span>
                                                    )}
                                                    {proof.status === 'rejected' && (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                                            <XCircle className="w-3 h-3" /> Rejected
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                                    <span>Amount: Rs. {proof.challan_detail.total_due}</span>
                                                    <span>•</span>
                                                    <span>Submitted: {new Date(proof.submitted_at).toLocaleDateString()}</span>
                                                    {proof.transaction_reference && (
                                                        <>
                                                            <span>•</span>
                                                            <span>Ref: {proof.transaction_reference}</span>
                                                        </>
                                                    )}
                                                </div>
                                                {proof.remarks && (
                                                    <div className={`mt-3 p-3 rounded-lg text-sm ${proof.status === 'rejected'
                                                        ? 'bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/30'
                                                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                                        }`}>
                                                        <strong>Admin Remarks:</strong> {proof.remarks}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setSelectedProof(proof)}
                                                    className="px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg flex items-center gap-2 transition-colors"
                                                >
                                                    <Eye className="w-4 h-4" /> View
                                                </button>
                                                {proof.status === 'rejected' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleRerequest(proof.challan)}
                                                            disabled={rerequesting === proof.challan}
                                                            className="px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                                                        >
                                                            <RefreshCw className={`w-4 h-4 ${rerequesting === proof.challan ? 'animate-spin' : ''}`} />
                                                            {rerequesting === proof.challan ? 'Re-requesting...' : 'Re-request'}
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                const challan = challans.find(c => c.id === proof.challan);
                                                                if (challan) {
                                                                    setSelectedChallan(challan);
                                                                    setUploadModalOpen(true);
                                                                }
                                                            }}
                                                            className="px-4 py-2 text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 rounded-lg flex items-center gap-2 transition-colors"
                                                        >
                                                            <Upload className="w-4 h-4" /> New Proof
                                                        </button>
                                                    </>
                                                )}
                                            </div>

                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Proof Preview Modal */}
            {selectedProof && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setSelectedProof(null)}>
                    <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-200 dark:border-dark-border flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Payment Proof</h3>
                                <p className="text-sm text-slate-500">Challan #{selectedProof.challan}</p>
                            </div>
                            <button onClick={() => setSelectedProof(null)} className="text-slate-400 hover:text-slate-600">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6">
                            <img
                                src={getImageUrl(selectedProof.proof_image)}
                                alt="Payment Proof"
                                className="w-full rounded-lg border border-slate-200 dark:border-dark-border"
                            />

                            <div className="mt-4 grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider">Status</p>
                                    <p className={`text-lg font-bold capitalize ${selectedProof.status === 'verified' ? 'text-green-600' :
                                        selectedProof.status === 'rejected' ? 'text-red-600' : 'text-amber-600'
                                        }`}>{selectedProof.status}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider">Amount</p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">Rs. {selectedProof.challan_detail.total_due}</p>
                                </div>
                            </div>
                            {selectedProof.remarks && (
                                <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Admin Remarks</p>
                                    <p className="text-slate-700 dark:text-slate-300">{selectedProof.remarks}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}


            {uploadModalOpen && selectedChallan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="p-6 border-b border-slate-200 dark:border-dark-border">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Upload Payment Proof</h3>
                            <p className="text-sm text-slate-500 mt-1">Challan #{selectedChallan.id} - Rs. {selectedChallan.total_due.toLocaleString()}</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Payment Receipt Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Transaction Reference (Optional)</label>
                                <input
                                    type="text"
                                    value={transactionRef}
                                    onChange={(e) => setTransactionRef(e.target.value)}
                                    placeholder="e.g., Bank reference number"
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-200 dark:border-dark-border flex justify-end gap-3">
                            <button
                                onClick={() => { setUploadModalOpen(false); setProofFile(null); setTransactionRef(''); }}
                                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUploadProof}
                                disabled={!proofFile || uploading}
                                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                            >
                                {uploading ? 'Uploading...' : 'Submit Proof'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </StudentLayout>
    );
}
