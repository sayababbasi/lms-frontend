import { useState, useEffect } from 'react';
import TeacherLayout from '../../../../components/layout/TeacherLayout';
import { Search, Filter, BookOpen, Users, Clock, MoreVertical, LayoutGrid, List } from 'lucide-react';
import Link from 'next/link';

export default function TeacherCourses() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedSemester, setSelectedSemester] = useState<string | null>(null);

    const [courses, setCourses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            setIsLoading(true);
            const { CoursesService } = await import('../../../../services/courses.service');
            const data = await CoursesService.getAll();
            // Handle paginated responses where data might be { count: X, results: [...] }
            setCourses((data as any).results ? (data as any).results : (Array.isArray(data) ? data : []));
        } catch (error) {
            console.error("Failed to load courses", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Filter courses based on search query
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.code?.toLowerCase().includes(searchQuery.toLowerCase());
        // Temporarily disabled semester filter as it's not in the model yet
        return matchesSearch;
    });

    const semesters = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

    return (
        <TeacherLayout title="My Courses">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">My Courses</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage your assigned subjects and students.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-white'}`}
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-white'}`}
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
                <div className="relative w-full md:w-96">
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                    <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                <div className="relative">
                    <button
                        onClick={() => setFilterOpen(!filterOpen)}
                        className={`flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border ${selectedSemester ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'} rounded-lg hover:text-indigo-600 dark:hover:text-white hover:border-indigo-300 dark:hover:border-slate-600 transition-all`}
                    >
                        <Filter className="w-4 h-4" />
                        <span>{selectedSemester ? `${selectedSemester} Sem` : 'Filter'}</span>
                    </button>

                    {filterOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-20 py-1">
                            <button
                                onClick={() => { setSelectedSemester(null); setFilterOpen(false); }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 ${!selectedSemester ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-slate-700 dark:text-slate-300'}`}
                            >
                                All Semesters
                            </button>
                            {semesters.map(sem => (
                                <button
                                    key={sem}
                                    onClick={() => { setSelectedSemester(sem); setFilterOpen(false); }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 ${selectedSemester === sem ? 'text-indigo-600 dark:text-indigo-400 font-medium' : 'text-slate-700 dark:text-slate-300'}`}
                                >
                                    {sem} Sem
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'grid-cols-1 gap-4'}`}>
                {isLoading ? (
                    <div className="col-span-full py-12 text-center text-slate-500">Loading courses...</div>
                ) : filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                        viewMode === 'grid' ? (
                            // Grid View Item
                            <div key={course.id} className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500/30 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col shadow-sm">
                                {/* Course Image / Gradient Placeholder */}
                                <div className="h-40 relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 group-hover:from-indigo-50 dark:group-hover:from-indigo-900/40 group-hover:to-purple-50 dark:group-hover:to-purple-900/40 transition-colors overflow-hidden">
                                    {course.thumbnail ? (
                                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <BookOpen className="w-12 h-12 text-slate-400 dark:text-slate-700 group-hover:text-indigo-500 dark:group-hover:text-indigo-400/50 transition-colors duration-500" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4">
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/60 dark:bg-black/40 backdrop-blur-md text-slate-900 dark:text-white border border-white/20 dark:border-white/10 shadow-sm">
                                            {course.code}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">{course.title}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">General • {course.code}</p>

                                    <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-6">
                                        <div className="flex items-center gap-1.5">
                                            <Users className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                                            <span>{course.students_count || 0} Students</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                                            <span>3 Cr. Hr</span>
                                        </div>
                                    </div>

                                    {/* Progress Bar (Course Completion) */}
                                    <div className="mb-6">
                                        <div className="flex justify-between text-xs mb-1.5">
                                            <span className="text-slate-500 dark:text-slate-400">Course Progress</span>
                                            <span className="text-indigo-600 dark:text-indigo-400 font-medium">{0}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 dark:bg-dark-bg rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                                style={{ width: `0%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="mt-auto grid grid-cols-2 gap-3">
                                        <Link
                                            href={`/teacher/dashboard/courses/${course.id}/manage`}
                                            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm text-center transition-colors shadow-lg shadow-indigo-600/20"
                                        >
                                            Manage
                                        </Link>
                                        <Link
                                            href={`/teacher/dashboard/courses/${course.id}/manage?tab=attendance`}
                                            className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-dark-bg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white font-medium text-sm border border-slate-200 dark:border-dark-border transition-colors text-center"
                                        >
                                            Attendance
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // List View Item
                            <div key={course.id} className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500/30 p-4 transition-all duration-300 flex items-center gap-6 shadow-sm">
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 group-hover:from-indigo-50 dark:group-hover:from-indigo-900/40 group-hover:to-purple-50 dark:group-hover:to-purple-900/40 flex items-center justify-center shrink-0 relative">
                                    {course.thumbnail ? (
                                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <BookOpen className="w-8 h-8 text-slate-400 dark:text-slate-700 group-hover:text-indigo-500 dark:group-hover:text-indigo-400/50 transition-colors" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                                    <div className="md:col-span-1">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">{course.title}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{course.code}</p>
                                    </div>

                                    <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                                        <div className="flex items-center gap-1.5">
                                            <Users className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                                            <span>{course.students_count || 0} Students</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                                            <span>3 Cr. Hr</span>
                                        </div>
                                    </div>

                                    <div className="w-full">
                                        <div className="flex justify-between text-xs mb-1.5">
                                            <span className="text-slate-500 dark:text-slate-400">Progress</span>
                                            <span className="text-indigo-600 dark:text-indigo-400 font-medium">{0}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-100 dark:bg-dark-bg rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                                style={{ width: `0%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-3">
                                        <Link
                                            href={`/teacher/dashboard/courses/${course.id}/manage?tab=attendance`}
                                            className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-dark-bg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white font-medium text-xs border border-slate-200 dark:border-dark-border transition-colors button"
                                        >
                                            Attendance
                                        </Link>
                                        <Link
                                            href={`/teacher/dashboard/courses/${course.id}/manage`}
                                            className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs text-center transition-colors shadow-lg shadow-indigo-600/20"
                                        >
                                            Manage
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                            <Search className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No courses found</h3>
                        <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or filters.</p>
                        <button
                            onClick={() => { setSearchQuery(''); setSelectedSemester(null); }}
                            className="mt-4 px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>
        </TeacherLayout>
    );
}
