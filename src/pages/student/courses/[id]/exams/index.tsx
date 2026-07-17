import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import StudentLayout from '../../../../../components/layout/StudentLayout';
import { ExamsService } from '../../../../../services/exams.service';
import Link from 'next/link';
import { CheckSquare, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudentExamsList() {
    const router = useRouter();
    const { id: courseId } = router.query;
    
    const [exams, setExams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (courseId) {
            loadExams();
        }
    }, [courseId]);

    const loadExams = async () => {
        setLoading(true);
        try {
            const response = await ExamsService.getExams(Number(courseId)) as any;
            setExams(Array.isArray(response) ? response : response.results || []);
        } catch (error) {
            console.error("Failed to load exams", error);
            toast.error("Failed to load quizzes");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <StudentLayout title="Course Quizzes">
                <div className="flex justify-center items-center py-20">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </StudentLayout>
        );
    }

    return (
        <StudentLayout title="Course Quizzes">
            <div className="mb-6">
                <Link href={`/student/courses/${courseId}`} className="text-slate-500 hover:text-indigo-500 text-sm mb-4 inline-block font-medium">
                    ← Back to Course
                </Link>
                <h1 className="text-2xl font-bold text-dark-text flex items-center gap-2">
                    <CheckSquare className="w-6 h-6 text-indigo-500" /> Quizzes & Exams
                </h1>
                <p className="text-slate-500 mt-1">View and take active assessments for this course.</p>
            </div>

            {exams.length === 0 ? (
                <div className="bg-dark-surface rounded-2xl border border-dark-border p-12 text-center">
                    <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-50" />
                    <h3 className="text-lg font-medium text-dark-text mb-1">No Quizzes Found</h3>
                    <p className="text-slate-500">There are no quizzes or exams scheduled for this course right now.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {exams.map(exam => {
                        const now = new Date();
                        const startTime = new Date(exam.start_time);
                        const endTime = new Date(exam.end_time);
                        const isActive = now >= startTime && now <= endTime;
                        const isUpcoming = now < startTime;
                        const isPast = now > endTime;

                        return (
                            <div key={exam.id} className="bg-dark-surface rounded-xl border border-dark-border p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-1">{exam.title}</h3>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4 text-slate-500" />
                                            Start: {startTime.toLocaleString()}
                                        </span>
                                        <span>End: {endTime.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {isActive ? (
                                        <Link
                                            href={`/student/courses/${courseId}/exams/${exam.id}`}
                                            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg shadow-lg shadow-indigo-500/20 transition-all"
                                        >
                                            Start Quiz
                                        </Link>
                                    ) : isUpcoming ? (
                                        <span className="px-4 py-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-lg text-sm font-medium">
                                            Upcoming
                                        </span>
                                    ) : (
                                        <span className="px-4 py-2 bg-slate-800 text-slate-400 border border-slate-700 rounded-lg text-sm font-medium">
                                            Closed
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </StudentLayout>
    );
}
