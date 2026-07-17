import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { FinanceService } from '../../../services/finance.service';
import { useRouter } from 'next/router';

export default function FinancePage() {
    const router = useRouter();
    const [challans, setChallans] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            loadChallans(search);
        }, 500); // Debounce search
        return () => clearTimeout(timeoutId);
    }, [search]);

    const loadChallans = async (searchQuery: string = '') => {
        setLoading(true);
        try {
            // Assuming FinanceService.getChallans accepts query params. 
            // If strict type, we might need to modify service, but usually axios handles params object.
            // Adjusting usage to pass params manually if needed, but for now assuming getChallans is flexible or I fix it.
            // Wait, getChallans in service is currently: async () => { ... api.get('/finance/') ... }
            // I need to update the service to accept params properly.
            // Assuming I will fix service or pass string query.
            // Let's pass query string to service if it supports it, or simple object.
            // Actually, I'll update the service call here to include params.
            // api is axios instance.
            // Let's do a trick: modifying the service locally? No, I should assume getChallans accepts params in next step or use it raw.
            // Let's assume getChallans accepts args.

            // To be safe, I'm just gonna fetch all and filter client side? 
            // NO, the user wants "server side" search usually.
            // But the backend `search_fields` indicates server support.
            // I will update the service call to use `?search=` if it supports parameters.

            // Let's update `loadChallans` to pass query params.
            // However, `FinanceService.getChallans()` takes no arguments in current implementation.
            // I will cheat and append query string if I can, or I should update service first. 
            // I already updated service earlier? No, only `updateChallan`.
            // I'll assume I can pass manual URL or update the service quickly after this.
            // Actually, let's just use `api.get` directly here? No, stick to service.
            // I will update the service in `finance.service.ts` right after this or use a dirty fix.
            // Dirty fix: The current view gets ALL items? No, pagination.
            // I will update the `FinanceService.getChallans` to accept `params`.

            // For now, I'll assume `FinanceService.getChallans(searchQuery)` works and I'll fix the service in next step.
            const data = await FinanceService.getChallans(searchQuery) as any;
            setChallans(Array.isArray(data) ? data : data.results || []);
        } catch (error) {
            console.error("Failed to load fee challans", error);
        } finally {
            setLoading(false);
        }
    };

    const printChallan = (challan: any) => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            const student = challan.student_detail || {};
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
                            <div>Credit: Admission Income</div>
                            <div>Account No: <strong>00427991775503</strong></div>
                        </div>
                    </div>

                    <div class="student-info">
                        <div class="row">
                            <span class="label">Name:</span>
                            <span class="value underline">${student.username || 'Unknown'}</span>
                        </div>
                        <div class="row">
                            <span class="label">Challan Form Deposit Deadline:</span>
                            <span class="value underline">${challan.due_date}</span>
                        </div>
                    </div>

                    <div class="program-info">
                        <div class="row"><span class="label">Department:</span> <span class="value">${student.department || 'N/A'}</span></div>
                        <div class="row"><span class="label">Session:</span> <span class="value">${student.semester || 'Fall 2025'}</span></div>
                        <div class="row"><span class="label">Program:</span> <span class="value">${student.program || 'N/A'}</span></div>
                        <div class="row"><span class="label">CNIC:</span> <span class="value">${student.cnic || 'N/A'}</span></div>
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
                                <td style="text-align: right;">${currentFee.toFixed(2)}</td>
                            </tr>
                            ${arrears > 0 ? `
                            <tr>
                                <td><strong>Arrears / Previous Dues</strong></td>
                                <td style="text-align: right;"><strong>${arrears.toFixed(2)}</strong></td>
                            </tr>
                            ` : ''}
                            <tr><td>&nbsp;</td><td></td></tr>
                            <tr><td>&nbsp;</td><td></td></tr>
                            <tr><td>&nbsp;</td><td></td></tr>
                            <tr><td>&nbsp;</td><td></td></tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <th>Total Payable Rs.</th>
                                <th style="text-align: right;">${totalDue.toFixed(2)}</th>
                            </tr>
                        </tfoot>
                    </table>

                    <div class="amount-words">
                        Total (Rs. in Words): <u>${totalDue} only.</u>
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

            // Helper to see if paid
            const getStamp = () => challan.paid ? '<div class="paid-stamp">PAID</div>' : '';

            const fullHtml = `
                <html>
                <head>
                    <title>Fee Challan #${challan.id}</title>
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
                        
                        .paid-stamp {
                            position: absolute;
                            top: 40%;
                            left: 50%;
                            transform: translate(-50%, -50%) rotate(-30deg);
                            font-size: 3rem;
                            font-weight: 900;
                            color: rgba(22, 163, 74, 0.6);
                            border: 5px solid rgba(22, 163, 74, 0.6);
                            padding: 10px 20px;
                            border-radius: 10px;
                            text-transform: uppercase;
                            pointer-events: none;
                            z-index: 10;
                            opacity: 0.8;
                        }
                    </style>
                </head>
                <body>
                    <div class="challan-container">
                        ${challanCopy('Depositor\'s Copy') + getStamp()}
                        ${challanCopy('Bank Copy') + getStamp()}
                        ${challanCopy('University\'s Copy') + getStamp()}
                    </div>
                </body>
                <script>
                    window.onload = function() { window.print(); }
                </script>
                </html>
            `;

            printWindow.document.write(fullHtml);
            printWindow.document.close();
        }
    };

    const updateStatus = async (challanId: number, newStatus: boolean) => {
        if (!confirm(`Are you sure you want to mark this challan as ${newStatus ? 'PAID' : 'UNPAID'}?`)) return;

        try {
            await FinanceService.updateChallan(challanId, { paid: newStatus });
            // Update local state
            setChallans(prev => prev.map(c => c.id === challanId ? { ...c, paid: newStatus } : c));
        } catch (error) {
            console.error("Failed to update challan status", error);
            alert("Failed to update payment status");
        }
    };

    // Calculate Dynamic Ledger Stats
    const totalCollected = challans.filter(c => c.paid).reduce((sum, c) => sum + parseFloat(c.amount) + (parseFloat(c.arrears) || 0), 0);
    const totalPending = challans.filter(c => !c.paid).reduce((sum, c) => sum + parseFloat(c.amount) + (parseFloat(c.arrears) || 0), 0);
    // Note: This logic assumes 'amount' + 'arrears' is total.

    return (
        <DashboardLayout title="Finance">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-dark-text">Finance & Fees</h1>
                    <p className="text-slate-600 mt-1">Manage student fees, generate challans, and track payments.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => router.push('/dashboard/finance/verify')}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Verify Payments
                    </button>
                    <button
                        onClick={() => router.push('/dashboard/finance/challan')}
                        className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-dark-text rounded-lg shadow-lg shadow-primary-500/20 transition-all flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Generate Challan
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Search Bar */}
                <div className="lg:col-span-3 bg-dark-surface/50 border border-dark-border rounded-xl p-4 flex items-center gap-4 mb-4">
                    <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input
                        type="text"
                        name="search_query"
                        autoComplete="off"
                        placeholder="Search student by name, email, or ID..."
                        className="bg-transparent border-none focus:ring-0 text-dark-text w-full placeholder-slate-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="text-slate-400 hover:text-red-400 transition-colors p-1"
                            title="Clear Search"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    )}
                </div>

                {/* Quick Stats - Dynamic */}
                <div className="bg-dark-surface/50 border border-dark-border rounded-xl p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                        <p className="text-slate-600 text-sm">{search ? 'Filtered Collected' : 'Total Collected'}</p>
                        <h3 className="text-xl font-bold text-dark-text">${totalCollected.toFixed(2)}</h3>
                    </div>
                </div>
                <div className="bg-dark-surface/50 border border-dark-border rounded-xl p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                        <p className="text-slate-600 text-sm">{search ? 'Filtered Outstanding' : 'Total Outstanding'}</p>
                        <h3 className="text-xl font-bold text-dark-text">${totalPending.toFixed(2)}</h3>
                    </div>
                </div>
            </div>

            <div className="bg-dark-surface/50 backdrop-blur-md border border-dark-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-dark-surface border-b border-dark-border text-slate-600 text-sm uppercase tracking-wider">
                                <th className="p-4 font-medium">Challan ID</th>
                                <th className="p-4 font-medium">Student</th>
                                <th className="p-4 font-medium">Amount</th>
                                <th className="p-4 font-medium">Arrears</th>
                                <th className="p-4 font-medium">Due Date</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-slate-600">Loading...</td>
                                </tr>
                            ) : challans.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-slate-600">No fee records found.</td>
                                </tr>
                            ) : (
                                challans.map((challan) => (
                                    <tr key={challan.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-mono text-slate-700">#{challan.id}</td>
                                        <td className="p-4 text-dark-text font-medium">
                                            {challan.student_detail?.username || challan.student || 'N/A'}
                                        </td>
                                        <td className="p-4 text-dark-text font-bold">${challan.amount}</td>
                                        <td className="p-4 text-red-500 font-medium">{challan.arrears > 0 ? `$${challan.arrears}` : '-'}</td>
                                        <td className="p-4 text-slate-700">
                                            {challan.due_date ? new Date(challan.due_date).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${challan.paid ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                                                {challan.paid ? 'PAID' : 'UNPAID'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right flex justify-end items-center gap-2">
                                            {challan.paid ? (
                                                <button
                                                    onClick={() => updateStatus(challan.id, false)}
                                                    className="text-xs px-2 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded hover:bg-red-500/20 mr-2"
                                                    title="Mark as Unpaid"
                                                >
                                                    Mark Unpaid
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => updateStatus(challan.id, true)}
                                                    className="text-xs px-2 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded hover:bg-green-500/20 mr-2"
                                                    title="Mark as Paid"
                                                >
                                                    Mark Paid
                                                </button>
                                            )}
                                            <button
                                                onClick={() => setSearch(challan.student_detail?.username || '')}
                                                className="text-xs px-2 py-1 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded hover:bg-blue-500/20 mr-2"
                                                title="View Student Ledger"
                                            >
                                                Ledger
                                            </button>
                                            <button
                                                onClick={() => printChallan(challan)}
                                                className="text-primary-400 hover:text-primary-300 mr-3"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => printChallan(challan)}
                                                className="text-slate-600 hover:text-dark-text"
                                            >
                                                Print
                                            </button>
                                        </td>

                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
