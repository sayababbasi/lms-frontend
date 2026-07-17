import React from 'react';
import { Quote } from 'lucide-react';

const testimonials = [
    {
        quote: "This platform has completely transformed how I learn. The courses are well-structured and the instructors are top-notch.",
        author: "Emily Johnson",
        role: "Computer Science Student",
        initials: "EJ"
    },
    {
        quote: "As an instructor, I appreciate the analytical tools provided. They help me understand where my students struggle.",
        author: "Michael Chen",
        role: "Senior Professor",
        initials: "MC"
    },
    {
        quote: "The best LMS I have used so far. Intuitive interface and great support from the team.",
        author: "Sarah Davis",
        role: "Corporate Trainer",
        initials: "SD"
    }
];

const TestimonialsSection = () => {
    return (
        <section className="py-20 bg-slate-50 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary-200 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-rose-200 rounded-full blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                        What Our Users Say
                    </h2>
                    <p className="text-lg text-slate-600">
                        Join thousands of satisfied learners and educators.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
                            <Quote className="w-10 h-10 text-primary-200 mb-6" />
                            <p className="text-slate-600 text-lg italic mb-8 flex-1">
                                "{t.quote}"
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                                    {t.initials}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900">{t.author}</div>
                                    <div className="text-sm text-slate-500">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
