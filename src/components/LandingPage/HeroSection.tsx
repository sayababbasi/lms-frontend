import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const slides = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop", // Students walking on campus
        title: "Empowering Future Leaders",
        subtitle: "Join a community dedicated to academic excellence and innovation.",
        cta: "Start Your Journey",
        link: "/signup"
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2256&auto=format&fit=crop", // Library Shelves
        title: "World-Class Resources",
        subtitle: "Access our state-of-the-art digital libraries and research facilities.",
        cta: "Explore Library",
        link: "#resources"
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop", // Lecture Hall / Graduation vibe
        title: "Expert Faculty",
        subtitle: "Learn from industry leaders and distinguished professors.",
        cta: "Meet Instructors",
        link: "#faculty"
    },
    {
        id: 4,
        image: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=1974&auto=format&fit=crop", // Group study / diverse
        title: "Collaborative Learning",
        subtitle: "Engage in meaningful group projects and peer-to-peer learning.",
        cta: "Student Life",
        link: "#community"
    },
    {
        id: 5,
        image: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?q=80&w=1974&auto=format&fit=crop", // Online learning / Laptop/ Virtual
        title: "Flexible Education",
        subtitle: "Learn at your own pace with our comprehensive online courses.",
        cta: "View Online Courses",
        link: "#online"
    }
];

const floatingStats = [
    { label: "Active Students", value: "5,000+", icon: "👨‍🎓", color: "bg-blue-100 text-blue-600" },
    { label: "Online Courses", value: "1,200+", icon: "📚", color: "bg-purple-100 text-purple-600" },
    { label: "Expert Instructors", value: "350+", icon: "👩‍🏫", color: "bg-emerald-100 text-emerald-600" },
];

const HeroSection = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <section className="relative h-screen min-h-[600px] w-full overflow-hidden bg-slate-50">
            <AnimatePresence mode='wait'>
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2 }}
                    className="absolute inset-0"
                >
                    {/* Parallax Background Image */}
                    <motion.div
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 12, ease: "linear" }}
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${slides[current].image})` }}
                    />

                    {/* Light Theme Gradient Overlays */}
                    {/* 1. Base wash to ensure text readability without hiding image */}
                    <div className="absolute inset-0 bg-white/30"></div>

                    {/* 2. Left-side gradient for text container */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent w-[90%] lg:w-[60%]"></div>

                    {/* 3. Bottom gradient for smooth transition */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>

                    <div className="absolute inset-0 flex items-center">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="max-w-3xl relative z-10 pl-4 lg:pl-12">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-white/50 text-primary-600 text-sm font-bold mb-6 shadow-sm"
                                >
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-600"></span>
                                    </span>
                                    New Term Starting Soon
                                </motion.div>

                                <motion.h1
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight drop-shadow-sm"
                                >
                                    {slides[current].title}
                                </motion.h1>
                                <motion.p
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-lg lg:text-2xl text-slate-700 mb-10 max-w-xl font-medium leading-relaxed"
                                >
                                    {slides[current].subtitle}
                                </motion.p>

                                <div className="flex flex-wrap gap-4">
                                    <Link
                                        href={slides[current].link}
                                        className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-primary-600 text-white font-bold text-lg hover:bg-primary-700 transition-all shadow-xl hover:shadow-primary-600/30 transform hover:-translate-y-1"
                                    >
                                        {slides[current].cta}
                                    </Link>
                                    <button className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white/80 backdrop-blur-sm text-slate-700 font-bold text-lg border border-white/50 hover:bg-white transition-all shadow-lg hover:shadow-xl">
                                        View Programs
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation and Indicators moved to fit light theme */}
            <div className="absolute bottom-8 right-8 lg:bottom-12 lg:right-12 flex gap-4 z-30">
                <button
                    onClick={prevSlide}
                    className="w-12 h-12 rounded-full border border-slate-200 bg-white/80 backdrop-blur-sm flex items-center justify-center text-slate-700 hover:bg-white hover:text-primary-600 transition-all shadow-lg hover:scale-105"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                    onClick={nextSlide}
                    className="w-12 h-12 rounded-full border border-slate-200 bg-white/80 backdrop-blur-sm flex items-center justify-center text-slate-700 hover:bg-white hover:text-primary-600 transition-all shadow-lg hover:scale-105"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

            {/* Scroll Down Indicator */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden lg:flex flex-col items-center gap-2"
            >
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-slate-400 to-transparent"></div>
            </motion.div>

            {/* Floating Stats Cards - Light Theme Glassmorphism */}
            <div className="absolute right-[10%] top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-5 z-20">
                {floatingStats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6 + (idx * 0.15) }}
                        className="bg-white/80 backdrop-blur-md border border-white/60 p-4 rounded-2xl shadow-xl w-72 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:bg-white"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center text-2xl shadow-sm`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900 leading-none mb-1">{stat.value}</p>
                                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default HeroSection;
