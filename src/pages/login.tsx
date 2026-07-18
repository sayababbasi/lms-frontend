import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Eye, EyeOff, Mail, Lock, BookOpen, Users, LineChart, Award, HeadphonesIcon } from 'lucide-react';
import { AuthService } from '../services/auth.service';
import Link from 'next/link';

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const savedUsername = localStorage.getItem('rememberMe_username');
        if (savedUsername) {
            setFormData(prev => ({ ...prev, username: savedUsername }));
            setRememberMe(true);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // AuthService.login returns the token AND the user object now.
            const data = await AuthService.login(formData.username, formData.password) as any;
            
            if (data && (data.access || data.token)) {
                if (rememberMe) {
                    localStorage.setItem('rememberMe_username', formData.username);
                } else {
                    localStorage.removeItem('rememberMe_username');
                }
                
                // Lightning Fast Routing: Use data.user from login response instead of making a 2nd API call
                const user = data.user;

                if (user) {
                    const redirectPath = router.query.redirect as string;
                    if (redirectPath) {
                        router.push(redirectPath);
                    } else if (user.is_student) {
                        router.push('/student/dashboard');
                    } else if (user.is_teacher) {
                        router.push('/teacher/dashboard');
                    } else {
                        // Admin or Default
                        router.push('/dashboard');
                    }
                } else {
                    router.push(router.query.redirect as string || '/dashboard');
                }
            } else {
                setError('Invalid credentials');
                setLoading(false);
            }
        } catch (err: any) {
            console.error("Login error:", err);
            const msg = err.response?.data?.detail || err.message || 'Login failed';
            setError(`Login failed: ${msg}`);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex w-full bg-white font-sans text-slate-800">
            <Head>
                <title>Login | Revotic LMS</title>
            </Head>

            {/* LEFT PANE - Brand & Illustration */}
            <div className="hidden lg:flex flex-col w-[55%] bg-[#f4f7fb] relative overflow-hidden pt-12">
                {/* Decorative background shapes */}
                <div className="absolute top-20 right-20 w-4 h-4 rounded-full border-2 border-indigo-200"></div>
                <div className="absolute top-40 left-20 w-3 h-3 rounded-full bg-blue-200"></div>
                <div className="absolute bottom-40 right-32 text-indigo-300 opacity-50 text-2xl">+</div>
                <div className="absolute bottom-60 left-10 text-indigo-300 opacity-50 text-2xl">+</div>

                {/* Content */}
                <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full px-8 z-10">
                    <div className="w-full mb-12">
                        {/* Using actual logo */}
                        <img src="/logo.png" alt="Logo" className="h-10 object-contain" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                        <span className="text-3xl font-extrabold text-blue-600 tracking-tight ml-2 hidden">Logo</span>
                    </div>

                    <div className="text-center mb-10 w-full">
                        <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Your Learning. Unified.</h1>
                        <p className="text-slate-600 text-lg">One platform for all your training, learning<br/>and growth.</p>
                    </div>

                    <div className="w-full flex justify-center mb-12 relative">
                        {/* Illustration */}
                        <img 
                            src="/images/login-illustration.png" 
                            alt="Learning Illustration" 
                            className="max-w-full h-auto w-[500px] object-contain drop-shadow-xl"
                            onError={(e) => {
                                // Fallback generic shapes if illustration is missing
                                e.currentTarget.src = "https://placehold.co/500x350/f4f7fb/6366f1?text=Please+Upload+Illustration+To\\n/public/images/login-illustration.png";
                            }}
                        />
                    </div>

                    {/* Features Row */}
                    <div className="flex justify-between w-full max-w-lg mt-auto pb-12 gap-4">
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-white p-3 rounded-2xl shadow-sm mb-3">
                                <BookOpen className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="text-xs font-semibold text-slate-700">Interactive Courses</span>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-white p-3 rounded-2xl shadow-sm mb-3">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="text-xs font-semibold text-slate-700">Expert Instructors</span>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-white p-3 rounded-2xl shadow-sm mb-3">
                                <LineChart className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="text-xs font-semibold text-slate-700">Track Progress</span>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-white p-3 rounded-2xl shadow-sm mb-3">
                                <Award className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="text-xs font-semibold text-slate-700">Get Certified</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT PANE - Login Form */}
            <div className="w-full lg:w-[45%] flex items-center justify-center p-6 bg-white relative">
                {/* Mobile Logo Fallback */}
                <div className="absolute top-8 left-8 lg:hidden">
                    <img src="/logo.png" alt="Logo" className="h-8 object-contain" />
                </div>

                <div className="w-full max-w-[440px] bg-white rounded-3xl p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <div className="mb-8">
                        <h2 className="text-[28px] font-bold text-slate-900 mb-2 tracking-tight">Welcome Back!</h2>
                        <p className="text-slate-500 text-[15px]">Sign in to continue to your account.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl text-center font-medium">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="username" className="block text-sm font-bold text-slate-700 mb-2">
                                Email address <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    className="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6b4ce6] focus:border-transparent transition-all"
                                    placeholder="Enter your email"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-2">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="block w-full pl-11 pr-12 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6b4ce6] focus:border-transparent transition-all"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-6 mb-6">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300 text-[#6b4ce6] focus:ring-[#6b4ce6] cursor-pointer"
                                />
                                <label htmlFor="remember-me" className="ml-2.5 block text-[14px] text-slate-600 cursor-pointer">
                                    Remember me
                                </label>
                            </div>
                            <Link href="/forgot-password" passHref>
                                <span className="text-[14px] font-semibold text-[#6b4ce6] hover:text-[#5838d4] transition-colors cursor-pointer">
                                    Forgot password?
                                </span>
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3.5 px-4 bg-[#6b4ce6] hover:bg-[#5838d4] text-white font-bold rounded-xl shadow-[0_4px_14px_0_rgba(107,76,230,0.39)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6b4ce6] flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : 'Login'}
                        </button>
                    </form>

                    <div className="mt-8 flex items-center justify-center gap-4">
                        <div className="h-px bg-slate-200 flex-1"></div>
                        <span className="text-slate-400 text-sm font-medium">or</span>
                        <div className="h-px bg-slate-200 flex-1"></div>
                    </div>

                    <div className="mt-8 text-center flex items-center justify-center gap-2 text-[14px] text-slate-600">
                        <HeadphonesIcon className="w-5 h-5 text-[#6b4ce6]" />
                        <span>Don't have an account? <a href="#" className="text-[#6b4ce6] font-semibold hover:underline">Contact Administrator</a></span>
                    </div>
                </div>
            </div>
        </div>
    );
}
