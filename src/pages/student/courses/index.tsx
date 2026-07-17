import { useState, useEffect } from 'react';
import StudentLayout from '../../../components/layout/StudentLayout';
import { StudentService } from '../../../services/student.service';
import { BookOpen, User, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Course {
    id: number;
    title: string;
    code: string;
    teacher: string;
    thumbnail: string | null;
    description: string;
}

export default function StudentCoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await StudentService.getMyCourses();
                // Handle paginated response from DRF
                if (data && Array.isArray((data as any).results)) {
                    setCourses((data as any).results);
                } else if (Array.isArray(data)) {
                    setCourses(data);
                } else {
                    console.error("Unexpected response format", data);
                    setCourses([]);
                }
            } catch (error) {
                console.error("Failed to fetch courses", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    return (
        <StudentLayout title="My Courses">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-dark-text">My Courses</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Access your enrolled subjects and learning materials.</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : courses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-dark-surface rounded-2xl border border-dark-border border-dashed">
                    <BookOpen className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
                    <h3 className="text-lg font-medium text-dark-text">No courses found</h3>
                    <p className="text-slate-500 text-center max-w-sm mt-2">You regularly don't appear to be enrolled in any courses yet. Contact your administration if this is an error.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <div key={course.id} className="bg-dark-surface rounded-2xl border border-dark-border overflow-hidden hover:shadow-lg transition-all group flex flex-col h-full">
                            {/* Thumbnail */}
                            <div className="h-48 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                                {course.thumbnail ? (
                                    <img
                                        src={course.thumbnail}
                                        alt={course.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                                        <BookOpen className="w-12 h-12" />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-dark-text shadow-sm">
                                    {course.code || 'CODE'}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5 flex flex-col flex-1">
                                <h3 className="text-lg font-bold text-dark-text mb-2 line-clamp-2 min-h-[3.5rem]">{course.title}</h3>

                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">
                                        {course.teacher ? course.teacher[0] : 'T'}
                                    </div>
                                    <span className="text-sm text-slate-500 truncate">{course.teacher || 'Unknown Instructor'}</span>
                                </div>

                                <div className="mt-auto pt-4 border-t border-dark-border flex items-center justify-between">
                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> Still in Progress
                                    </span>
                                    <Link
                                        href={`/student/courses/${course.id}`}
                                        className="text-sm font-semibold text-primary-600 hover:text-primary-700 hover:underline"
                                    >
                                        View Course
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </StudentLayout>
    );
}
