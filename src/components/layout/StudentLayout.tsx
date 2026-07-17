import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import StudentSidebar from './StudentSidebar';
import Topbar from './Topbar';
import { AuthService } from '../../services/auth.service';
import { Toaster } from 'react-hot-toast';

interface StudentLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function StudentLayout({ children, title }: StudentLayoutProps) {
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
                // Check if user is a student
                if (user && (user as any).role === 'student') {
                    setAuthorized(true);
                } else {
                    // Not authorized (not a student)
                    // If admin, maybe redirect to admin dashboard? For now, just login.
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
                    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <div className="font-semibold text-primary-600">Loading Student Portal...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-bg flex">
            <Head>
                <title>{title ? `${title} | REVOTIC Student` : 'Revotic Student Portal'}</title>
            </Head>

            <StudentSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <div className="flex-1 flex flex-col h-full lg:h-screen overflow-hidden bg-dark-bg">
                <Topbar onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800">
                    <div className="max-w-7xl mx-auto pb-20 lg:pb-8">
                        {children}
                    </div>
                </main>
            </div>
            <Toaster position="bottom-right" />
        </div>
    );
}
