import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, Save, FileText, CheckSquare, Upload, X, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

interface QuizBuilderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    initialCourseId?: number;
}

export default function QuizBuilderModal({ isOpen, onClose, onSubmit, initialCourseId }: QuizBuilderModalProps) {
    const { register, control, handleSubmit, reset, watch, setValue } = useForm({
        defaultValues: {
            title: '',
            date: new Date().toISOString().split('T')[0],
            startTime: '09:00',
            durationMinutes: 60,
            questions: [
                {
                    text: '',
                    question_type: 'MCQ',
                    marks: 1,
                    options: [
                        { text: '', is_correct: false },
                        { text: '', is_correct: false }
                    ]
                }
            ]
        }
    });

    const { fields: questions, append: appendQuestion, remove: removeQuestion } = useFieldArray({
        control,
        name: 'questions'
    });

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            reset({
                title: '',
                date: new Date().toISOString().split('T')[0],
                startTime: '09:00',
                durationMinutes: 60,
                questions: [
                    {
                        text: '',
                        question_type: 'MCQ',
                        marks: 1,
                        options: [
                            { text: '', is_correct: true },
                            { text: '', is_correct: false }
                        ]
                    }
                ]
            });
        }
    }, [isOpen, reset]);

    const handleFormSubmit = async (data: any) => {
        setIsSaving(true);
        try {
            await onSubmit(data);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const addOption = (qIndex: number) => {
        const currentOptions = watch(`questions.${qIndex}.options`) || [];
        setValue(`questions.${qIndex}.options`, [...currentOptions, { text: '', is_correct: false }]);
    };

    const removeOption = (qIndex: number, optIndex: number) => {
        const currentOptions = watch(`questions.${qIndex}.options`) || [];
        setValue(`questions.${qIndex}.options`, currentOptions.filter((_: any, i: number) => i !== optIndex));
    };

    const setCorrectOption = (qIndex: number, optIndex: number) => {
        const currentOptions = watch(`questions.${qIndex}.options`) || [];
        const newOptions = currentOptions.map((opt: any, i: number) => ({
            ...opt,
            is_correct: i === optIndex
        }));
        setValue(`questions.${qIndex}.options`, newOptions);
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => {}}>
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-2xl transition-all border border-slate-200 dark:border-slate-800 flex flex-col h-[90vh]">
                                
                                {/* Header */}
                                <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                                    <div>
                                        <Dialog.Title as="h3" className="text-xl font-bold text-slate-900 dark:text-white">
                                            Quiz Builder
                                        </Dialog.Title>
                                        <p className="text-sm text-slate-500 mt-1">Create an interactive assessment with mixed question types.</p>
                                    </div>
                                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Body */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                                    <form id="quiz-builder-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
                                        
                                        {/* Basic Settings */}
                                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-4 shadow-sm">
                                            <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                                <Settings className="w-5 h-5 text-indigo-500" /> General Settings
                                            </h4>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Quiz Title</label>
                                                <input type="text" {...register('title', { required: true })} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Midterm Examination" />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                                                    <input type="date" {...register('date', { required: true })} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Time</label>
                                                    <input type="time" {...register('startTime', { required: true })} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Duration (mins)</label>
                                                    <input type="number" {...register('durationMinutes', { required: true, min: 1 })} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Questions Array */}
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold text-slate-900 dark:text-white text-lg">Questions</h4>
                                            </div>

                                            {questions.map((question, qIndex) => {
                                                const qType = watch(`questions.${qIndex}.question_type`);
                                                const opts = watch(`questions.${qIndex}.options`) || [];

                                                return (
                                                    <div key={question.id} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5 relative group">
                                                        {/* Question Header & Type */}
                                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                                            <div className="flex-1 flex gap-3 items-center">
                                                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold shrink-0">
                                                                    {qIndex + 1}
                                                                </span>
                                                                <select 
                                                                    {...register(`questions.${qIndex}.question_type`)}
                                                                    className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none w-48"
                                                                >
                                                                    <option value="MCQ">Multiple Choice</option>
                                                                    <option value="TEXT">Short/Long Text</option>
                                                                    <option value="FILE">File Upload</option>
                                                                </select>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex items-center gap-2">
                                                                    <label className="text-sm font-medium text-slate-500">Points</label>
                                                                    <input type="number" {...register(`questions.${qIndex}.marks`)} className="w-20 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 text-center" min="1" />
                                                                </div>
                                                                {questions.length > 1 && (
                                                                    <button type="button" onClick={() => removeQuestion(qIndex)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                                                                        <Trash2 className="w-5 h-5" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Question Text */}
                                                        <div className="mb-4 pl-11">
                                                            <textarea
                                                                {...register(`questions.${qIndex}.text`, { required: true })}
                                                                placeholder="Type your question here..."
                                                                rows={2}
                                                                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 resize-none shadow-sm"
                                                            ></textarea>
                                                        </div>

                                                        {/* Dynamic Options based on Type */}
                                                        <div className="pl-11">
                                                            {qType === 'MCQ' && (
                                                                <div className="space-y-3">
                                                                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Answer Options (Select Correct Answer)</label>
                                                                    {opts.map((opt: any, optIndex: number) => (
                                                                        <div key={optIndex} className="flex items-center gap-3">
                                                                            <input
                                                                                type="radio"
                                                                                name={`correct_${qIndex}`}
                                                                                checked={opt.is_correct}
                                                                                onChange={() => setCorrectOption(qIndex, optIndex)}
                                                                                className="w-5 h-5 text-indigo-600 border-slate-300 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-600 cursor-pointer"
                                                                            />
                                                                            <input
                                                                                type="text"
                                                                                {...register(`questions.${qIndex}.options.${optIndex}.text`)}
                                                                                placeholder={`Option ${optIndex + 1}`}
                                                                                className={`flex-1 bg-white dark:bg-slate-900 border rounded-lg px-4 py-2 text-sm focus:ring-2 outline-none transition-colors ${opt.is_correct ? 'border-indigo-500 ring-1 ring-indigo-500 dark:border-indigo-500 text-slate-900 dark:text-white' : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}
                                                                            />
                                                                            {opts.length > 2 && (
                                                                                <button type="button" onClick={() => removeOption(qIndex, optIndex)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                                                                                    <X className="w-5 h-5" />
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                    <button type="button" onClick={() => addOption(qIndex)} className="flex items-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline mt-2">
                                                                        <Plus className="w-4 h-4" /> Add Option
                                                                    </button>
                                                                </div>
                                                            )}

                                                            {qType === 'TEXT' && (
                                                                <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-600 text-center">
                                                                    <FileText className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                                                                    <p className="text-sm text-slate-500">A text box will be provided to the student.</p>
                                                                </div>
                                                            )}

                                                            {qType === 'FILE' && (
                                                                <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-600 text-center">
                                                                    <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                                                                    <p className="text-sm text-slate-500">Student will be prompted to upload a file.</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            <button
                                                type="button"
                                                onClick={() => appendQuestion({
                                                    text: '', question_type: 'MCQ', marks: 1, options: [{ text: '', is_correct: true }, { text: '', is_correct: false }]
                                                })}
                                                className="w-full py-4 border-2 border-dashed border-indigo-200 dark:border-indigo-500/30 rounded-xl text-indigo-600 dark:text-indigo-400 font-medium hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Plus className="w-5 h-5" /> Add Another Question
                                            </button>

                                        </div>
                                    </form>
                                </div>

                                {/* Footer */}
                                <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        className="px-6 py-2.5 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                        onClick={onClose}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        form="quiz-builder-form"
                                        type="submit"
                                        disabled={isSaving}
                                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg font-medium flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {isSaving ? <span className="animate-pulse">Saving...</span> : <><Save className="w-5 h-5" /> Save Quiz</>}
                                    </button>
                                </div>

                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
