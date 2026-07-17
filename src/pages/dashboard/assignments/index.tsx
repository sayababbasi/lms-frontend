import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { AssignmentService } from '../../../services/assignment.service';
import { ExamService } from '../../../services/exam.service';
import AssignmentModal from '../../../components/dashboard/assignments/AssignmentModal';
import ExamModal from '../../../components/dashboard/exams/ExamModal';

export default function AssignmentsPage() {
    const router = useRouter();

    // View Mode: 'STATS' (Overview) or 'LIST' (Details for a course)
    const [viewMode, setViewMode] = useState<'STATS' | 'LIST'>('STATS');
    const [activeTab, setActiveTab] = useState<'ASSIGNMENTS' | 'QUIZZES'>('ASSIGNMENTS');
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

    // Data States
    const [stats, setStats] = useState<any[]>([]);
    const [assignments, setAssignments] = useState<any[]>([]);
    const [quizzes, setQuizzes] = useState<any[]>([]);

    const [loading, setLoading] = useState(false);

    // Modals
    const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState<any>(null);

    const [isExamModalOpen, setIsExamModalOpen] = useState(false);
    const [editingExam, setEditingExam] = useState<any>(null);

    useEffect(() => {
        if (viewMode === 'STATS') {
            loadStats();
        } else if (selectedCourseId) {
            if (activeTab === 'ASSIGNMENTS') loadAssignments(selectedCourseId);
            else loadQuizzes(selectedCourseId);
        }
    }, [viewMode, activeTab, selectedCourseId]);

    const loadStats = async () => {
        setLoading(true);
        try {
            const data = await AssignmentService.getCourseStats();
            setStats(Array.isArray(data) ? data : (data as any).results || []);
        } catch (error) {
            console.error("Failed to load stats", error);
            toast.error("Failed to load course statistics");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateExam = async (data: any) => {
        try {
            // Ensure payload matches backend expectations
            // Exam model expects: course (id), title, start_time, end_time
            const payload = {
                ...data,
                course: typeof data.course === 'object' ? data.course.id : data.course // Handle if course object or ID
            };

            if (editingExam) {
                // Assuming update endpoint exists, though service might need update
                // ExamService.updateExam(editingExam.id, payload)
                // For now, let's treat update same as create or assume unimplemented backend update for MVP
                toast.error("Update function not yet fully implemented in service");
            } else {
                await ExamService.createExam(payload);
                toast.success("Quiz created successfully");
            }
            setIsExamModalOpen(false);
            setEditingExam(null);
            if (selectedCourseId) loadQuizzes(selectedCourseId);
            // also reload stats if needed 
            if (viewMode === 'STATS') loadStats();

        } catch (error: any) {
            console.error("Failed to save quiz", error);
            const msg = error.response?.data?.detail
                || (typeof error.response?.data === 'object' ? JSON.stringify(error.response?.data) : String(error.response?.data))
                || "Failed to save quiz";
            toast.error(msg);
        }
    };

    const loadAssignments = async (courseId: number) => {
        setLoading(true);
        try {
            const data = await AssignmentService.getAssignments(courseId) as any;
            setAssignments(Array.isArray(data) ? data : (data as any).results || []);
        } catch (error) {
            console.error("Failed to load assignments", error);
            toast.error("Failed to load assignments");
        } finally {
            setLoading(false);
        }
    };





    const loadQuizzes = async (courseId: number) => {
        setLoading(true);
        try {
            const data = await ExamService.getExams(courseId) as any;
            // Check if ExamService needs import in index.tsx? It was missing in previous file view (line 1-6). 
            // I'll add the import in a separate call or hope it's there. 
            // Wait, I see lines 1-6 in previous view. It only has AssignmentService. 
            // I need to add ExamService import too.
            setQuizzes(Array.isArray(data) ? data : (data as any).results || []);
        } catch (error) {
            console.error("Failed to load quizzes", error);
            toast.error("Failed to load quizzes");
        } finally {
            setLoading(false);
        }
    };



    const handleManageCourse = (courseId: number) => {
        setSelectedCourseId(courseId);
        setViewMode('LIST');
        setActiveTab('ASSIGNMENTS');
    };


    const handleBackToStats = () => {
        setViewMode('STATS');
        setSelectedCourseId(null);
    };



    const handleCreateAssignment = async (data: any) => {
        try {
            if (editingAssignment) {
                await AssignmentService.updateAssignment(editingAssignment.id, data);
                toast.success("Assignment updated");
            } else {
                await AssignmentService.createAssignment({ ...data, course: selectedCourseId }); // Ensure course is linked
                toast.success("Assignment created successfully");
            }
            setIsAssignmentModalOpen(false);
            setEditingAssignment(null);
            if (selectedCourseId) loadAssignments(selectedCourseId);
        } catch (error: any) {
            console.error("Failed to save assignment", error);
            const msg = error.response?.data?.detail
                || (typeof error.response?.data === 'object' ? JSON.stringify(error.response?.data) : String(error.response?.data))
                || "Failed to save assignment";
            toast.error(msg);
        }
    };



    const handleDeleteAssignment = async (id: number) => {
        if (!confirm("Are you sure you want to delete this assignment?")) return;
        try {
            await AssignmentService.deleteAssignment(id);
            toast.success("Assignment deleted");
            if (selectedCourseId) loadAssignments(selectedCourseId);
        } catch (error) {
            toast.error("Failed to delete assignment");
        }
    };



    return (
        <DashboardLayout title="Assignments & Grading">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-dark-text">Assignments & Grading</h1>
                    <p className="text-slate-600 mt-1">
                        {viewMode === 'STATS' ? 'Course-wise Overview' : 'Managing Assignments & Quizzes'}
                    </p>
                </div>
                {viewMode === 'LIST' && (
                    <div className="flex gap-2">
                        <button
                            onClick={handleBackToStats}
                            className="px-4 py-2 text-slate-600 hover:text-dark-text bg-dark-surface border border-dark-border rounded-lg transition-all"
                        >
                            Back to Overview
                        </button>
                        {activeTab === 'ASSIGNMENTS' && (
                            <button
                                onClick={() => { setEditingAssignment(null); setIsAssignmentModalOpen(true); }}
                                className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-dark-text rounded-lg shadow-lg shadow-primary-500/20 transition-all flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                Create Assignment
                            </button>
                        )}
                        {activeTab === 'QUIZZES' && (
                            <button
                                onClick={() => { setEditingExam(null); setIsExamModalOpen(true); }}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                Create Quiz
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* View Mode: STATS (Overview) */}
            {viewMode === 'STATS' && (
                <div className="bg-dark-surface/50 backdrop-blur-md border border-dark-border rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-dark-surface border-b border-dark-border text-slate-600 text-sm uppercase tracking-wider">
                                    <th className="p-4 font-medium">Course</th>
                                    <th className="p-4 font-medium text-center">Assignments</th>
                                    <th className="p-4 font-medium text-center">Quizzes</th>
                                    <th className="p-4 font-medium">Submissions</th>
                                    <th className="p-4 font-medium">Avg Grade</th>
                                    <th className="p-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-dark-border">
                                {loading && !stats.length ? (
                                    <tr><td colSpan={6} className="p-8 text-center text-slate-600">Loading Stats...</td></tr>
                                ) : stats.length === 0 ? (
                                    <tr><td colSpan={6} className="p-8 text-center text-slate-600">No courses found.</td></tr>
                                ) : (
                                    stats.map((course) => (
                                        <tr key={course.id} className="hover:bg-white/5 transition-colors">
                                            <td className="p-4">
                                                <span className="font-medium text-dark-text block">{course.title}</span>
                                                <span className="text-xs text-primary-600 font-mono">{course.code}</span>
                                            </td>
                                            <td className="p-4 text-center text-slate-700 font-mono">{course.assignments_count}</td>
                                            <td className="p-4 text-center text-slate-700 font-mono">{course.quizzes_count}</td>
                                            <td className="p-4 text-slate-700">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-slate-600">Received: <span className="text-dark-text">{course.submissions_count}</span></span>
                                                    <span className="text-xs text-slate-600">Graded: <span className="text-green-600">{course.graded_submissions_count}</span></span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {course.average_grade ? (
                                                    <span className={`font-bold ${course.average_grade >= 80 ? 'text-green-600' : course.average_grade >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                        {course.average_grade.toFixed(1)}%
                                                    </span>
                                                ) : <span className="text-slate-600">-</span>}
                                            </td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => handleManageCourse(course.id)}
                                                    className="px-3 py-1 bg-white/5 hover:bg-white/10 text-primary-600 rounded border border-slate-300 transition-all text-sm"
                                                >
                                                    Manage
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* View Mode: LIST (Details) */}
            {viewMode === 'LIST' && (
                <>
                    {/* Tabs */}
                    <div className="flex items-center gap-1 bg-dark-surface/50 p-1 rounded-lg w-fit mb-6 border border-dark-border">
                        <button
                            onClick={() => setActiveTab('ASSIGNMENTS')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'ASSIGNMENTS' ? 'bg-primary-600 text-white shadow' : 'text-slate-600 hover:text-dark-text'}`}
                        >
                            Assignments
                        </button>
                        <button
                            onClick={() => setActiveTab('QUIZZES')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'QUIZZES' ? 'bg-primary-600 text-white shadow' : 'text-slate-600 hover:text-dark-text'}`}
                        >
                            Quizzes
                        </button>
                    </div>

                    <div className="bg-dark-surface/50 backdrop-blur-md border border-dark-border rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            {/* Assignments Table */}
                            {activeTab === 'ASSIGNMENTS' && (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-dark-surface border-b border-dark-border text-slate-600 text-sm uppercase tracking-wider">
                                            <th className="p-4 font-medium">Title</th>
                                            <th className="p-4 font-medium">Due Date</th>
                                            <th className="p-4 font-medium">Submissions</th>
                                            <th className="p-4 font-medium text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-dark-border">
                                        {loading && !assignments.length ? (
                                            <tr><td colSpan={4} className="p-8 text-center text-slate-600">Loading Assignments...</td></tr>
                                        ) : assignments.length === 0 ? (
                                            <tr><td colSpan={4} className="p-8 text-center text-slate-600">No assignments found for this course.</td></tr>
                                        ) : (
                                            assignments.map((assignment) => (
                                                <tr key={assignment.id} className="hover:bg-white/5 transition-colors">
                                                    <td className="p-4">
                                                        <span className="font-medium text-dark-text block">{assignment.title}</span>
                                                        <span className="text-xs text-slate-600 line-clamp-1">{assignment.description}</span>
                                                    </td>
                                                    <td className="p-4 text-slate-700">
                                                        {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() + ' ' + new Date(assignment.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'No Due Date'}
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-24 h-2 bg-slate-300 rounded-full overflow-hidden flex-1 max-w-[100px]">
                                                                <div className="h-full bg-primary-600" style={{ width: assignment.submissions_count > 0 ? '100%' : '0%' }}></div>
                                                            </div>
                                                            <span className="text-xs text-slate-600 font-medium">
                                                                {assignment.submissions_count !== undefined ? assignment.submissions_count : '-'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-right space-x-2">
                                                        <button
                                                            onClick={() => router.push(`/dashboard/assignments/${assignment.id}/submissions`)}
                                                            className="text-primary-600 hover:text-primary-500 text-sm font-medium mr-2"
                                                        >
                                                            Submissions
                                                        </button>
                                                        <button
                                                            onClick={() => { setEditingAssignment(assignment); setIsAssignmentModalOpen(true); }}
                                                            className="text-primary-600 hover:text-primary-500 text-sm"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteAssignment(assignment.id)}
                                                            className="text-red-400 hover:text-red-300 text-sm"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            )}

                            {/* Quizzes Table */}
                            {activeTab === 'QUIZZES' && (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-dark-surface border-b border-dark-border text-slate-600 text-sm uppercase tracking-wider">
                                            <th className="p-4 font-medium">Quiz Title</th>
                                            <th className="p-4 font-medium">Date</th>
                                            <th className="p-4 font-medium">Duration</th>
                                            <th className="p-4 font-medium text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-dark-border">
                                        {loading && !quizzes.length ? (
                                            <tr><td colSpan={4} className="p-8 text-center text-slate-600">Loading Quizzes...</td></tr>
                                        ) : quizzes.length === 0 ? (
                                            <tr><td colSpan={4} className="p-8 text-center text-slate-600">No quizzes found for this course.</td></tr>
                                        ) : (
                                            quizzes.map((quiz) => (
                                                <tr key={quiz.id} className="hover:bg-white/5 transition-colors">
                                                    <td className="p-4 font-medium text-dark-text">{quiz.title}</td>
                                                    <td className="p-4 text-slate-700">
                                                        {quiz.date ? new Date(quiz.date).toLocaleDateString() : 'TBD'}
                                                    </td>
                                                    <td className="p-4 text-slate-700">{quiz.duration ? `${quiz.duration} mins` : 'N/A'}</td>
                                                    <td className="p-4 text-right">
                                                        <button className="text-primary-600 hover:text-primary-500 mr-3">Edit</button>
                                                        <button className="text-red-400 hover:text-red-300">Delete</button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </>
            )}

            <AssignmentModal
                isOpen={isAssignmentModalOpen}
                onClose={() => setIsAssignmentModalOpen(false)}
                onSubmit={handleCreateAssignment}
                initialData={editingAssignment}
                isLoading={loading && isAssignmentModalOpen}
            />

            <ExamModal
                isOpen={isExamModalOpen}
                onClose={() => setIsExamModalOpen(false)}
                onSubmit={handleCreateExam}
                initialData={editingExam}
                isLoading={loading && isExamModalOpen}
            />
        </DashboardLayout>
    );
}
