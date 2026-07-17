import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

interface GradingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (grade: number, feedback: string) => void;
    studentName: string;
    currentGrade?: {
        score: number;
        feedback: string;
    };
}

export default function GradingModal({ isOpen, onClose, onSubmit, studentName, currentGrade }: GradingModalProps) {
    const [score, setScore] = useState<string>('');
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        if (isOpen && currentGrade) {
            setScore(currentGrade.score.toString());
            setFeedback(currentGrade.feedback || '');
        } else if (isOpen) {
            setScore('');
            setFeedback('');
        }
    }, [isOpen, currentGrade]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numScore = parseFloat(score);
        if (isNaN(numScore) || numScore < 0 || numScore > 100) {
            // Basic validation, parent handles toast
            return;
        }
        // Ensure max 2 decimal places to avoid backend validation errors
        const cleanedScore = Math.round(numScore * 100) / 100;
        onSubmit(cleanedScore, feedback);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl scale-100 animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Grade Submission</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Student: {studentName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Score (0-100)</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            value={score}
                            onChange={(e) => setScore(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                            placeholder="e.g. 85.5"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Feedback (Optional)</label>
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none h-32 resize-none"
                            placeholder="Add comments for the student..."
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            <Check className="w-4 h-4" />
                            Save Grade
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
