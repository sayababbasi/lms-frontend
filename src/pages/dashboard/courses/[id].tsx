import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { CoursesService } from '../../../services/courses.service';
import { UsersService } from '../../../services/users.service';
import { useForm } from 'react-hook-form';

export default function CourseManagePage() {
    const router = useRouter();
    const { id } = router.query;
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('settings'); // 'curriculum', 'settings', 'students'
    const [teachers, setTeachers] = useState<any[]>([]);

    useEffect(() => {
        if (id) {
            loadCourse();
            loadTeachers();
        }
    }, [id]);

    const loadCourse = async () => {
        try {
            const data = await CoursesService.getById(Number(id));
            setCourse(data);
        } catch (error) {
            console.error("Failed to load course", error);
            toast.error("Failed to load course details");
        } finally {
            setLoading(false);
        }
    };

    const loadTeachers = async () => {
        try {
            const data = await UsersService.getTeachers();
            setTeachers(Array.isArray(data) ? data : (data as any).results || []);
        } catch (error) {
            console.error("Failed to load teachers", error);
        }
    };

    return (
        <DashboardLayout title={course ? `Manage: ${course.code}` : 'Manage Course'}>
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                </div>
            ) : !course ? (
                <div className="text-center py-20">
                    <h2 className="text-xl text-white">Course not found</h2>
                    <button onClick={() => router.push('/dashboard/courses')} className="mt-4 text-primary-400 hover:text-primary-300">
                        &larr; Back to Courses
                    </button>
                </div>
            ) : (
                <div>
                    {/* Header */}
                    <div className="mb-8 border-b border-dark-border pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button onClick={() => router.push('/dashboard/courses')} className="p-2 bg-dark-surface border border-dark-border rounded-lg text-slate-400 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold text-dark-text flex items-center gap-3">
                                    {course.title}
                                    <span className="px-2 py-1 bg-primary-500/20 text-primary-400 text-xs rounded border border-primary-500/30 uppercase tracking-widest">{course.code}</span>
                                </h1>
                                <p className="text-slate-400 mt-1">Managed by: <span className="text-white font-medium">{course.teacher || 'Unassigned'}</span></p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-dark-text rounded-lg transition-all font-medium">
                                Publish Course
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-6 border-b border-dark-border mb-8">
                        {['settings', 'curriculum', 'students'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-3 px-1 font-medium capitalize text-lg transition-all border-b-2 ${activeTab === tab ? 'text-primary-400 border-primary-400' : 'text-slate-500 border-transparent hover:text-dark-text hover:border-slate-600'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div>
                        {activeTab === 'settings' && <SettingsTab course={course} teachers={teachers} onUpdate={loadCourse} />}
                        {activeTab === 'curriculum' && <CurriculumTab course={course} />}
                        {activeTab === 'students' && <StudentsTab />}
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

function SettingsTab({ course, teachers, onUpdate }: { course: any, teachers: any[], onUpdate: () => void }) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            title: course.title,
            code: course.code,
            description: course.description,
            teacher_id: '' // Can't easily map string name back to ID without passing proper data, defaults to empty for "Change"
        }
    });
    const [uploading, setUploading] = useState(false);

    const onSubmit = async (data: any) => {
        setUploading(true);
        try {
            // Only include teacher_id if selected
            const payload: any = { ...data };
            if (!payload.teacher_id) delete payload.teacher_id;
            else payload.teacher_id = Number(payload.teacher_id); // Ensure number

            await CoursesService.update(course.id, payload);
            toast.success("Course settings updated");
            onUpdate();
        } catch (error) {
            console.error("Failed to update course", error);
            toast.error("Failed to update course settings");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-3xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Info */}
                <div className="bg-dark-surface/50 border border-dark-border rounded-xl p-6 space-y-4">
                    <h3 className="text-xl font-bold text-white border-b border-dark-border pb-4 mb-4">General Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Course Title</label>
                            <input {...register('title', { required: 'Title is required' })} className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500" />
                            {errors.title && <span className="text-red-500 text-xs">Title is required</span>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Course Code</label>
                            <input {...register('code', { required: 'Code is required' })} className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                        <textarea {...register('description')} rows={4} className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500" />
                    </div>
                </div>

                {/* Teacher Assignment */}
                <div className="bg-dark-surface/50 border border-dark-border rounded-xl p-6 space-y-4">
                    <h3 className="text-xl font-bold text-white border-b border-dark-border pb-4 mb-4">Instructor Assignment</h3>
                    <p className="text-sm text-slate-400 mb-4">Assign a primary instructor for this course. They will have full access to manage the curriculum and students.</p>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Select Instructor</label>
                        <select {...register('teacher_id')} className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500">
                            <option value="">-- Keep Current ({course.teacher || 'Unassigned'}) --</option>
                            {teachers.filter(t => t.user).map((t: any) => (
                                <option key={t.id} value={t.user.id}>
                                    {t.user.first_name} {t.user.last_name} ({t.user.email})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button type="submit" disabled={uploading} className="px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors flex items-center gap-2">
                        {uploading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}

function CurriculumTab({ course }: { course: any }) {
    return (
        <div className="border border-dark-border border-dashed rounded-xl p-12 text-center bg-dark-surface/30">
            <div className="w-16 h-16 bg-dark-surface rounded-full flex items-center justify-center mx-auto mb-4 border border-dark-border">
                <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Curriculum Builder</h3>
            <p className="text-slate-400 max-w-md mx-auto mb-6">Create modules, add lessons, and organize your course resources here.</p>
            <button className="px-4 py-2 bg-dark-surface border border-dark-border hover:bg-dark-bg rounded-lg text-primary-400 transition-colors">
                + Add Module
            </button>
        </div>
    );
}

function StudentsTab() {
    return (
        <div className="border border-dark-border border-dashed rounded-xl p-12 text-center bg-dark-surface/30">
            <h3 className="text-xl font-bold text-white mb-2">Enrolled Students</h3>
            <p className="text-slate-400">No students enrolled yet.</p>
        </div>
    );
}
