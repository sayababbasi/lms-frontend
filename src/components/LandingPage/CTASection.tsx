import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

const CTASection = () => {
    return (
        <section className="py-20 lg:py-28 relative overflow-hidden bg-slate-50">
            {/* Soft Ambient Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-100/50 rounded-full blur-[100px] -ml-32 -mb-32"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-12 lg:p-16 text-center transform hover:shadow-2xl transition-all duration-500">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-bold mb-8">
                        <Sparkles className="w-4 h-4" />
                        <span>Limited time offer including free setup</span>
                    </div>

                    <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                        Ready to Start Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                            Digital Transformation?
                        </span>
                    </h2>

                    <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Join over 500+ institutions that have modernized their campus with Revotic AI. scalable, secure used by millions.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                        <Link
                            href="/signup"
                            className="w-full sm:w-auto px-10 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl hover:shadow-indigo-600/25 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                            Get Started Now
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/contact"
                            className="w-full sm:w-auto px-10 py-4 bg-white border border-slate-200 text-slate-700 rounded-full font-bold text-lg hover:bg-slate-50 transition-all hover:border-slate-300 flex items-center justify-center"
                        >
                            Request Demo
                        </Link>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-slate-500 text-sm font-medium">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span>No credit card required</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span>14-day free trial</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span>Cancel anytime</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
