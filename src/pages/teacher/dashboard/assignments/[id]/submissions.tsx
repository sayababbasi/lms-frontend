import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import TeacherLayout from '../../../../../components/layout/TeacherLayout';
import { ChevronLeft, Filter, Search, Download, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { AssignmentsService, Submission } from '../../../../../services/assignments';
import { toast } from 'react-hot-toast';
import GradingModal from '../../../../../components/dashboard/assignments/GradingModal';

export default function AssignmentSubmissions() {
    const router = useRouter();
    const { id } = router.query;
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<'All' | 'Graded' | 'Pending'>('All');

    // Scale for modal
    const [selectedSubmission, setSelectedSubmission] = useState<{ id: number, studentName: string, grade?: { score: number, feedback: string }, gradeId?: number, fullSubmission?: Submission } | null>(null);
    const [isGradingModalOpen, setIsGradingModalOpen] = useState(false);

    const fetchSubmissions = async () => {
        if (!id) return;
        try {
            setIsLoading(true);
            const data = await AssignmentsService.getSubmissions(Number(id));
            setSubmissions(data);
        } catch (error) {
            console.error("Failed to load submissions", error);
            toast.error("Failed to load submissions");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, [id]);

    const openGradingModal = (submission: Submission) => {
        setSelectedSubmission({
            id: submission.id,
            studentName: submission.student_name || `Student #${submission.student}`,
            grade: submission.grade ? {
                score: submission.grade.score,
                feedback: submission.grade.feedback
            } : undefined,
            gradeId: submission.grade?.id,
            fullSubmission: submission
        });
        setIsGradingModalOpen(true);
    };

    const handleGradeSubmit = async (data: { score: number; feedback: string }) => {
        if (!selectedSubmission) return;

        const { score, feedback } = data;

        try {
            await AssignmentsService.gradeSubmission(selectedSubmission.id, {
                score,
                feedback
            }, selectedSubmission.gradeId);
            toast.success("Grade updated successfully");
            setIsGradingModalOpen(false);
            fetchSubmissions();
        } catch (error: any) {
            console.error("Grading failed", error);
            const errorMessage = error.response?.data ? JSON.stringify(error.response.data) : "Failed to update grade";
            toast.error(errorMessage);
        }
    };

    const handleExport = () => {
        if (submissions.length === 0) {
            toast.error("No data to export");
            return;
        }

        // Simple CSV Export
        const headers = ["Student ID", "Submitted At", "Status", "Score"];
        const rows = submissions.map(s => [
            s.student,
            s.submitted_at,
            s.status || (s.grade ? 'Graded' : 'Pending'),
            s.grade?.score || ''
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `submissions_assignment_${id}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredSubmissions = submissions.filter(s => {
        if (filterStatus === 'All') return true;
        const isGraded = !!s.grade;
        if (filterStatus === 'Graded') return isGraded;
        if (filterStatus === 'Pending') return !isGraded;
        return true;
    });

    // Toggle filter
    const toggleFilter = () => {
        if (filterStatus === 'All') setFilterStatus('Pending');
        else if (filterStatus === 'Pending') setFilterStatus('Graded');
        else setFilterStatus('All');
    };

    return (
        <TeacherLayout title="Grading Submissions">
            <div className="space-y-6">
                {/* Back Link */}
                <Link
                    href="/teacher/dashboard/assignments"
                    className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors w-fit"
                >
                    <ChevronLeft className="w-5 h-5" />
                    <span>Back to Assignments</span>
                </Link>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Submissions</h1>
                        <p className="text-slate-500">Manage and grade student work for Assignment #{id}</p>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Search students..."
                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                        />
                        <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={toggleFilter}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium text-sm"
                        >
                            <Filter className="w-4 h-4" />
                            {filterStatus === 'All' ? 'Filter: All' : `Filter: ${filterStatus}`}
                        </button>
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all font-medium text-sm"
                        >
                            <Download className="w-4 h-4" />
                            Export Grades
                        </button>
                    </div>
                </div>

                {/* Submissions Table */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-left">
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Submitted</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Score</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {isLoading ? (
                                    <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr>
                                ) : filteredSubmissions.length === 0 ? (
                                    <tr><td colSpan={5} className="p-4 text-center text-slate-500">No submissions found.</td></tr>
                                ) : (
                                    filteredSubmissions.map((submission) => {
                                        const isGraded = !!submission.grade;
                                        const score = submission.grade?.score;

                                        return (
                                            <tr key={submission.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-slate-900 dark:text-white">{submission.student_name || `Student #${submission.student}`}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-slate-400" />
                                                        {new Date(submission.submitted_at).toLocaleString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${isGraded ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' :
                                                        'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
                                                        }`}>
                                                        {isGraded ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                                        {isGraded ? 'Graded' : 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {isGraded ? (
                                                        <span className="font-bold text-slate-900 dark:text-white">{score}</span>
                                                    ) : (
                                                        <span className="text-slate-400 italic">--</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => openGradingModal(submission)}
                                                        className="text-indigo-600 dark:text-indigo-400 font-medium text-sm hover:underline"
                                                    >
                                                        {isGraded ? 'Edit Grade' : 'Grade Submission'}
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <GradingModal
                    isOpen={isGradingModalOpen}
                    onClose={() => setIsGradingModalOpen(false)}
                    onSubmit={handleGradeSubmit}
                    isLoading={isLoading}
                    initialData={{
                        student: selectedSubmission?.studentName,
                        grade: selectedSubmission?.grade,
                        fullSubmission: selectedSubmission?.fullSubmission
                    }}
                />
            </div>
        </TeacherLayout>
    );
}
