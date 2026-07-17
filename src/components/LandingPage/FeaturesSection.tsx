import React from 'react';
import { BookOpen, BarChart2, Video, Shield, Smartphone, Globe } from 'lucide-react';

const icons = {
    BookOpen: BookOpen,
    BarChart2: BarChart2,
    Video: Video,
    Shield: Shield,
    Smartphone: Smartphone,
    Globe: Globe,
};

const features = [
    {
        title: "Comprehensive Course Management",
        description: "Easily create, organize, and manage courses with our intuitive drag-and-drop interface.",
        icon: "BookOpen",
        color: "bg-blue-100 text-blue-600",
    },
    {
        title: "Advanced Analytics",
        description: "Gain deep insights into student performance and engagement with real-time data visualization.",
        icon: "BarChart2",
        color: "bg-purple-100 text-purple-600",
    },
    {
        title: "Live Virtual Classrooms",
        description: "Conduct seamless live sessions with integrated video conferencing and interactive tools.",
        icon: "Video",
        color: "bg-rose-100 text-rose-600",
    },
    {
        title: "Enterprise-Grade Security",
        description: "Your data is protected with state-of-the-art encryption and compliance standards.",
        icon: "Shield",
        color: "bg-emerald-100 text-emerald-600",
    },
    {
        title: "Mobile Learning",
        description: "Access content anywhere, anytime with our fully responsive mobile-first design.",
        icon: "Smartphone",
        color: "bg-amber-100 text-amber-600",
    },
    {
        title: "Global Reach",
        description: "Support for multiple languages and currencies to scale your education globally.",
        icon: "Globe",
        color: "bg-cyan-100 text-cyan-600",
    },
];

const FeaturesSection = () => {
    return (
        <section id="features" className="py-20 lg:py-32 bg-white relative">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                        Everything You Need to <span className="text-primary-600">Succeed</span>
                    </h2>
                    <p className="text-lg text-slate-600">
                        Our platform provides a complete suite of tools to help universities and institutions deliver world-class education.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                    {features.map((feature, index) => {
                        const Icon = icons[feature.icon as keyof typeof icons] || BookOpen;
                        return (
                            <div key={index} className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-primary-900/5 transition-all duration-300">
                                <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary-600 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
