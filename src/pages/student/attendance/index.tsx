import { useState, useEffect } from 'react';
import StudentLayout from '../../../components/layout/StudentLayout';
import { StudentService } from '../../../services/student.service';
import { useAuth } from '../../../hooks/useAuth';
import { Calendar, BookOpen, CheckCircle, XCircle, AlertCircle, User, Hash, Eye, X } from 'lucide-react';

interface CourseAttendance {
    course_id: number;
    course_title: string;
    code: string;
    total_sessions: number;
    present_count: number;
    percentage: number;
    status: string;
}

interface AttendanceData {
    student: {
        id: number;
        name: string;
        email: string;
        roll_number: string;
    };
    courses: CourseAttendance[];
}

interface AttendanceDetailRecord {
    id: number;
    date: string;
    present: boolean;
    status: string;
    course_title: string;
}

export default function StudentAttendancePage() {
    const { user } = useAuth();
    const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCourse, setSelectedCourse] = useState<CourseAttendance | null>(null);
    const [detailedRecords, setDetailedRecords] = useState<AttendanceDetailRecord[]>([]);
    const [loadingDetails, setLoadingDetails] = useState(false);

    useEffect(() => {
        if (user) {
            fetchAttendanceData();
        }
    }, [user]);

    const fetchAttendanceData = async () => {
        try {
            setLoading(true);
            const data = await StudentService.getAttendanceStats(user!.id);
            setAttendanceData(data as AttendanceData);
            setError('');
        } catch (error: any) {
            console.error("Failed to fetch attendance data", error);
            setError(error.message || 'Failed to load attendance data');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (percentage: number) => {
        if (percentage >= 80) return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
    };

    const getProgressColor = (percentage: number) => {
        if (percentage >= 80) return 'bg-green-500';
        if (percentage >= 60) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const fetchDetailedAttendance = async (course: CourseAttendance) => {
        try {
            setLoadingDetails(true);
            setSelectedCourse(course);
            const data = await StudentService.getCourseAttendanceDetails(course.course_id, user!.id);
            // Handle both paginated and direct array responses
            const records = Array.isArray(data) ? data : ((data as any).results || []);
            setDetailedRecords(records as AttendanceDetailRecord[]);
        } catch (error: any) {
            console.error("Failed to fetch detailed attendance", error);
        } finally {
            setLoadingDetails(false);
        }
    };

    const closeModal = () => {
        setSelectedCourse(null);
        setDetailedRecords([]);
    };

    return (
        <StudentLayout title="Attendance">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-dark-text">Attendance Records</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Track your attendance across all enrolled courses.</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center py-16 bg-dark-surface rounded-2xl border border-dark-border">
                    <AlertCircle className="w-16 h-16 text-red-300 dark:text-red-600 mb-4" />
                    <h3 className="text-lg font-medium text-dark-text">Error loading attendance</h3>
                    <p className="text-slate-500 text-center max-w-sm mt-2">{error}</p>
                    <button
                        onClick={fetchAttendanceData}
                        className="mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors"
                    >
                        Retry
                    </button>
                </div>
            ) : !attendanceData ? (
                <div className="flex flex-col items-center justify-center py-16 bg-dark-surface rounded-2xl border border-dark-border border-dashed">
                    <Calendar className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
                    <h3 className="text-lg font-medium text-dark-text">No attendance data found</h3>
                    <p className="text-slate-500 text-center max-w-sm mt-2">Attendance records will appear here once they are available.</p>
                </div>
            ) : (
                <>
                    {/* Student Info Card */}
                    {attendanceData.student && (
                        <div className="bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20 p-6 rounded-2xl border border-primary-200 dark:border-primary-800 mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                                    {attendanceData.student.name ? attendanceData.student.name[0].toUpperCase() : 'S'}
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-dark-text">{attendanceData.student.name}</h2>
                                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-600 dark:text-slate-300">
                                        <div className="flex items-center gap-1">
                                            <Hash className="w-4 h-4" />
                                            <span className="font-medium">{attendanceData.student.roll_number}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <User className="w-4 h-4" />
                                            <span>{attendanceData.student.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Attendance Grid */}
                    {attendanceData.courses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 bg-dark-surface rounded-2xl border border-dark-border border-dashed">
                            <BookOpen className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
                            <h3 className="text-lg font-medium text-dark-text">No course attendance yet</h3>
                            <p className="text-slate-500 text-center max-w-sm mt-2">You don't have any attendance records for your enrolled courses yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {attendanceData.courses.map((course) => (
                                <div key={course.course_id} className="bg-dark-surface rounded-2xl border border-dark-border overflow-hidden hover:shadow-lg transition-all group">
                                    {/* Course Header */}
                                    <div className="p-5 border-b border-dark-border">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 tracking-wide uppercase mb-2">
                                                    {course.code}
                                                </span>
                                                <h3 className="text-lg font-bold text-dark-text line-clamp-2">{course.course_title}</h3>
                                            </div>
                                        </div>

                                        {/* Status Badge */}
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(course.percentage)}`}>
                                            {course.percentage >= 80 ? (
                                                <>
                                                    <CheckCircle className="w-3.5 h-3.5" />
                                                    Eligible
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="w-3.5 h-3.5" />
                                                    Ineligible
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Attendance Stats */}
                                    <div className="p-5">
                                        {/* Progress Circle */}
                                        <div className="flex items-center justify-center mb-5">
                                            <div className="relative">
                                                <svg className="transform -rotate-90 w-32 h-32">
                                                    <circle
                                                        cx="64"
                                                        cy="64"
                                                        r="56"
                                                        stroke="currentColor"
                                                        strokeWidth="8"
                                                        fill="transparent"
                                                        className="text-slate-200 dark:text-slate-700"
                                                    />
                                                    <circle
                                                        cx="64"
                                                        cy="64"
                                                        r="56"
                                                        stroke="currentColor"
                                                        strokeWidth="8"
                                                        fill="transparent"
                                                        strokeDasharray={`${2 * Math.PI * 56}`}
                                                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - course.percentage / 100)}`}
                                                        className={course.percentage >= 80 ? 'text-green-500' : 'text-red-500'}
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="text-center">
                                                        <div className="text-3xl font-bold text-dark-text">{course.percentage}%</div>
                                                        <div className="text-xs text-slate-500">Attendance</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Sessions</p>
                                                <p className="text-xl font-bold text-dark-text">{course.total_sessions}</p>
                                            </div>
                                            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Present</p>
                                                <p className="text-xl font-bold text-green-600 dark:text-green-400">{course.present_count}</p>
                                            </div>
                                        </div>

                                        {/* View Details Button */}
                                        <button
                                            onClick={() => fetchDetailedAttendance(course)}
                                            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-lg transition-colors"
                                        >
                                            <Eye className="w-4 h-4" />
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Info Banner */}
                    <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                        <div className="flex gap-3">
                            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-800 dark:text-blue-300">
                                <p className="font-semibold mb-1">Attendance Policy</p>
                                <p>A minimum of <strong>80% attendance</strong> is required to be eligible for appearing in examinations. Students below this threshold are marked as ineligible.</p>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Detailed Attendance Modal */}
            {selectedCourse && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
                    <div className="bg-dark-surface rounded-2xl border border-dark-border max-w-2xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-dark-border">
                            <div>
                                <h2 className="text-xl font-bold text-dark-text">{selectedCourse.course_title}</h2>
                                <p className="text-sm text-slate-500 mt-1">{selectedCourse.code} - Detailed Attendance Records</p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                            {loadingDetails ? (
                                <div className="flex justify-center py-12">
                                    <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : detailedRecords.length === 0 ? (
                                <div className="text-center py-12">
                                    <Calendar className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                                    <p className="text-slate-500">No attendance records found for this course.</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {detailedRecords.map((record) => (
                                        <div
                                            key={record.id}
                                            className={`flex items-center justify-between p-4 rounded-xl border ${record.present
                                                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${record.present
                                                    ? 'bg-green-100 dark:bg-green-900/40'
                                                    : 'bg-red-100 dark:bg-red-900/40'
                                                    }`}>
                                                    {record.present ? (
                                                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                                    ) : (
                                                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-dark-text">
                                                        {new Date(record.date).toLocaleDateString('en-US', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                    <p className="text-sm text-slate-500">
                                                        {new Date(record.date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-xs font-bold ${record.present
                                                ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                                                : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
                                                }`}>
                                                {record.present ? 'Present' : 'Absent'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </StudentLayout>
    );
}
