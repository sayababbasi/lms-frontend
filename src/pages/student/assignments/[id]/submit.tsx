import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import StudentLayout from '../../../../components/layout/StudentLayout';
import { StudentService } from '../../../../services/student.service';
import { FileText, Upload, CheckCircle, ArrowLeft, Calendar, File } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SubmitAssignmentPage() {
    const router = useRouter();
    const { id } = router.query;

    const [assignment, setAssignment] = useState<any>(null);
    const [submission, setSubmission] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [textContent, setTextContent] = useState('');
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (id) {
            fetchAssignment();
        }
    }, [id]);

    const fetchAssignment = async () => {
        try {
            const data = await StudentService.getAssignment(Number(id));
            setAssignment(data);

            const submissionsData = await StudentService.getMySubmission(Number(id));
            const submissionsList = Array.isArray(submissionsData) ? submissionsData : (submissionsData as any)?.results || [];
            if (submissionsList.length > 0) {
                setSubmission(submissionsList[0]);
            }
        } catch (error) {
            console.error("Failed to load assignment", error);
            toast.error("Could not load assignment details");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!textContent && !file) {
            toast.error("Please provide text content or upload a file.");
            return;
        }

        setSubmitting(true);
        try {
            await StudentService.submitAssignment(Number(id), {
                text_content: textContent,
                file: file
            });
            toast.success("Assignment submitted successfully!");
            // Refresh to show updated submission status
            setTextContent('');
            setFile(null);
            fetchAssignment();
        } catch (error: any) {
            console.error("Submission failed", error);
            const msg = error.response?.data?.detail || "Failed to submit assignment";
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <StudentLayout title="Assignment Details">
                <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </StudentLayout>
        );
    }

    if (!assignment) return null;

    const maxAttempts = assignment.max_attempts || 1;
    const currentAttempt = submission ? submission.attempt_number : 0;
    const canSubmit = currentAttempt < maxAttempts;

    return (
        <StudentLayout title={assignment.title}>
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-500 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Assignments
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-dark-card p-6 rounded-2xl border border-dark-border">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <span className="px-2 py-1 bg-primary-500/10 text-primary-400 text-xs font-bold rounded mb-2 inline-block">
                                        {assignment.course_code}
                                    </span>
                                    <h1 className="text-2xl font-bold text-dark-text">{assignment.title}</h1>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-slate-500 mb-1">Due Date</div>
                                    <div className="font-bold text-orange-400 flex items-center gap-2 justify-end">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(assignment.due_date).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            <div className="prose prose-invert max-w-none text-slate-400 mb-8">
                                <h3 className="text-white font-medium mb-2">Instructions</h3>
                                <p className="whitespace-pre-wrap">{assignment.description || 'No description provided.'}</p>
                            </div>

                            {submission && (
                                <div className="border-t border-slate-200 dark:border-slate-800 pt-6 mb-8">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Previous Submission</h3>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500 dark:text-slate-400">Status</span>
                                            <span className="font-medium text-slate-900 dark:text-white">{submission.status}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500 dark:text-slate-400">Submitted At</span>
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                {new Date(submission.submitted_at || submission.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-500 dark:text-slate-400">Attempt</span>
                                            <span className="font-medium text-slate-900 dark:text-white">{currentAttempt} of {maxAttempts}</span>
                                        </div>
                                        
                                        {submission.files && submission.files.length > 0 && (
                                            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 mt-3">
                                                <span className="text-slate-500 dark:text-slate-400 text-sm mb-2 block">Attached File</span>
                                                <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-medium text-sm">
                                                    <FileText className="w-4 h-4" />
                                                    {submission.files[0].filename}
                                                </div>
                                            </div>
                                        )}

                                        {submission.grade && (
                                            <div className="mt-4 p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-green-700 dark:text-green-400 font-bold">Graded</span>
                                                    <span className="text-green-900 dark:text-white font-bold text-lg">{submission.grade.score} / {assignment.max_score}</span>
                                                </div>
                                                {submission.grade.feedback && (
                                                    <p className="text-sm text-green-800 dark:text-slate-300 mt-2 border-t border-green-200 dark:border-green-500/20 pt-2">
                                                        <span className="font-semibold text-green-700 dark:text-green-400">Feedback: </span>
                                                        {submission.grade.feedback}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {canSubmit ? (
                                <div className="border-t border-dark-border pt-6">
                                    <h3 className="text-lg font-bold text-dark-text mb-4">
                                        {submission ? 'Resubmit Assignment' : 'Your Submission'}
                                    </h3>
                                    <p className="text-sm text-slate-400 mb-6">
                                        Attempt {currentAttempt + 1} of {maxAttempts} allowed.
                                    </p>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2">
                                                Online Text
                                            </label>
                                            <textarea
                                                rows={6}
                                                value={textContent}
                                                onChange={(e) => setTextContent(e.target.value)}
                                                className="w-full bg-dark-bg border border-dark-border rounded-xl p-4 text-dark-text focus:outline-none focus:border-primary-500 transition-colors"
                                                placeholder="Write your submission answer here..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2">
                                                Attach File
                                            </label>
                                            <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${file ? 'border-primary-500 bg-primary-500/5' : 'border-dark-border hover:border-slate-600'}`}>
                                                <input
                                                    type="file"
                                                    id="file-upload"
                                                    className="hidden"
                                                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                                                />
                                                <label htmlFor="file-upload" className="cursor-pointer block w-full h-full">
                                                    {file ? (
                                                        <div className="flex items-center justify-center gap-3 text-primary-400">
                                                            <File className="w-6 h-6" />
                                                            <span className="font-medium truncate max-w-[200px]">{file.name}</span>
                                                            <span className="text-xs opacity-70">({(file.size / 1024).toFixed(1)} KB)</span>
                                                        </div>
                                                    ) : (
                                                        <div className="text-slate-500">
                                                            <Upload className="w-8 h-8 mx-auto mb-3 opacity-50" />
                                                            <span className="block font-medium mb-1">Click to upload file</span>
                                                            <span className="text-xs opacity-50 block">PDF, Word, or Images accepted</span>
                                                        </div>
                                                    )}
                                                </label>
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-4">
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className={`px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl shadow-lg shadow-primary-500/20 transition-all transform hover:-translate-y-1 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {submitting ? 'Submitting...' : submission ? 'Resubmit Assignment' : 'Mark as Done & Submit'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <div className="border-t border-dark-border pt-6 text-center">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 mb-4">
                                        <CheckCircle className="w-6 h-6 text-slate-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">Maximum Attempts Reached</h3>
                                    <p className="text-slate-400 text-sm">
                                        You have used all {maxAttempts} attempts for this assignment and can no longer submit.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Meta (Optional) */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-slate-200 dark:border-dark-border shadow-sm">
                            <h3 className="font-bold text-slate-900 dark:text-dark-text mb-4">Instructor</h3>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white">
                                    {assignment.teacher_name ? assignment.teacher_name.charAt(0).toUpperCase() : 'T'}
                                </div>
                                <div>
                                    <div className="font-medium text-slate-900 dark:text-white">{assignment.teacher_name || 'Unknown'}</div>
                                    <div className="text-xs text-slate-500">Course Instructor</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
