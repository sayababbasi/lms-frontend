import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CoursesService } from '../../../services/courses.service';

interface AssignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    isLoading?: boolean;
    initialData?: any;
}

export default function AssignmentModal({ isOpen, onClose, onSubmit, isLoading, initialData }: AssignmentModalProps) {
    const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm();
    const [courses, setCourses] = useState<any[]>([]);

    useEffect(() => {
        if (isOpen) {
            loadCourses();
            if (initialData) {
                setValue('title', initialData.title);
                setValue('description', initialData.description);
                setValue('course', initialData.course);
                setValue('status', initialData.status || 'Published');
                setValue('max_score', initialData.max_score || 100);
                setValue('max_attempts', initialData.max_attempts || 3);
                // Format date for input type="date" (YYYY-MM-DD) or datetime-local
                if (initialData.due_date) {
                    const date = new Date(initialData.due_date);
                    setValue('due_date', date);
                }
            } else {
                reset({
                    title: '',
                    description: '',
                    course: '',
                    due_date: '',
                    status: 'Published',
                    max_score: 100,
                    max_attempts: 3
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
                            <Dialog.Panel className="w-full max-w-md transform overflow-visible rounded-2xl bg-dark-surface border border-dark-border p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-dark-text mb-4"
                                >
                                    {initialData ? 'Edit Assignment' : 'Create New Assignment'}
                                </Dialog.Title>

                                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Assignment Title</label>
                                        <input
                                            type="text"
                                            {...register('title', { required: "Title is required" })}
                                            className="mt-1 w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-dark-text focus:outline-none focus:border-primary-500"
                                            placeholder="e.g. Midterm Project"
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
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Status */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                                            <select
                                                {...register('status', { required: "Status is required" })}
                                                className="mt-1 w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-dark-text focus:outline-none focus:border-primary-500"
                                            >
                                                <option value="Draft">Draft</option>
                                                <option value="Published">Published</option>
                                                <option value="Closed">Closed</option>
                                            </select>
                                            {errors.status && <span className="text-red-400 text-xs">{errors.status.message as string}</span>}
                                        </div>

                                        {/* Max Score */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Max Score</label>
                                            <input
                                                type="number"
                                                {...register('max_score', { 
                                                    required: "Max Score is required",
                                                    min: { value: 1, message: "Must be at least 1" }
                                                })}
                                                className="mt-1 w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-dark-text focus:outline-none focus:border-primary-500"
                                            />
                                            {errors.max_score && <span className="text-red-400 text-xs">{errors.max_score.message as string}</span>}
                                        </div>

                                        {/* Max Attempts */}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Max Attempts</label>
                                            <input
                                                type="number"
                                                {...register('max_attempts', { 
                                                    required: "Max Attempts is required",
                                                    min: { value: 1, message: "Must be at least 1" }
                                                })}
                                                className="mt-1 w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-dark-text focus:outline-none focus:border-primary-500"
                                            />
                                            {errors.max_attempts && <span className="text-red-400 text-xs">{errors.max_attempts.message as string}</span>}
                                        </div>
                                    </div>

                                    {/* Due Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Due Date</label>
                                        <Controller
                                            control={control}
                                            name="due_date"
                                            rules={{ required: "Due Date is required" }}
                                            render={({ field }) => (
                                                <DatePicker
                                                    selected={field.value ? new Date(field.value) : null}
                                                    onChange={(date) => field.onChange(date)}
                                                    showTimeSelect
                                                    timeFormat="HH:mm"
                                                    timeIntervals={15}
                                                    timeCaption="Time"
                                                    dateFormat="MMMM d, yyyy h:mm aa"
                                                    className="mt-1 w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-dark-text focus:outline-none focus:border-primary-500"
                                                    placeholderText="Select Due Date & Time"
                                                />
                                            )}
                                        />
                                        {errors.due_date && <span className="text-red-400 text-xs">{errors.due_date.message as string}</span>}
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                                        <textarea
                                            {...register('description')}
                                            rows={4}
                                            className="mt-1 w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-dark-text focus:outline-none focus:border-primary-500"
                                            placeholder="Detailed instructions..."
                                        ></textarea>
                                    </div>

                                    <div className="mt-6 flex justify-end gap-3">
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
                                            {isLoading ? 'Saving...' : (initialData ? 'Update Assignment' : 'Create Assignment')}
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
