import Head from 'next/head';
import Header from '../components/LandingPage/Header';
import Footer from '../components/LandingPage/Footer';
import { Target, Heart, Zap, Globe, Users, Trophy } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-primary-100 selection:text-primary-900">
            <Head>
                <title>About Us | REVOTIC LMS</title>
            </Head>

            <Header />

            <main>
                {/* Hero Section */}
                <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center sticky top-0 z-0">
                    <span className="text-primary-600 font-bold tracking-widest uppercase text-sm mb-4 block">Our Story</span>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
                        Empowering Education <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">
                            For The Future
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Born in the heart of Islamabad, we are on a mission to transform how institutions manage learning—combining local understanding with global standards.
                    </p>
                </section>

                {/* Mission & Vision Grid */}
                <section className="bg-white py-20 relative z-10 rounded-t-[3rem] shadow-[0_-20px_40px_rgba(0,0,0,0.05)] border-t border-slate-100">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary-100 to-blue-50 rounded-3xl transform rotate-3 scale-105"></div>
                                <div className="relative bg-white p-8 md:p-12 rounded-3xl border border-slate-100 shadow-xl">
                                    <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-6 text-primary-600">
                                        <Target className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-slate-900 mb-4">Our Mission</h3>
                                    <p className="text-slate-600 leading-relaxed text-lg">
                                        To bridge the digital gap in education by providing an intuitive, powerful, and affordable Learning Management System. We believe technology should look good and work even better.
                                    </p>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Built for Pakistan, <br />Ready for the World.</h2>
                                <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                                    What started as a small project to help local colleges in Islamabad has grown into a robust platform trusted by leading institutions like NUST and LUMS.
                                </p>
                                <p className="text-slate-600 text-lg leading-relaxed">
                                    We understand the unique challenges of our region—from connectivity issues to specific administrative needs—and we've built Revotic to solve them while matching international quality standards.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Core Values */}
                <section className="py-24 bg-slate-900 text-white relative overflow-hidden z-10">
                    <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
                    </div>

                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
                            <p className="text-slate-400 max-w-2xl mx-auto">The principles that guide every feature we build.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { title: "Student First", icon: Heart, desc: "Every decision starts with the student experience." },
                                { title: "Innovation", icon: Zap, desc: "Constantly pushing boundaries to make learning faster." },
                                { title: "Global Standard", icon: Globe, desc: "World-class quality, locally accessible." },
                                { title: "Community", icon: Users, desc: "Building a network of empowered educators." },
                            ].map((val, i) => (
                                <div key={i} className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700 hover:bg-slate-800 transition-colors">
                                    <val.icon className="w-10 h-10 text-primary-400 mb-4" />
                                    <h3 className="text-xl font-bold mb-2">{val.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">{val.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Simple Stats for About Page */}
                <section className="py-24 bg-slate-50 relative z-10">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold text-slate-900 mb-12">Our Impact</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { label: "Founded", value: "2023" },
                                { label: "Institutions", value: "50+" },
                                { label: "Active Users", value: "25k+" },
                                { label: "Cities", value: "12" },
                            ].map((stat, idx) => (
                                <div key={idx}>
                                    <div className="text-4xl font-bold text-primary-600 mb-2">{stat.value}</div>
                                    <div className="text-slate-500 uppercase tracking-wider text-sm font-semibold">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
