import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Eye, EyeOff } from 'lucide-react';
import { AuthService } from '../services/auth.service';

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
            const data = await AuthService.login(formData.username, formData.password) as any;
            if (data && (data.access || data.token)) {
                if (rememberMe) {
                    localStorage.setItem('rememberMe_username', formData.username);
                } else {
                    localStorage.removeItem('rememberMe_username');
                }
                
                // Fetch User Details to Determine Role
                const user = await AuthService.getCurrentUser() as any;

                if (user) {
                    const redirectPath = router.query.redirect as string;
                    if (redirectPath) {
                        router.push(redirectPath);
                    } else if (user.role === 'student') {
                        router.push('/student/dashboard');
                    } else if (user.role === 'teacher') {
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
            }
        } catch (err: any) {
            console.error("Login error:", err);
            const msg = err.response?.data?.detail || err.message || 'Login failed';
            setError(`Login failed: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[url('/bg-pattern.svg')] bg-cover bg-center relative overflow-hidden">
            {/* Dynamic Abstract Background */}
            <div className="absolute top-0 left-0 w-full h-full bg-dark-bg/90 backdrop-blur-sm z-0"></div>

            {/* Orbs for glass effect */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-500/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>

            <Head>
                <title>Login | Revotic LMS</title>
            </Head>

            <div className="relative z-10 w-full max-w-md p-8 m-4 bg-white/90 backdrop-blur-xl rounded-2xl border border-slate-200 shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                    <p className="text-slate-500">Sign in to access your dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2">
                            Email Address / Username
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900 placeholder-slate-400 transition-all outline-none"
                            placeholder="Enter your username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-900 placeholder-slate-400 transition-all outline-none pr-12"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 focus:outline-none"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                            />
                            <label htmlFor="remember-me" className="ml-2 text-slate-600">
                                Remember me
                            </label>
                        </div>
                        <a href="#" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
                            Forgot password?
                        </a>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3.5 px-4 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-primary-500/25 transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing in...
                            </span>
                        ) : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-600">
                    <p>Don't have an account? <a href="#" className="text-primary-600 hover:text-primary-500 font-medium">Contact Administrator</a></p>
                </div>
            </div>
        </div>
    );
}
