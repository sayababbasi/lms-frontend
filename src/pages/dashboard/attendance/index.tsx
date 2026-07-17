import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { AttendanceService } from '../../../services/attendance.service';
import { UsersService } from '../../../services/users.service';

export default function AttendancePage() {
    // Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [allStudents, setAllStudents] = useState<any[]>([]);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);

    // Stats State
    const [studentStats, setStudentStats] = useState<any>(null); // { student: {...}, courses: [...] }
    const [loadingStats, setLoadingStats] = useState(false);

    // Edit Modal State
    const [editingCourse, setEditingCourse] = useState<any>(null);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [attendanceHistory, setAttendanceHistory] = useState<any[]>([]);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        fetchAllStudents();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setSearchResults([]);
        } else {
            const lower = searchQuery.toLowerCase();
            const filtered = allStudents.filter((s: any) =>
                s.user.first_name.toLowerCase().includes(lower) ||
                s.user.last_name.toLowerCase().includes(lower) ||
                s.user.email.toLowerCase().includes(lower) ||
                (s.roll_number && s.roll_number.toLowerCase().includes(lower))
            );
            setSearchResults(filtered);
        }
    }, [searchQuery, allStudents]);

    const fetchAllStudents = async () => {
        try {
            const data = await UsersService.getStudents();
            setAllStudents((data as any).results || data);
        } catch (error) {
            console.error("Failed to load students", error);
        }
    };

    const handleSelectStudent = async (student: any) => {
        setSelectedStudent(student);
        setSearchQuery(""); // Clear search to hide dropdown
        setSearchResults([]);
        loadStudentStats(student.user.id);
    };

    const loadStudentStats = async (studentId: number) => {
        setLoadingStats(true);
        try {
            const data = await AttendanceService.getStudentStats(studentId);
            setStudentStats(data);
        } catch (error) {
            toast.error("Failed to load student stats");
        } finally {
            setLoadingStats(false);
        }
    };

    const openEditModal = async (course: any) => {
        setEditingCourse(course);
        setModalOpen(true);
        setHistoryLoading(true);
        try {
            // Fetch history for this student + course
            // We need to fetch ALL valid dates for the course to show "Absent" vs "Present" properly?
            // For now, let's fetch existing records.
            const data = await AttendanceService.getStudentHistory(course.course_id, selectedStudent.user.id);
            // Result is list of AttendanceRecords
            setAttendanceHistory(Array.isArray(data) ? data : (data as any).results || []);
        } catch (error) {
            toast.error("Failed to load attendance history");
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleToggleHistory = (recordId: number) => {
        setAttendanceHistory(prev => prev.map(r =>
            r.id === recordId ? { ...r, present: !r.present } : r
        ));
    };

    const saveHistory = async () => {
        if (!selectedStudent || !editingCourse) return;
        try {
            const records = attendanceHistory.map(r => ({
                student_id: selectedStudent.user.id,
                present: r.present
            }));

            // We must save date-by-date? bulkUpdate endpoint expects: { course, date, records: [{student, present}] }
            // Saving "All history" at once is tricky with current BulkUpdate because it's ONE date per call.
            // We need to loop or update API. 
            // Better: Loop updateAttendance for changed records? Or loop bulkUpdate? 
            // Actually, we have record IDs. We can just loop `updateAttendance(id, { present })`.

            const promises = attendanceHistory.map(r =>
                AttendanceService.updateAttendance(r.id, { present: r.present })
            );

            await Promise.all(promises);
            toast.success("Attendance updated");
            setModalOpen(false);
            loadStudentStats(selectedStudent.user.id); // Refresh stats
        } catch (error) {
            toast.error("Failed to update attendance");
        }
    };

    return (
        <DashboardLayout title="Attendance Audit">
            <div className="space-y-6">
                {/* Header & Search */}
                <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
                    <h1 className="text-2xl font-bold text-dark-text mb-2">Student Attendance Audit</h1>
                    <p className="text-slate-600 mb-6">Search for a student to view and edit their complete attendance history.</p>

                    <div className="relative max-w-xl">
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search by Name, Email, or Roll Number..."
                                    className="w-full bg-dark-bg border border-dark-border rounded-lg pl-10 pr-4 py-3 text-dark-text focus:outline-none focus:border-primary-500 transition-colors"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {searchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-dark-border rounded-lg shadow-xl z-50 max-h-[300px] overflow-y-auto">
                                {searchResults.map((student: any) => (
                                    <button
                                        key={student.id}
                                        onClick={() => handleSelectStudent(student)}
                                        className="w-full text-left p-3 hover:bg-white/5 border-b border-dark-border/50 last:border-0 flex items-center gap-3 transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-xs font-bold text-primary-400">
                                            {student.user.first_name?.[0]}{student.user.last_name?.[0]}
                                        </div>
                                        <div>
                                            <div className="text-white font-medium">{student.user.first_name} {student.user.last_name}</div>
                                            <div className="text-xs text-slate-400">{student.user.email} • {student.roll_number}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Student Profile & Stats */}
                {selectedStudent && studentStats && (
                    <div className="space-y-6 animate-fadeIn">
                        {/* Profile Info */}
                        <div className="bg-dark-card rounded-xl p-6 border border-dark-border flex items-center gap-6">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white">
                                {selectedStudent.user.first_name?.[0]}{selectedStudent.user.last_name?.[0]}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-dark-text">{studentStats.student.name}</h2>
                                <p className="text-slate-600">{studentStats.student.email}</p>
                                <p className="text-sm text-primary-600 font-mono mt-1">Roll No: {studentStats.student.roll_number}</p>
                            </div>
                        </div>

                        {/* Courses List */}
                        <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
                            <h3 className="text-lg font-bold text-dark-text mb-4">Enrolled Courses Attendance</h3>

                            {studentStats.courses.length === 0 ? (
                                <p className="text-slate-500 italic">No enrolled courses found.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="text-slate-600 text-sm border-b border-dark-border">
                                                <th className="py-3 px-4">Course</th>
                                                <th className="py-3 px-4 text-center">Total Classes</th>
                                                <th className="py-3 px-4 text-center">Attended</th>
                                                <th className="py-3 px-4 text-center">Percentage</th>
                                                <th className="py-3 px-4 text-center">Status</th>
                                                <th className="py-3 px-4 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {studentStats.courses.map((course: any) => (
                                                <tr key={course.course_id} className="border-b border-dark-border/50 hover:bg-white/5">
                                                    <td className="py-3 px-4">
                                                        <div className="text-dark-text font-medium">{course.course_title}</div>
                                                        <div className="text-xs text-slate-600">{course.code}</div>
                                                    </td>
                                                    <td className="py-3 px-4 text-center text-slate-700">{course.total_sessions}</td>
                                                    <td className="py-3 px-4 text-center text-slate-700">{course.present_count}</td>
                                                    <td className="py-3 px-4 text-center font-bold text-dark-text">{course.percentage}%</td>
                                                    <td className="py-3 px-4 text-center">
                                                        <span className={`px-2 py-1 rounded text-xs border ${course.status === 'Eligible'
                                                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                                                            }`}>
                                                            {course.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-right">
                                                        <button
                                                            onClick={() => openEditModal(course)}
                                                            className="text-primary-600 hover:text-dark-text text-sm font-medium"
                                                        >
                                                            Edit History
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
                )}

                {!selectedStudent && (
                    <div className="text-center py-20 opacity-50">
                        <div className="bg-dark-bg w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <p className="text-xl text-slate-600">Search for a student to begin</p>
                    </div>
                )}

                {/* Edit History Modal */}
                {modalOpen && editingCourse && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                        <div className="bg-dark-card w-full max-w-2xl rounded-xl border border-dark-border shadow-2xl flex flex-col max-h-[80vh]">
                            <div className="p-6 border-b border-dark-border flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold text-dark-text">Edit Attendance: {editingCourse.course_title}</h3>
                                    <p className="text-slate-600 text-sm">Update records to fix eligibility.</p>
                                </div>
                                <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                {historyLoading ? (
                                    <div className="text-center p-8 text-slate-400">Loading history...</div>
                                ) : attendanceHistory.length === 0 ? (
                                    <p className="text-center text-slate-500">No attendance records found for this course.</p>
                                ) : (
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="text-slate-600 text-sm border-b border-dark-border">
                                                <th className="py-2 px-4">Date</th>
                                                <th className="py-2 px-4 text-center">Current Status</th>
                                                <th className="py-2 px-4 text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {attendanceHistory.map((record: any) => (
                                                <tr key={record.id} className="border-b border-dark-border/50 hover:bg-white/5">
                                                    <td className="py-3 px-4 text-dark-text font-mono">{record.date}</td>
                                                    <td className="py-3 px-4 text-center">
                                                        <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${record.present
                                                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                            }`}>
                                                            {record.present ? 'Present' : 'Absent'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
                                                        <button
                                                            onClick={() => handleToggleHistory(record.id)}
                                                            className={`text-xs px-3 py-1 rounded border transition-colors ${!record.present
                                                                ? 'border-green-500/30 text-green-400 hover:bg-green-500/10'
                                                                : 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                                                                }`}
                                                        >
                                                            Mark {record.present ? 'Absent' : 'Present'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            <div className="p-6 border-t border-dark-border bg-dark-bg/50 flex justify-end gap-3 rounded-b-xl">
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveHistory}
                                    className="px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-medium shadow-lg shadow-primary-500/20"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
