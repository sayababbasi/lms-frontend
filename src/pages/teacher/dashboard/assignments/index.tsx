import { useState, useEffect } from 'react';
import TeacherLayout from '../../../../components/layout/TeacherLayout';
import { FileText, Search, Clock, MoreVertical, Plus } from 'lucide-react';
import Link from 'next/link';
import AssignmentModal from '../../../../components/dashboard/assignments/AssignmentModal';
import { AssignmentsService, Assignment } from '../../../../services/assignments';
import { toast } from 'react-hot-toast';

export default function TeacherAssignments() {
    // API State
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // UI State
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Fetch Assignments
    const fetchAssignments = async () => {
        try {
            setIsLoading(true);
            const data = await AssignmentsService.getAll();
            setAssignments(data);
        } catch (error) {
            console.error("Failed to fetch assignments", error);
            toast.error("Failed to load assignments");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignments();
    }, []);

    // Filter Logic
    const filteredAssignments = assignments.filter(assignment => {
        const titleMatch = assignment.title?.toLowerCase().includes(searchQuery.toLowerCase());
        // Handling optional fields safely
        const courseMatch = (assignment.course_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (assignment.course_code || '').toLowerCase().includes(searchQuery.toLowerCase());

        const matchesSearch = titleMatch || courseMatch;
        // Backend might need to return 'status' or we calculate it based on due_date
        const isActive = new Date(assignment.due_date) > new Date();
        const deducedStatus = assignment.status || (isActive ? 'Active' : 'Closed');

        const matchesStatus = filterStatus === 'All' || deducedStatus === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleCreateAssignment = async (data: any) => {
        try {
            // Validate that we have a valid date
            const date = new Date(data.due_date);
            if (isNaN(date.getTime())) {
                toast.error("Invalid due date");
                return;
            }

            await AssignmentsService.create({
                title: data.title,
                description: data.description,
                due_date: date.toISOString(), // Send proper ISO format
                course: parseInt(data.course), // Ensure ID is number
                status: data.status,
                max_score: parseInt(data.max_score)
            });
            toast.success("Assignment created successfully!");
            fetchAssignments(); // Refresh list
            setIsCreateModalOpen(false);
        } catch (error: any) {
            console.error("Failed to create assignment", error);
            // Extract detailed validation errors from Django if they exist
            if (error.response?.data) {
                const messages = Object.entries(error.response.data)
                    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value[0] : value}`)
                    .join(", ");
                toast.error(`Error: ${messages}`);
            } else {
                toast.error("Failed to create assignment");
            }
        }
    };

    return (
        <TeacherLayout title="Assignments & Grading">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent inline-block">Assignments & Grading</h1>
                        <p className="text-slate-500 dark:text-slate-400">Manage assignments and grade student submissions.</p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all transform hover:-translate-y-0.5"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Create New</span>
                    </button>
                </div>

                {/* Toolbar */}
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-4 rounded-2xl border border-white/20 dark:border-slate-700/50 flex flex-col md:flex-row gap-4 justify-between items-center shadow-lg shadow-slate-200/50 dark:shadow-black/20">
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Search assignments..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-12 pr-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-inner"
                        />
                        <Search className="w-5 h-5 text-indigo-500 dark:text-indigo-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    </div>

                    <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700/50">
                        {['All', 'Active', 'Closed'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filterStatus === status
                                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Assignments List */}
                <div className="grid gap-4">
                    {isLoading ? (
                        <div className="text-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                            <p className="text-slate-500">Loading assignments...</p>
                        </div>
                    ) : filteredAssignments.length > 0 ? (
                        filteredAssignments.map((assignment) => {
                            const isActive = new Date(assignment.due_date) > new Date();
                            const status = assignment.status || (isActive ? 'Active' : 'Closed');
                            // Fallbacks for display
                            const displayCourseCode = assignment.course_code || `Class #${assignment.course}`;
                            const displayCourseName = assignment.course_name || 'Course details loading...';

                            return (
                                <div key={assignment.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 hover:border-indigo-500/30 transition-all group shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />

                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">

                                        {/* Info */}
                                        <div className="flex items-start gap-5">
                                            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-500/10 dark:to-violet-500/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                                <FileText className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{assignment.title}</h3>
                                                <div className="flex flex-wrap gap-3 items-center mb-3">
                                                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-lg border border-indigo-100 dark:border-indigo-500/20">{displayCourseCode}</span>
                                                    <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">{displayCourseName}</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-500">
                                                    <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                                                        <Clock className="w-3.5 h-3.5 text-indigo-500" />
                                                        Due: {new Date(assignment.due_date).toLocaleDateString()}
                                                    </span>
                                                    <span className={`px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${status === 'Active'
                                                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600'
                                                        }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                                                        {status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stats & Actions */}
                                        <div className="flex flex-col sm:flex-row items-center gap-6 lg:gap-12 border-t lg:border-t-0 border-slate-100 dark:border-slate-700 pt-4 lg:pt-0 pl-0 lg:pl-6">
                                            <div className="flex gap-8 text-center divide-x divide-slate-100 dark:divide-slate-700">
                                                <div className="px-4">
                                                    <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{assignment.submissions_count || 0}</p>
                                                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Submitted</p>
                                                </div>
                                                <div className="px-4 pl-8">
                                                    {/* Assuming pending calc or 0 for now */}
                                                    <p className={`text-2xl font-black tracking-tight ${0 > 0 ? 'text-amber-500 dark:text-amber-400' : 'text-emerald-500 dark:text-emerald-400'}`}>{assignment.pending || 0}</p>
                                                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Pending</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                                <Link
                                                    href={`/teacher/dashboard/assignments/${assignment.id}/submissions`}
                                                    className="flex-1 sm:flex-none text-center px-6 py-2.5 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-slate-900/10 dark:shadow-indigo-600/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                                                >
                                                    Grade Now
                                                </Link>
                                                <button className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div className="text-center py-20 bg-white/50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                                <Search className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No assignments found</h3>
                            <p className="text-slate-500 dark:text-slate-400">Create a new assignment to get started.</p>
                        </div>
                    )}
                </div>

                {/* Create Assignment Modal */}
                <AssignmentModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onSubmit={handleCreateAssignment}
                />
            </div>
        </TeacherLayout>
    );
}
