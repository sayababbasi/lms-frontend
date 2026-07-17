import React from 'react';
import { CheckCircle2, ArrowRight, Zap, Building, Users } from 'lucide-react';
import Link from 'next/link';

const prices = [
    {
        name: "Starter",
        price: "$100",
        description: "Perfect for small institutions getting started with digital learning.",
        features: [
            "Student & Teacher Portals",
            "Basic Course Management",
            "Attendance Tracking",
            "Email Support",
            "Up to 500 Students"
        ],
        cta: "Start Free Trial",
        highlight: false,
        icon: Users
    },
    {
        name: "Growth",
        price: "$225",
        description: "The complete solution for growing colleges and universities.",
        features: [
            "Everything in Starter",
            "Advanced Analytics Dashboard",
            "Real-time Messaging System",
            "Exam & Assignment Builder",
            "Up to 2,000 Students",
            "Priority 24/7 Support"
        ],
        cta: "Get Started",
        highlight: true,
        icon: Zap
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "Tailored infrastructure for large-scale educational networks.",
        features: [
            "Unlimited Students",
            "White-label Branding",
            "Custom API Integrations",
            "Dedicated Success Manager",
            "On-premise Deployment Option",
            "SLA Guarantee"
        ],
        cta: "Contact Sales",
        highlight: false,
        icon: Building
    }
];

const PricingSection = () => {
    return (
        <section id="pricing" className="py-16 bg-white relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] right-[-5%] w-96 h-96 bg-primary-50 rounded-full blur-3xl opacity-60"></div>
                <div className="absolute bottom-[10%] left-[-5%] w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-60"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-primary-600 font-semibold tracking-wider uppercase text-sm">Flexible Pricing</span>
                    <h2 className="text-4xl font-bold text-slate-900 mt-3 mb-6">Plans that scale with your growth</h2>
                    <p className="text-lg text-slate-600">
                        Choose the perfect package for your institution. No hidden fees, cancel anytime.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto">
                    {prices.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative rounded-3xl p-8 transition-all duration-300 border ${plan.highlight
                                ? 'bg-white shadow-2xl shadow-primary-900/10 border-primary-100 scale-105 z-10'
                                : 'bg-slate-50 border-slate-100 hover:shadow-xl hover:bg-white'
                                }`}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${plan.highlight ? 'bg-primary-50 text-primary-600' : 'bg-white text-slate-600 shadow-sm'
                                    }`}>
                                    <plan.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">{plan.name}</h3>
                                <p className="text-slate-500 mt-2 text-sm min-h-[40px]">{plan.description}</p>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                                    {plan.price !== "Custom" && <span className="text-slate-500">/month</span>}
                                </div>
                            </div>

                            <ul className="space-y-4 mb-10">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${plan.highlight ? 'text-primary-600' : 'text-slate-400'
                                            }`} />
                                        <span className="text-slate-700 text-sm font-medium">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href={plan.name === "Enterprise" ? "/contact" : "/request-demo"}
                                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${plan.highlight
                                    ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-primary-600/30'
                                    : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                                    }`}
                            >
                                {plan.cta}
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
