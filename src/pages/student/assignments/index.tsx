import { useState, useEffect } from 'react';
import StudentLayout from '../../../components/layout/StudentLayout';
import { StudentService } from '../../../services/student.service';
import { FileText, Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import Link from 'next/link';

interface Assignment {
    id: number;
    title: string;
    description: string;
    course_title: string;
    course_code: string;
    due_date: string;
    created_at: string;
    submissions_count: number; // In this context for student, checking if submitted might need a separate field or check
    // For now, we will rely on backend to eventually filter or just show all
    // Ideally backend should return "is_submitted" flag or we infer
    is_submitted: boolean;
}

export default function StudentAssignmentsPage() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'submitted'>('all');

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        setLoading(true);
        try {
            const data = await StudentService.getAssignments();
            // Handle pagination (DRF returns { results: [...] } if paginated)
            if (Array.isArray(data)) {
                setAssignments(data);
            } else if (data && Array.isArray((data as any).results)) {
                setAssignments((data as any).results);
            } else {
                console.error("Unexpected API response format:", data);
                setAssignments([]);
            }
        } catch (error) {
            console.error("Failed to fetch assignments", error);
        } finally {
            setLoading(false);
        }
    };

    const getFilteredAssignments = () => {
        if (filter === 'all') return assignments;
        if (filter === 'submitted') return assignments.filter(a => a.is_submitted);
        if (filter === 'pending') return assignments.filter(a => !a.is_submitted);
        return assignments;
    };

    return (
        <StudentLayout title="Assignments">
            <div className="mb-10">
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Assignments</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Manage your coursework and track your progress.</p>
            </div>

            {/* Modern Filter Tabs */}
            <div className="flex items-center gap-1 mb-8 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl w-fit border border-slate-200 dark:border-slate-700/50">
                {['all', 'pending', 'submitted'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={`px-6 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all duration-200 ${filter === f
                            ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24">
                    <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-400 text-sm font-medium animate-pulse">Loading assignments...</p>
                </div>
            ) : getFilteredAssignments().length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-b from-white to-slate-50 dark:from-slate-800/50 dark:to-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-inner text-slate-400 dark:text-slate-500">
                        <FileText className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No assignments found</h3>
                    <p className="text-slate-500 text-center max-w-sm">
                        {filter === 'all'
                            ? "You don't have any assignments yet. Enjoy the free time! 🎉"
                            : `No ${filter} assignments found.`}
                    </p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {getFilteredAssignments().map((assignment) => (
                        <div key={assignment.id} className="relative bg-white dark:bg-dark-card backdrop-blur-sm p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm hover:shadow-xl hover:shadow-primary-500/5 hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
                            {/* Decorative gradient blob */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100"></div>

                            <div className="relative flex flex-col md:flex-row gap-6 md:items-start justify-between">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-900/50 text-slate-500 border border-slate-200 dark:border-slate-700 uppercase tracking-wider">
                                            {assignment.course_code}
                                        </span>
                                        <div className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                                        <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 tracking-wide">
                                            {assignment.course_title}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                            {assignment.title}
                                        </h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2 max-w-2xl">
                                            {assignment.description}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-6 text-sm">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            <span className="font-medium">Assigned: {new Date(assignment.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className={`flex items-center gap-2 font-semibold ${assignment.is_submitted ? 'text-green-600 dark:text-green-400' : 'text-orange-500'
                                            }`}>
                                            <Clock className="w-4 h-4" />
                                            <span>Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-row md:flex-col items-center md:items-end gap-5 min-w-[160px] pl-4 md:border-l border-slate-100 dark:border-slate-700/50">
                                    {assignment.is_submitted ? (
                                        <>
                                            <div className="px-4 py-1.5 rounded-full text-sm font-bold bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 flex items-center gap-2 shadow-sm">
                                                <CheckCircle className="w-4 h-4" />
                                                Submitted
                                            </div>
                                            <Link
                                                href={`/student/assignments/${assignment.id}/submit`}
                                                className="w-full md:w-auto px-6 py-2.5 text-sm font-semibold rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all text-center"
                                            >
                                                View Details
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <div className="px-4 py-1.5 rounded-full text-sm font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 shadow-sm flex items-center gap-2">
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                                                </span>
                                                Pending
                                            </div>
                                            <Link
                                                href={`/student/assignments/${assignment.id}/submit`}
                                                className="w-full md:w-auto px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white text-sm font-bold rounded-xl text-center shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all"
                                            >
                                                Submit Assignment
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </StudentLayout>
    );
}
