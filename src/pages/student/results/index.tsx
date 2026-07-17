import React, { useEffect, useState } from 'react';
import StudentLayout from '../../../components/layout/StudentLayout';
import { StudentService } from '../../../services/student.service';
import { Award, Calendar, ChevronRight, FileText, CheckCircle, AlertCircle, TrendingUp, Target } from 'lucide-react';
import Link from 'next/link';

interface Result {
    id: number;
    exam_title: string;
    course_name: string;
    score: string;
    total_marks: number;
    total_questions: number;
    submit_time: string;
}

export default function StudentResultsPage() {
    const [results, setResults] = useState<Result[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const data = await StudentService.getResults();
            setResults(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch results", error);
        } finally {
            setLoading(false);
        }
    };

    const calculatePercentage = (score: string, total: number) => {
        const s = parseFloat(score);
        if (total === 0) return 0;
        return (s / total) * 100;
    };

    // Calculate overall stats
    const averageScore = results.length > 0
        ? results.reduce((acc, r) => acc + calculatePercentage(r.score, r.total_marks), 0) / results.length
        : 0;
    const totalPassed = results.filter(r => calculatePercentage(r.score, r.total_marks) >= 40).length;

    return (
        <StudentLayout title="My Results">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Examination Results</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Detailed performance report of your attempted examinations.</p>
            </div>

            {/* Performance Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white dark:bg-dark-card p-6 rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Average Score</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{averageScore.toFixed(1)}%</h3>
                        </div>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: `${averageScore}%` }} />
                    </div>
                </div>

                <div className="bg-white dark:bg-dark-card p-6 rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Exams Passed</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{totalPassed} / {results.length}</h3>
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Based on 40% passing criteria</p>
                </div>

                <div className="bg-white dark:bg-dark-card p-6 rounded-3xl border border-slate-200 dark:border-dark-border shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                            <Target className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500">Highest Score</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                {results.length > 0 ? Math.max(...results.map(r => calculatePercentage(r.score, r.total_marks))).toFixed(1) : 0}%
                            </h3>
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Top performance</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-24">
                    <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-600 rounded-full animate-spin"></div>
                </div>
            ) : results.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 text-slate-400">
                        <Award className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">No results available</h3>
                    <p className="text-slate-500 mt-1 text-center max-w-xs">Once you complete and submit an exam, your results will appear here automatically.</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-dark-card rounded-3xl border border-slate-200 dark:border-dark-border shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50">
                                    <th className="px-6 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider">Examination</th>
                                    <th className="px-6 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider">Subject</th>
                                    <th className="px-6 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider">Submitted On</th>
                                    <th className="px-6 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider text-center">Score</th>
                                    <th className="px-6 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {results.map((result) => {
                                    const percentage = calculatePercentage(result.score, result.total_marks);
                                    const isPassed = percentage >= 40;

                                    return (
                                        <tr key={result.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                            <td className="px-6 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 dark:text-primary-400">
                                                        <FileText className="w-5 h-5" />
                                                    </div>
                                                    <span className="font-bold text-slate-900 dark:text-white">{result.exam_title}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 font-medium text-slate-600 dark:text-slate-400">{result.course_name}</td>
                                            <td className="px-6 py-6 text-slate-500">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(result.submit_time).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 text-center">
                                                <div className="inline-flex flex-col items-center">
                                                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                                                        {parseFloat(result.score).toFixed(0)}/{result.total_marks}
                                                    </span>
                                                    <span className={`text-xs font-bold ${isPassed ? 'text-green-500' : 'text-red-500'}`}>
                                                        {percentage.toFixed(1)}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 text-center">
                                                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${isPassed
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                    }`}>
                                                    {isPassed ? 'PASSED' : 'FAILED'}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="mt-8 bg-primary-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-primary-600/20">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h2 className="text-2xl font-extrabold mb-2 text-white">Need detailed analysis?</h2>
                        <p className="text-primary-100 opacity-90 max-w-md">Contact your department for a full breakdown of your performance and feedback from the subject teachers.</p>
                    </div>
                    <button className="px-8 py-4 bg-white text-primary-600 font-black rounded-2xl hover:bg-primary-50 transition-all shadow-xl hover:-translate-y-1 uppercase tracking-widest text-sm">
                        Contact Faculty
                    </button>
                </div>
                {/* Decorative background circle */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary-400/20 rounded-full blur-3xl"></div>
            </div>
        </StudentLayout>
    );
}
