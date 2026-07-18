import { useRouter } from 'next/router';
import { Dialog, Transition } from '@headlessui/react';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../../../services/api';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import { CoursesService } from '../../../../services/courses.service';
import { UsersService } from '../../../../services/users.service';
import { AuthService } from '../../../../services/auth.service';
import { AttendanceService } from '../../../../services/attendance.service';
import { ExamsService } from '../../../../services/exams.service';

// Icons
const Icons = {
    overview: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    ),
    curriculum: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
    ),
    assignments: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
    ),
    exams: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
    ),
    attendance: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    ),
    results: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
    ),
    timetable: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    ),

    enrollment: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
    ),
    settings: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    ),
};

type Tab = 'overview' | 'curriculum' | 'assignments' | 'exams' | 'attendance' | 'enrollment' | 'results' | 'timetable' | 'settings';

export default function CourseHubPage() {
    const router = useRouter();
    const { id } = router.query;

    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [course, setCourse] = useState<any>(null);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Confirm Modal State
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        description: string;
        confirmText: string;
        onConfirm: () => void;
    }>({
        isOpen: false,
        title: '',
        description: '',
        confirmText: 'Confirm',
        onConfirm: () => {}
    });

    const closeConfirm = () => setConfirmModal(prev => ({ ...prev, isOpen: false }));
    const [selectedTeacherIds, setSelectedTeacherIds] = useState<number[]>([]);
    const [currentUser, setCurrentUser] = useState<any>(null);

    // Attendance State
    const [attendanceDate, setAttendanceDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [attendanceRecords, setAttendanceRecords] = useState<Record<number, boolean>>({});
    const [attendanceLoading, setAttendanceLoading] = useState(false);
    const [attendanceStats, setAttendanceStats] = useState<any>(null);

    // Enrollment State
    const [enrollmentRequests, setEnrollmentRequests] = useState<any[]>([]);
    const [allStudents, setAllStudents] = useState<any[]>([]);
    const [enrollmentLoading, setEnrollmentLoading] = useState(false);
    const [enrollStudentId, setEnrollStudentId] = useState("");

    // Exams State
    const [exams, setExams] = useState<any[]>([]);
    const [examLoading, setExamLoading] = useState(false);
    const [eligibilityStatus, setEligibilityStatus] = useState<Record<number, any>>({});
    const [admitCards, setAdmitCards] = useState<Record<number, any>>({});

    // Create Exam State
    const [showCreateExamModal, setShowCreateExamModal] = useState(false);
    const [createExamForm, setCreateExamForm] = useState({
        title: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        durationMinutes: 60
    });

    // Curriculum State
    const [isAddingModule, setIsAddingModule] = useState(false);
    const [newModuleTitle, setNewModuleTitle] = useState("");
    const [addingLessonToModule, setAddingLessonToModule] = useState<number | null>(null);
    const [newLessonTitle, setNewLessonTitle] = useState("");
    const [uploadingLessonId, setUploadingLessonId] = useState<number | null>(null);
    const [linkingVideoId, setLinkingVideoId] = useState<number | null>(null);
    const [youtubeUrlInput, setYoutubeUrlInput] = useState('');
    const [uploadingResourceId, setUploadingResourceId] = useState<number | null>(null);
    const [deletingLessonId, setDeletingLessonId] = useState<number | null>(null);
    const [deletingModuleId, setDeletingModuleId] = useState<number | null>(null);
    const [deletingVideoId, setDeletingVideoId] = useState<number | null>(null);
    const [deletingResourceId, setDeletingResourceId] = useState<number | null>(null);
    const [editingModuleId, setEditingModuleId] = useState<number | null>(null);
    const [editModuleTitle, setEditModuleTitle] = useState('');
    const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
    const [editLessonTitle, setEditLessonTitle] = useState('');

    const handleCreateModule = async () => {
        if (!newModuleTitle.trim()) return;
        setSaving(true);
        try {
            await CoursesService.createModule({
                course_id: Number(id),
                title: newModuleTitle,
                order: course?.modules?.length ? course.modules.length + 1 : 1
            });
            toast.success("Module created");
            setNewModuleTitle("");
            setIsAddingModule(false);
            fetchData();
        } catch (error) {
            toast.error("Failed to create module");
        } finally {
            setSaving(false);
        }
    };

    const handleResourceUpload = async (lessonId: number, file: File) => {
        setUploadingResourceId(lessonId);
        toast.loading("Uploading resource...", { id: `upload-res-${lessonId}` });
        try {
            await CoursesService.uploadResource(lessonId, file);
            toast.success("Resource successfully uploaded!", { id: `upload-res-${lessonId}` });
            fetchData();
        } catch (error) {
            toast.error("Failed to upload resource", { id: `upload-res-${lessonId}` });
        } finally {
            setUploadingResourceId(null);
        }
    };

    const handleCreateLesson = async (moduleId: number) => {
        if (!newLessonTitle.trim()) return;
        setSaving(true);
        try {
            const moduleObj = course.modules.find((m: any) => m.id === moduleId);
            await CoursesService.createLesson({
                module_id: moduleId,
                title: newLessonTitle,
                order: moduleObj?.lessons?.length ? moduleObj.lessons.length + 1 : 1
            });
            toast.success("Lesson created");
            setNewLessonTitle("");
            setAddingLessonToModule(null);
            fetchData();
        } catch (error) {
            toast.error("Failed to create lesson");
        } finally {
            setSaving(false);
        }
    };

    
    const handleLinkYouTube = async (lessonId: number) => {
        if (!youtubeUrlInput.trim()) return;
        setUploadingLessonId(lessonId); // Reusing this for loading state
        try {
            // Extract video ID
            let videoId = youtubeUrlInput;
            const match = youtubeUrlInput.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/))([^&?\s]+)/);
            if (match && match[1]) {
                videoId = match[1];
            }
            // Send PATCH request to /api/lessons/{id}/
            await api.patch(`/lessons/${lessonId}/`, { 
                youtube_video_id: videoId, 
                upload_status: 'completed' 
            });
            toast.success('YouTube video linked successfully!');
            setLinkingVideoId(null);
            setYoutubeUrlInput('');
            fetchData();
        } catch {
            toast.error('Failed to link video');
        } finally {
            setUploadingLessonId(null);
        }
    };

    const handleVideoUpload = async (lessonId: number, file: File) => {
        setUploadingLessonId(lessonId);
        toast.loading("Uploading to YouTube... This may take a minute.", { id: `upload-${lessonId}` });
        try {
            await CoursesService.uploadVideo(lessonId, file);
            toast.success("Video successfully uploaded and linked!", { id: `upload-${lessonId}` });
            fetchData();
        } catch (error) {
            toast.error("Failed to upload video to YouTube", { id: `upload-${lessonId}` });
        } finally {
            setUploadingLessonId(null);
        }
    };



    const handleDeleteVideo = (lessonId: number) => {
        setConfirmModal({
            isOpen: true,
            title: 'Remove Video',
            description: 'Remove this video? You can upload a new one after.',
            confirmText: 'Remove',
            onConfirm: async () => {
                setDeletingVideoId(lessonId);
                try {
                    await CoursesService.deleteVideo(lessonId);
                    toast.success('Video removed. Upload a new one now.');
                    fetchData();
                } catch {
                    toast.error('Failed to remove video');
                } finally {
                    setDeletingVideoId(null);
                }
            }
        });
    };

    const handleDeleteResource = (resourceId: number) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Resource',
            description: 'Delete this resource file?',
            confirmText: 'Delete',
            onConfirm: async () => {
                setDeletingResourceId(resourceId);
                try {
                    await CoursesService.deleteResource(resourceId);
                    toast.success('Resource deleted');
                    fetchData();
                } catch {
                    toast.error('Failed to delete resource');
                } finally {
                    setDeletingResourceId(null);
                }
            }
        });
    };

    const handleDeleteLesson = (lessonId: number) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Lesson',
            description: 'Delete this lesson and all its content?',
            confirmText: 'Delete',
            onConfirm: async () => {
                setDeletingLessonId(lessonId);
                try {
                    await CoursesService.deleteLesson(lessonId);
                    toast.success('Lesson deleted');
                    fetchData();
                } catch {
                    toast.error('Failed to delete lesson');
                } finally {
                    setDeletingLessonId(null);
                }
            }
        });
    };

    const handleDeleteModule = (moduleId: number) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Module',
            description: 'Delete this module and ALL its lessons? This cannot be undone.',
            confirmText: 'Delete',
            onConfirm: async () => {
                setDeletingModuleId(moduleId);
                try {
                    await CoursesService.deleteModule(moduleId);
                    toast.success('Module deleted');
                    fetchData();
                } catch {
                    toast.error('Failed to delete module');
                } finally {
                    setDeletingModuleId(null);
                }
            }
        });
    };

    const handleUpdateModuleTitle = async (moduleId: number) => {
        if (!editModuleTitle.trim()) return;
        setSaving(true);
        try {
            await CoursesService.updateModule(moduleId, { title: editModuleTitle });
            toast.success('Module renamed');
            setEditingModuleId(null);
            fetchData();
        } catch {
            toast.error('Failed to rename module');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateLessonTitle = async (lessonId: number) => {
        if (!editLessonTitle.trim()) return;
        setSaving(true);
        try {
            await CoursesService.updateLessonTitle(lessonId, editLessonTitle);
            toast.success('Lesson renamed');
            setEditingLessonId(null);
            fetchData();
        } catch {
            toast.error('Failed to rename lesson');
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id]);

    useEffect(() => {
        if (router.query.tab) {
            setActiveTab(router.query.tab as Tab);
        }
    }, [router.query.tab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [courseData, teachersData, userData] = await Promise.all([
                CoursesService.getById(Number(id)),
                UsersService.getTeachers(),
                AuthService.getCurrentUser()
            ]);
            setCourse(courseData);
            setTeachers((teachersData as any).results || teachersData);
            setCurrentUser(userData);

            // Pre-select existing teachers
            const cData = courseData as any;
            if (cData.teacher_ids && Array.isArray(cData.teacher_ids)) {
                setSelectedTeacherIds(cData.teacher_ids);
            }
        } catch (error) {
            console.error("Failed to load data", error);
            toast.error("Failed to load course details");
        } finally {
            setLoading(false);
        }
    };

    const handleAssignTeacher = async () => {
        setSaving(true);
        try {
            // Send teacher_ids array
            await CoursesService.update(Number(id), { teacher_ids: selectedTeacherIds });
            toast.success("Instructors updated successfully");
            fetchData();
        } catch (error: any) {
            console.error("Failed to update instructors", error);
            const msg = error.response?.data?.detail || JSON.stringify(error.response?.data) || "Failed to update instructors";
            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    // Helper to add/remove
    const addTeacher = (teacherId: string) => {
        const idNum = Number(teacherId);
        if (!selectedTeacherIds.includes(idNum)) {
            setSelectedTeacherIds([...selectedTeacherIds, idNum]);
        }
    };

    const removeTeacher = (teacherId: number) => {
        setSelectedTeacherIds(selectedTeacherIds.filter(id => id !== teacherId));
    };

    const loadAttendance = async () => {
        setAttendanceLoading(true);
        try {
            const [data, stats] = await Promise.all([
                AttendanceService.getAttendance(attendanceDate, Number(id)),
                AttendanceService.getStats(Number(id))
            ]);

            setAttendanceStats(stats);

            // Map records to state
            const records: Record<number, boolean> = {};

            if (course && course.students) {
                course.students.forEach((s: any) => {
                    records[s.user.id] = true; // Default Present
                });
            }

            if (data && (data as any[]).length > 0) {
                // Overlay fetched records
                (data as any[]).forEach((r: any) => {
                    records[r.student] = r.present;
                });
            }

            setAttendanceRecords(records);
        } catch (error) {
            console.error("Failed to load attendance", error);
            toast.error("Failed to load attendance records");
        } finally {
            setAttendanceLoading(false);
        }
    };

    const handleSaveAttendance = async () => {
        setSaving(true);
        try {
            const records = Object.entries(attendanceRecords).map(([studentId, present]) => ({
                student_id: Number(studentId),
                present
            }));

            await AttendanceService.bulkUpdate({
                course: Number(id),
                date: attendanceDate,
                records
            });
            toast.success("Attendance saved successfully");
            loadAttendance(); // Reload to confirm
        } catch (error) {
            console.error("Failed to save attendance", error);
            toast.error("Failed to save attendance");
        } finally {
            setSaving(false);
        }
    };

    const toggleAttendance = (studentId: number) => {
        setAttendanceRecords(prev => ({
            ...prev,
            [studentId]: !prev[studentId]
        }));
    };

    // Enrollment Management Handlers
    const loadEnrollmentData = async () => {
        setEnrollmentLoading(true);
        try {
            const [reqs, students] = await Promise.all([
                CoursesService.getEnrollmentRequests(Number(id)),
                UsersService.getStudents() // Fetch all students for the dropdown
            ]);
            setEnrollmentRequests((reqs as any).results || reqs);
            setAllStudents((students as any).results || students);
        } catch (error) {
            console.error("Failed to load enrollment data", error);
            toast.error("Failed to load enrollment data");
        } finally {
            setEnrollmentLoading(false);
        }
    };

    const handleApproveRequest = async (requestId: number) => {
        try {
            await CoursesService.approveRequest(requestId);
            toast.success("Request approved and student enrolled");
            loadEnrollmentData(); // Refresh requests
            fetchData(); // Refresh course to see new student in list
        } catch (error) {
            toast.error("Failed to approve request");
        }
    };

    const handleRejectRequest = async (requestId: number) => {
        try {
            await CoursesService.rejectRequest(requestId);
            toast.success("Request rejected");
            loadEnrollmentData();
        } catch (error) {
            toast.error("Failed to reject request");
        }
    };

    const handleRemoveStudent = (studentId: number) => {
        setConfirmModal({
            isOpen: true,
            title: 'Remove Student',
            description: 'Are you sure you want to remove this student from the course?',
            confirmText: 'Remove',
            onConfirm: async () => {
                try {
                    await CoursesService.removeStudent(Number(id), studentId);
                    toast.success('Student removed from course');
                    fetchData();
                } catch {
                    toast.error('Failed to remove student');
                }
            }
        });
    };

    const handleEnrollStudent = async () => {
        if (!enrollStudentId) return;
        try {
            await CoursesService.addStudent(Number(id), Number(enrollStudentId));
            toast.success("Student enrolled successfully");
            setEnrollStudentId("");
            fetchData();
        } catch (error) {
            toast.error("Failed to enroll student");
        }
    };

    // Exam Handlers
    const loadExams = async () => {
        setExamLoading(true);
        try {
            const data = await ExamsService.getExams(Number(id));
            setExams(Array.isArray(data) ? data : (data as any).results || []);
        } catch (error) {
            console.error("Failed to load exams", error);
        } finally {
            setExamLoading(false);
        }
    };

    const handleCreateExam = async () => {
        if (!createExamForm.title || !createExamForm.date || !createExamForm.startTime || !createExamForm.durationMinutes) {
            toast.error("Please fill all fields");
            return;
        }

        setSaving(true);
        try {
            // Calculate timestamps
            const startDateTime = new Date(`${createExamForm.date}T${createExamForm.startTime}`);
            const endDateTime = new Date(startDateTime.getTime() + createExamForm.durationMinutes * 60000);

            const payload = {
                course: Number(id),
                title: createExamForm.title,
                start_time: startDateTime.toISOString(),
                end_time: endDateTime.toISOString()
            };

            await ExamsService.createExam(payload);
            toast.success("Exam created successfully");
            setShowCreateExamModal(false);
            // Reset form
            setCreateExamForm({
                title: '',
                date: new Date().toISOString().split('T')[0],
                startTime: '09:00',
                durationMinutes: 60
            });
            loadExams();
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Failed to create exam");
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'enrollment') {
            loadEnrollmentData();
        }
        if (activeTab === 'exams') {
            loadExams();
        }
    }, [activeTab]);

    if (loading) {
        return (
            <DashboardLayout title="Course Hub">
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
            </DashboardLayout>
        );
    }

    if (!course) return null;

    return (
        <>
        <DashboardLayout title={course.title}>
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-dark-card rounded-xl p-6 border border-dark-border shadow-lg">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <button
                                    onClick={() => router.push('/dashboard/courses')}
                                    className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                </button>
                                <h1 className="text-3xl font-bold text-dark-text">{course.title}</h1>
                            </div>
                            <p className="text-slate-600 pl-12 flex items-center gap-4">
                                <span>Code: <span className="text-dark-text font-mono">{course.code}</span></span>
                                <span>Instructors: <span className="text-primary-600">
                                    {course.teachers && course.teachers.length > 0 ? course.teachers.join(", ") : (course.teacher || "Unassigned")}
                                </span></span>
                            </p>
                        </div>
                        <div className="flex gap-3">
                            {currentUser && course.teacher_id === currentUser.id && ( // Simple check, ideally check against list
                                <span className="px-3 py-1 bg-primary-500/10 text-primary-400 rounded-full text-xs font-medium border border-primary-500/20">
                                    Instructor Access
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex overflow-x-auto pb-2 gap-2 border-b border-dark-border scrollbar-hide">
                    {['overview', 'curriculum', 'assignments', 'exams', 'attendance', 'enrollment', 'results', 'timetable', 'settings'].map((t) => (
                        <button
                            key={t}
                            onClick={() => router.push({ query: { ...router.query, tab: t } })}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === t
                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                                : 'text-slate-600 hover:text-dark-text hover:bg-white/5'
                                } `}
                        >
                            {Icons[t as keyof typeof Icons]}
                            <span className="capitalize">{t}</span>
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px]">
                    {activeTab === 'attendance' && (
                        <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-dark-text">Attendance Register</h2>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="date"
                                        value={attendanceDate}
                                        onChange={(e) => setAttendanceDate(e.target.value)}
                                        className="bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-dark-text focus:outline-none focus:border-primary-500"
                                    />
                                    <button
                                        onClick={handleSaveAttendance}
                                        disabled={saving}
                                        className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-primary-500/20"
                                    >
                                        {saving ? 'Saving...' : 'Save Attendance'}
                                    </button>
                                </div>
                            </div>

                            {attendanceLoading ? (
                                <div className="text-center py-12 text-slate-400">Loading attendance data...</div>
                            ) : !course.students || course.students.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="bg-dark-bg p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>
                                    <p className="text-slate-400">No students enrolled in this course.</p>
                                    <p className="text-sm text-slate-500 mt-2">Enroll students from the Settings tab or Admin panel.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-dark-border text-slate-600 text-sm">
                                                <th className="py-3 px-4">Roll No</th>
                                                <th className="py-3 px-4">Student Name</th>
                                                <th className="py-3 px-4 text-center">Attendance %</th>
                                                <th className="py-3 px-4 text-center">Eligibility</th>
                                                <th className="py-3 px-4 text-center">Status (Today)</th>
                                                <th className="py-3 px-4 text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {course.students.map((student: any) => {
                                                const stats = attendanceStats?.student_stats?.[student.user.id];
                                                const percentage = stats ? stats.percentage : 0;
                                                const isEligible = percentage >= 80;

                                                return (
                                                    <tr key={student.user.id} className="border-b border-dark-border/50 hover:bg-white/5 transition-colors">
                                                        <td className="py-3 px-4 font-mono text-primary-600">{student.roll_number || "N/A"}</td>
                                                        <td className="py-3 px-4 text-dark-text">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-xs text-primary-600 font-bold">
                                                                    {student.user.first_name?.[0]}{student.user.last_name?.[0]}
                                                                </div>
                                                                <div>
                                                                    {student.user.first_name} {student.user.last_name}
                                                                    <div className="text-xs text-slate-600">{student.user.username}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4 text-center font-bold text-dark-text">
                                                            {percentage}%
                                                        </td>
                                                        <td className="py-3 px-4 text-center">
                                                            {isEligible ? (
                                                                <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded border border-green-500/20">Eligible</span>
                                                            ) : (
                                                                <div className="flex flex-col items-center">
                                                                    <span className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded border border-red-500/20 mb-1">Ineligible</span>
                                                                    <span className="text-[10px] text-red-300 max-w-[120px] leading-tight">Contact Administration</span>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="py-3 px-4 text-center">
                                                            <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${attendanceRecords[student.user.id]
                                                                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                                } `}>
                                                                {attendanceRecords[student.user.id] ? 'Present' : 'Absent'}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-4 text-center">
                                                            <button
                                                                onClick={() => toggleAttendance(student.user.id)}
                                                                className={`w-10 h-6 rounded-full p-1 transition-colors ${attendanceRecords[student.user.id] ? 'bg-primary-600' : 'bg-slate-600'
                                                                    } `}
                                                            >
                                                                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${attendanceRecords[student.user.id] ? 'translate-x-4' : 'translate-x-0'
                                                                    } `}></div>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                        {/* Table Footer with Summary */}
                                        <tfoot>
                                            <tr className="bg-white/5">
                                                <td colSpan={4} className="py-3 px-4 text-slate-600 font-medium">Summary (Today)</td>
                                                <td colSpan={2} className="py-3 px-4 text-right text-sm">
                                                    <span className="text-green-400 mr-4">
                                                        Present: {Object.values(attendanceRecords).filter(v => v).length}
                                                    </span>
                                                    <span className="text-red-400">
                                                        Absent: {Object.values(attendanceRecords).filter(v => !v).length}
                                                    </span>
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ENROLLMENT TAB */}
                    {activeTab === 'enrollment' && (
                        <div className="space-y-6">
                            {/* 1. Add Student */}
                            <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
                                <h3 className="text-lg font-bold text-dark-text mb-4">Enroll New Student</h3>
                                <div className="flex gap-4">
                                    <select
                                        value={enrollStudentId}
                                        onChange={(e) => setEnrollStudentId(e.target.value)}
                                        className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-dark-text focus:outline-none focus:border-primary-500"
                                    >
                                        <option value="">Select a student...</option>
                                        {allStudents
                                            .filter(s => !course.students?.some((enrolled: any) => enrolled.user.id === s.user.id))
                                            .map((student: any) => (
                                                <option key={student.id} value={student.user.id}>
                                                    {student.user.first_name} {student.user.last_name} ({student.roll_number})
                                                </option>
                                            ))}
                                    </select>
                                    <button
                                        onClick={handleEnrollStudent}
                                        disabled={!enrollStudentId}
                                        className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Enroll
                                    </button>
                                </div>
                            </div>

                            {/* 2. Pending Requests */}
                            <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
                                <h3 className="text-lg font-bold text-dark-text mb-4">Pending Enrollment Requests ({enrollmentRequests.length})</h3>
                                {enrollmentRequests.length === 0 ? (
                                    <p className="text-slate-500 italic">No pending requests.</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="text-slate-600 text-sm border-b border-dark-border">
                                                    <th className="py-2 px-4">Student</th>
                                                    <th className="py-2 px-4">Email</th>
                                                    <th className="py-2 px-4 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {enrollmentRequests.map((req: any) => (
                                                    <tr key={req.id} className="border-b border-dark-border/50">
                                                        <td className="py-3 px-4 text-dark-text font-medium">{req.student_name}</td>
                                                        <td className="py-3 px-4 text-slate-600">{req.student_email}</td>
                                                        <td className="py-3 px-4 text-right flex justify-end gap-2">
                                                            <button
                                                                onClick={() => handleApproveRequest(req.id)}
                                                                className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded hover:bg-green-500/20 transition-colors"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleRejectRequest(req.id)}
                                                                className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded hover:bg-red-500/20 transition-colors"
                                                            >
                                                                Reject
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* 3. Enrolled Students List (Reuse style) */}
                            <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
                                <h3 className="text-lg font-bold text-dark-text mb-4">Enrolled Students ({course.students?.length || 0})</h3>
                                {!course.students || course.students.length === 0 ? (
                                    <p className="text-slate-500 italic">No students enrolled.</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="text-slate-600 text-sm border-b border-dark-border">
                                                    <th className="py-2 px-4">Roll No</th>
                                                    <th className="py-2 px-4">Name</th>
                                                    <th className="py-2 px-4 text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {course.students.map((student: any) => (
                                                    <tr key={student.user.id} className="border-b border-dark-border/50 hover:bg-white/5">
                                                        <td className="py-3 px-4 font-mono text-primary-600">{student.roll_number}</td>
                                                        <td className="py-3 px-4 text-dark-text">
                                                            <div>{student.user.first_name} {student.user.last_name}</div>
                                                            <div className="text-xs text-slate-600">{student.user.email}</div>
                                                        </td>
                                                        <td className="py-3 px-4 text-right">
                                                            <button
                                                                onClick={() => handleRemoveStudent(student.user.id)}
                                                                className="text-red-400 hover:text-red-300 text-sm font-medium"
                                                            >
                                                                Remove
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

                    {/* 1. OVERVIEW */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            {/* Key Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                                <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-6 rounded-2xl border border-indigo-500/20 relative overflow-hidden group hover:shadow-lg hover:shadow-indigo-500/10 transition-all">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full -translate-y-8 translate-x-8"></div>
                                    <div className="relative">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                                                <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                            </div>
                                        </div>
                                        <p className="text-3xl font-bold text-black/70 mb-1">{course.students?.length || 0}</p>
                                        <p className="text-sm text-slate-700">Enrolled Students</p>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-6 rounded-2xl border border-emerald-500/20 relative overflow-hidden group hover:shadow-lg hover:shadow-emerald-500/10 transition-all">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full -translate-y-8 translate-x-8"></div>
                                    <div className="relative">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                                <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </div>
                                        </div>
                                        <p className="text-3xl font-bold text-black/70 mb-1">{course.credit_hours || 3}</p>
                                        <p className="text-sm text-slate-700">Credit Hours</p>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-6 rounded-2xl border border-amber-500/20 relative overflow-hidden group hover:shadow-lg hover:shadow-amber-500/10 transition-all">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full -translate-y-8 translate-x-8"></div>
                                    <div className="relative">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                                <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                            </div>
                                        </div>
                                        <p className="text-3xl font-bold text-black/70 mb-1">{course.teachers?.length || 1}</p>
                                        <p className="text-sm text-slate-700">Instructors</p>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-rose-500/10 to-pink-500/10 p-6 rounded-2xl border border-rose-500/20 relative overflow-hidden group hover:shadow-lg hover:shadow-rose-500/10 transition-all">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full -translate-y-8 translate-x-8"></div>
                                    <div className="relative">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center">
                                                <svg className="w-6 h-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            </div>
                                        </div>
                                        <p className="text-3xl font-bold text-black/70 mb-1">{course.semester || 'N/A'}</p>
                                        <p className="text-sm text-slate-700">Semester</p>
                                    </div>
                                </div>
                            </div>

                            {/* Course Details & Quick Actions */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Course Information */}
                                <div className="lg:col-span-2 bg-dark-card rounded-2xl border border-dark-border overflow-hidden">
                                    <div className="px-6 py-4 border-b border-dark-border bg-dark-surface/50">
                                        <h3 className="text-lg font-semibold text-white">Course Information</h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Course Code</p>
                                                    <p className="text-lg font-mono font-bold text-black/70">{course.code}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Title</p>
                                                    <p className="text-lg font-semibold text-black/70">{course.title}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Department</p>
                                                    <p className="text-black/70">{course.department || 'Computer Science'}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Status</p>
                                                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                                        Active
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Instructors</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {course.teachers && course.teachers.length > 0 ? (
                                                            course.teachers.map((t: string, i: number) => (
                                                                <span key={i} className="px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg text-sm">{t}</span>
                                                            ))
                                                        ) : (
                                                            <span className="text-slate-500 italic">Unassigned</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {course.description && (
                                            <div className="mt-6 pt-6 border-t border-dark-border">
                                                <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">Description</p>
                                                <p className="text-slate-300 leading-relaxed">{course.description}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="bg-dark-card rounded-2xl border border-dark-border overflow-hidden">
                                    <div className="px-6 py-4 border-b border-dark-border bg-dark-surface/50">
                                        <h3 className="text-lg font-semibold text-black/70">Quick Actions</h3>
                                    </div>
                                    <div className="p-4 space-y-2">
                                        <button
                                            onClick={() => router.push({ query: { ...router.query, tab: 'attendance' } })}
                                            className="w-full flex items-center gap-4 p-4 rounded-xl bg-dark-surface hover:bg-rose-500/5 border border-dark-border hover:border-rose-500/30 transition-all group"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                                                {Icons.attendance}
                                            </div>
                                            <div className="text-left">
                                                <p className="font-medium text-rose-400">Mark Attendance</p>
                                                <p className="text-xs text-slate-500">Record today's attendance</p>
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => router.push({ query: { ...router.query, tab: 'enrollment' } })}
                                            className="w-full flex items-center gap-4 p-4 rounded-xl bg-dark-surface hover:bg-white/5 border border-dark-border hover:border-emerald-500/30 transition-all group"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                                                {Icons.enrollment}
                                            </div>
                                            <div className="text-left">
                                                <p className="font-medium text-emerald-400">Manage Students</p>
                                                <p className="text-xs text-slate-500">Enroll or remove students</p>
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => router.push({ query: { ...router.query, tab: 'exams' } })}
                                            className="w-full flex items-center gap-4 p-4 rounded-xl bg-dark-surface hover:bg-white/5 border border-dark-border hover:border-amber-500/30 transition-all group"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                                                {Icons.exams}
                                            </div>
                                            <div className="text-left">
                                                <p className="font-medium text-amber-400">Schedule Exam</p>
                                                <p className="text-xs text-slate-500">Create new examination</p>
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => router.push({ query: { ...router.query, tab: 'settings' } })}
                                            className="w-full flex items-center gap-4 p-4 rounded-xl bg-dark-surface hover:bg-white/5 border border-dark-border hover:border-rose-500/30 transition-all group"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                                                {Icons.settings}
                                            </div>
                                            <div className="text-left">
                                                <p className="font-medium text-rose-400">Course Settings</p>
                                                <p className="text-xs text-slate-500">Manage instructors & more</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Enrolled Students Preview */}
                            {course.students && course.students.length > 0 && (
                                <div className="bg-dark-card rounded-2xl border border-dark-border overflow-hidden">
                                    <div className="px-6 py-4 border-b border-dark-border bg-dark-surface/50 flex justify-between items-center">
                                        <h3 className="text-lg font-semibold text-black/70">Recent Students</h3>
                                        <button
                                            onClick={() => router.push({ query: { ...router.query, tab: 'enrollment' } })}
                                            className="text-sm text-rose-400 hover:text-rose-300 font-medium"
                                        >
                                            View All →
                                        </button>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex flex-wrap gap-3">
                                            {course.students.slice(0, 8).map((student: any) => (
                                                <div key={student.user.id} className="flex items-center gap-3 px-4 py-3 bg-dark-surface rounded-xl border border-dark-border">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                                        {student.user.first_name?.[0]}{student.user.last_name?.[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-rose-400 text-sm">{student.user.first_name} {student.user.last_name}</p>
                                                        <p className="text-xs text-slate-500 font-mono">{student.roll_number}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {course.students.length > 8 && (
                                                <div className="flex items-center justify-center px-6 py-3 bg-dark-surface rounded-xl border border-dashed border-dark-border text-slate-500">
                                                    +{course.students.length - 8} more
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}


                    {/* 2. SETTINGS (Moved Logic from Old Page) */}
                    {activeTab === 'settings' && (
                        <div className="max-w-2xl bg-dark-surface border border-dark-border rounded-xl p-6">
                            <h2 className="text-lg font-bold text-dark-text mb-4">Course Settings</h2>

                            <div className="mb-6">
                                <h3 className="text-md font-medium text-dark-text mb-3">Instructor Assignment</h3>

                                <div className="mb-4">
                                    <label className="block text-sm text-slate-600 mb-2">Assigned Instructors</label>
                                    <div className="space-y-2">
                                        {selectedTeacherIds.length === 0 ? (
                                            <p className="text-slate-500 text-sm italic">No instructors assigned.</p>
                                        ) : (
                                            selectedTeacherIds.map(id => {
                                                const teacher = teachers.find(t => t.user?.id === id);
                                                return (
                                                    <div key={id} className="flex items-center justify-between bg-dark-bg p-3 rounded-lg border border-dark-border">
                                                        <span className="text-dark-text">
                                                            {teacher ? `${teacher.user.first_name} ${teacher.user.last_name} (${teacher.user.username})` : `User ID: ${id} `}
                                                        </span>
                                                        <button
                                                            onClick={() => removeTeacher(id)}
                                                            className="text-red-400 hover:text-red-300 text-sm"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm text-slate-600 mb-1">Add Instructor</label>
                                    <select
                                        onChange={(e) => {
                                            if (e.target.value) {
                                                addTeacher(e.target.value);
                                                e.target.value = ""; // Reset
                                            }
                                        }}
                                        className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-dark-text focus:outline-none focus:border-primary-500 transition-colors"
                                    >
                                        <option value="">Select a teacher to add...</option>
                                        {teachers.filter(t => !selectedTeacherIds.includes(t.user?.id)).map((teacher: any) => (
                                            <option key={teacher.id} value={teacher.user.id}>
                                                {teacher.user.first_name} {teacher.user.last_name} ({teacher.user.username})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    onClick={handleAssignTeacher}
                                    disabled={saving}
                                    className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${saving
                                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                        : 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                                        } `}
                                >
                                    {saving ? 'Saving...' : 'Save Instructors'}
                                </button>
                            </div>
                            <div className="border-t border-dark-border pt-6">
                                <button className="text-red-400 hover:text-red-300 font-medium text-sm">Delete Course (Danger Zone)</button>
                            </div>
                        </div>
                    )}

                    {/* 3. ASSIGNMENTS */}
                    {activeTab === 'assignments' && (
                        <div className="text-center py-10 bg-dark-surface border border-dark-border rounded-xl">
                            <p className="text-slate-600 mb-4">Manage assignments for this course.</p>
                            <button
                                onClick={() => router.push('/dashboard/assignments')}
                                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500"
                            >
                                Go to Assignments Dashboard
                            </button>
                        </div>
                    )}

                    {/* 4. EXAMS TAB (Teacher Only) */}
                    {activeTab === 'exams' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center bg-dark-card p-6 rounded-xl border border-dark-border">
                                <div>
                                    <h2 className="text-xl font-bold text-dark-text">Exams Management</h2>
                                    <p className="text-slate-600">Schedule and manage exams for this course.</p>
                                </div>
                                <button
                                    onClick={() => setShowCreateExamModal(true)}
                                    className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg shadow-lg shadow-primary-500/20 transition-all font-medium"
                                >
                                    + Create Exam
                                </button>
                            </div>

                            {/* Create Exam Modal */}
                            {showCreateExamModal && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                                    <div className="bg-dark-card border border-dark-border rounded-xl p-6 w-full max-w-md shadow-2xl relative">
                                        <button
                                            onClick={() => setShowCreateExamModal(false)}
                                            className="absolute top-4 right-4 text-slate-600 hover:text-dark-text"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>

                                        <h3 className="text-xl font-bold text-dark-text mb-6">Schedule New Exam</h3>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm text-slate-600 mb-1">Exam Title</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-dark-text focus:outline-none focus:border-primary-500"
                                                    placeholder="e.g. Midterm Examination"
                                                    value={createExamForm.title}
                                                    onChange={(e) => setCreateExamForm({ ...createExamForm, title: e.target.value })}
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm text-slate-400 mb-1">Date</label>
                                                    <input
                                                        type="date"
                                                        className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500"
                                                        value={createExamForm.date}
                                                        onChange={(e) => setCreateExamForm({ ...createExamForm, date: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm text-slate-400 mb-1">Start Time</label>
                                                    <input
                                                        type="time"
                                                        className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500"
                                                        value={createExamForm.startTime}
                                                        onChange={(e) => setCreateExamForm({ ...createExamForm, startTime: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm text-slate-400 mb-1">Duration (Minutes)</label>
                                                <input
                                                    type="number"
                                                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500"
                                                    value={createExamForm.durationMinutes}
                                                    onChange={(e) => setCreateExamForm({ ...createExamForm, durationMinutes: parseInt(e.target.value) || 0 })}
                                                />
                                            </div>

                                            <button
                                                onClick={handleCreateExam}
                                                disabled={saving}
                                                className={`w-full py-3 rounded-lg font-bold text-white shadow-lg transition-all mt-4 ${saving
                                                    ? 'bg-primary-900 cursor-not-allowed text-slate-400'
                                                    : 'bg-primary-600 hover:bg-primary-500 shadow-primary-500/20'
                                                    }`}
                                            >
                                                {saving ? 'Creating...' : 'Schedule Exam'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="bg-dark-card rounded-xl border border-dark-border p-6">
                                <h3 className="text-lg font-bold text-white mb-4">Scheduled Exams</h3>
                                {examLoading ? (
                                    <div className="text-center py-8 text-slate-400">Loading exams...</div>
                                ) : exams.length === 0 ? (
                                    <div className="text-center py-8 text-slate-500 italic">No exams created yet.</div>
                                ) : (
                                    <div className="space-y-3">
                                        {exams.map((exam) => (
                                            <div key={exam.id} className="bg-dark-bg border border-dark-border rounded-lg p-4 flex justify-between items-center group hover:border-primary-500/30 transition-colors">
                                                <div>
                                                    <h4 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors">{exam.title}</h4>
                                                    <p className="text-slate-400 text-sm flex gap-3">
                                                        <span>{new Date(exam.start_time).toLocaleDateString()}</span>
                                                        <span>{new Date(exam.start_time).toLocaleTimeString()}</span>
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs bg-primary-500/10 text-primary-400 px-2 py-1 rounded border border-primary-500/20">Scheduled</span>
                                                    <button className="text-slate-400 hover:text-white transition-colors">
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* 5. CURRICULUM TAB */}
                    {activeTab === 'curriculum' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center bg-dark-surface p-4 rounded-xl border border-dark-border">
                                <div>
                                    <h3 className="text-xl font-bold text-dark-text">Course Curriculum</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">Manage modules, lessons, and video content.</p>
                                </div>
                                <button onClick={() => setIsAddingModule(true)} className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                    Add Module
                                </button>
                            </div>

                            {isAddingModule && (
                                <div className="bg-dark-card border border-primary-500/30 p-4 rounded-xl flex gap-3">
                                    <input type="text" value={newModuleTitle} onChange={(e) => setNewModuleTitle(e.target.value)} placeholder="Module Title (e.g. Week 1: Introduction)" className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-slate-900 placeholder-slate-400" autoFocus />
                                    <button onClick={handleCreateModule} disabled={saving} className="px-4 py-2 bg-primary-600 text-white rounded-lg">Save</button>
                                    <button onClick={() => setIsAddingModule(false)} className="px-4 py-2 border border-dark-border text-slate-600 dark:text-slate-300 rounded-lg">Cancel</button>
                                </div>
                            )}

                            {course?.modules?.map((module: any, index: number) => (
                                <div key={module.id} className="bg-dark-card border border-dark-border rounded-xl overflow-hidden">
                                    <div className="bg-dark-surface px-6 py-4 border-b border-dark-border flex justify-between items-center">
                                        {editingModuleId === module.id ? (
                                            <div className="flex items-center gap-2 flex-1 mr-3">
                                                <input
                                                    type="text"
                                                    value={editModuleTitle}
                                                    onChange={e => setEditModuleTitle(e.target.value)}
                                                    onKeyDown={e => { if (e.key === 'Enter') handleUpdateModuleTitle(module.id); if (e.key === 'Escape') setEditingModuleId(null); }}
                                                    className="flex-1 bg-dark-bg border border-primary-500/50 rounded-lg px-3 py-1.5 text-dark-text text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                                                    autoFocus
                                                />
                                                <button onClick={() => handleUpdateModuleTitle(module.id)} disabled={saving} className="px-3 py-1.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-500 transition-colors shadow-sm">Save</button>
                                                <button onClick={() => setEditingModuleId(null)} className="px-3 py-1.5 border border-dark-border text-slate-300 hover:bg-white/5 text-sm font-medium rounded-lg transition-colors">Cancel</button>
                                            </div>
                                        ) : (
                                            <h4 className="font-bold text-dark-text text-lg">Module {index + 1}: {module.title}</h4>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => { setEditingModuleId(module.id); setEditModuleTitle(module.title); }}
                                                title="Rename module"
                                                className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-500/10 rounded-lg transition-all"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            </button>
                                            <button onClick={() => setAddingLessonToModule(module.id)} className="text-sm text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 dark:text-primary-400 dark:hover:text-primary-300 flex items-center gap-1 font-medium dark:bg-primary-900/20 dark:hover:bg-primary-900/40 px-3 py-1.5 rounded-lg transition-all">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg> Add Lesson
                                            </button>
                                            <button
                                                onClick={() => handleDeleteModule(module.id)}
                                                disabled={deletingModuleId === module.id}
                                                title="Delete module"
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                            >
                                                {deletingModuleId === module.id
                                                    ? <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                                                    : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                }
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4 space-y-3">
                                        {module.lessons?.map((lesson: any, lIndex: number) => (
                                            <div key={lesson.id} className="bg-dark-bg border border-dark-border p-5 rounded-xl flex flex-col gap-4 group">
                                                <div className="flex justify-between items-start w-full">
                                                    {editingLessonId === lesson.id ? (
                                                        <div className="flex items-center gap-2 flex-1 max-w-lg mr-4">
                                                            <input
                                                                type="text"
                                                                value={editLessonTitle}
                                                                onChange={e => setEditLessonTitle(e.target.value)}
                                                                onKeyDown={e => { if (e.key === 'Enter') handleUpdateLessonTitle(lesson.id); if (e.key === 'Escape') setEditingLessonId(null); }}
                                                                className="flex-1 bg-dark-surface border border-primary-500/50 rounded-lg px-3 py-1.5 text-dark-text text-sm focus:outline-none focus:border-primary-500"
                                                                autoFocus
                                                            />
                                                            <button onClick={() => handleUpdateLessonTitle(lesson.id)} disabled={saving} className="px-3 py-1.5 bg-primary-600 text-white text-xs font-medium rounded-lg shadow-sm hover:bg-primary-500 transition-colors">Save</button>
                                                            <button onClick={() => setEditingLessonId(null)} className="px-3 py-1.5 border border-dark-border text-slate-400 hover:bg-white/5 text-xs font-medium rounded-lg transition-colors">Cancel</button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-3">
                                                            <h5 className="font-medium text-slate-800 dark:text-slate-200 text-base">Lecture {lIndex + 1}: {lesson.title}</h5>
                                                            <button onClick={() => { setEditingLessonId(lesson.id); setEditLessonTitle(lesson.title); }} title="Rename lesson" className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-500/10 rounded-md transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                            </button>
                                                        </div>
                                                    )}
                                                    
                                                    <button onClick={() => handleDeleteLesson(lesson.id)} disabled={deletingLessonId === lesson.id} title="Delete lesson" className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                                                        {deletingLessonId === lesson.id ? <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg> : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>}
                                                    </button>
                                                </div>
                                                <div className="flex-1">
                                                    
                                                    {lesson.youtube_video_id && (
                                                        <div className="mt-3 relative w-full rounded-xl overflow-hidden border border-dark-border aspect-video bg-black shadow-sm group/video">
                                                            <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${lesson.youtube_video_id}?modestbranding=1&rel=0`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                                            <div className="absolute top-3 right-3 opacity-0 group-hover/video:opacity-100 transition-opacity">
                                                                <button
                                                                    onClick={() => handleDeleteVideo(lesson.id)}
                                                                    disabled={deletingVideoId === lesson.id}
                                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600/95 hover:bg-red-500 text-white text-sm rounded-lg font-medium backdrop-blur-sm shadow-xl border border-red-500/50 transition-colors"
                                                                >
                                                                    {deletingVideoId === lesson.id ? 'Removing...' : '✕ Remove Video'}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Resources List */}
                                                    {lesson.resources && lesson.resources.length > 0 && (
                                                        <div className="mt-3 flex flex-wrap gap-2">
                                                            {lesson.resources.map((res: any) => (
                                                                <div key={res.id} className="flex items-center gap-2 bg-dark-surface border border-dark-border px-3 py-1.5 rounded-lg text-sm text-slate-700 dark:text-slate-300">
                                                                    <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                                                    <a href={res.file} target="_blank" rel="noreferrer" className="hover:text-primary-600 dark:hover:text-primary-400 truncate max-w-[200px]">{res.title}</a>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Action Buttons */}
                                                    <div className="mt-3 flex items-center gap-3">
                                                        {!lesson.youtube_video_id && (
                                                            <div className="flex flex-col gap-2">
                                                                {linkingVideoId === lesson.id ? (
                                                                    <div className="flex items-center gap-2">
                                                                        <input 
                                                                            type="text" 
                                                                            placeholder="Paste YouTube URL..." 
                                                                            className="bg-dark-bg border border-dark-border rounded px-3 py-2 text-sm text-dark-text focus:border-primary-500 focus:outline-none"
                                                                            value={youtubeUrlInput}
                                                                            onChange={e => setYoutubeUrlInput(e.target.value)}
                                                                            autoFocus
                                                                        />
                                                                        <button onClick={() => handleLinkYouTube(lesson.id)} disabled={uploadingLessonId === lesson.id} className="px-3 py-2 bg-primary-600 text-white rounded text-sm font-medium hover:bg-primary-500 transition-colors">Save</button>
                                                                        <button onClick={() => { setLinkingVideoId(null); setYoutubeUrlInput(''); }} className="px-3 py-2 border border-dark-border text-slate-400 rounded text-sm font-medium hover:bg-slate-800 transition-colors">Cancel</button>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex flex-wrap items-center gap-2">
                                                                        <button onClick={() => setLinkingVideoId(lesson.id)} className={`px-4 py-2 rounded-lg text-sm font-medium border flex items-center gap-2 transition-all bg-dark-surface border-dark-border text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-border`}>
                                                                            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                                                                            Link YouTube Video
                                                                        </button>
                                                                        <span className="text-xs text-slate-500 font-medium px-1">OR</span>
                                                                        <label className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium border flex items-center gap-2 transition-all ${uploadingLessonId === lesson.id ? 'bg-primary-100 dark:bg-primary-900/50 border-primary-300 dark:border-primary-500/30 text-primary-600 dark:text-primary-300 cursor-not-allowed' : 'bg-dark-surface border-dark-border text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-border'}`}>
                                                                            {uploadingLessonId === lesson.id ? (
                                                                                <>
                                                                                   <svg className="animate-spin w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                                                   Uploading...
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                                                                    Upload MP4
                                                                                    <input type="file" accept="video/mp4,video/x-m4v,video/*" className="hidden" onChange={(e) => {
                                                                                        if (e.target.files && e.target.files[0]) handleVideoUpload(lesson.id, e.target.files[0]);
                                                                                    }} disabled={uploadingLessonId === lesson.id} />
                                                                                </>
                                                                            )}
                                                                        </label>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}

                                                        <label className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium border flex items-center gap-2 transition-all ${uploadingResourceId === lesson.id ? 'bg-primary-100 dark:bg-primary-900/50 border-primary-300 dark:border-primary-500/30 text-primary-600 dark:text-primary-300 cursor-not-allowed' : 'bg-dark-surface border-dark-border text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-border'}`}>
                                                            {uploadingResourceId === lesson.id ? (
                                                                <>
                                                                   <svg className="animate-spin w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                                   Uploading...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                                                    Upload Material
                                                                    <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" className="hidden" onChange={(e) => {
                                                                        if (e.target.files && e.target.files[0]) handleResourceUpload(lesson.id, e.target.files[0]);
                                                                    }} disabled={uploadingResourceId === lesson.id} />
                                                                </>
                                                            )}
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {addingLessonToModule === module.id && (
                                            <div className="bg-dark-bg border border-primary-500/30 p-3 rounded-lg flex gap-2 ml-4 mb-2">
                                                <input type="text" value={newLessonTitle} onChange={(e) => setNewLessonTitle(e.target.value)} placeholder="Lesson Title" className="flex-1 bg-dark-surface border border-dark-border rounded px-3 py-1.5 text-slate-900 placeholder-slate-400 text-sm" autoFocus />
                                                <button onClick={() => handleCreateLesson(module.id)} disabled={saving} className="px-3 py-1.5 bg-primary-600 text-white text-sm rounded">Save</button>
                                                <button onClick={() => setAddingLessonToModule(null)} className="px-3 py-1.5 border border-dark-border text-slate-600 dark:text-slate-300 text-sm rounded">Cancel</button>
                                            </div>
                                        )}
                                        {(!module.lessons || module.lessons.length === 0) && addingLessonToModule !== module.id && (
                                            <div className="text-slate-500 text-sm italic py-2 ml-4">No lessons in this module yet.</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {(!course?.modules || course.modules.length === 0) && (
                                <div className="text-center py-12 bg-dark-surface border border-dark-border rounded-xl">
                                    <div className="w-16 h-16 bg-dark-bg rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                    </div>
                                    <p className="text-slate-400">No curriculum modules created yet.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 6. OTHER TABS (Placeholders) */}
                    {(['results', 'timetable'].includes(activeTab)) && (
                        <div className="flex flex-col items-center justify-center py-20 bg-dark-surface border border-dark-border rounded-xl">
                            <div className="w-16 h-16 bg-dark-bg rounded-full flex items-center justify-center mb-4 text-slate-600">
                                {Icons[activeTab as keyof typeof Icons]}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module</h3>
                            <p className="text-slate-400">This feature is part of the comprehensive Course Module.</p>
                            <span className="mt-4 px-3 py-1 bg-yellow-500/10 text-yellow-500 text-xs rounded-full border border-yellow-500/20">Coming Soon</span>
                        </div>
                    )}

                </div>
            </div>
        </DashboardLayout>
        <ConfirmModal 
            isOpen={confirmModal.isOpen} 
            onClose={closeConfirm} 
            onConfirm={confirmModal.onConfirm}
            title={confirmModal.title}
            description={confirmModal.description}
            confirmText={confirmModal.confirmText}
        />
        </>
    );
}
