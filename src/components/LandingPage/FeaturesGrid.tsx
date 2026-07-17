import React, { useState } from 'react';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    MessageSquare,
    BarChart3,
    CalendarCheck,
    ShieldCheck,
    GraduationCap,
    Clock,
    FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const tabs = [
    { id: 'admin', label: 'Admin Portal', icon: ShieldCheck },
    { id: 'teacher', label: 'Teacher Portal', icon: Users },
    { id: 'student', label: 'Student Portal', icon: GraduationCap },
];

const features = {
    admin: [
        {
            title: "Centralized Control",
            desc: "Manage all users, courses, and settings from a single powerful dashboard.",
            icon: LayoutDashboard,
            color: "bg-blue-50 text-blue-600"
        },
        {
            title: "Advanced Analytics",
            desc: "Track institutional performance, revenue, and attendance trends in real-time.",
            icon: BarChart3,
            color: "bg-indigo-50 text-indigo-600"
        },
        {
            title: "User Management",
            desc: "Bulk import students, manage staff roles, and oversee permissions securely.",
            icon: Users,
            color: "bg-purple-50 text-purple-600"
        },
        {
            title: "Financial Overview",
            desc: "Generate fee challans, track payments, and manage payroll seamlessly.",
            icon: FileText,
            color: "bg-emerald-50 text-emerald-600"
        }
    ],
    teacher: [
        {
            title: "Digital Gradebook",
            desc: "Automate grading and maintain accurate records of student performance.",
            icon: BookOpen,
            color: "bg-amber-50 text-amber-600"
        },
        {
            title: "Smart Attendance",
            desc: "Mark attendance quickly with mobile-friendly tools and automated reports.",
            icon: CalendarCheck,
            color: "bg-rose-50 text-rose-600"
        },
        {
            title: "Assignment Builder",
            desc: "Create quizzes and assignments with support for file uploads and deadlines.",
            icon: Clock,
            color: "bg-cyan-50 text-cyan-600"
        },
        {
            title: "Student Communication",
            desc: "Direct messaging with students and announcements for entire classes.",
            icon: MessageSquare,
            color: "bg-teal-50 text-teal-600"
        }
    ],
    student: [
        {
            title: "Personalized Dashboard",
            desc: "See upcoming deadlines, classes, and notices at a glance.",
            icon: LayoutDashboard,
            color: "bg-sky-50 text-sky-600"
        },
        {
            title: "Course Materials",
            desc: "Access lecture notes, videos, and resources anytime, anywhere.",
            icon: BookOpen,
            color: "bg-violet-50 text-violet-600"
        },
        {
            title: "Result Portal",
            desc: "View grades, transcripts, and progress reports instantly.",
            icon: BarChart3,
            color: "bg-fuchsia-50 text-fuchsia-600"
        },
        {
            title: "Instant Alerts",
            desc: "Get notified about new assignments, grades, and campus news.",
            icon: MessageSquare,
            color: "bg-orange-50 text-orange-600"
        }
    ]
};

const FeaturesGrid = () => {
    const [activeTab, setActiveTab] = useState('admin');

    return (
        <section id="features" className="py-16 bg-slate-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-primary-600 font-semibold tracking-wider uppercase text-sm">Powerful Features</span>
                    <h2 className="text-4xl font-bold text-slate-900 mt-3 mb-6">Everything you need to run your institute</h2>
                    <p className="text-lg text-slate-600">
                        A complete ecosystem designed for every role in your educational journey.
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex justify-center mb-12">
                    <div className="inline-flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === tab.id
                                    ? 'bg-slate-900 text-white shadow-md'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Feature Grid */}
                <div className="min-h-[400px]">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                        >
                            {/* @ts-ignore */}
                            {features[activeTab].map((feature, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-primary-100 transition-all duration-300 group"
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.color} group-hover:scale-110 transition-transform`}>
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                    <p className="text-slate-500 leading-relaxed text-sm">
                                        {feature.desc}
                                    </p>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default FeaturesGrid;
