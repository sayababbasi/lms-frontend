import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import { AssignmentService } from '../../../../services/assignment.service';
import GradingModal from '../../../../components/dashboard/assignments/GradingModal';

export default function AssignmentSubmissionsPage() {
    const router = useRouter();
    const { id } = router.query;

    const [assignment, setAssignment] = useState<any>(null);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isGradingOpen, setIsGradingOpen] = useState(false);
    const [gradingSubmission, setGradingSubmission] = useState<any>(null);
    const [savingGrade, setSavingGrade] = useState(false);

    useEffect(() => {
        if (id) {
            loadData();
        }
    }, [id]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [assignData, subsData] = await Promise.all([
                AssignmentService.getAssignment(Number(id)),
                AssignmentService.getSubmissions(Number(id))
            ]);
            setAssignment(assignData);
            setSubmissions(Array.isArray(subsData) ? subsData : (subsData as any).results || []);
        } catch (error) {
            console.error("Failed to load submissions", error);
            toast.error("Failed to load submissions");
        } finally {
            setLoading(false);
        }
    };

    const handleGradeClick = (submission: any) => {
        setGradingSubmission(submission);
        setIsGradingOpen(true);
    };

    const handleSaveGrade = async (gradeData: any) => {
        setSavingGrade(true);
        try {
            await AssignmentService.gradeSubmission(gradingSubmission.id, gradeData);
            toast.success("Grade saved successfully");
            setIsGradingOpen(false);
            setGradingSubmission(null);
            loadData();
        } catch (error) {
            console.error("Failed to save grade", error);
            toast.error("Failed to save grade");
        } finally {
            setSavingGrade(false);
        }
    };

    const gradedCount = submissions.filter(s => s.grade).length;
    const pendingCount = submissions.length - gradedCount;

    if (loading) {
        return (
            <DashboardLayout title="Submissions">
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
                        <p className="text-slate-500 dark:text-slate-400">Loading submissions...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (!assignment) {
        return (
            <DashboardLayout title="Submissions">
                <div className="flex flex-col items-center justify-center min-h-[50vh]">
                    <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center mb-6">
                        <svg className="w-10 h-10 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Assignment Not Found</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">The assignment you're looking for doesn't exist or has been removed.</p>
                    <button
                        onClick={() => router.push('/dashboard/assignments')}
                        className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-primary-500/20"
                    >
                        Back to Assignments
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout title={`Submissions: ${assignment.title}`}>
            <div className="space-y-6">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-primary-50 via-purple-50/50 to-transparent dark:from-primary-600/20 dark:via-purple-600/10 dark:to-transparent rounded-2xl border border-primary-100 dark:border-primary-500/20 p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100/50 dark:bg-primary-500/5 rounded-full -translate-y-32 translate-x-32"></div>
                    <div className="relative">
                        <button
                            onClick={() => router.push('/dashboard/assignments')}
                            className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-4 text-sm font-medium transition-colors group"
                        >
                            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Assignments
                        </button>

                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="px-3 py-1 bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 rounded-lg text-xs font-bold uppercase tracking-wider">
                                        Assignment
                                    </span>
                                </div>
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">{assignment.title}</h1>
                                <div className="flex flex-wrap items-center gap-4 text-sm">
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                        <svg className="w-4 h-4 text-emerald-500 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                        <span>{assignment.course_title}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                        <svg className="w-4 h-4 text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>Due: {new Date(assignment.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    {assignment.total_marks && (
                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                            <svg className="w-4 h-4 text-rose-500 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                            </svg>
                                            <span>Max: {assignment.total_marks} marks</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-dark-border p-5 flex items-center gap-4 shadow-sm">
                        <div className="w-14 h-14 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                            <svg className="w-7 h-7 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white">{submissions.length}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Total Submissions</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-dark-border p-5 flex items-center gap-4 shadow-sm">
                        <div className="w-14 h-14 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                            <svg className="w-7 h-7 text-emerald-500 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{gradedCount}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Graded</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-dark-card rounded-xl border border-slate-200 dark:border-dark-border p-5 flex items-center gap-4 shadow-sm">
                        <div className="w-14 h-14 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
                            <svg className="w-7 h-7 text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{pendingCount}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Pending Review</p>
                        </div>
                    </div>
                </div>

                {/* Submissions Table */}
                <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-dark-border overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-dark-border bg-slate-50 dark:bg-dark-surface/50 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Student Submissions</h2>
                        {pendingCount > 0 && (
                            <span className="px-3 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 rounded-full text-xs font-medium">
                                {pendingCount} awaiting review
                            </span>
                        )}
                    </div>

                    {submissions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-6">
                            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center mb-6">
                                <svg className="w-10 h-10 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No Submissions Yet</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm">Students haven't submitted their work for this assignment yet. Check back later.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50/50 dark:bg-dark-surface/30">
                                        <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500">Student</th>
                                        <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500">Submitted</th>
                                        <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500">Attachment</th>
                                        <th className="text-center p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500">Status</th>
                                        <th className="text-center p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500">Score</th>
                                        <th className="text-right p-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-dark-border/50">
                                    {submissions.map((sub) => (
                                        <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                                        {sub.student?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || 'S'}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-900 dark:text-white">{sub.student || 'Student'}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-500">{sub.student_email || ''}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div>
                                                    <p className="text-slate-900 dark:text-white text-sm">
                                                        {new Date(sub.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-500">
                                                        {new Date(sub.submitted_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {sub.file ? (
                                                    <a
                                                        href={sub.file}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 px-3 py-2 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-lg text-sm font-medium hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                        </svg>
                                                        View File
                                                    </a>
                                                ) : (
                                                    <span className="text-slate-400 dark:text-slate-500 text-sm italic">No attachment</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-center">
                                                {sub.grade ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-200 dark:border-emerald-500/20">
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Graded
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold border border-amber-200 dark:border-amber-500/20">
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-center">
                                                {sub.grade ? (
                                                    <span className="text-2xl font-bold text-slate-900 dark:text-white">{sub.grade.score}</span>
                                                ) : (
                                                    <span className="text-slate-300 dark:text-slate-500">—</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => handleGradeClick(sub)}
                                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${sub.grade
                                                            ? 'bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600'
                                                            : 'bg-primary-600 text-white hover:bg-primary-500 shadow-lg shadow-primary-500/20'
                                                        }`}
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    {sub.grade ? 'Edit' : 'Grade'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <GradingModal
                isOpen={isGradingOpen}
                onClose={() => setIsGradingOpen(false)}
                onSubmit={handleSaveGrade}
                initialData={gradingSubmission}
                isLoading={savingGrade}
            />
        </DashboardLayout>
    );
}
