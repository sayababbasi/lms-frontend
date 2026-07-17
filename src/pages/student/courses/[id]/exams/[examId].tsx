import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import StudentLayout from '../../../../../components/layout/StudentLayout';
import { ExamsService } from '../../../../../services/exams.service';
import { Clock, CheckCircle, AlertCircle, Upload, FileText, ChevronRight, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudentQuizPlayer() {
    const router = useRouter();
    const { id: courseId, examId } = router.query;
    
    const [exam, setExam] = useState<any>(null);
    const [attempt, setAttempt] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, any>>({});
    const [files, setFiles] = useState<Record<number, File>>({});

    useEffect(() => {
        if (examId) {
            initExam();
        }
    }, [examId]);

    const initExam = async () => {
        setLoading(true);
        try {
            // Fetch exam details (with questions)
            const data = await ExamsService.getExam(Number(examId));
            setExam(data as any);

            // Check if already attempted
            if ((data as any).has_attempted && !(data as any).submit_time) {
                // If yes, we could show results or say "already submitted"
                toast.success("Exam attempt initialized");
            }
            
            // Start attempt
            const attemptData = await ExamsService.startExam(Number(examId));
            setAttempt(attemptData);

            if ((attemptData as any).submit_time) {
                toast("You have already submitted this exam.", { icon: 'ℹ️' });
            }

        } catch (error) {
            console.error("Failed to init exam", error);
            toast.error("Failed to load exam details");
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (qId: number, optId: number) => {
        setAnswers(prev => ({ ...prev, [qId]: { selected_option_id: optId } }));
    };

    const handleTextChange = (qId: number, text: string) => {
        setAnswers(prev => ({ ...prev, [qId]: { text_answer: text } }));
    };

    const handleFileChange = (qId: number, file: File | null) => {
        if (file) {
            setFiles(prev => ({ ...prev, [qId]: file }));
        }
    };

    const handleSubmit = async () => {
        if (!confirm("Are you sure you want to submit? You cannot change your answers after submission.")) return;
        
        setSubmitting(true);
        try {
            const formData = new FormData();
            
            // Prepare answers JSON
            const answersData = Object.keys(answers).map(qId => ({
                question_id: Number(qId),
                ...answers[Number(qId)]
            }));
            
            // Add file questions to answers array even if no text/option is selected
            Object.keys(files).forEach(qId => {
                if (!answersData.find(a => a.question_id === Number(qId))) {
                    answersData.push({ question_id: Number(qId) });
                }
            });

            formData.append('answers_data', JSON.stringify(answersData));

            // Append files
            Object.entries(files).forEach(([qId, file]) => {
                formData.append(`file_${qId}`, file);
            });

            await ExamsService.submitExam(Number(examId), formData);
            toast.success("Exam submitted successfully!");
            router.push(`/student/courses/${courseId}/exams`);

        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to submit exam");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <StudentLayout title="Loading Quiz...">
                <div className="flex justify-center items-center py-20">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </StudentLayout>
        );
    }

    if (!exam) return null;

    if (attempt?.submit_time) {
        return (
            <StudentLayout title={exam.title}>
                <div className="bg-dark-surface rounded-2xl border border-dark-border p-12 text-center max-w-2xl mx-auto mt-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Exam Submitted</h2>
                    <p className="text-slate-400 mb-6">You have successfully completed this assessment. Your score is {attempt.score}.</p>
                    <button onClick={() => router.push(`/student/courses/${courseId}/exams`)} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors">
                        Return to Quizzes
                    </button>
                </div>
            </StudentLayout>
        );
    }

    const currentQuestion = exam.questions[currentQuestionIndex];
    const totalQuestions = exam.questions.length;
    const progress = ((currentQuestionIndex) / totalQuestions) * 100;

    return (
        <StudentLayout title={exam.title}>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-dark-card rounded-2xl border border-dark-border p-6 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg shadow-indigo-900/10">
                    <div>
                        <h1 className="text-2xl font-bold text-white">{exam.title}</h1>
                        <p className="text-slate-400 mt-1">Course ID: {courseId}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-4 py-2 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-indigo-400" />
                            <span className="text-indigo-400 font-mono font-bold tracking-widest">
                                {/* Timer functionality could go here */}
                                IN PROGRESS
                            </span>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6 flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-400 min-w-[80px]">Question {currentQuestionIndex + 1} of {totalQuestions}</span>
                    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                {/* Question Area */}
                <div className="bg-dark-surface rounded-2xl border border-dark-border p-6 md:p-10 mb-6 shadow-xl relative overflow-hidden">
                    {/* Background accent */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <span className="inline-block px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-xs font-bold uppercase tracking-wider">
                                {currentQuestion.question_type}
                            </span>
                            <span className="text-slate-400 font-medium">{currentQuestion.marks} Points</span>
                        </div>

                        <h3 className="text-xl md:text-2xl font-bold text-white mb-8 leading-relaxed">
                            {currentQuestion.text}
                        </h3>

                        {/* Answers Area */}
                        <div className="space-y-4">
                            {currentQuestion.question_type === 'MCQ' && (
                                <div className="grid gap-3">
                                    {currentQuestion.options.map((opt: any) => {
                                        const isSelected = answers[currentQuestion.id]?.selected_option_id === opt.id;
                                        return (
                                            <button
                                                key={opt.id}
                                                onClick={() => handleOptionSelect(currentQuestion.id, opt.id)}
                                                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${isSelected ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 hover:border-slate-500 bg-slate-800/50'}`}
                                            >
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-500'}`}>
                                                    {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                                                </div>
                                                <span className={`text-lg ${isSelected ? 'text-white' : 'text-slate-300'}`}>{opt.text}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {currentQuestion.question_type === 'TEXT' && (
                                <div>
                                    <textarea
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
                                        rows={6}
                                        placeholder="Type your answer here..."
                                        value={answers[currentQuestion.id]?.text_answer || ''}
                                        onChange={(e) => handleTextChange(currentQuestion.id, e.target.value)}
                                    ></textarea>
                                </div>
                            )}

                            {currentQuestion.question_type === 'FILE' && (
                                <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 hover:border-indigo-500/50 transition-colors bg-slate-800/30 text-center">
                                    <input 
                                        type="file" 
                                        id={`file-${currentQuestion.id}`} 
                                        className="hidden" 
                                        onChange={(e) => handleFileChange(currentQuestion.id, e.target.files ? e.target.files[0] : null)}
                                    />
                                    <label htmlFor={`file-${currentQuestion.id}`} className="cursor-pointer flex flex-col items-center">
                                        <Upload className="w-12 h-12 text-indigo-400 mb-3" />
                                        <span className="text-white font-medium mb-1">Click to upload your file</span>
                                        <span className="text-slate-500 text-sm">PDF, DOCX, ZIP, or Image files</span>
                                        
                                        {files[currentQuestion.id] && (
                                            <div className="mt-6 p-3 bg-indigo-500/20 border border-indigo-500/30 rounded-lg flex items-center gap-3 w-full max-w-sm mx-auto">
                                                <FileText className="w-6 h-6 text-indigo-400 shrink-0" />
                                                <span className="text-white text-sm truncate">{files[currentQuestion.id].name}</span>
                                                <button onClick={(e) => { e.preventDefault(); handleFileChange(currentQuestion.id, null); }} className="ml-auto text-red-400 hover:text-red-300">✕</button>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="flex justify-between items-center bg-dark-card rounded-2xl border border-dark-border p-4 shadow-lg">
                    <button
                        onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestionIndex === 0}
                        className="px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed font-medium flex items-center gap-2 transition-all"
                    >
                        <ChevronLeft className="w-5 h-5" /> Previous
                    </button>

                    {currentQuestionIndex === totalQuestions - 1 ? (
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 shadow-lg shadow-green-500/20 flex items-center gap-2 transition-all"
                        >
                            {submitting ? 'Submitting...' : <><CheckCircle className="w-5 h-5" /> Submit Exam</>}
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentQuestionIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 font-medium flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all"
                        >
                            Next <ChevronRight className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        </StudentLayout>
    );
}
