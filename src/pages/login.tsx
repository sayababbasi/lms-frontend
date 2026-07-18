import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Eye, EyeOff } from 'lucide-react';
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
        // Clear any stale tokens on login page load so a cached session
        // cannot bypass the login form or misroute to a wrong portal.
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

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
                    } else if (user.is_staff || user.is_superuser || user.role === 'admin') {
                        // Admin check MUST come first — an admin may also have
                        // is_teacher=true, so checking teacher first would misroute them.
                        router.push('/dashboard');
                    } else if (user.is_student) {
                        router.push('/student/dashboard');
                    } else if (user.is_teacher) {
                        router.push('/teacher/dashboard');
                    } else {
                        // Fallback for unknown roles
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
            const responseData = err.response?.data;
            const errorCode = responseData?.code;
            const errorDetail = responseData?.detail;

            if (errorCode === 'user_not_found' || (typeof errorDetail === 'string' && errorDetail.toLowerCase().includes('no account'))) {
                setError('Username or email address not found. Please check and try again.');
            } else if (errorCode === 'wrong_password' || (typeof errorDetail === 'string' && errorDetail.toLowerCase().includes('incorrect password'))) {
                setError('Incorrect password. Please check your password and try again.');
            } else if (errorCode === 'account_locked' || (typeof errorDetail === 'string' && errorDetail.toLowerCase().includes('locked'))) {
                setError('Your account is locked due to too many failed attempts. Please try again later.');
            } else if (typeof errorDetail === 'string') {
                setError(errorDetail);
            } else if (err.message === 'Network Error') {
                setError('Cannot connect to server. Please check your internet connection.');
            } else {
                setError('Login failed. Please check your credentials and try again.');
            }
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex w-full bg-white font-sans text-slate-800">
            <Head>
                <title>Login | Revotic LMS</title>
            </Head>

            {/* ── LEFT PANE ── Brand & Illustration */}
            <div className="hidden lg:flex flex-col w-[55%] bg-[#f0f4fc] relative overflow-hidden">
                {/* Decorative dots / plus signs */}
                <div className="absolute top-16 right-24 w-4 h-4 rounded-full border-2 border-blue-200 opacity-60"></div>
                <div className="absolute top-40 left-16 w-3 h-3 rounded-full bg-blue-200 opacity-60"></div>
                <div className="absolute bottom-36 right-28 text-blue-300 opacity-40 text-2xl font-light select-none">+</div>
                <div className="absolute bottom-56 left-8 text-blue-300 opacity-40 text-2xl font-light select-none">+</div>

                <div className="flex-1 flex flex-col items-center justify-between py-12 px-10 z-10">
                    {/* Logo */}
                    <div className="w-full">
                        <img
                            src="/branding/revoticai-new-logo-for-light-theme.png"
                            alt="Revotic LMS"
                            className="h-12 object-contain"
                        />
                    </div>

                    {/* Heading + illustration */}
                    <div className="flex flex-col items-center w-full">
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight leading-tight">
                                Your Learning. Unified.
                            </h1>
                            <p className="text-slate-500 text-lg leading-relaxed">
                                One platform for all your training, learning<br />and growth.
                            </p>
                        </div>

                        {/* Illustration — no card, no shadow */}
                        <div className="w-full flex justify-center">
                            <img
                                src="/images/login-illustration.png"
                                alt="Learning Illustration"
                                className="w-full max-w-[600px] h-auto object-contain"
                                onError={(e) => {
                                    e.currentTarget.src = 'https://placehold.co/600x420/f0f4fc/6366f1?text=Illustration';
                                }}
                            />
                        </div>
                    </div>

                    {/* Feature icons row */}
                    <div className="flex justify-between w-full max-w-lg gap-4">
                        {[
                            { icon: '📖', label: 'Interactive Courses' },
                            { icon: '👩‍🏫', label: 'Expert Instructors' },
                            { icon: '📈', label: 'Track Progress' },
                            { icon: '🏆', label: 'Get Certified' },
                        ].map((f) => (
                            <div key={f.label} className="flex flex-col items-center text-center gap-2">
                                <div className="bg-white p-3 rounded-2xl shadow-sm text-xl">{f.icon}</div>
                                <span className="text-xs font-semibold text-slate-600">{f.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── RIGHT PANE ── Login form */}
            <div className="w-full lg:w-[45%] flex items-center justify-center p-6 bg-white relative">
                {/* Mobile logo */}
                <div className="absolute top-8 left-8 lg:hidden">
                    <img
                        src="/branding/revoticai-new-logo-for-light-theme.png"
                        alt="Revotic LMS"
                        className="h-8 object-contain"
                    />
                </div>

                <div className="w-full max-w-[440px] bg-white rounded-3xl p-10 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.05)]">
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

                        {/* Email / Username */}
                        <div>
                            <label htmlFor="username" className="block text-[13px] font-bold text-slate-700 mb-2">
                                Email Address / Username <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                autoComplete="username"
                                className="block w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6b4ce6] focus:border-transparent transition-all"
                                placeholder="Enter your email or username"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-[13px] font-bold text-slate-700 mb-2">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    autoComplete="current-password"
                                    className="block w-full px-4 py-3.5 pr-12 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6b4ce6] focus:border-transparent transition-all"
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

                        {/* Remember me + Forgot password */}
                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    id="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300 text-[#6b4ce6] focus:ring-[#6b4ce6] cursor-pointer accent-[#6b4ce6]"
                                />
                                <span className="text-[13px] text-slate-600">Remember me</span>
                            </label>
                            <Link href="/forgot-password" passHref>
                                <span className="text-[13px] font-semibold text-[#6b4ce6] hover:text-[#5838d4] transition-colors cursor-pointer">
                                    Forgot password?
                                </span>
                            </Link>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3.5 px-4 bg-[#6b4ce6] hover:bg-[#5838d4] text-white font-bold rounded-xl text-[15px] shadow-[0_4px_14px_0_rgba(107,76,230,0.35)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6b4ce6] flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : 'Login'}
                        </button>
                    </form>

                    <div className="mt-8 flex items-center gap-3">
                        <div className="h-px bg-slate-200 flex-1"></div>
                        <span className="text-slate-400 text-sm">or</span>
                        <div className="h-px bg-slate-200 flex-1"></div>
                    </div>

                    <p className="mt-6 text-center text-[13px] text-slate-500">
                        Don&apos;t have an account?{' '}
                        <a href="#" className="text-[#6b4ce6] font-semibold hover:underline">Contact Administrator</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

