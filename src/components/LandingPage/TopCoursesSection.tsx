import React from 'react';
import { Star, Clock, BookOpen, Users } from 'lucide-react';

// Using functional component for Image Placeholder to avoid Next.js Image complexity if domain configs are not set
const CourseCard = ({ title, category, rating, students, price, imageColor }: any) => (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 group">
        <div className={`h-48 ${imageColor} relative overflow-hidden`}>
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
            <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-700 uppercase tracking-wide">
                {category}
            </span>
        </div>
        <div className="p-6">
            <div className="flex items-center gap-1 mb-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-sm font-bold text-slate-700">{rating}</span>
                <span className="text-sm text-slate-400">({students} reviews)</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
                {title}
            </h3>
            <div className="flex items-center gap-4 text-slate-500 text-sm mb-4">
                <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>24h 15m</span>
                </div>
                <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>12 Lessons</span>
                </div>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                    <span className="text-sm font-medium text-slate-600">Dr. Sarah Smith</span>
                </div>
                <div className="text-lg font-bold text-primary-600">
                    {price}
                </div>
            </div>
        </div>
    </div>
);

const TopCoursesSection = () => {
    const courses = [
        { title: "Complete Python Bootcamp", category: "Development", rating: 4.8, students: 2304, price: "$89", imageColor: "bg-blue-500" },
        { title: "Digital Marketing Masterclass", category: "Marketing", rating: 4.7, students: 1540, price: "$69", imageColor: "bg-rose-500" },
        { title: "UI/UX Design Fundamentals", category: "Design", rating: 4.9, students: 3100, price: "$99", imageColor: "bg-purple-500" },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                            Explore Our Top Courses
                        </h2>
                        <p className="text-lg text-slate-600">
                            Discover the most popular courses selected by our student community.
                        </p>
                    </div>
                    <button className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors">
                        View All Courses
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course, index) => (
                        <CourseCard key={index} {...course} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TopCoursesSection;
