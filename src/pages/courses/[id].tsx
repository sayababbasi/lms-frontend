import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { BookOpen, Clock, Users, CheckCircle, Lock, PlayCircle, FileText, Upload, AlertCircle } from 'lucide-react';
import Header from '../../components/LandingPage/Header';
import Footer from '../../components/LandingPage/Footer';
import { CoursesService } from '../../services/courses.service';
import { AuthService } from '../../services/auth.service';
import { toast, Toaster } from 'react-hot-toast';

export default function CourseDetailPage() {
    const router = useRouter();
    const { id } = router.query;

    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

    const [paymentType, setPaymentType] = useState<'local' | 'international'>('local');
    // Enrollment Form State
    const [transactionId, setTransactionId] = useState('');
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            try {
                const [courseData, userData] = await Promise.all([
                    CoursesService.getById(Number(id)),
                    AuthService.getCurrentUser().catch(() => null)
                ]);
                setCourse(courseData);
                setUser(userData);

                // Auto-open modal if user just logged in to enroll
                if (userData && router.query.action === 'enroll') {
                    // Check if already enrolled to avoid modal
                    const isAlreadyEnrolled = (courseData as any).students?.some((s: any) => s.id === (userData as any).student_profile?.id);
                    if (!isAlreadyEnrolled) {
                        setIsEnrollModalOpen(true);
                    }
                }
            } catch (error) {
                console.error("Failed to load course", error);
                toast.error("Failed to load course details");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id, router.query.action]);

    const handleEnrollSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!paymentProof || !transactionId) {
            toast.error("Please provide both transaction ID and payment proof.");
            return;
        }

        setSubmitting(true);
        try {
            await CoursesService.requestEnrollment(Number(id), paymentProof, transactionId);
            toast.success("Enrollment request submitted! Waiting for admin approval.");
            setIsEnrollModalOpen(false);
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to submit request.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;
    if (!course) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Course not found</div>;

    const isEnrolled = user && course.students?.some((s: any) => s.id === user.student_profile?.id);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <Head>
                <title>{course.title} | REVOTIC LMS</title>
            </Head>
            <Header />
            <Toaster position="top-right" />

            {/* Course Header */}
            <div className="bg-slate-900 text-white pt-32 pb-20">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2">
                            <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4 inline-block">
                                {course.code}
                            </span>
                            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                            <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                                {course.description}
                            </p>
                            <div className="flex flex-wrap gap-6 text-slate-400 text-sm">
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    <span>{course.students?.length || 0} Students Enrolled</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    <span>Last Updated: {new Date(course.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-5 h-5" />
                                    <span>{course.modules?.length || 0} Modules</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 max-w-7xl py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Content Column */}
                    <div className="lg:col-span-2 space-y-12">
                        <section>
                            <h2 className="text-2xl font-bold mb-6">Course Content</h2>
                            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                                {course.modules?.length > 0 ? course.modules.map((module: any) => (
                                    <div key={module.id} className="p-6">
                                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                            <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 text-sm">{module.order}</span>
                                            {module.title}
                                        </h3>
                                        <div className="space-y-3 pl-10">
                                            {module.lessons?.map((lesson: any) => (
                                                <div key={lesson.id} className="flex items-center justify-between text-slate-600 bg-slate-50 p-3 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <PlayCircle className="w-5 h-5 text-primary-600" />
                                                        <span>{lesson.title}</span>
                                                    </div>
                                                    {isEnrolled ? (
                                                        <Link href={`/dashboard/student/courses/${course.id}`} className="text-xs text-primary-600 font-bold hover:underline">
                                                            Watch
                                                        </Link>
                                                    ) : (
                                                        <Lock className="w-4 h-4 text-slate-400" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )) : (
                                    <div className="p-8 text-center text-slate-500">
                                        No modules uploaded yet.
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Column */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
                            {course.thumbnail && (
                                <div className="h-48 bg-slate-100 relative">
                                    <img src={course.thumbnail} alt="Course Thumbnail" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="p-8">
                                <div className="text-3xl font-bold text-slate-900 mb-2">$100.00</div>
                                <div className="text-slate-500 mb-6 text-sm">One-time payment for lifetime access</div>

                                {user ? (
                                    isEnrolled ? (
                                        <Link
                                            href={`/dashboard/student/courses/${course.id}`}
                                            className="w-full block text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all"
                                        >
                                            Go to Course
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={() => setIsEnrollModalOpen(true)}
                                            className="w-full block bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary-600/30"
                                        >
                                            Enroll Now
                                        </button>
                                    )
                                ) : (
                                    <Link
                                        href={`/signup?redirect=/courses/${id}?action=enroll`}
                                        className="w-full block text-center bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all"
                                    >
                                        Sign up to Enroll
                                    </Link>
                                )}

                                <div className="mt-8 space-y-4">
                                    <div className="flex items-center gap-3 text-slate-600 text-sm">
                                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                                        <span>Full lifetime access</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600 text-sm">
                                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                                        <span>Access on mobile and desktop</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-600 text-sm">
                                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                                        <span>Certificate of completion</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />

            {/* Enrollment Modal */}
            {isEnrollModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-900">Secure Enrollment</h3>
                            <button onClick={() => setIsEnrollModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <span className="text-2xl">×</span>
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-xl">
                                <button
                                    onClick={() => setPaymentType('local')}
                                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${paymentType === 'local' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    Local Bank
                                </button>
                                <button
                                    onClick={() => setPaymentType('international')}
                                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${paymentType === 'international' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    International
                                </button>
                            </div>

                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                                {paymentType === 'local' ? (
                                    <>
                                        <h4 className="font-bold text-blue-900 mb-2 text-sm uppercase">Bank Transfer Details</h4>
                                        <p className="text-sm text-blue-800 mb-1">Bank: <strong>Meezan Bank</strong></p>
                                        <p className="text-sm text-blue-800 mb-1">Account Title: <strong>Revotic LMS</strong></p>
                                        <p className="text-sm text-blue-800">Account No: <strong>0101-229292-01</strong></p>
                                    </>
                                ) : (
                                    <>
                                        <h4 className="font-bold text-blue-900 mb-2 text-sm uppercase">International Transfer</h4>
                                        <p className="text-sm text-blue-800 mb-1">Bank: <strong>Meezan Bank (Pakistan)</strong></p>
                                        <p className="text-sm text-blue-800 mb-1">Swift/BIC: <strong>MEZNKKKA</strong></p>
                                        <p className="text-sm text-blue-800 mb-1">IBAN: <strong>PK88MEZN0000000101229292</strong></p>
                                        <p className="text-sm text-blue-800">Account Title: <strong>Revotic LMS</strong></p>
                                    </>
                                )}
                            </div>

                            <form onSubmit={handleEnrollSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Transaction ID</label>
                                    <input
                                        type="text"
                                        required
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all outline-none"
                                        placeholder="e.g. 8273628192"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Payment Proof (Screenshot)</label>
                                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-primary-400 transition-colors cursor-pointer relative">
                                        <input
                                            type="file"
                                            required
                                            accept="image/*"
                                            onChange={(e) => setPaymentProof(e.target.files ? e.target.files[0] : null)}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                        <span className="text-sm text-slate-600">
                                            {paymentProof ? paymentProof.name : "Click to upload receipt"}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-600/20 disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {submitting ? 'Submitting...' : 'Submit Payment Proof'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
