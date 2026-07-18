import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import TeacherSidebar from './TeacherSidebar';
import Topbar from './Topbar';
import { AuthService } from '../../services/auth.service';
import { Toaster } from 'react-hot-toast';

interface TeacherLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function TeacherLayout({ children, title }: TeacherLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            if (!AuthService.isAuthenticated()) {
                router.push('/login');
                return;
            }

            try {
                const user = await AuthService.getCurrentUser();
                if (!user) {
                    router.push('/login');
                    return;
                }
                const u = user as any;
                // Admins must be excluded even if they also have is_teacher=true
                const isAdmin = u.is_staff || u.is_superuser || u.role === 'admin';
                const isTeacher = (u.role === 'teacher' || u.is_teacher) && !isAdmin;
                if (isTeacher) {
                    setAuthorized(true);
                } else if (isAdmin) {
                    // Admin accidentally landed on teacher portal — send to admin dashboard
                    router.push('/dashboard');
                } else {
                    router.push('/login');
                }
            } catch (error) {
                console.error("Auth check failed", error);
                router.push('/login');
            }
        };

        checkAuth();
    }, [router]);

    if (!authorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark-bg text-dark-text">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <div className="font-semibold text-indigo-400">Loading Teacher Portal...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-bg flex">
            <Head>
                <title>{title ? `${title} | REVOTIC Teacher` : 'Revotic Teacher Portal'}</title>
            </Head>

            <TeacherSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <div className="flex-1 flex flex-col h-screen overflow-hidden bg-dark-bg">
                <Topbar onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
            <Toaster position="bottom-right" />
        </div>
    );
}
