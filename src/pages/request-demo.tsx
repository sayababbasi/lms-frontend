import { useState } from 'react';
import Head from 'next/head';
import Header from '../components/LandingPage/Header';
import Footer from '../components/LandingPage/Footer';
import { Mail, User, Building, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function RequestDemo() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: 'teacher' // Default to teacher for demo requests usually
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Using the existing register endpoint which creates inactive users by default
            await axios.post(`${process.env.API_URL || 'http://localhost:8000/api'}/register/`, {
                username: formData.email.split('@')[0] + Math.floor(Math.random() * 1000), // Generate username from email
                email: formData.email,
                password: formData.password,
                first_name: formData.first_name,
                last_name: formData.last_name,
                role: formData.role
            });

            setIsSuccess(true);
            toast.success("Demo request submitted successfully!");
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.error || "Request failed. Please try again.";
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-slate-50 font-inter flex flex-col">
                <Head>
                    <title>Request Demo | REVOTIC LMS</title>
                </Head>
                <Header />
                <div className="flex-grow flex items-center justify-center p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-slate-100"
                    >
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Request Received!</h2>
                        <p className="text-slate-600 mb-6">
                            Thank you for your interest in Revotic LMS. <br />
                            <span className="font-semibold text-primary-600">Your demo account is pending admin approval.</span>
                        </p>
                        <p className="text-sm text-slate-500 mb-8">
                            You will receive an email confirmation once our team reviews and approves your request.
                        </p>
                        <Link href="/" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors w-full">
                            Back to Home
                        </Link>
                    </motion.div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-inter flex flex-col">
            <Head>
                <title>Request Demo | REVOTIC LMS</title>
            </Head>

            <Header />
            <div className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <Toaster position="top-center" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-semibold mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                            </span>
                            Live Demo Environment
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
                            Experience the future of education management.
                        </h1>
                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            Get full access to our sandbox environment. Test drive the student portal, teacher dashboard, and admin tools to see how Revotic can transform your institution.
                        </p>

                        <div className="space-y-4">
                            {[
                                "Unlimited access to all features",
                                "Pre-populated data for realistic testing",
                                "No credit card required",
                                "Dedicated support during trial"
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    </div>
                                    <span className="text-slate-700 font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Form */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-10">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-slate-900">Create Demo Account</h2>
                            <p className="text-slate-500 mt-1">Fill in your details to request access.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            name="first_name"
                                            required
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none"
                                            placeholder="Jane"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        required
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none"
                                        placeholder="Cooper"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Work Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none"
                                        placeholder="jane@university.edu"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none"
                                        placeholder="Create a password"
                                    />
                                </div>
                                <p className="text-xs text-slate-400 mt-1">Used to login to the demo environment.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Role Interest</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none bg-white"
                                >
                                    <option value="demo_full">Full Access (Admin + Teacher + Student)</option>
                                    <option value="demo_academic">Academic Suite (Teacher + Student)</option>
                                    <option value="student">Student Portal Only</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 mt-4"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Get Access Now
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
