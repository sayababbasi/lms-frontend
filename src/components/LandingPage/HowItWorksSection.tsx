import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Search, PlayCircle, Award, Upload, Users, Settings } from 'lucide-react';

const steps = {
    students: [
        {
            title: "Create an Account",
            description: "Sign up in seconds and build your personalized learner profile.",
            icon: UserPlus,
        },
        {
            title: "Discover Courses",
            description: "Browse through hundreds of courses across various disciplines.",
            icon: Search,
        },
        {
            title: "Start Learning",
            description: "Access high-quality video lectures, quizzes, and assignments.",
            icon: PlayCircle,
        },
        {
            title: "Get Certified",
            description: "Earn recognized certificates upon course completion.",
            icon: Award,
        },
    ],
    instructors: [
        {
            title: "Sign Up as Instructor",
            description: "Join our community of expert educators and share your knowledge.",
            icon: UserPlus,
        },
        {
            title: "Create Course Content",
            description: "Upload videos, PDFs, and create engaging quizzes.",
            icon: Upload,
        },
        {
            title: "Engage Students",
            description: "Interact with students through discussions and live sessions.",
            icon: Users,
        },
        {
            title: "Manage & Analyze",
            description: "Track performance and manage your course analytics.",
            icon: Settings,
        },
    ]
};

const HowItWorksSection = () => {
    const [activeTab, setActiveTab] = useState<'students' | 'instructors'>('students');

    return (
        <section className="py-20 lg:py-32 bg-slate-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                        How It Works
                    </h2>
                    <p className="text-lg text-slate-600 mb-8">
                        Whether you are here to learn or to teach, we make the process simple and enjoyable.
                    </p>

                    <div className="inline-flex p-1 bg-white rounded-xl shadow-sm border border-slate-200">
                        <button
                            onClick={() => setActiveTab('students')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'students'
                                    ? 'bg-primary-600 text-white shadow-md'
                                    : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            For Students
                        </button>
                        <button
                            onClick={() => setActiveTab('instructors')}
                            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'instructors'
                                    ? 'bg-primary-600 text-white shadow-md'
                                    : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            For Instructors
                        </button>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                        >
                            {steps[activeTab].map((step, index) => (
                                <div key={index} className="text-center relative">
                                    {index < steps[activeTab].length - 1 && (
                                        <div className="hidden lg:block absolute top-8 left-1/2 w-full h-[2px] bg-slate-200 -z-10"></div>
                                    )}
                                    <div className="w-16 h-16 rounded-full bg-white border-4 border-slate-50 shadow-lg flex items-center justify-center mx-auto mb-6 text-primary-600 z-10 relative">
                                        <step.icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                                    <p className="text-slate-600 text-sm">{step.description}</p>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

            </div>
        </section>
    );
};

export default HowItWorksSection;
