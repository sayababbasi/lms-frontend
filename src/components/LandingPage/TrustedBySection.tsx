import React from 'react';
import { Building2, Globe, Award, Briefcase, GraduationCap, Landmark, School } from 'lucide-react';
import { motion } from 'framer-motion';

const globalPartners = [
    { name: 'Qatar University', icon: Landmark, country: 'Qatar' },
    { name: 'UAE University', icon: Building2, country: 'UAE' },
    { name: 'Santa Monica College', icon: GraduationCap, country: 'USA' },
    { name: 'Khalifa University', icon: Globe, country: 'UAE' },
    { name: 'Austin CC', icon: School, country: 'USA' },
    { name: 'Doha Institute', icon: Award, country: 'Qatar' },
    { name: 'Valencia College', icon: Briefcase, country: 'USA' },
];

const localPartners = [
    { name: 'LUMS', icon: Award, country: 'Pakistan' },
    { name: 'FAST NUCES', icon: Briefcase, country: 'Pakistan' },
    { name: 'Quaid-i-Azam', icon: Building2, country: 'Pakistan' },
    { name: 'IBA Karachi', icon: GraduationCap, country: 'Pakistan' },
    { name: 'GIKI', icon: Globe, country: 'Pakistan' },
    { name: 'PIEAS', icon: Award, country: 'Pakistan' },
    { name: 'UET Lahore', icon: School, country: 'Pakistan' },
];

const MarqueeRow = ({ items, direction = "left" }: { items: typeof globalPartners, direction?: "left" | "right" }) => {
    return (
        <div className="flex overflow-hidden relative group">
            <motion.div
                className="flex gap-8 min-w-max py-4"
                animate={{
                    x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"]
                }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: 30
                }}
            >
                {[...items, ...items, ...items].map((partner, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center justify-center gap-2 w-[220px] h-[100px] bg-white border border-slate-100 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-lg hover:border-primary-100 transition-all duration-300 cursor-default group/item flex-shrink-0"
                    >
                        <partner.icon className={`w-8 h-8 ${partner.country === 'Qatar' ? 'text-amber-600' :
                            partner.country === 'UAE' ? 'text-emerald-600' :
                                partner.country === 'USA' ? 'text-blue-600' :
                                    'text-primary-600'
                            } opacity-80 group-hover:opacity-100 transition-opacity`} />

                        <span className="text-slate-700 font-bold font-jakarta text-sm uppercase tracking-wide group-hover:text-slate-900 transition-colors">
                            {partner.name}
                        </span>
                    </div>
                ))}
            </motion.div>

            {/* Gradients */}
            <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
            <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>
        </div>
    );
};

const TrustedBySection = () => {
    return (
        <section className="py-20 bg-white border-b border-slate-100 overflow-hidden">
            <div className="container mx-auto px-4 mb-12 text-center">
                <span className="text-primary-600 font-bold tracking-widest uppercase text-xs mb-3 block">Global Reach</span>
                <h2 className="text-2xl font-bold text-slate-900">Trusted by Leading Institutions Worldwide</h2>
            </div>

            <div className="space-y-4">
                <MarqueeRow items={globalPartners} direction="left" />
                <MarqueeRow items={localPartners} direction="right" />
            </div>
        </section>
    );
};

export default TrustedBySection;
