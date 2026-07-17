import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { CoursesService } from '../../../services/courses.service';
import CourseModal from '../../../components/dashboard/courses/CourseModal';
import {
    Search, Filter, Plus, BookOpen, Users,
    MoreVertical, Edit2, LayoutGrid, List,
    GraduationCap, Clock, Star, MonitorPlay
} from 'lucide-react';

export default function CoursesPage() {
    const router = useRouter();
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        setLoading(true);
        try {
            const data = await CoursesService.getAll();
            setCourses((data as any).results || data);
        } catch (error) {
            console.error("Failed to load courses", error);
            toast.error("Failed to load courses");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrUpdate = async (data: any) => {
        setLoading(true);
        try {
            if (editingCourse) {
                await CoursesService.update(editingCourse.id, data);
            } else {
                await CoursesService.create(data);
            }
            toast.success(editingCourse ? "Course updated successfully" : "Course created successfully");
            setIsModalOpen(false);
            setEditingCourse(null);
            loadCourses();
        } catch (error: any) {
            console.error("Failed to save course", error);
            const message = error.response?.data?.detail || "Failed to save course. Check inputs.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (course: any) => {
        setEditingCourse(course);
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setEditingCourse(null);
        setIsModalOpen(true);
    };

    // Stats Calculation
    const totalCourses = courses.length;
    const totalStudents = courses.reduce((acc, curr) => acc + (curr.enrolled_count || 12), 0); // Mock fallback
    const activeCourses = courses.filter(c => c.is_published !== false).length;

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = [
        {
            label: 'Total Courses',
            value: totalCourses,
            icon: BookOpen,
            color: 'text-blue-500',
            bg: 'bg-blue-50 dark:bg-blue-500/10',
            border: 'border-blue-200 dark:border-blue-500/20',
            shadow: 'shadow-blue-500/20'
        },
        {
            label: 'Total Students',
            value: totalStudents,
            icon: Users,
            color: 'text-purple-500',
            bg: 'bg-purple-50 dark:bg-purple-500/10',
            border: 'border-purple-200 dark:border-purple-500/20',
            shadow: 'shadow-purple-500/20'
        },
        {
            label: 'Active Courses',
            value: activeCourses,
            icon: MonitorPlay,
            color: 'text-green-500',
            bg: 'bg-green-50 dark:bg-green-500/10',
            border: 'border-green-200 dark:border-green-500/20',
            shadow: 'shadow-green-500/20'
        },
    ];

    return (
        <DashboardLayout title="Course Management">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Course Management</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Create, edit, and manage your course curriculum.</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-primary-500/20 transition-all flex items-center gap-2 font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Create New Course
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="group bg-white dark:bg-dark-surface p-5 rounded-2xl border border-slate-200 dark:border-dark-border transition-all duration-300 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} ${stat.border} border ${stat.shadow}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{stat.label}</h3>
                        <div className="text-3xl font-bold text-slate-800 dark:text-white">{stat.value}</div>
                        <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br ${stat.color.replace('text-', 'from-')}/10 to-transparent blur-2xl rounded-full group-hover:scale-150 transition-transform duration-500`} />
                    </div>
                ))}
            </div>

            {/* Content Area */}
            <div className="space-y-6">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-dark-card p-4 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search courses by title or code..."
                            className="bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 w-full transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center bg-slate-50 dark:bg-dark-bg rounded-lg p-1 border border-slate-200 dark:border-dark-border">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-dark-card shadow-sm text-primary-600' : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'}`}
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-dark-card shadow-sm text-primary-600' : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'}`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Course Grid/List */}
                {loading && !courses.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-white dark:bg-dark-card rounded-2xl h-[340px] animate-pulse border border-slate-100 dark:border-dark-border"></div>
                        ))}
                    </div>
                ) : filteredCourses.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-dark-card rounded-2xl border border-dashed border-slate-200 dark:border-dark-border">
                        <div className="mx-auto w-20 h-20 bg-slate-50 dark:bg-dark-surface rounded-full flex items-center justify-center text-slate-400 mb-4 animate-bounce">
                            <BookOpen className="w-10 h-10" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">No courses found</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 mb-6 max-w-xs mx-auto">
                            {searchTerm ? "Try adjusting your search terms." : "Get started by creating your first course curriculum."}
                        </p>
                        {!searchTerm && (
                            <button
                                onClick={openCreateModal}
                                className="px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl shadow-lg shadow-primary-500/20 transition-all font-medium"
                            >
                                Create Course
                            </button>
                        )}
                    </div>
                ) : (
                    <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                        {filteredCourses.map((course) => (
                            <div
                                key={course.id}
                                className={`group bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border hover:border-primary-500/30 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/5 hover:-translate-y-1 flex ${viewMode === 'list' ? 'flex-row items-center h-28' : 'flex-col h-full'}`}
                            >
                                {/* Card Image */}
                                <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-40 h-full' : 'aspect-video w-full'}`}>
                                    {course.thumbnail ? (
                                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full bg-slate-100 dark:bg-dark-surface flex items-center justify-center text-slate-400">
                                            <BookOpen className="w-12 h-12 opacity-20" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <button onClick={() => handleEditClick(course)} className="p-2 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-lg text-slate-700 dark:text-white hover:text-primary-500 shadow-sm">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {course.code && (
                                        <div className="absolute bottom-3 left-3">
                                            <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-wider border border-white/10 shadow-lg">
                                                {course.code}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Card Content */}
                                <div className={`p-5 flex-1 flex flex-col ${viewMode === 'list' ? 'justify-center' : ''}`}>
                                    <div className="mb-1">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                            {course.title}
                                        </h3>
                                        {viewMode === 'list' && (
                                            <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-1 mt-1">
                                                {course.description || "No description provided."}
                                            </p>
                                        )}
                                    </div>

                                    {viewMode !== 'list' && (
                                        <>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4 flex-1">
                                                {course.description || "No description provided."}
                                            </p>

                                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-dark-border/50">
                                                <div className="flex -space-x-2">
                                                    {[1, 2, 3].map(i => (
                                                        <div key={i} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-dark-surface border-2 border-white dark:border-dark-card flex items-center justify-center text-xs font-medium text-slate-600 dark:text-slate-400 shadow-sm">
                                                            {String.fromCharCode(64 + i)}
                                                        </div>
                                                    ))}
                                                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-dark-bg border-2 border-white dark:border-dark-card flex items-center justify-center text-[10px] font-bold text-slate-500 pl-1">
                                                        +12
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => router.push(`/dashboard/courses/${course.id}/manage`)}
                                                    className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1 group/btn"
                                                >
                                                    Manage <div className="w-0 overflow-hidden group-hover/btn:w-auto transition-all"><BookOpen className="w-3.5 h-3.5 ml-1" /></div>
                                                </button>
                                            </div>
                                        </>
                                    )}

                                    {viewMode === 'list' && (
                                        <div className="ml-auto flex items-center gap-4">
                                            <div className="flex items-center gap-6 mr-8 text-sm text-slate-500">
                                                <span className="flex items-center gap-2"><Users className="w-4 h-4" /> 15 Students</span>
                                                <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> 8 Weeks</span>
                                            </div>
                                            <button
                                                onClick={() => router.push(`/dashboard/courses/${course.id}/manage`)}
                                                className="px-4 py-2 border border-slate-200 dark:border-dark-border rounded-xl text-sm font-semibold text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                                            >
                                                Manage Course
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <CourseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateOrUpdate}
                isLoading={loading}
                initialData={editingCourse}
            />
        </DashboardLayout>
    );
}
