import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import StudentLayout from '../../../../components/layout/StudentLayout';
import { StudentService } from '../../../../services/student.service';
import { Clock, AlertTriangle, CheckCircle, Save, ChevronRight, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudentExamAttemptPage() {
    const router = useRouter();
    const { id } = router.query;

    // Convert id to number safely
    const examId = id ? parseInt(id as string) : null;

    const [exam, setExam] = useState<any>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<{ [key: number]: any }>({});
    const [timeLeft, setTimeLeft] = useState<number>(0); // in seconds
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (examId) fetchExamDetails(examId);
    }, [examId]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        handleSubmit(); // Auto-submit
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft]);

    const fetchExamDetails = async (eId: number) => {
        try {
            // Try to start/resume
            // Since we can't easily pass complex objects in Next.js router state without query hacks,
            // we'll rely on fetching afresh.
            // Ideally start_attempt is idempotent or checks for existing attempt.
            const attemptData = await StudentService.startExamAttempt(eId);

            // Then fetch exam details (assuming we have an endpoint or getExams works)
            const allExams = await StudentService.getExams();
            // Type safe check
            const examList = Array.isArray(allExams) ? allExams : (allExams as any).results || [];
            const foundExam = examList.find((e: any) => e.id === eId);

            if (foundExam) {
                setExam(foundExam);
                setQuestions(foundExam.questions || []);
                // Set timer logic here. For mvp using dummy 1 hour.
                // Ideally: attemptData.start_time + foundExam.duration - now
                setTimeLeft(60 * 60);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error loading exam");
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (questionId: number, optionId: number) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: { selected_option_id: optionId, question_id: questionId }
        }));
    };

    const handleSubmit = async () => {
        if (submitting || !id) return;
        setSubmitting(true);
        try {
            const formattedAnswers = Object.values(answers);
            console.log("Submitting payload:", { answers: formattedAnswers });
            await StudentService.submitExam(parseInt(id as string), { answers: formattedAnswers });
            toast.success("Exam submitted successfully!");
            router.push('/student/exams');
        } catch (error: any) {
            console.error("Submission failed:", error);
            const serverError = error.response?.data;
            if (serverError) {
                console.log("Server error details:", serverError);
                const errorMsg = typeof serverError === 'string' ? serverError : (serverError.error || JSON.stringify(serverError));
                toast.error(`Submission failed: ${errorMsg}`);
            } else {
                toast.error("Failed to submit exam");
            }
            setSubmitting(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    if (loading) return <div className="p-10 text-center">Loading Exam...</div>;
    if (!exam) return <div className="p-10 text-center">Exam not found</div>;

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <StudentLayout title={`Attempting: ${exam.title}`}>
            <div className="flex flex-col h-[calc(100vh-100px)]">
                {/* Header with Timer */}
                <div className="bg-white dark:bg-dark-card p-4 rounded-xl border border-slate-200 dark:border-dark-border shadow-sm flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">{exam.title}</h2>
                        <span className="text-sm text-slate-500">{exam.course_code}</span>
                    </div>
                    <div className={`px-4 py-2 rounded-lg font-mono font-bold text-xl flex items-center gap-2 ${timeLeft < 300 ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                        <Clock className="w-5 h-5" />
                        {formatTime(timeLeft)}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex gap-6 flex-1 overflow-hidden">
                    {/* Question Area */}
                    <div className="flex-1 overflow-y-auto">
                        {currentQuestion ? (
                            <div className="bg-white dark:bg-dark-card p-8 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm">
                                <div className="flex justify-between items-start mb-6">
                                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Question {currentQuestionIndex + 1}</span>
                                    <span className="text-sm font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">{currentQuestion.marks} Marks</span>
                                </div>

                                <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-8 leading-relaxed">
                                    {currentQuestion.text}
                                </h3>

                                <div className="space-y-3">
                                    {currentQuestion.options && currentQuestion.options.map((option: any) => (
                                        <div
                                            key={option.id}
                                            onClick={() => handleAnswerSelect(currentQuestion.id, option.id)}
                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 group ${answers[currentQuestion.id]?.selected_option_id === option.id
                                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10'
                                                : 'border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700'
                                                }`}
                                        >
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${answers[currentQuestion.id]?.selected_option_id === option.id
                                                ? 'border-primary-500 bg-primary-500'
                                                : 'border-slate-300 group-hover:border-primary-400'
                                                }`}>
                                                {answers[currentQuestion.id]?.selected_option_id === option.id && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                                            </div>
                                            <span className={`text-lg ${answers[currentQuestion.id]?.selected_option_id === option.id ? 'text-primary-700 dark:text-primary-300 font-medium' : 'text-slate-700 dark:text-slate-300'}`}>
                                                {option.text}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center p-10">No questions found</div>
                        )}

                        {/* Navigation */}
                        <div className="flex justify-between mt-6">
                            <button
                                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentQuestionIndex === 0}
                                className="px-6 py-3 rounded-xl font-semibold text-slate-600 bg-white border border-slate-200 disabled:opacity-50 hover:bg-slate-50 flex items-center gap-2"
                            >
                                <ChevronLeft className="w-4 h-4" /> Previous
                            </button>

                            {currentQuestionIndex === questions.length - 1 ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="px-8 py-3 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/20 flex items-center gap-2"
                                >
                                    {submitting ? 'Submitting...' : 'Submit Exam'} <CheckCircle className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                                    className="px-6 py-3 rounded-xl font-semibold text-white bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/20 flex items-center gap-2"
                                >
                                    Next <ChevronRight className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Navigator */}
                    <div className="w-72 bg-white dark:bg-dark-card p-6 rounded-2xl border border-slate-200 dark:border-dark-border hidden lg:block h-fit">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Questions</h3>
                        <div className="grid grid-cols-4 gap-2">
                            {questions.map((q, idx) => (
                                <button
                                    key={q.id}
                                    onClick={() => setCurrentQuestionIndex(idx)}
                                    className={`aspect-square rounded-lg font-bold text-sm transition-all ${currentQuestionIndex === idx
                                        ? 'bg-primary-600 text-white ring-2 ring-primary-200 dark:ring-primary-900'
                                        : answers[q.id]
                                            ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
                                        }`}
                                >
                                    {idx + 1}
                                </button>
                            ))}
                        </div>

                        <div className="mt-6 space-y-3">
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <div className="w-3 h-3 rounded bg-primary-600"></div> Current
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <div className="w-3 h-3 rounded bg-primary-100 dark:bg-primary-900/30"></div> Answered
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <div className="w-3 h-3 rounded bg-slate-100 dark:bg-slate-800"></div> Not visited
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
