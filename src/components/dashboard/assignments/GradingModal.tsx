import { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { FileText, Link as LinkIcon, Download, File, MessageSquare } from 'lucide-react';
import { Submission } from '../../../services/assignments';

interface GradingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    isLoading?: boolean;
    initialData?: {
        student: string;
        grade?: any;
        fullSubmission?: Submission;
    };
}

export default function GradingModal({ isOpen, onClose, onSubmit, isLoading, initialData }: GradingModalProps) {
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        if (isOpen && initialData) {
            if (initialData.grade) {
                setValue('score', initialData.grade.score);
                setValue('feedback', initialData.grade.feedback);
            } else {
                reset({ score: '', feedback: '' });
            }
        }
    }, [isOpen, initialData, setValue, reset]);

    const handleFormSubmit = (data: any) => {
        onSubmit(data);
    };

    const submission = initialData?.fullSubmission;

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-0 text-left align-middle shadow-xl transition-all flex flex-col max-h-[90vh]">
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 flex-1 overflow-hidden">
                                    
                                    {/* Left Panel: Submission Content */}
                                    <div className="col-span-2 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-900 overflow-y-auto">
                                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10">
                                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                                                Student Submission
                                            </h3>
                                            <p className="text-sm text-slate-500 mt-1">
                                                Review the uploaded work before grading
                                            </p>
                                        </div>

                                        <div className="p-6 space-y-8">
                                            {/* Files Preview */}
                                            {submission?.files && submission.files.length > 0 && (
                                                <div>
                                                    <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                                                        <File className="w-4 h-4 text-indigo-500" />
                                                        Submission Preview
                                                    </h4>

                                                    {/* Document Previews */}
                                                    {submission.files.some(f => {
                                                        const ext = f.filename?.split('.').pop()?.toLowerCase() || f.file?.split('.').pop()?.toLowerCase() || '';
                                                        return ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext);
                                                    }) && (
                                                        <div className="space-y-4">
                                                            {submission.files
                                                                .filter(f => {
                                                                    const ext = f.filename?.split('.').pop()?.toLowerCase() || f.file?.split('.').pop()?.toLowerCase() || '';
                                                                    return ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext);
                                                                })
                                                                .map((docFile) => {
                                                                    const ext = docFile.filename?.split('.').pop()?.toLowerCase() || docFile.file?.split('.').pop()?.toLowerCase() || '';
                                                                    const isPdf = ext === 'pdf';
                                                                    const isOffice = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext);
                                                                    
                                                                    return (
                                                                        <div key={`preview-${docFile.id}`} className="w-full h-[600px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-inner flex flex-col">
                                                                            {isPdf ? (
                                                                                <iframe 
                                                                                    src={docFile.file} 
                                                                                    className="w-full h-full"
                                                                                    title={`PDF Preview - ${docFile.filename || 'Document'}`}
                                                                                />
                                                                            ) : isOffice ? (
                                                                                typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? (
                                                                                    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-900">
                                                                                        <FileText className="w-16 h-16 text-indigo-400 mb-4" />
                                                                                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Office Document ({ext.toUpperCase()})</h3>
                                                                                        <p className="text-slate-500 max-w-sm mb-6">
                                                                                            Inline preview of Word, Excel, and PowerPoint files requires a publicly accessible domain. Since you are testing on localhost, please download the file to view it.
                                                                                        </p>
                                                                                        <a
                                                                                            href={docFile.file}
                                                                                            target="_blank"
                                                                                            rel="noopener noreferrer"
                                                                                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
                                                                                        >
                                                                                            <Download className="w-4 h-4" /> Download {ext.toUpperCase()}
                                                                                        </a>
                                                                                    </div>
                                                                                ) : (
                                                                                    <iframe 
                                                                                        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(docFile.file)}`} 
                                                                                        className="w-full h-full"
                                                                                        title={`Office Preview - ${docFile.filename || 'Document'}`}
                                                                                    />
                                                                                )
                                                                            ) : null}
                                                                        </div>
                                                                    );
                                                                })}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* External URL */}
                                            {submission?.external_url && (
                                                <div>
                                                    <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                                                        <LinkIcon className="w-4 h-4 text-emerald-500" />
                                                        External Link
                                                    </h4>
                                                    <a
                                                        href={submission.external_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                                                    >
                                                        {submission.external_url}
                                                    </a>
                                                </div>
                                            )}

                                            {/* Text Content */}
                                            {submission?.text_content && (
                                                <div>
                                                    <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                                                        <MessageSquare className="w-4 h-4 text-blue-500" />
                                                        Online Text Submission
                                                    </h4>
                                                    <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 prose dark:prose-invert max-w-none">
                                                        <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 text-sm">
                                                            {submission.text_content}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Fallback if nothing */}
                                            {(!submission?.files?.length && !submission?.external_url && !submission?.text_content) && (
                                                <div className="text-center py-12 px-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                                                    <File className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                                    <p className="text-slate-500 font-medium">No submission content provided.</p>
                                                    <p className="text-slate-400 text-sm mt-1">The student did not attach any files or text.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Panel: Grading Form */}
                                    <div className="col-span-1 bg-white dark:bg-slate-900 flex flex-col">
                                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 sticky top-0 z-10">
                                            <Dialog.Title as="h3" className="text-lg font-semibold text-slate-900 dark:text-white">
                                                Evaluation
                                            </Dialog.Title>
                                            <p className="text-sm text-slate-500 mt-1 font-medium">
                                                Student: <span className="text-indigo-600 dark:text-indigo-400">{initialData?.student}</span>
                                            </p>
                                            {submission?.is_late && (
                                                <span className="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                                                    Submitted Late
                                                </span>
                                            )}
                                        </div>

                                        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto">
                                            {/* Score */}
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                                    Score (out of 100)
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        max="100"
                                                        min="0"
                                                        {...register('score', { required: "Score is required", min: 0, max: 100 })}
                                                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-4 pr-12 py-3 text-lg font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                                                        placeholder="0"
                                                    />
                                                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400 font-medium">
                                                        / 100
                                                    </div>
                                                </div>
                                                {errors.score && <span className="text-red-500 text-xs mt-2 block">{errors.score.message as string}</span>}
                                            </div>

                                            {/* Downloaded Files in Right Panel */}
                                            {submission?.files && submission.files.length > 0 && (
                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                                        Attached Files
                                                    </label>
                                                    <div className="space-y-3">
                                                        {submission.files.map((file) => (
                                                            <a
                                                                key={file.id}
                                                                href={file.file}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors group"
                                                            >
                                                                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">
                                                                    <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                                                        {file.filename || file.file.split('/').pop()}
                                                                    </p>
                                                                </div>
                                                                <Download className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Feedback */}
                                            <div className="flex-1 flex flex-col">
                                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                                    Feedback to Student
                                                </label>
                                                <textarea
                                                    {...register('feedback')}
                                                    className="w-full flex-1 min-h-[120px] bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm resize-none placeholder:text-slate-400"
                                                    placeholder="Provide constructive feedback..."
                                                ></textarea>
                                            </div>

                                            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex gap-3 mt-auto">
                                                <button
                                                    type="button"
                                                    className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors font-medium"
                                                    onClick={onClose}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={isLoading}
                                                    className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                                >
                                                    {isLoading ? 'Saving...' : 'Save Grade'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>

                                </div>

                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
