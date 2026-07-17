import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import StudentLayout from '../../../components/layout/StudentLayout';
import { StudentService } from '../../../services/student.service';
import { ChevronLeft, CheckCircle, XCircle, Info, Award, FileText, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';

interface Answer {
    id: number;
    question_text: string;
    correct_option_text: string | null;
    selected_option_text: string | null;
    marks_awarded: string;
}

interface ResultDetail {
    id: number;
    exam_title: string;
    course_name: string;
    score: string;
    total_marks: number;
    total_questions: number;
    submit_time: string;
    answers: Answer[];
}

export default function StudentResultDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const [result, setResult] = useState<ResultDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchDetail(parseInt(id as string));
    }, [id]);

    const fetchDetail = async (attemptId: number) => {
        try {
            const data = await StudentService.getResultDetail(attemptId);
            setResult(data as any);
        } catch (error) {
            console.error("Failed to fetch result detail", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <StudentLayout title="Loading..."><div className="p-10 text-center text-white">Loading result details...</div></StudentLayout>;
    if (!result) return <StudentLayout title="Not Found"><div className="p-10 text-center text-white">Result not found.</div></StudentLayout>;

    const percentage = (parseFloat(result.score) / result.total_marks) * 100;

    return (
        <StudentLayout title={`Result: ${result.exam_title}`}>
            <div className="mb-8">
                <Link href="/student/results" className="flex items-center text-primary-400 hover:text-primary-300 transition-colors mb-4 group">
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-semibold">Back to all results</span>
                </Link>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight">{result.exam_title}</h1>
                        <p className="text-slate-400 mt-2 font-medium flex items-center gap-2">
                            <FileText className="w-4 h-4" /> {result.course_name}
                        </p>
                    </div>
                    <div className="bg-dark-surface p-4 rounded-2xl border border-dark-border flex items-center gap-4 shadow-xl">
                        <div className="text-right">
                            <p className="text-xs text-slate-500 uppercase font-black tracking-widest">Submitted On</p>
                            <p className="text-white font-bold">{new Date(result.submit_time).toLocaleDateString()}</p>
                        </div>
                        <div className="w-px h-10 bg-dark-border"></div>
                        <div className="text-right">
                            <p className="text-xs text-slate-500 uppercase font-black tracking-widest">Time</p>
                            <p className="text-white font-bold">{new Date(result.submit_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Score Card */}
            <div className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-[2.5rem] p-10 text-white mb-10 shadow-2xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex items-center gap-8">
                        <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-4 border-white/30 shadow-2xl">
                            <Award className="w-16 h-16 text-white" />
                        </div>
                        <div>
                            <span className="text-primary-100 font-black uppercase tracking-[0.2em] text-sm">Performance Score</span>
                            <div className="flex items-baseline gap-2 mt-1">
                                <h2 className="text-7xl font-black text-white">{parseFloat(result.score).toFixed(0)}</h2>
                                <span className="text-3xl text-primary-200 font-bold">/ {result.total_marks}</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-center md:text-right">
                        <div className="text-5xl font-black text-white mb-2">{percentage.toFixed(1)}%</div>
                        <span className={`px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest shadow-lg ${percentage >= 40 ? 'bg-green-500 text-white ring-4 ring-green-500/30' : 'bg-red-500 text-white ring-4 ring-red-500/30'
                            }`}>
                            {percentage >= 40 ? 'QUALIFIED' : 'NOT QUALIFIED'}
                        </span>
                    </div>
                </div>
                {/* Abstract UI Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
            </div>

            {/* Question Breakdown */}
            <div className="space-y-6 mb-12">
                <h3 className="text-2xl font-black text-white flex items-center gap-3">
                    <CheckSquare className="w-7 h-7 text-primary-500" />
                    Question Analysis
                </h3>

                <div className="grid gap-4">
                    {result.answers.map((answer, idx) => (
                        <div key={answer.id} className="bg-dark-surface rounded-3xl p-6 border border-dark-border shadow-md hover:border-primary-500/30 transition-all group">
                            <div className="flex justify-between items-start gap-6 mb-6">
                                <div className="flex gap-4">
                                    <span className="text-3xl font-black text-slate-800 group-hover:text-primary-900/50 transition-colors">{(idx + 1).toString().padStart(2, '0')}</span>
                                    <h4 className="text-lg font-bold text-white leading-relaxed pt-1">{answer.question_text}</h4>
                                </div>
                                <div className={`px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-widest ${parseFloat(answer.marks_awarded) > 0
                                        ? 'bg-green-500/10 text-green-500'
                                        : 'bg-red-500/10 text-red-500'
                                    }`}>
                                    {parseFloat(answer.marks_awarded) > 0 ? '+ Correct' : '+ Incorrect'}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className={`p-4 rounded-2xl border ${answer.selected_option_text === answer.correct_option_text
                                        ? 'bg-green-500/5 border-green-500/20'
                                        : 'bg-red-500/5 border-red-500/20'
                                    }`}>
                                    <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Your Selection</p>
                                    <div className="flex items-center gap-2">
                                        {answer.selected_option_text === answer.correct_option_text ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                                        <span className={`font-bold ${answer.selected_option_text === answer.correct_option_text ? 'text-green-500' : 'text-red-500'}`}>
                                            {answer.selected_option_text || 'Skipped'}
                                        </span>
                                    </div>
                                </div>

                                {answer.selected_option_text !== answer.correct_option_text && (
                                    <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/20">
                                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-1">Correct Answer</p>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <span className="font-bold text-green-500">{answer.correct_option_text}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-dark-surface/50 border border-dark-border rounded-3xl p-6 flex items-center justify-center gap-4 text-slate-500">
                <Info className="w-5 h-5 text-primary-500" />
                <p className="text-sm font-medium">Auto-graded MCQ evaluation system version 1.0. Results are subject to final verification by the registrar's office.</p>
            </div>
        </StudentLayout>
    );
}

// Add CSS module or similar for CheckSquare icon if not imported
import { CheckSquare } from 'lucide-react';
