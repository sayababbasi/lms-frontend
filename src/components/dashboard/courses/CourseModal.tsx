import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface CourseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    isLoading?: boolean;
    initialData?: any;
}

export default function CourseModal({ isOpen, onClose, onSubmit, isLoading, initialData }: CourseModalProps) {
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setValue('title', initialData.title);
                setValue('code', initialData.code);
                setValue('description', initialData.description);
                setPreviewImage(initialData.thumbnail);
            } else {
                reset();
                setPreviewImage(null);
            }
        }
    }, [isOpen, initialData, reset, setValue]);

    const handleFormSubmit = (data: any) => {
        onSubmit(data);
    };

    // Helper to handle image preview
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
                            <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-dark-surface border border-dark-border p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-bold leading-6 text-dark-text mb-4 flex justify-between items-center"
                                >
                                    <span>{initialData ? 'Edit Course' : 'Create New Course'}</span>
                                    <button onClick={onClose} className="text-slate-500 hover:text-dark-text">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </Dialog.Title>

                                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Course Thumbnail</label>
                                        <div className="flex items-center gap-4">
                                            {previewImage ? (
                                                <img src={previewImage} alt="Thumbnail preview" className="w-20 h-20 object-cover rounded-lg border border-dark-border" />
                                            ) : (
                                                <div className="w-20 h-20 bg-dark-bg border border-dark-border rounded-lg flex items-center justify-center text-slate-500">
                                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    {...register('thumbnail', { onChange: handleImageChange })}
                                                    className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-600 file:text-white hover:file:bg-primary-500"
                                                />
                                                <p className="text-xs text-slate-500 mt-1">Recommended size: 800x600px</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Course Code *</label>
                                        <input
                                            {...register('code', { required: 'Course Code is required' })}
                                            className={`w-full bg-dark-bg border ${errors.code ? 'border-red-500' : 'border-dark-border'} rounded-lg px-4 py-2 text-dark-text focus:outline-none focus:border-primary-500`}
                                            placeholder="e.g. CS101"
                                        />
                                        {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code.message as string}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Course Title *</label>
                                        <input
                                            {...register('title', { required: 'Title is required' })}
                                            className={`w-full bg-dark-bg border ${errors.title ? 'border-red-500' : 'border-dark-border'} rounded-lg px-4 py-2 text-dark-text focus:outline-none focus:border-primary-500`}
                                            placeholder="e.g. Introduction to Programming"
                                        />
                                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message as string}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                                        <textarea
                                            {...register('description')}
                                            rows={3}
                                            className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:outline-none focus:border-primary-500"
                                            placeholder="Brief overview of the course content..."
                                        />
                                    </div>

                                    <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-dark-border">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-slate-600 hover:text-dark-text transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors flex items-center gap-2"
                                        >
                                            {isLoading && (
                                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            )}
                                            {initialData ? 'Update Course' : 'Create Course'}
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
