import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { LayoutDashboard, BookOpen, FileText, Calendar, CheckSquare, Layers, Users, Clock, MessageSquare } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const menuItems = [
    { name: 'Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard },
    { name: 'My Courses', path: '/teacher/dashboard/courses', icon: BookOpen },
    { name: 'Assignments & Grading', path: '/teacher/dashboard/assignments', icon: CheckSquare },
    { name: 'Students', path: '/teacher/dashboard/students', icon: Users },
    { name: 'Messages', path: '/teacher/dashboard/messages', icon: MessageSquare },
    { name: 'Schedule', path: '/teacher/dashboard/schedule', icon: Calendar },
    { name: 'Resources', path: '/teacher/dashboard/resources', icon: Layers },
];

export default function TeacherSidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) {
    const router = useRouter();
    const { user } = useAuth();
    const { theme } = useTheme();

    return (
        <>
            {/* Mobile Backdrop */}
            <div
                className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
            />

            <aside className={`fixed lg:static top-0 left-0 z-40 h-screen w-72 bg-dark-surface border-r border-dark-border transform transition-transform duration-300 ease-in-out lg:transform-none shadow-2xl lg:shadow-none ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full bg-dark-surface">
                    {/* Logo Section - Premium Enhanced */}
                    <div className="h-20 flex flex-col justify-center px-6 border-b border-dark-border bg-gradient-to-b from-dark-surface to-dark-surface/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-20 bg-indigo-500/5 blur-[60px] rounded-full pointer-events-none -mr-16 -mt-10"></div>
                        <Link href="/teacher/dashboard" className="flex items-center gap-2 group transition-all duration-300 relative z-10">
                            <img
                                src={theme === 'dark'
                                    ? "/branding/revoticai-new-logo-for-dark-theme.png"
                                    : "/branding/revoticai-new-logo-for-light-theme.png"
                                }
                                alt="Revotic AI Logo"
                                className={`h-7 w-auto object-contain transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(37,99,235,0.3)]`}
                            />
                            <span className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">LMS</span>
                        </Link>
                        <div className="mt-1 flex items-center gap-1.5 relative z-10">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-none">Instructor Portal</span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300">
                        {menuItems.map((item) => {
                            const isActive = router.pathname === item.path || router.pathname.startsWith(`${item.path}/`);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.path}
                                    className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${isActive
                                        ? 'bg-indigo-600/10 text-indigo-500 border-l-[3px] border-indigo-500 rounded-l-none'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-dark-bg/80 hover:text-indigo-600'
                                        }`}
                                >
                                    {isActive && (
                                        <div className="absolute inset-0 bg-indigo-600/5 animate-pulse-slow"></div>
                                    )}
                                    <item.icon className={`w-5 h-5 mr-3 shrink-0 transition-all duration-300 ${isActive ? 'text-indigo-500 scale-110 drop-shadow-[0_0_8px_rgba(99,102,241,0.4)]' : 'text-slate-400 group-hover:text-indigo-600 group-hover:scale-110'}`} />
                                    <span className={`text-sm tracking-wide transition-all duration-300 ${isActive ? 'font-bold' : 'font-semibold'}`}>
                                        {item.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile Summary (Bottom) */}
                    <div className="p-4 bg-dark-surface border-t border-dark-border/50">
                        <div className="bg-dark-bg/40 p-3 rounded-2xl border border-dark-border/30 flex items-center gap-3 group transition-all hover:bg-dark-bg/60 hover:border-indigo-500/30">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-indigo-500/20 transition-transform group-hover:scale-110">
                                {user ? user.first_name?.[0] : 'T'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-dark-text truncate group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{user ? `${user.first_name} ${user.last_name}` : 'Instructor'}</p>
                                <p className="text-[10px] text-slate-500 truncate font-bold uppercase tracking-wider flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Instructor
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
