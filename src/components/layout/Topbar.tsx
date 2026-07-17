import Link from 'next/link';
import { AuthService } from '../../services/auth.service';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { Menu, Search, Sun, Moon, Bell, LogOut } from 'lucide-react';

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
    const { theme, toggleTheme } = useTheme();
    const { user } = useAuth();

    const getNotificationHref = () => {
        if (!user) return '/login';
        if (user.role === 'student' || user.is_student) return '/student/dashboard/notifications';
        if (user.role === 'teacher' || user.is_teacher) return '/teacher/dashboard/notifications';
        return '/dashboard/notifications';
    };

    return (
        <header className="h-20 bg-dark-surface/80 backdrop-blur-md border-b border-dark-border flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-20">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Search Bar */}
                <div className="hidden sm:flex items-center relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2.5 bg-dark-bg border border-dark-border rounded-xl text-sm text-dark-text placeholder-slate-500 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none w-48 transition-all focus:w-72"
                    />
                </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-4">
                <button
                    onClick={toggleTheme}
                    className="p-2.5 text-slate-500 hover:text-primary-600 rounded-xl hover:bg-primary-50 dark:hover:bg-white/5 transition-colors"
                >
                    {theme === 'dark' ? (
                        <Moon className="w-5 h-5" />
                    ) : (
                        <Sun className="w-5 h-5" />
                    )}
                </button>

                <div className="relative">
                    <Link href={getNotificationHref()} className="p-2.5 text-slate-500 hover:text-primary-600 rounded-xl hover:bg-primary-50 dark:hover:bg-white/5 transition-colors block">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-dark-surface animate-pulse"></span>
                    </Link>
                </div>

                <div className="hidden sm:block h-6 w-px bg-dark-border mx-1"></div>

                <button
                    onClick={() => AuthService.logout()}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-xl transition-all active:scale-95"
                >
                    <span className="hidden md:inline">Logout</span>
                    <LogOut className="w-4.5 h-4.5" />
                </button>
            </div>
        </header>
    );
}
