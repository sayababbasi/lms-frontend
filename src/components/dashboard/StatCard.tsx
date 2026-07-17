import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    trendUp?: boolean;
    color?: string; // e.g. "from-blue-500 to-cyan-500"
}

export default function StatCard({ title, value, icon, trend, trendUp, color = "from-primary-500 to-indigo-500" }: StatCardProps) {
    return (
        <div className="relative overflow-hidden bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300 group">
            {/* Background Decoration */}
            <div className={`absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${color} rounded-full opacity-10 group-hover:scale-110 transition-transform duration-500`}></div>

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">{title}</p>
                        <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${color} text-white shadow-md transform group-hover:rotate-12 transition-transform duration-300`}>
                        {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6" })}
                    </div>
                </div>

                {trend && (
                    <div className="flex items-center mt-2">
                        <span className={`flex items-center text-sm font-bold ${trendUp ? 'text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full' : 'text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full'}`}>
                            {trendUp ? (
                                <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                            ) : (
                                <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                            )}
                            {trend}
                        </span>
                        <span className="text-slate-400 text-sm ml-2 font-medium">vs last month</span>
                    </div>
                )}
            </div>
        </div>
    );
}
