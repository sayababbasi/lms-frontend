import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import StudentLayout from '../../../../components/layout/StudentLayout';
import { StudentService } from '../../../../services/student.service';
import { useAuth } from '../../../../hooks/useAuth';
import { BookOpen, User, Calendar, FileText, Clock, Award, ChevronRight, CalendarCheck, CheckSquare } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface CourseDetail {
    id: number;
    title: string;
    code: string;
    description: string;
    teacher: string;
    teacher_name?: string;
    thumbnail: string | null;
    created_at: string;
    students_count?: number;
}

interface CourseAttendance {
    course_id: number;
    course_title: string;
    code: string;
    total_sessions: number;
    present_count: number;
    percentage: number;
    status: string;
}

export default function CourseDetailPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { id } = router.query;
    const [course, setCourse] = useState<CourseDetail | null>(null);
    const [attendance, setAttendance] = useState<CourseAttendance | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (id && user) {
            fetchCourseDetail();
            fetchAttendanceData();
        }
    }, [id, user]);

    const fetchCourseDetail = async () => {
        try {
            setLoading(true);
            const data = await StudentService.getCourseDetail(Number(id)) as any;
            setCourse(data);
            setError('');
        } catch (error: any) {
            console.error("Failed to fetch course details", error);
            setError(error.message || 'Failed to load course details');
        } finally {
            setLoading(false);
        }
    };

    const fetchAttendanceData = async () => {
        try {
            if (!user) return;
            const data = await StudentService.getAttendanceStats(user.id) as any;
            // Find attendance for this specific course
            const courseAttendance = data.courses?.find((c: CourseAttendance) => c.course_id === Number(id));
            if (courseAttendance) {
                setAttendance(courseAttendance);
            }
        } catch (error: any) {
            console.error("Failed to fetch attendance", error);
            // Don't show error for attendance, just leave it null
        }
    };

    if (loading) {
        return (
            <StudentLayout title="Course Details">
                <div className="flex justify-center items-center py-20">
                    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </StudentLayout>
        );
    }

    if (error || !course) {
        return (
            <StudentLayout title="Course Details">
                <div className="flex flex-col items-center justify-center py-16 bg-dark-surface rounded-2xl border border-dark-border">
                    <BookOpen className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
                    <h3 className="text-lg font-medium text-dark-text">Course not found</h3>
                    <p className="text-slate-500 text-center max-w-sm mt-2">{error || 'The course you are looking for does not exist.'}</p>
                    <Link href="/student/courses" className="mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors">
                        Back to Courses
                    </Link>
                </div>
            </StudentLayout>
        );
    }

    return (
        <StudentLayout title={course.title}>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm mb-6">
                <Link href="/student/courses" className="text-slate-500 hover:text-primary-500 transition-colors">
                    My Courses
                </Link>
                <ChevronRight className="w-4 h-4 text-slate-400" />
                <span className="text-dark-text font-medium">{course.title}</span>
            </div>

            {/* Course Header */}
            <div className="bg-dark-surface rounded-2xl border border-dark-border overflow-hidden mb-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Thumbnail */}
                    <div className="lg:col-span-1 h-64 lg:h-auto bg-slate-100 dark:bg-slate-800 relative">
                        {course.thumbnail ? (
                            <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                                <BookOpen className="w-20 h-20" />
                            </div>
                        )}
                    </div>

                    {/* Course Info */}
                    <div className="lg:col-span-2 p-6 lg:p-8">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <div className="inline-block bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-full text-xs font-bold mb-3">
                                    {course.code}
                                </div>
                                <h1 className="text-3xl font-bold text-dark-text mb-2">{course.title}</h1>
                            </div>
                        </div>

                        <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                            {course.description || 'No description available for this course.'}
                        </p>

                        {/* Course Meta */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold">
                                    {course.teacher_name ? course.teacher_name[0] : course.teacher ? course.teacher[0] : 'T'}
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Instructor</p>
                                    <p className="text-sm font-semibold text-dark-text">{course.teacher_name || course.teacher || 'Unknown'}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Started</p>
                                    <p className="text-sm font-semibold text-dark-text">{new Date(course.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Course Content Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Assignments */}
                <Link href="/student/assignments" className="bg-dark-surface p-6 rounded-2xl border border-dark-border hover:border-primary-500/50 transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                            <FileText className="w-6 h-6" />
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary-500 transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold text-dark-text mb-1">Assignments</h3>
                    <p className="text-sm text-slate-500">View and submit coursework</p>
                </Link>

                {/* Attendance */}
                <Link href="/student/attendance" className="bg-dark-surface p-6 rounded-2xl border border-dark-border hover:border-primary-500/50 transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                            <CalendarCheck className="w-6 h-6" />
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary-500 transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold text-dark-text mb-1">Attendance</h3>
                    {attendance ? (
                        <div className="flex items-baseline gap-2">
                            <span className={`text-2xl font-bold ${attendance.percentage >= 80
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-red-600 dark:text-red-400'
                                }`}>
                                {attendance.percentage}%
                            </span>
                            <span className="text-xs text-slate-500">({attendance.present_count}/{attendance.total_sessions})</span>
                        </div>
                    ) : (
                        <p className="text-sm text-slate-500">No data available</p>
                    )}
                </Link>

                {/* Course Curriculum */}
                <Link href={`/student/courses/${id}/curriculum`} className="bg-dark-surface p-6 rounded-2xl border border-dark-border hover:border-indigo-500/50 transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold text-dark-text mb-1">Course Curriculum</h3>
                    <p className="text-sm text-slate-500">Watch video lectures &amp; download materials</p>
                </Link>

                {/* Quizzes & Exams */}
                <Link href={`/student/courses/${id}/exams`} className="bg-dark-surface p-6 rounded-2xl border border-dark-border hover:border-indigo-500/50 transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                            <CheckSquare className="w-6 h-6" />
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold text-dark-text mb-1">Quizzes & Exams</h3>
                    <p className="text-sm text-slate-500">Take active course assessments</p>
                </Link>
            </div>

            {/* Placeholder for future content */}
            <div className="mt-8 bg-dark-surface p-8 rounded-2xl border border-dark-border border-dashed">
                <div className="text-center text-slate-400">
                    <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Additional course content and features coming soon</p>
                </div>
            </div>
        </StudentLayout>
    );
}
