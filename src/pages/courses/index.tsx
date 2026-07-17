import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Search, BookOpen, Clock, Users, ArrowRight } from 'lucide-react';
import Header from '../../components/LandingPage/Header';
import Footer from '../../components/LandingPage/Footer';
import { CoursesService } from '../../services/courses.service';

export default function CoursesPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await CoursesService.getAll();
                // Handle pagination or direct array
                setCourses(Array.isArray(data) ? data : (data as any).results || []);
            } catch (error) {
                console.error("Failed to fetch courses", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <Head>
                <title>All Courses | REVOTIC LMS</title>
            </Head>
            <Header />

            <main className="pt-32 pb-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    {/* Page Header */}
                    <div className="text-center mb-12">
                        <span className="text-primary-600 font-bold tracking-widest uppercase text-sm mb-4 block">Expand Your Horizons</span>
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Explore Our Courses</h1>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Join thousands of students learning from the best instructors. Find the perfect course to upgrade your skills.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto mb-16 relative">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search courses by title or code..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 shadow-sm focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        </div>
                    </div>

                    {/* Course Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="bg-white rounded-3xl h-96 animate-pulse"></div>
                            ))}
                        </div>
                    ) : filteredCourses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredCourses.map((course) => (
                                <Link href={`/courses/${course.id}`} key={course.id} className="group">
                                    <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                                        <div className="relative h-48 bg-slate-200">
                                            {course.thumbnail ? (
                                                <img
                                                    src={course.thumbnail}
                                                    alt={course.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                                                    <BookOpen className="w-12 h-12 opacity-20" />
                                                </div>
                                            )}
                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-900 uppercase tracking-wide">
                                                {course.code || 'COURSE'}
                                            </div>
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex items-center gap-2 mb-3 text-sm text-slate-500">
                                                <span className="bg-primary-50 text-primary-700 px-2 py-0.5 rounded-md font-medium">Department</span>
                                                <span>•</span>
                                                <span>{course.teacher || 'Instructor'}</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                                                {course.title}
                                            </h3>
                                            <p className="text-slate-500 text-sm line-clamp-2 mb-6 flex-1">
                                                {course.description || "No description available."}
                                            </p>

                                            <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
                                                <div className="flex items-center gap-4 text-sm text-slate-500">
                                                    <div className="flex items-center gap-1">
                                                        <Users className="w-4 h-4" />
                                                        <span>{course.students ? course.students.length : 0} enrolled</span>
                                                    </div>
                                                </div>
                                                <span className="text-primary-600 font-bold flex items-center gap-1 text-sm bg-primary-50 px-3 py-1.5 rounded-lg group-hover:bg-primary-600 group-hover:text-white transition-all">
                                                    View Details
                                                    <ArrowRight className="w-4 h-4" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                <Search className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No courses found</h3>
                            <p className="text-slate-500">Try adjusting your search terms.</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
