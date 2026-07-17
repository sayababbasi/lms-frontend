import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Phone, UserCircle, ArrowRight, CheckCircle2, ChevronLeft } from 'lucide-react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

const API_URL = process.env.API_URL || 'http://localhost:8000/api';

const Signup = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        first_name: '',
        last_name: '',
        role: 'student'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(`${API_URL}/register/`, {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                first_name: formData.first_name,
                last_name: formData.last_name,
                role: formData.role
            });

            const data = response.data as any;
            if (data.access) {
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);

                const redirectPath = router.query.redirect as string;
                if (redirectPath) {
                    router.push(redirectPath);
                    return;
                }
            }

            setIsSuccess(true);
            toast.success("Registration successful!");
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.error || "Registration failed. Please try again.";
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
                >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Registration Submitted!</h2>
                    <p className="text-slate-600 mb-6">
                        Your account has been created successfully. <br />
                        <span className="font-semibold text-primary-600">Admin approval is pending.</span>
                    </p>
                    <p className="text-sm text-slate-500 mb-8">
                        You will receive an email confirmation once your account is approved and activated.
                    </p>
                    <Link href={router.query.redirect ? `/login?redirect=${router.query.redirect}` : "/login"} className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors w-full">
                        {router.query.redirect ? "Proceed to Login & Pay" : "Back to Login"}
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-slate-50">
            <Toaster position="top-center" />

            {/* Left Side - Image/Branding */}
            <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 via-slate-900 to-slate-900 z-10"></div>

                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 hover:scale-105 transition-transform duration-[20s]"
                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop)' }}
                ></div>

                <div className="relative z-20 text-center px-12 max-w-2xl">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-2xl">
                        <UserCircle className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-6">Join Our Global Learning Community</h1>
                    <p className="text-lg text-slate-300 leading-relaxed mb-8">
                        Access world-class education, connect with expert instructors, and accelerate your career growth with Revotic LMS.
                    </p>

                    {/* Stats */}
                    <div className="flex justify-center gap-8 text-white/80">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">5k+</div>
                            <div className="text-xs uppercase tracking-wider mt-1">Students</div>
                        </div>
                        <div className="w-[1px] h-10 bg-white/20"></div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">120+</div>
                            <div className="text-xs uppercase tracking-wider mt-1">Courses</div>
                        </div>
                        <div className="w-[1px] h-10 bg-white/20"></div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">50+</div>
                            <div className="text-xs uppercase tracking-wider mt-1">Partners</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12 overflow-y-auto">
                <div className="max-w-[480px] w-full">
                    <div className="mb-8">
                        <Link href="/" className="inline-flex items-center text-slate-500 hover:text-slate-800 transition-colors mb-6 text-sm font-medium">
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Back to Home
                        </Link>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
                        <p className="text-slate-500">
                            Already have an account? <Link href="/login" className="text-primary-600 font-semibold hover:underline">Log in</Link>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">First Name</label>
                                <input
                                    name="first_name"
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-slate-800 bg-white"
                                    placeholder="John"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Last Name</label>
                                <input
                                    name="last_name"
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-slate-800 bg-white"
                                    placeholder="Doe"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Username</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    name="username"
                                    type="text"
                                    required
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-slate-800 bg-white"
                                    placeholder="johndoe123"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-slate-800 bg-white"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2 form-group">
                            <label className="text-sm font-medium text-slate-700">I am a...</label>
                            <div className="grid grid-cols-2 gap-4">
                                <label className={`cursor-pointer border-2 rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all ${formData.role === 'student' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                                    <input type="radio" name="role" value="student" className="hidden" onChange={handleChange} checked={formData.role === 'student'} />
                                    <span className="font-semibold">Student</span>
                                </label>
                                <label className={`cursor-pointer border-2 rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-all ${formData.role === 'teacher' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                                    <input type="radio" name="role" value="teacher" className="hidden" onChange={handleChange} checked={formData.role === 'teacher'} />
                                    <span className="font-semibold">Teacher</span>
                                </label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-slate-800 bg-white"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-slate-800 bg-white"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-primary-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-xs text-slate-400">
                        By signing up, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
