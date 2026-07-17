import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { UsersService } from '../../../services/users.service';
import { FinanceService } from '../../../services/finance.service';
import { FileText, User, Calendar, DollarSign, CheckCircle, AlertCircle, Download } from 'lucide-react';

export default function GenerateChallan() {
    const router = useRouter();
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [lastChallan, setLastChallan] = useState<any>(null);

    const [formData, setFormData] = useState({
        student: '',
        amount: '',
        due_date: ''
    });

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            const data = await UsersService.getStudents();
            setStudents(Array.isArray(data) ? data : (data as any).results || []);
        } catch (err) {
            console.error("Failed to load students", err);
            setError("Failed to load students list.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setSuccess(null);
        setError(null);

        try {
            // Provide default due date if not selected (e.g., 7 days from now)
            const payload = {
                student: Number(formData.student), // This should be the User ID
                amount: Number(formData.amount),
                due_date: formData.due_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            };

            await FinanceService.createChallan(payload);
            setSuccess("Fee Challan generated successfully!");

            // Find student details for the receipt
            const selectedStudent = students.find(s => (s.user?.id || s.user) == formData.student);
            const studentName = selectedStudent?.user?.username || selectedStudent?.username || 'Unknown';
            const rollNo = selectedStudent?.roll_number || 'N/A';
            const department = selectedStudent?.department || 'N/A';
            const program = selectedStudent?.program || 'N/A';
            const cnic = selectedStudent?.user?.cnic || 'N/A'; // Assuming CNIC is on User model
            const session = selectedStudent?.semester || 'Fall 2025'; // Default or from data

            setLastChallan({
                ...payload,
                studentName,
                rollNo,
                department,
                program,
                cnic,
                session,
                challanNo: Math.floor(100000 + Math.random() * 900000) // Random 6 digit challan no for display
            });

            setFormData({ student: '', amount: '', due_date: '' });

        } catch (err: any) {
            console.error("Failed to generate challan", err);
            setError(err.response?.data?.detail || "Failed to generate challan. Please check inputs.");
        } finally {
            setSubmitting(false);
        }
    };

    const handlePrint = () => {
        // Create a printable window
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            const challanCopy = (title: string) => `
                <div class="challan-copy">
                    <div class="header">
                        <div class="copy-title">${title}</div>
                        <div class="bank-name">Habib Bank Limited</div>
                        <div class="sub-header">
                            <div>Dated: <u>${new Date().toLocaleDateString()}</u></div>
                            <div>Challan No: <u>${lastChallan?.challanNo}</u></div>
                        </div>
                        <div class="account-info">
                            <div>Credit: Admission Income</div>
                            <div>Account No: <strong>00427991775503</strong></div>
                        </div>
                    </div>

                    <div class="student-info">
                        <div class="row">
                            <span class="label">Name:</span>
                            <span class="value underline">${lastChallan?.studentName}</span>
                        </div>
                        <div class="row">
                            <span class="label">Challan Form Deposit Deadline:</span>
                            <span class="value underline">${lastChallan?.due_date}</span>
                        </div>
                    </div>

                    <div class="program-info">
                        <div class="row"><span class="label">Department:</span> <span class="value">${lastChallan?.department}</span></div>
                        <div class="row"><span class="label">Session:</span> <span class="value">${lastChallan?.session}</span></div>
                        <div class="row"><span class="label">Program:</span> <span class="value">${lastChallan?.program}</span></div>
                        <div class="row"><span class="label">CNIC:</span> <span class="value">${lastChallan?.cnic}</span></div>
                    </div>

                    <table class="fee-table">
                        <thead>
                            <tr>
                                <th style="text-align: left;">Particulars</th>
                                <th style="text-align: right; width: 80px;">Rs.</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Tuition / Course Fee</td>
                                <td style="text-align: right;">${lastChallan?.amount}</td>
                            </tr>
                            <tr><td>&nbsp;</td><td></td></tr>
                            <tr><td>&nbsp;</td><td></td></tr>
                            <tr><td>&nbsp;</td><td></td></tr>
                            <tr><td>&nbsp;</td><td></td></tr>
                            <tr><td>&nbsp;</td><td></td></tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <th>Total Rs.</th>
                                <th style="text-align: right;">${lastChallan?.amount}</th>
                            </tr>
                        </tfoot>
                    </table>

                    <div class="amount-words">
                        Total (Rs. in Words): <u>${toWords(lastChallan?.amount)} only.</u>
                    </div>

                    <div class="footer">
                        <div class="signature">
                            <span>Officer</span>
                            <span>CASHIER</span>
                        </div>
                        <div class="note">
                            The entrance test registration fee is neither refundable nor transferable.<br/>
                            Note: This voucher can be deposited in any HBL branch throughout Pakistan.
                        </div>
                    </div>
                </div>
            `;

            // Simple number to words converter for display
            const toWords = (amount: any) => {
                // Placeholder - for production use a library like number-to-words
                return amount ? `${amount}` : 'Zero';
            };

            printWindow.document.write(`
                <html>
                <head>
                    <title>Fee Challan Receipt</title>
                    <style>
                        body { 
                            font-family: 'Times New Roman', Times, serif; 
                            background: white; 
                            margin: 0;
                            padding: 20px; 
                        }
                        .challan-container { 
                            display: flex; 
                            justify-content: space-between;
                            max-width: 100%;
                        }
                        .challan-copy { 
                            width: 32%; 
                            border: 2px solid #000; 
                            padding: 10px; 
                            box-sizing: border-box;
                            font-size: 11px;
                            position: relative;
                        }
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
                        .fee-table th, .fee-table td { border: 1px solid #000; padding: 2px 5px; font-size: 10px; }
                        .fee-table th { background: #f0f0f0; }
                        
                        .amount-words { font-size: 10px; margin-bottom: 20px; }
                        
                        .footer .signature { display: flex; justify-content: space-between; margin-top: 30px; margin-bottom: 10px; font-weight: bold; }
                        .footer .note { font-size: 8px; text-align: left; }
                    </style>
                </head>
                <body>
                    <div class="challan-container">
                        ${challanCopy('Depositor\'s Copy')}
                        ${challanCopy('Bank Copy')}
                        ${challanCopy('University\'s Copy')}
                    </div>
                </body>
                <script>
                    window.onload = function() { window.print(); }
                </script>
                </html>
            `);
            printWindow.document.close();
        }
    };

    return (
        <DashboardLayout title="Generate Fee Challan">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 font-manrope">Generate Fee Challan</h1>
                    <p className="text-slate-500 mt-2">Create a new fee payment request for a student.</p>
                </div>

                <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                    {success && (
                        <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="w-5 h-5" />
                                {success}
                            </div>
                            <button
                                onClick={handlePrint}
                                className="px-4 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Download/Print
                            </button>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-rose-50 text-rose-700 rounded-xl flex items-center gap-3">
                            <AlertCircle className="w-5 h-5" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Student Selection */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Select Student</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                <select
                                    required
                                    value={formData.student}
                                    onChange={(e) => setFormData({ ...formData, student: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all appearance-none"
                                >
                                    <option value="">Select a student...</option>
                                    {students.map((student: any) => (
                                        <option key={student.id} value={student.user?.id || student.user}>
                                            {/* Handle various potential API response structures */}
                                            {student.user?.username || student.username} ({student.roll_number || 'No Roll #'})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Amount (USD)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    placeholder="e.g. 1500"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Due Date */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Due Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                <input
                                    type="date"
                                    required
                                    value={formData.due_date}
                                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-600/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {submitting ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <FileText className="w-5 h-5" />
                                    Generate Challan
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
