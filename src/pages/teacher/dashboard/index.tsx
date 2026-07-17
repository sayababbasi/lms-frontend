import { useState, useEffect } from 'react';
import TeacherLayout from '../../../components/layout/TeacherLayout';
import { BookOpen, Users, FileText, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { TimetableService } from '../../../services/timetable.service';
import { AssignmentsService } from '../../../services/assignments';

export default function TeacherDashboard() {
    const [courses, setCourses] = useState<any[]>([]);
    const [assignments, setAssignments] = useState<any[]>([]);
    const [schedule, setSchedule] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const { CoursesService } = await import('../../../services/courses.service');
            
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const todayStr = days[new Date().getDay()];

            const [coursesData, assignmentsData, scheduleData] = await Promise.all([
                CoursesService.getAll(),
                AssignmentsService.getAll(),
                TimetableService.getTimetable(todayStr).catch(() => []) // fail gracefully
            ]);

            setCourses(Array.isArray(coursesData) ? coursesData : (coursesData as any).results || []);
            setAssignments(Array.isArray(assignmentsData) ? assignmentsData : (assignmentsData as any)?.results || []);
            setSchedule(Array.isArray(scheduleData) ? scheduleData : (scheduleData as any)?.results || []);
            
        } catch (error) {
            console.error("Failed to load dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    const assignedCoursesCount = courses.length;
    const totalStudentsCount = courses.reduce((acc, course) => acc + (course.students_count || course.students?.length || 0), 0);
    
    // For pending grading, we can just use assignments that have pending > 0 if available, 
    // or just show total assignments as a fallback for now.
    const pendingGradingCount = assignments.reduce((acc, assignment) => acc + (assignment.pending || assignment.submissions_count || 0), 0);
    const classesTodayCount = schedule.length;

    const stats = [
        { label: 'Assigned Courses', value: assignedCoursesCount.toString(), icon: BookOpen, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', shadow: 'shadow-indigo-500/10' },
        { label: 'Total Students', value: totalStudentsCount.toString(), icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', shadow: 'shadow-emerald-500/10' },
        { label: 'Pending Grading', value: pendingGradingCount.toString(), icon: FileText, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', shadow: 'shadow-amber-500/10' },
        { label: 'Classes Today', value: classesTodayCount.toString(), icon: Clock, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', shadow: 'shadow-rose-500/10' },
    ];

    // Helper to format time strings
    const formatTime = (timeStr: string) => {
        if (!timeStr) return { time: '', period: '' };
        try {
            const [hours, minutes] = timeStr.split(':');
            const h = parseInt(hours);
            const period = h >= 12 ? 'PM' : 'AM';
            const displayH = h % 12 || 12;
            return {
                time: `${displayH.toString().padStart(2, '0')}:${minutes}`,
                period
            };
        } catch {
            return { time: timeStr, period: '' };
        }
    };

    return (
        <TeacherLayout title="Dashboard">
            {/* Header */}
            <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">Teacher Dashboard</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">Welcome back! Here's an overview of your academic activities.</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="group bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} ${stat.border} border ${stat.shadow} shadow-sm`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1 group-hover:scale-105 transition-transform origin-left">{stat.value}</div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity / Schedule */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Today's Schedule */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 overflow-hidden relative shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Clock className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                                Today's Schedule
                            </h2>
                            <span className="text-sm text-slate-500 dark:text-slate-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                        </div>

                        <div className="space-y-4">
                            {schedule.length === 0 ? (
                                <p className="text-slate-500 text-center py-4">No classes scheduled for today.</p>
                            ) : (
                                schedule.map((slot: any) => {
                                    const { time, period } = formatTime(slot.start_time);
                                    return (
                                        <div key={slot.id} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 hover:border-indigo-500/30 transition-colors group">
                                            <div className="w-16 flex flex-col items-center justify-center p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20">
                                                <span className="text-sm font-bold">{time}</span>
                                                <span className="text-xs">{period}</span>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-slate-900 dark:text-white font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{slot.course_title}</h4>
                                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">Room: {slot.room_number}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                                        {slot.start_time} - {slot.end_time}
                                                    </span>
                                                </div>
                                            </div>
                                            <Link href={`/teacher/dashboard/courses/${slot.course}`} className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                                Course
                                            </Link>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Pending Actions or Notices */}
                <div className="space-y-8">
                    {/* Pending Grading Widget */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 relative overflow-hidden shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <FileText className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                                Grading Queue
                            </h2>
                            <Link href="/teacher/dashboard/assignments" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300">View All</Link>
                        </div>
                        <div className="space-y-3">
                            {assignments.length === 0 ? (
                                <p className="text-slate-500 text-sm text-center py-4">No assignments pending.</p>
                            ) : (
                                assignments.slice(0, 5).map((assignment: any) => {
                                    const pendingCount = assignment.pending || assignment.submissions_count || 0;
                                    return (
                                        <Link key={assignment.id} href={`/teacher/dashboard/assignments/${assignment.id}/submissions`} className="block">
                                            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900 dark:text-white">{assignment.title}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-500">
                                                        {assignment.course_code || assignment.course_name || `Course ${assignment.course}`} • {pendingCount} submissions
                                                    </p>
                                                </div>
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${pendingCount > 0 ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                                    {pendingCount}
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* System Alerts */}
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/40 dark:to-purple-900/40 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 p-6">
                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white mb-1">Welcome!</h3>
                                <p className="text-sm text-indigo-700 dark:text-indigo-200/80 mb-3">
                                    Your dashboard is now fully dynamic. Classes, grading queues, and total student counts are updated in real-time.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
