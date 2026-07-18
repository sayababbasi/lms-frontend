import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { CoursesService } from '../../../services/courses.service';

interface ExamModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    isLoading?: boolean;
    initialData?: any;
}

export default function ExamModal({ isOpen, onClose, onSubmit, isLoading, initialData }: ExamModalProps) {
    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
    const [courses, setCourses] = useState<any[]>([]);

    useEffect(() => {
        if (isOpen) {
            loadCourses();
            if (initialData) {
                setValue('title', initialData.title);
                setValue('course', initialData.course);

                if (initialData.start_time) {
                    const startDate = new Date(initialData.start_time);
                    const formattedStart = startDate.toISOString().slice(0, 16);
                    setValue('start_time', formattedStart);
                }

                if (initialData.end_time) {
                    const endDate = new Date(initialData.end_time);
                    const formattedEnd = endDate.toISOString().slice(0, 16);
                    setValue('end_time', formattedEnd);
                }
            } else {
                reset({
                    title: '',
                    course: '',
                    start_time: '',
                    end_time: ''
                });
            }
        }
    }, [isOpen, initialData, setValue, reset]);

    const loadCourses = async () => {
        try {
            const data = await CoursesService.getAll();
            setCourses((data as any).results || data);
        } catch (error) {
            console.error("Failed to load courses", error);
        }
    };

    const handleFormSubmit = (data: any) => {
        onSubmit(data);
    };

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
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-dark-surface border border-dark-border p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-dark-text mb-4"
                                >
                                    {initialData ? 'Edit Quiz' : 'Create New Quiz'}
                                </Dialog.Title>

                                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Quiz Title</label>
                                        <input
                                            type="text"
                                            {...register('title', { required: "Title is required" })}
                                            className="mt-1 w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-dark-text focus:outline-none focus:border-primary-500"
                                            placeholder="e.g. Final Exam"
                                        />
                                        {errors.title && <span className="text-red-400 text-xs">{errors.title.message as string}</span>}
                                    </div>

                                    {/* Course */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Course</label>
                                        <select
                                            {...register('course', { required: "Course is required" })}
                                            className="mt-1 w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-dark-text focus:outline-none focus:border-primary-500"
                                        >
                                            <option value="">Select a course...</option>
                                            {courses.map(course => (
                                                <option key={course.id} value={course.id}>
                                                    {course.code ? `${course.code} - ` : ''}{course.title}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.course && <span className="text-red-400 text-xs">{errors.course.message as string}</span>}
                                    </div>

                                    {/* Start & End Time Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Start Time */}
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Start Time</label>
                                            <input
                                                type="datetime-local"
                                                {...register('start_time', { required: "Start Time is required" })}
                                                className="mt-1 w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-dark-text focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 [color-scheme:dark]"
                                            />
                                            {errors.start_time && <span className="text-red-400 text-xs">{errors.start_time.message as string}</span>}
                                        </div>

                                        {/* End Time */}
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">End Time</label>
                                            <input
                                                type="datetime-local"
                                                {...register('end_time', {
                                                    required: "End Time is required",
                                                    validate: (val) => {
                                                        const start = watch('start_time');
                                                        if (start && val < start) {
                                                            return "End time cannot be before start time";
                                                        }
                                                        return true;
                                                    }
                                                })}
                                                className="mt-1 w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-dark-text focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 [color-scheme:dark]"
                                            />
                                            {errors.end_time && <span className="text-red-400 text-xs">{errors.end_time.message as string}</span>}
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 mt-6">
                                        <button
                                            type="button"
                                            className="px-4 py-2 text-slate-600 hover:text-dark-text hover:bg-white/5 rounded-lg transition-colors"
                                            onClick={onClose}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg shadow-lg shadow-primary-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? 'Saving...' : (initialData ? 'Update Quiz' : 'Create Quiz')}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
