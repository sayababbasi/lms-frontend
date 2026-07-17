import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { ResultService } from '../../../services/result.service';
import { CoursesService } from '../../../services/courses.service';
import { UsersService } from '../../../services/users.service';
import toast from 'react-hot-toast';
import {
    BarChart2, Users, CheckCircle, Trophy, Plus,
    Search, Filter, MoreVertical, Edit2, Trash2,
    Shield, ShieldOff, X, BookOpen, GraduationCap
} from 'lucide-react';

export default function ResultsPage() {
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [courses, setCourses] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        student: '',
        course: '',
        marks_obtained: '',
        total_marks: '100', // Default
        published: true
    });
    const [editingId, setEditingId] = useState<number | null>(null);

    // Filter State
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadResults();
    }, []);

    useEffect(() => {
        if (showModal) {
            loadDeps();
        }
    }, [showModal]);

    const loadResults = async () => {
        setLoading(true);
        try {
            const data = await ResultService.getResults() as any;
            setResults(Array.isArray(data) ? data : data.results || []);
        } catch (error) {
            console.error("Failed to load results", error);
            toast.error("Failed to load results");
        } finally {
            setLoading(false);
        }
    };

    const loadDeps = async () => {
        try {
            const [cData, sData] = await Promise.all([
                CoursesService.getAll(),
                UsersService.getStudents()
            ]);
            setCourses(Array.isArray(cData) ? cData : (cData as any).results || []);
            setStudents(Array.isArray(sData) ? sData : (sData as any).results || []);
        } catch (error) {
            console.error("Failed to load dependencies", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingId) {
                await ResultService.updateResult(editingId, formData);
                toast.success("Result updated successfully");
            } else {
                await ResultService.createResult(formData);
                toast.success("Result published successfully");
            }
            setShowModal(false);
            setEditingId(null);
            setFormData({ student: '', course: '', marks_obtained: '', total_marks: '100', published: true });
            loadResults();
        } catch (error) {
            console.error(error);
            toast.error("Failed to save result");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (result: any) => {
        setEditingId(result.id);
        setFormData({
            student: result.student,
            course: result.course,
            marks_obtained: result.marks_obtained,
            total_marks: result.total_marks,
            published: result.published
        });
        setShowModal(true);
    };

    const handleBlock = async (id: number, currentStatus: boolean) => {
        if (!confirm(`Are you sure you want to ${currentStatus ? 'unblock' : 'block'} this result?`)) return;
        try {
            await ResultService.updateResult(id, { is_blocked: !currentStatus });
            toast.success(`Result ${currentStatus ? 'unblocked' : 'blocked'}`);
            loadResults();
        } catch (error) {
            toast.error("Action failed");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this result permanently?")) return;
        try {
            await ResultService.deleteResult(id);
            toast.success("Result deleted");
            loadResults();
        } catch (error) {
            toast.error("Failed to delete");
        }
    };

    // Calculate Stats
    const totalPublished = results.length;
    const averageScore = results.length > 0
        ? (results.reduce((acc, curr) => acc + (parseFloat(curr.marks_obtained) / parseFloat(curr.total_marks) * 100), 0) / results.length).toFixed(1)
        : '0.0';
    const passRate = results.length > 0
        ? ((results.filter(r => !['F'].includes(r.grade)).length / results.length) * 100).toFixed(0)
        : '0';
    const topPerformer = results.length > 0
        ? results.reduce((prev, current) => (parseFloat(prev.marks_obtained) > parseFloat(current.marks_obtained) ? prev : current), results[0])
        : null;

    // Filter results
    const filteredResults = results.filter(result =>
        result.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.exam_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.course_title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = [
        {
            label: 'Total Published',
            value: totalPublished,
            icon: BarChart2,
            color: 'text-blue-500',
            bg: 'bg-blue-50 dark:bg-blue-500/10',
            border: 'border-blue-200 dark:border-blue-500/20',
            shadow: 'shadow-blue-500/20'
        },
        {
            label: 'Class Average',
            value: `${averageScore}%`,
            icon: Users,
            color: 'text-purple-500',
            bg: 'bg-purple-50 dark:bg-purple-500/10',
            border: 'border-purple-200 dark:border-purple-500/20',
            shadow: 'shadow-purple-500/20'
        },
        {
            label: 'Pass Rate',
            value: `${passRate}%`,
            icon: CheckCircle,
            color: 'text-green-500',
            bg: 'bg-green-50 dark:bg-green-500/10',
            border: 'border-green-200 dark:border-green-500/20',
            shadow: 'shadow-green-500/20'
        },
        {
            label: 'Top Score',
            value: topPerformer ? `${topPerformer.marks_obtained}` : '-',
            subValue: topPerformer ? topPerformer.student_name.split(' ')[0] : '',
            icon: Trophy,
            color: 'text-amber-500',
            bg: 'bg-amber-50 dark:bg-amber-500/10',
            border: 'border-amber-200 dark:border-amber-500/20',
            shadow: 'shadow-amber-500/20'
        },
    ];

    return (
        <DashboardLayout title="Results Management">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Results Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and publish student exam results and performance.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingId(null);
                        setFormData({ student: '', course: '', marks_obtained: '', total_marks: '100', published: true });
                        setShowModal(true);
                    }}
                    className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-primary-500/20 transition-all flex items-center gap-2 font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Publish Result
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="group bg-white dark:bg-dark-surface p-5 rounded-2xl border border-slate-200 dark:border-dark-border hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} ${stat.border} border ${stat.shadow} shadow-lg`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            {stat.subValue && (
                                <span className="text-xs font-bold px-2 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400">
                                    {stat.subValue}
                                </span>
                            )}
                        </div>
                        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{stat.label}</h3>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>

                        {/* Glow Effect */}
                        <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br ${stat.color.replace('text-', 'from-')}/10 to-transparent blur-2xl rounded-full group-hover:scale-150 transition-transform duration-500`} />
                    </div>
                ))}
            </div>

            {/* Content Card */}
            <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-100 dark:border-dark-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search results..."
                            className="pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-dark-surface border border-slate-200 dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 w-full sm:w-64 text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-white bg-slate-50 dark:bg-dark-surface rounded-lg border border-slate-200 dark:border-dark-border">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 dark:bg-dark-surface border-b border-slate-200 dark:border-dark-border">
                            <tr>
                                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Student</th>
                                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Course / Exam</th>
                                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Score</th>
                                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Grade</th>
                                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-dark-border">
                            {loading ? (
                                <tr><td colSpan={6} className="p-12 text-center text-slate-500 animate-pulse">Loading results data...</td></tr>
                            ) : filteredResults.length === 0 ? (
                                <tr><td colSpan={6} className="p-12 text-center text-slate-500">No results found matching your search.</td></tr>
                            ) : (
                                filteredResults.map((result) => (
                                    <tr key={result.id} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-xs">
                                                    {result.student_name?.charAt(0)}
                                                </div>
                                                <span className="font-medium text-slate-900 dark:text-white">{result.student_name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-600 dark:text-slate-400 text-sm">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-slate-900 dark:text-white">{result.course_title || 'N/A'}</span>
                                                <span className="text-xs">{result.exam_title || 'Mid-Term Exam'}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                                                {result.marks_obtained}
                                                <span className="text-slate-400 font-normal text-xs">/ {result.total_marks}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${['A', 'A+'].includes(result.grade) ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20' : ['B', 'B+'].includes(result.grade) ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20' : ['F'].includes(result.grade) ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'}`}>
                                                {result.grade || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {result.is_blocked ? (
                                                <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded-lg border border-red-200 dark:border-red-500/20">
                                                    <ShieldOff className="w-3 h-3" /> Blocked
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-lg border border-green-200 dark:border-green-500/20">
                                                    <Shield className="w-3 h-3" /> Visible
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEdit(result)} className="p-2 text-slate-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded-lg transition-colors" title="Edit Result">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleBlock(result.id, result.is_blocked)} className={`p-2 rounded-lg transition-colors ${result.is_blocked ? 'text-green-500 hover:bg-green-50 dark:hover:bg-green-500/10' : 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10'}`} title={result.is_blocked ? "Unblock" : "Block"}>
                                                    {result.is_blocked ? <Shield className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />}
                                                </button>
                                                <button onClick={() => handleDelete(result.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors" title="Delete Result">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Publish/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden scale-100 transition-all">
                        <div className="p-6 border-b border-slate-100 dark:border-dark-border flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                {editingId ? <Edit2 className="w-5 h-5 text-primary-500" /> : <Plus className="w-5 h-5 text-primary-500" />}
                                {editingId ? 'Edit Result' : 'Publish Result'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div className="grid grid-cols-1 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Student</label>
                                    <div className="relative">
                                        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <select
                                            required
                                            className="w-full bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl pl-10 pr-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all appearance-none"
                                            value={formData.student}
                                            onChange={e => setFormData({ ...formData, student: e.target.value })}
                                            disabled={!!editingId}
                                        >
                                            <option value="">Select Student</option>
                                            {students.map((s: any) => (
                                                <option key={s.id} value={s.user?.id}>{s.user?.first_name} {s.user?.last_name} ({s.roll_number})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Course / Exam</label>
                                    <div className="relative">
                                        <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <select
                                            required
                                            className="w-full bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl pl-10 pr-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all appearance-none"
                                            value={formData.course}
                                            onChange={e => setFormData({ ...formData, course: e.target.value })}
                                            disabled={!!editingId}
                                        >
                                            <option value="">Select Course</option>
                                            {courses.map(c => (
                                                <option key={c.id} value={c.id}>{c.title} ({c.code})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Marks Obtained</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        className="w-full bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                        value={formData.marks_obtained}
                                        onChange={e => setFormData({ ...formData, marks_obtained: e.target.value })}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Total Marks</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        className="w-full bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                        value={formData.total_marks}
                                        onChange={e => setFormData({ ...formData, total_marks: e.target.value })}
                                        placeholder="100.00"
                                    />
                                </div>
                            </div>

                            <div className="pt-2 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-5 py-2.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-primary-500/20 disabled:opacity-50 flex items-center gap-2 transform active:scale-95 transition-all"
                                >
                                    {submitting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                                    {editingId ? 'Update Result' : 'Publish Result'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
