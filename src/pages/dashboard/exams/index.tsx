import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { ExamsService } from '../../../services/exams.service';
import { AuthService } from '../../../services/auth.service';
import { CoursesService } from '../../../services/courses.service';

export default function ExamsPage() {
    const [exams, setExams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [eligibilityStatus, setEligibilityStatus] = useState<Record<number, any>>({});
    const [admitCards, setAdmitCards] = useState<Record<number, any>>({});
    const [currentUser, setCurrentUser] = useState<any>(null);

    // Teacher Only State
    const [teacherCourses, setTeacherCourses] = useState<any[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createForm, setCreateForm] = useState({
        courseId: '',
        title: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        durationMinutes: 60
    });
    const [creating, setCreating] = useState(false);

    // Manage Modal State
    const [showManageModal, setShowManageModal] = useState(false);
    const [selectedExam, setSelectedExam] = useState<any>(null);
    const [courseStudents, setCourseStudents] = useState<any[]>([]);
    const [managingLoading, setManagingLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [examsData, userData] = await Promise.all([
                ExamsService.getAllExams(),
                AuthService.getCurrentUser()
            ]);

            setCurrentUser(userData);

            // If Teacher, load their courses for the dropdown
            const u = userData as any;
            if (u?.is_teacher || u?.is_staff) {
                const coursesData = await CoursesService.getAll();
                const allCourses = (coursesData as any).results || coursesData;
                // Filter courses where user is main teacher or in teachers list
                const myCourses = allCourses.filter((c: any) =>
                    c.teacher_id === u.id || (c.teacher_ids && c.teacher_ids.includes(u.id))
                );
                setTeacherCourses(myCourses);
            }

            setExams(Array.isArray(examsData) ? examsData : (examsData as any).results || []);
        } catch (error) {
            console.error("Failed to load data", error);
            toast.error("Failed to load exams data");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateExam = async () => {
        if (!createForm.courseId || !createForm.title) {
            toast.error("Please fill required fields");
            return;
        }

        setCreating(true);
        try {
            const startDateTime = new Date(`${createForm.date}T${createForm.startTime}`);
            const endDateTime = new Date(startDateTime.getTime() + createForm.durationMinutes * 60000);

            await ExamsService.createExam({
                course: Number(createForm.courseId),
                title: createForm.title,
                start_time: startDateTime.toISOString(),
                end_time: endDateTime.toISOString()
            });

            toast.success("Exam created successfully");
            setShowCreateModal(false);
            setCreateForm({
                courseId: '',
                title: '',
                date: new Date().toISOString().split('T')[0],
                startTime: '09:00',
                durationMinutes: 60
            });
            loadData(); // Refresh list
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Failed to create exam");
        } finally {
            setCreating(false);
        }
    };

    const handleManageExam = async (exam: any) => {
        setSelectedExam(exam);
        setShowManageModal(true);
        setManagingLoading(true);
        setCourseStudents([]);

        try {
            // Get course details to see enrolled students
            const courseId = typeof exam.course === 'object' ? exam.course.id : exam.course;
            const courseData = await CoursesService.getById(Number(courseId));

            if ((courseData as any).students) {
                setCourseStudents((courseData as any).students);
            }
        } catch (error) {
            console.error("Failed to load students", error);
            toast.error("Failed to load student list");
        } finally {
            setManagingLoading(false);
        }
    };

    const checkStudentEligibility = async (studentId: number) => {
        if (!selectedExam) return;
        try {
            const data = await ExamsService.checkEligibility(selectedExam.id, studentId);
            setEligibilityStatus(prev => ({ ...prev, [`${selectedExam.id}-${studentId}`]: data }));
            if ((data as any).eligible) {
                toast.success(`${(data as any).student || 'Student'} is Eligible`);
            } else {
                toast.error(`${(data as any).student || 'Student'} is Ineligible`);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Check failed");
        }
    };

    const issueStudentCard = async (studentId: number) => {
        if (!selectedExam) return;
        try {
            const data = await ExamsService.generateAdmitCard(selectedExam.id, studentId);
            setAdmitCards(prev => ({ ...prev, [`${selectedExam.id}-${studentId}`]: (data as any).admit_card }));
            toast.success("Admit Card Issued");
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to issue card");
        }
    };

    const checkExamEligibility = async (examId: number) => {
        try {
            const data = await ExamsService.checkEligibility(examId);
            setEligibilityStatus(prev => ({ ...prev, [examId]: data }));
            if ((data as any).eligible) {
                toast.success((data as any).message);
            } else {
                toast.error((data as any).message);
            }
        } catch (error: any) {
            const msg = error.response?.data?.error || "Failed to check eligibility";
            toast.error(msg);
        }
    };

    const downloadAdmitCard = async (examId: number) => {
        try {
            const data = await ExamsService.generateAdmitCard(examId);
            setAdmitCards(prev => ({ ...prev, [examId]: (data as any).admit_card }));
            toast.success(`Admit Card Issued: ${(data as any).admit_card.unique_code}`);
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to generate admit card");
        }
    };

    const isTeacher = currentUser?.is_teacher || currentUser?.is_staff;

    return (
        <DashboardLayout title={isTeacher ? "Exams Management" : "Exams & Admit Cards"}>
            <div className="space-y-6">
                <div className="bg-dark-card rounded-xl p-8 border border-dark-border flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-dark-text mb-2">
                            {isTeacher ? "Exams Management" : "Exams & Admit Cards"}
                        </h1>
                        <p className="text-slate-600">
                            {isTeacher
                                ? "Manage exams across all your courses."
                                : "View schedules and download your admit cards."}
                        </p>
                    </div>
                    {isTeacher && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary-500/20 transition-all flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            Create Exam
                        </button>
                    )}
                </div>

                {/* Create Exam Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <div className="bg-dark-card border border-dark-border rounded-xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="absolute top-4 right-4 text-slate-600 hover:text-dark-text"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>

                            <h3 className="text-xl font-bold text-dark-text mb-6">Schedule New Exam</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-slate-600 mb-1">Select Course</label>
                                    <select
                                        className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500"
                                        value={createForm.courseId}
                                        onChange={(e) => setCreateForm({ ...createForm, courseId: e.target.value })}
                                    >
                                        <option value="">-- Select Course --</option>
                                        {teacherCourses.map(course => (
                                            <option key={course.id} value={course.id}>
                                                {course.code} - {course.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Exam Title</label>
                                    <input
                                        type="text"
                                        className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500"
                                        placeholder="e.g. Final Assessment"
                                        value={createForm.title}
                                        onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Date</label>
                                        <input
                                            type="date"
                                            className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500"
                                            value={createForm.date}
                                            onChange={(e) => setCreateForm({ ...createForm, date: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Start Time</label>
                                        <input
                                            type="time"
                                            className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500"
                                            value={createForm.startTime}
                                            onChange={(e) => setCreateForm({ ...createForm, startTime: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Duration (Minutes)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500"
                                        value={createForm.durationMinutes}
                                        onChange={(e) => setCreateForm({ ...createForm, durationMinutes: parseInt(e.target.value) || 0 })}
                                    />
                                </div>

                                <button
                                    onClick={handleCreateExam}
                                    disabled={creating}
                                    className={`w-full py-3 rounded-lg font-bold text-white shadow-lg transition-all mt-4 ${creating
                                        ? 'bg-primary-900 cursor-not-allowed text-slate-400'
                                        : 'bg-primary-600 hover:bg-primary-500 shadow-primary-500/20'
                                        }`}
                                >
                                    {creating ? 'Creating...' : 'Schedule Exam'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Manage Exam Modal (Teacher) */}
                {showManageModal && selectedExam && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <div className="bg-dark-card border border-dark-border rounded-xl p-8 w-full max-w-4xl shadow-2xl relative animate-in fade-in zoom-in duration-200 h-[80vh] flex flex-col">
                            <button
                                onClick={() => setShowManageModal(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-white"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>

                            <div className="mb-6 flex-shrink-0">
                                <h3 className="text-2xl font-bold text-dark-text mb-2">Manage Exam: {selectedExam.title}</h3>
                                <p className="text-slate-600 text-sm">Course: {selectedExam.course_code || selectedExam.course}</p>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2">
                                {managingLoading ? (
                                    <div className="text-center py-12 text-slate-400">Loading students...</div>
                                ) : courseStudents.length === 0 ? (
                                    <div className="text-center py-12 text-slate-400">No students enrolled in this course.</div>
                                ) : (
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-dark-surface/50 sticky top-0">
                                            <tr className="text-slate-600 text-xs uppercase tracking-wider border-b border-dark-border">
                                                <th className="py-4 px-4 sticky top-0 bg-dark-surface/90 backdrop-blur">Student</th>
                                                <th className="py-4 px-4 sticky top-0 bg-dark-surface/90 backdrop-blur">Roll No</th>
                                                <th className="py-4 px-4 sticky top-0 bg-dark-surface/90 backdrop-blur text-center">Status</th>
                                                <th className="py-4 px-4 sticky top-0 bg-dark-surface/90 backdrop-blur text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-dark-border/50">
                                            {courseStudents.map((student: any) => {
                                                // Handle StudentSerializer structure (user is an object)
                                                // We need the User ID for eligibility checks, not the Student ID
                                                const userObj = student.user;
                                                const userId = userObj?.id || student.user_id || student.id;
                                                const username = userObj?.username || student.username || "Unknown";
                                                const fullName = userObj ? `${userObj.first_name} ${userObj.last_name}`.trim() : username;
                                                const displayName = fullName || username;

                                                const key = `${selectedExam.id}-${userId}`;
                                                const status = eligibilityStatus[key];
                                                const card = admitCards[key];

                                                return (
                                                    <tr key={student.id} className="hover:bg-white/5 transition-colors">
                                                        <td className="py-3 px-4 text-dark-text font-medium">
                                                            <div>{displayName}</div>
                                                            <div className="text-xs text-slate-600">{username}</div>
                                                        </td>
                                                        <td className="py-3 px-4 text-slate-400 font-mono text-sm">{student.roll_number}</td>
                                                        <td className="py-3 px-4 text-center">
                                                            {status ? (
                                                                status.eligible ? (
                                                                    <span className="text-green-400 text-xs font-bold px-2 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                                                                        Eligible ({status.percentage}%)
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-red-400 text-xs font-bold px-2 py-1 bg-red-500/10 rounded-full border border-red-500/20">
                                                                        Last Att: {status.percentage}%
                                                                    </span>
                                                                )
                                                            ) : (
                                                                <button
                                                                    onClick={() => checkStudentEligibility(userId)}
                                                                    className="text-xs text-primary-400 hover:text-primary-300 underline"
                                                                >
                                                                    Check
                                                                </button>
                                                            )}

                                                            {card && (
                                                                <div className="mt-1">
                                                                    <span className="text-blue-400 text-xs font-bold px-2 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
                                                                        Card Issued
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="py-3 px-4 text-right">
                                                            <div className="flex justify-end gap-2">
                                                                {!status && (
                                                                    <span className="text-slate-600 text-xs italic">Check first</span>
                                                                )}
                                                                {status && (
                                                                    <button
                                                                        onClick={() => issueStudentCard(userId)}
                                                                        className="px-3 py-1.5 bg-primary-600 hover:bg-primary-500 text-white rounded shadow transition-all text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                                                        disabled={!status.eligible || !!card}
                                                                    >
                                                                        Issue Card
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-dark-card rounded-xl border border-dark-border overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-slate-600">Loading exams...</div>
                    ) : exams.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-slate-600 text-lg">No exams scheduled.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-dark-surface/50">
                                    <tr className="text-slate-600 text-xs uppercase tracking-wider border-b border-dark-border px-6">
                                        <th className="py-4 px-6">Exam Title</th>
                                        <th className="py-4 px-6">Course</th>
                                        <th className="py-4 px-6">Date</th>
                                        <th className="py-4 px-6">Start Time</th>
                                        <th className="py-4 px-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-dark-border/50">
                                    {exams.map((exam) => (
                                        <tr key={exam.id} className="hover:bg-white/5 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="text-dark-text font-medium">{exam.title}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="text-primary-400 font-mono text-sm">{exam.course_code || exam.course_title || exam.course}</div>
                                            </td>
                                            <td className="py-4 px-6 text-slate-700">
                                                {new Date(exam.start_time).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 px-6 text-slate-700">
                                                {new Date(exam.start_time).toLocaleTimeString()}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex justify-end gap-3">
                                                    {isTeacher ? (
                                                        <button
                                                            onClick={() => handleManageExam(exam)}
                                                            className="text-sm text-primary-400 hover:text-primary-300 font-medium py-2 px-4 border border-primary-500/30 rounded-lg hover:bg-primary-500/10 transition-all"
                                                        >
                                                            Manage Students
                                                        </button>
                                                    ) : (
                                                        <>
                                                            {!eligibilityStatus[exam.id] && !admitCards[exam.id] && (
                                                                <button
                                                                    onClick={() => checkExamEligibility(exam.id)}
                                                                    className="px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:border-slate-500 hover:text-white transition-all text-sm"
                                                                >
                                                                    Check Eligibility
                                                                </button>
                                                            )}

                                                            {eligibilityStatus[exam.id] && !eligibilityStatus[exam.id].eligible && (
                                                                <span className="flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-xs font-bold border border-red-500/20">
                                                                    Ineligible ({eligibilityStatus[exam.id].percentage}%)
                                                                </span>
                                                            )}

                                                            {eligibilityStatus[exam.id] && eligibilityStatus[exam.id].eligible && !admitCards[exam.id] && (
                                                                <button
                                                                    onClick={() => downloadAdmitCard(exam.id)}
                                                                    className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg shadow-lg shadow-primary-500/20 transition-all text-sm font-medium"
                                                                >
                                                                    Download Admit Card
                                                                </button>
                                                            )}

                                                            {admitCards[exam.id] && (
                                                                <button
                                                                    onClick={() => toast.success(`Code: ${admitCards[exam.id].unique_code}`)}
                                                                    className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 rounded-lg border border-green-500/20 hover:bg-green-500/20 transition-colors text-sm font-medium"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                                    Card Issued
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
