import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';

const stats = [
    { label: "Active Students", value: 25000, suffix: "+" },
    { label: "Courses Created", value: 1200, suffix: "+" },
    { label: "Instructors", value: 850, suffix: "+" },
    { label: "Completion Rate", value: 94, suffix: "%" },
];

const Counter = ({ value, suffix = "" }: { value: number, suffix: string }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
    const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

    useEffect(() => {
        if (isInView) {
            spring.set(value);
        }
    }, [isInView, value, spring]);

    return (
        <span ref={ref} className="flex justify-center items-center">
            <motion.span>{display}</motion.span>
            <span>{suffix}</span>
        </span>
    );
};

const StatsSection = () => {
    return (
        <section className="py-12 bg-slate-900 text-white relative overflow-hidden font-jakarta">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-x divide-slate-800/50">
                    {stats.map((stat, index) => (
                        <div key={index} className="p-4 flex flex-col items-center justify-center">
                            <div className="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 mb-2 font-mono flex items-center gap-1">
                                <Counter value={stat.value} suffix={stat.suffix} />
                            </div>
                            <div className="text-slate-400 font-medium tracking-wide uppercase text-sm">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
