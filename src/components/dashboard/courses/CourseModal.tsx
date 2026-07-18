import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import api from '../../../services/api';

interface CourseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    isLoading?: boolean;
    initialData?: any;
}

export default function CourseModal({ isOpen, onClose, onSubmit, isLoading, initialData }: CourseModalProps) {
    const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm();
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [teachers, setTeachers] = useState<any[]>([]);

    useEffect(() => {
        // Fetch teachers for the select dropdowns
        const fetchTeachers = async () => {
            try {
                const res = await api.get('/users/?is_teacher=true');
                const responseData = res.data as any;
                if (responseData.results) {
                    setTeachers(responseData.results.filter((u: any) => u.is_teacher));
                } else if (Array.isArray(responseData)) {
                    setTeachers(responseData.filter((u: any) => u.is_teacher));
                }
            } catch (err) {
                console.error("Failed to fetch teachers", err);
            }
        };
        fetchTeachers();
    }, []);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setValue('title', initialData.title);
                setValue('code', initialData.code);
                setValue('description', initialData.description);
                setValue('credit_hours', initialData.credit_hours || 3);
                setValue('passing_percentage', initialData.passing_percentage || 50);
                setValue('status', initialData.status || 'DRAFT');
                setValue('semester', initialData.semester || '');
                setValue('category', initialData.category || '');
                setValue('prerequisites', initialData.prerequisites || '');
                // Instructor fields
                setValue('teacher_id', initialData.teacher_id || '');
                setValue('teacher_ids', initialData.teacher_ids || []);
                setPreviewImage(initialData.thumbnail);
            } else {
                reset({ credit_hours: 3, passing_percentage: 50, status: 'DRAFT', teacher_ids: [] });
                setPreviewImage(null);
            }
        }
    }, [isOpen, initialData, reset, setValue]);

    const handleFormSubmit = (data: any) => {
        onSubmit(data);
    };

    const handleImageChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
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
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
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
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-dark-surface border border-dark-border p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-2xl font-extrabold leading-6 text-dark-text mb-6 flex justify-between items-center"
                                >
                                    <span>{initialData ? 'Edit Course Settings' : 'Create New Professional Course'}</span>
                                    <button onClick={onClose} className="text-slate-500 hover:text-dark-text bg-dark-bg p-2 rounded-full border border-dark-border transition-colors">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </Dialog.Title>

                                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                                    {/* THUMBNAIL */}
                                    <div className="bg-dark-bg/50 p-4 rounded-xl border border-dark-border">
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Course Thumbnail / Cover</label>
                                        <div className="flex items-center gap-6">
                                            {previewImage ? (
                                                <img src={previewImage} alt="Thumbnail preview" className="w-32 h-24 object-cover rounded-xl border border-dark-border shadow-md" />
                                            ) : (
                                                <div className="w-32 h-24 bg-dark-bg border border-dashed border-slate-500 rounded-xl flex flex-col items-center justify-center text-slate-500">
                                                    <svg className="w-8 h-8 mb-1 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                    <span className="text-xs">800x600</span>
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    {...register('thumbnail', { onChange: handleImageChange })}
                                                    className="block w-full text-sm text-slate-400 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-primary-600/20 file:text-primary-400 hover:file:bg-primary-600/30 transition-colors cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* BASIC INFO */}
                                        <div className="space-y-4">
                                            <h4 className="text-md font-bold text-slate-300 border-b border-dark-border pb-2">Basic Details</h4>
                                            
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-300 mb-1">Course Code <span className="text-red-500">*</span></label>
                                                <input
                                                    {...register('code', { required: 'Course Code is required' })}
                                                    className={`w-full bg-dark-bg border ${errors.code ? 'border-red-500' : 'border-dark-border'} rounded-xl px-4 py-3 text-dark-text focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500`}
                                                    placeholder="e.g. CS101"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-slate-300 mb-1">Course Title <span className="text-red-500">*</span></label>
                                                <input
                                                    {...register('title', { required: 'Title is required' })}
                                                    className={`w-full bg-dark-bg border ${errors.title ? 'border-red-500' : 'border-dark-border'} rounded-xl px-4 py-3 text-dark-text focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500`}
                                                    placeholder="e.g. Introduction to Programming"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-slate-300 mb-1">Category / Department</label>
                                                <input
                                                    {...register('category')}
                                                    className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-dark-text focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                                                    placeholder="e.g. Computer Science"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-slate-300 mb-1">Description</label>
                                                <textarea
                                                    {...register('description')}
                                                    rows={4}
                                                    className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-dark-text focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                                                    placeholder="Comprehensive overview of the curriculum..."
                                                />
                                            </div>
                                        </div>

                                        {/* ACADEMIC INFO */}
                                        <div className="space-y-4">
                                            <h4 className="text-md font-bold text-slate-300 border-b border-dark-border pb-2">Academic & Scheduling</h4>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-300 mb-1">Credit Hours</label>
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        {...register('credit_hours')}
                                                        className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-dark-text focus:outline-none focus:border-primary-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-300 mb-1">Passing %</label>
                                                    <input
                                                        type="number"
                                                        min={0} max={100}
                                                        {...register('passing_percentage')}
                                                        className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-dark-text focus:outline-none focus:border-primary-500"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-300 mb-1">Semester / Term</label>
                                                    <input
                                                        {...register('semester')}
                                                        className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-dark-text focus:outline-none focus:border-primary-500"
                                                        placeholder="Fall 2026"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-slate-300 mb-1">Status</label>
                                                    <select
                                                        {...register('status')}
                                                        className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-dark-text focus:outline-none focus:border-primary-500"
                                                    >
                                                        <option value="DRAFT">Draft (Hidden)</option>
                                                        <option value="PUBLISHED">Published</option>
                                                        <option value="ARCHIVED">Archived</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-slate-300 mb-1">Primary Instructor</label>
                                                <select
                                                    {...register('teacher_id')}
                                                    className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-dark-text focus:outline-none focus:border-primary-500"
                                                >
                                                    <option value="">-- Assign Instructor --</option>
                                                    {teachers.map(t => (
                                                        <option key={t.id} value={t.id}>{t.first_name} {t.last_name} ({t.username})</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-slate-300 mb-1">Assistant / Co-Instructors</label>
                                                <select
                                                    multiple
                                                    {...register('teacher_ids')}
                                                    className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2 text-dark-text focus:outline-none focus:border-primary-500 h-24"
                                                >
                                                    {teachers.map(t => (
                                                        <option key={t.id} value={t.id}>{t.first_name} {t.last_name} ({t.username})</option>
                                                    ))}
                                                </select>
                                                <p className="text-xs text-slate-500 mt-1">Hold Ctrl (Windows) or Cmd (Mac) to select multiple</p>
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-300 mb-1">Prerequisites</label>
                                                <textarea
                                                    {...register('prerequisites')}
                                                    rows={2}
                                                    className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2 text-dark-text focus:outline-none focus:border-primary-500"
                                                    placeholder="Required prior knowledge or courses..."
                                                />
                                            </div>

                                        </div>
                                    </div>

                                    <div className="mt-8 flex justify-end gap-4 pt-6 border-t border-dark-border">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-6 py-2.5 bg-dark-bg border border-dark-border rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all font-semibold"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white rounded-xl shadow-lg shadow-primary-500/20 transition-all font-bold flex items-center gap-2"
                                        >
                                            {isLoading && (
                                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            )}
                                            {initialData ? 'Save Changes' : 'Publish Course'}
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
