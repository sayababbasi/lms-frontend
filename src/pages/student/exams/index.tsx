import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import StudentLayout from '../../../components/layout/StudentLayout';
import { StudentService } from '../../../services/student.service';
import { FileText, Clock, AlertCircle, CheckCircle, ChevronRight, Play } from 'lucide-react';
import { useRouter } from 'next/router';

interface Exam {
    id: number;
    title: string;
    course_title: string;
    course_code: string;
    start_time: string;
    end_time: string;
    duration: number; // in minutes
    has_attempted: boolean;
}

export default function StudentExamsPage() {
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            const data = await StudentService.getExams();
            // Ensure data is array
            setExams(Array.isArray(data) ? data : (data as any).results || []);
        } catch (error) {
            console.error("Failed to fetch exams", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStartExam = async (examId: number) => {
        try {
            const attempt = await StudentService.startExamAttempt(examId);
            // Passing state in Next.js router is handled via query params or context, 
            // but for simplicity we rely on the attempt page fetching data if needed.
            // Or we can use a library for state, but let's stick to simple routing.
            router.push(`/student/exams/${examId}/attempt`);
        } catch (error) {
            toast.error("Failed to start exam. " + ((error as any).response?.data?.error || ""));
        }
    };

    return (
        <StudentLayout title="Exams">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Exams</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">View and take your scheduled examinations.</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-24">
                    <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-600 rounded-full animate-spin"></div>
                </div>
            ) : exams.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 text-slate-400">
                        <FileText className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">No exams scheduled</h3>
                    <p className="text-slate-500 mt-1">You don't have any upcoming exams.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {exams.map((exam) => (
                        <div key={exam.id} className="relative bg-white dark:bg-dark-card p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm hover:shadow-md transition-all">
                            <div className="flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 uppercase tracking-wide">
                                            {exam.course_code || 'COURSE'}
                                        </span>
                                        <span className="text-slate-400 text-xs">•</span>
                                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{exam.course_title}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{exam.title}</h3>
                                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4" />
                                            <span>{new Date(exam.start_time).toLocaleString()}</span>
                                        </div>
                                        {exam.has_attempted && (
                                            <div className="flex items-center gap-1.5 text-green-600 font-bold">
                                                <CheckCircle className="w-4 h-4" />
                                                <span>Attempted</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {exam.has_attempted ? (
                                    <button
                                        disabled
                                        className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-400 font-semibold rounded-xl flex items-center gap-2 cursor-not-allowed"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Completed
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleStartExam(exam.id)}
                                        className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/20 flex items-center gap-2 transition-all hover:-translate-y-0.5"
                                    >
                                        <Play className="w-4 h-4" />
                                        Start Exam
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </StudentLayout>
    );
}
