import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import StudentLayout from '../../../components/layout/StudentLayout';
import { StudentService } from '../../../services/student.service';
import { FinanceService } from '../../../services/finance.service';
import Link from 'next/link';
import {
    BookOpen, CheckSquare, Clock, Award, Calendar, FileText,
    DollarSign, ClipboardList, GraduationCap, BarChart3,
    ChevronRight, Wallet, AlertCircle, MessageSquare, Send, User, Search
} from 'lucide-react';
import { MessagesService } from '../../../services/messages';

export default function StudentDashboard() {
    const { user } = useAuth();
    const [statsData, setStatsData] = useState({
        enrolled_courses: 0,
        pending_assignments: 0,
        attendance: '0%',
        cgpa: '0.00'
    });
    const [error, setError] = useState('');
    const [pendingAssignments, setPendingAssignments] = useState<any[]>([]);
    const [upcomingExams, setUpcomingExams] = useState<any[]>([]);
    const [pendingChallans, setPendingChallans] = useState<any[]>([]);
    const [recentMessages, setRecentMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [stats, assignments, exams, challans, conversations] = await Promise.all([
                    StudentService.getStats(),
                    StudentService.getAssignments(),
                    StudentService.getExams().catch(() => []),
                    FinanceService.getMyChallans().catch(() => []),
                    MessagesService.getConversations().catch(() => [])
                ]);

                setStatsData(stats as any);
                setRecentMessages(conversations || []);

                // Handle assignments
                let assignmentsList: any[] = [];
                if (Array.isArray(assignments)) {
                    assignmentsList = assignments;
                } else if (assignments && Array.isArray((assignments as any).results)) {
                    assignmentsList = (assignments as any).results;
                }
                const pending = assignmentsList
                    .filter((a: any) => !a.is_submitted)
                    .sort((a: any, b: any) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
                setPendingAssignments(pending);

                // Handle exams
                let examsList: any[] = [];
                if (Array.isArray(exams)) {
                    examsList = exams;
                } else if (exams && Array.isArray((exams as any).results)) {
                    examsList = (exams as any).results;
                }
                const upcoming = examsList
                    .filter((e: any) => new Date(e.start_time) > new Date() && !e.has_attempted)
                    .sort((a: any, b: any) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
                setUpcomingExams(upcoming.slice(0, 3));

                // Handle challans
                let challansList: any[] = [];
                if (Array.isArray(challans)) {
                    challansList = challans;
                } else if (challans && Array.isArray((challans as any).results)) {
                    challansList = (challans as any).results;
                }
                const unpaid = challansList.filter((c: any) => c.status === 'unpaid' || c.status === 'pending');
                setPendingChallans(unpaid);

                setError('');
            } catch (error: any) {
                console.error("Failed to load dashboard data", error);
                setError(error.message || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const stats = [
        { label: 'Enrolled Courses', value: statsData.enrolled_courses, icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { label: 'Pending Assignments', value: statsData.pending_assignments, icon: CheckSquare, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
        { label: 'Attendance', value: statsData.attendance, icon: Clock, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
        { label: 'CGPA', value: statsData.cgpa, icon: Award, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    ];

    const quickLinks = [
        { href: '/student/courses', label: 'My Courses', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        { href: '/student/assignments', label: 'Assignments', icon: ClipboardList, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
        { href: '/student/exams', label: 'Exams', icon: FileText, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
        { href: '/student/attendance', label: 'Attendance', icon: Calendar, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
        { href: '/student/results', label: 'Results', icon: BarChart3, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
        { href: '/student/finance', label: 'Fee & Finance', icon: Wallet, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
        { href: '/student/timetable', label: 'Timetable', icon: Clock, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
        { href: '/student/results', label: 'Transcript', icon: GraduationCap, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    ];

    return (
        <StudentLayout title="Dashboard">
            {/* Page Header */}
            <div className="mb-6 md:mb-8 relative overflow-hidden p-6 md:p-8 rounded-3xl bg-white dark:bg-dark-card border border-slate-100 dark:border-dark-border shadow-sm">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">{user?.first_name || 'Student'}</span>! 👋
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 text-base md:text-lg">
                            You have <span className="font-bold text-slate-900 dark:text-white">{statsData.pending_assignments} assignments</span> pending.
                        </p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-1">Current Date</p>
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold bg-slate-50 dark:bg-dark-bg px-4 py-2 rounded-xl border border-slate-100 dark:border-dark-border">
                            <Calendar className="w-5 h-5 text-primary-500" />
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </div>
                    </div>
                </div>
                {/* Decorative gradients */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-500/10 to-indigo-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-orange-500/10 to-amber-500/10 blur-3xl rounded-full translate-y-1/2 -translate-x-1/2" />

                {error && (
                    <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/20 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5" />
                        Error: {error}
                    </div>
                )}
            </div>

            {/* Fee Alert Banner */}
            {pendingChallans.length > 0 && (
                <Link href="/student/finance" className="block mb-6">
                    <div className="bg-dark-surface border border-amber-500/30 rounded-xl p-4 flex items-center justify-between hover:border-amber-500/50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20">
                                <DollarSign className="w-6 h-6 text-amber-500" />
                            </div>
                            <div>
                                <p className="font-medium text-dark-text">
                                    You have {pendingChallans.length} pending fee challan{pendingChallans.length > 1 ? 's' : ''}
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Click to view and pay your fees
                                </p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                    </div>
                </Link>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-dark-surface p-6 rounded-2xl border border-dark-border hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                        <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</h3>
                        <div className="text-2xl font-bold text-dark-text mt-1">{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Pending Assignments */}
                <div className="bg-white dark:bg-dark-card p-6 rounded-3xl border border-slate-100 dark:border-dark-border shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/20">
                                <CheckSquare className="w-5 h-5" />
                            </div>
                            Pending Assignments
                        </h3>
                        <Link href="/student/assignments" className="group flex items-center gap-1 text-sm font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors">
                            View All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : pendingAssignments.length === 0 ? (
                        <div className="text-center py-16 bg-slate-50/50 dark:bg-dark-surface/50 rounded-2xl border border-dashed border-slate-200 dark:border-dark-border">
                            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center mx-auto mb-4 text-green-600 dark:text-green-400">
                                <CheckSquare className="w-8 h-8" />
                            </div>
                            <h4 className="text-slate-900 dark:text-white font-semibold mb-1">All Caught Up!</h4>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">No pending assignments found</p>
                        </div>
                    ) : (
                        <div className="space-y-4 relative z-10">
                            {pendingAssignments.slice(0, 4).map((assignment: any) => (
                                <div key={assignment.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white dark:bg-dark-surface border border-slate-100 dark:border-dark-border hover:border-orange-200 dark:hover:border-orange-500/30 hover:shadow-md hover:shadow-orange-500/5 transition-all duration-300">
                                    <div className="flex-1 min-w-0 mr-4 mb-3 sm:mb-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2.5 py-1 rounded-lg bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] uppercase font-bold tracking-wider border border-orange-100 dark:border-orange-500/20">
                                                {assignment.course_code}
                                            </span>
                                            <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                                                <Clock className="w-3 h-3" />
                                                Due {new Date(assignment.due_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h4 className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                            {assignment.title}
                                        </h4>
                                    </div>
                                    <Link
                                        href={`/student/assignments/${assignment.id}/submit`}
                                        className="shrink-0 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all active:scale-95 text-center"
                                    >
                                        Submit
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Upcoming Exams */}
                <div className="bg-white dark:bg-dark-card p-6 rounded-3xl border border-slate-100 dark:border-dark-border shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/20">
                                <FileText className="w-5 h-5" />
                            </div>
                            Upcoming Exams
                        </h3>
                        <Link href="/student/exams" className="group flex items-center gap-1 text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                            View All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {
                        loading ? (
                            <div className="flex justify-center py-12">
                                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : upcomingExams.length === 0 ? (
                            <div className="text-center py-16 bg-slate-50/50 dark:bg-dark-surface/50 rounded-2xl border border-dashed border-slate-200 dark:border-dark-border">
                                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400">
                                    <Calendar className="w-8 h-8" />
                                </div>
                                <h4 className="text-slate-900 dark:text-white font-semibold mb-1">No Exams Scheduled</h4>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Relax and prepare for upcoming assignments!</p>
                            </div>
                        ) : (
                            <div className="space-y-4 relative z-10">
                                {upcomingExams.map((exam: any) => {
                                    const examDate = new Date(exam.start_time);
                                    const daysUntil = Math.ceil((examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

                                    return (
                                        <div key={exam.id} className="group p-5 rounded-2xl bg-white dark:bg-dark-surface border border-slate-100 dark:border-dark-border hover:border-purple-200 dark:hover:border-purple-500/30 hover:shadow-md hover:shadow-purple-500/5 transition-all duration-300">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] uppercase font-bold tracking-wider border border-purple-100 dark:border-purple-500/20">
                                                            {exam.course_code || exam.course_title}
                                                        </span>
                                                    </div>
                                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{exam.title}</h4>

                                                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                                        <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-dark-bg px-2.5 py-1 rounded-md border border-slate-100 dark:border-dark-border">
                                                            <Calendar className="w-4 h-4 text-purple-500" />
                                                            {examDate.toLocaleDateString()}
                                                        </span>
                                                        <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-dark-bg px-2.5 py-1 rounded-md border border-slate-100 dark:border-dark-border">
                                                            <Clock className="w-4 h-4 text-purple-500" />
                                                            {examDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className={`shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-xl border-2 ${daysUntil <= 1
                                                    ? 'bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400'
                                                    : daysUntil <= 3
                                                        ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20 text-amber-600 dark:text-amber-400'
                                                        : 'bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400'
                                                    }`}>
                                                    <span className="text-xl font-bold leading-none">{daysUntil <= 0 ? '!' : daysUntil}</span>
                                                    <span className="text-[10px] font-bold uppercase mt-1">{daysUntil <= 0 ? 'Now' : 'Days'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                </div>
            </div>

            {/* Recent Messages & Resources */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* Recent Messages */}
                <div className="lg:col-span-2 bg-white dark:bg-dark-card p-6 rounded-3xl border border-slate-100 dark:border-dark-border shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-primary-500 text-white shadow-lg shadow-indigo-500/20">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            Recent Messages
                        </h3>
                        <Link href="/student/dashboard/messages" className="group flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                            Open Inbox <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {
                        recentMessages.length === 0 ? (
                            <div className="text-center py-12 bg-slate-50/50 dark:bg-dark-surface/50 rounded-2xl border border-dashed border-slate-200 dark:border-dark-border">
                                <p className="text-slate-500 dark:text-slate-400 text-sm italic">No recent messages from instructors.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {recentMessages.slice(0, 4).map((msg: any) => (
                                    <Link key={msg.id} href="/student/dashboard/messages" className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-surface border border-slate-100 dark:border-dark-border hover:border-primary-500/30 transition-all flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold shrink-0">
                                            {msg.name[0]}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex justify-between items-start mb-0.5">
                                                <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{msg.name}</h4>
                                                <span className="text-[10px] text-slate-400 font-medium">{new Date(msg.timestamp).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{msg.last_message}</p>
                                            {msg.unread_count > 0 && (
                                                <span className="mt-2 inline-block px-2 py-0.5 bg-primary-600 text-white text-[10px] font-bold rounded-full">
                                                    {msg.unread_count} New
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )
                    }
                </div>

                {/* Quick Reminders */}
                <div className="bg-gradient-to-br from-primary-600 to-indigo-700 p-6 rounded-3xl text-white shadow-xl shadow-primary-500/20 flex flex-col justify-between">
                    <div>
                        <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            Smart View
                        </h4>
                        <div className="space-y-4">
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                                <p className="text-sm font-medium opacity-80 mb-1">Total Attendance</p>
                                <div className="text-2xl font-bold">{statsData.attendance}</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                                <p className="text-sm font-medium opacity-80 mb-1">Average Grade</p>
                                <div className="text-2xl font-bold">A-</div>
                            </div>
                        </div>
                    </div>
                    <button className="mt-6 w-full py-3 bg-white text-primary-600 font-bold rounded-xl hover:bg-opacity-90 transition-all">
                        View Analytics
                    </button>
                </div>
            </div>

            {/* Quick Links */}
            <div className="bg-dark-surface p-6 rounded-2xl border border-dark-border">
                <h3 className="text-lg font-bold text-dark-text mb-4">Quick Links</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                    {quickLinks.map((link, idx) => (
                        <Link
                            key={idx}
                            href={link.href}
                            className="flex flex-col items-center justify-center p-4 rounded-xl bg-dark-bg border border-dark-border hover:border-primary-500/30 transition-all group"
                        >
                            <div className={`p-3 rounded-xl ${link.bg} ${link.color} mb-2 group-hover:scale-110 transition-transform`}>
                                <link.icon className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-medium text-slate-500 text-center group-hover:text-dark-text transition-colors">
                                {link.label}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </StudentLayout>
    );
}
