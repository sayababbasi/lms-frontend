import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Eye, EyeOff } from 'lucide-react';

type UserRole = 'student' | 'teacher' | 'staff';

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    role: UserRole;
    isLoading?: boolean;
    initialData?: any;
}

export default function UserModal({ isOpen, onClose, onSubmit, role, isLoading, initialData }: UserModalProps) {
    const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm();
    const [activeTab, setActiveTab] = useState<'account' | 'profile'>('account');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                // Populate form with initial data
                // initialData structure: { id, user: { username, email, ... }, department, ... }

                // Account fields
                setValue('password', '');
                setValue('first_name', initialData.user?.first_name);
                setValue('last_name', initialData.user?.last_name);
                setValue('username', initialData.user?.username);
                setValue('email', initialData.user?.email);
                setValue('phone', initialData.user?.phone);
                setValue('address', initialData.user?.address);
                setValue('cnic', initialData.user?.cnic);
                setValue('gender', initialData.user?.gender);
                setValue('date_of_birth', initialData.user?.date_of_birth);

                // Profile fields
                setValue('roll_number', initialData.roll_number);
                setValue('department', initialData.department);
                setValue('program', initialData.program);
                setValue('semester', initialData.semester);
                setValue('section', initialData.section);
                setValue('admission_date', initialData.admission_date);
                setValue('guardian_name', initialData.guardian_name);
                setValue('guardian_contact', initialData.guardian_contact);

                setValue('designation', initialData.designation);
                setValue('qualification', initialData.qualification);
                setValue('specialization', initialData.specialization);
                setValue('joining_date', initialData.joining_date);
                setValue('role', initialData.role);

                setActiveTab('account');
            } else {
                reset();
                setActiveTab('account');
            }
        }
    }, [isOpen, initialData, reset, setValue]);

    const handleFormSubmit = (data: any) => {
        // Construct the payload structure expected by backend (User + Profile)
        const formatDate = (date: any) => {
            if (!date) return null;
            if (typeof date === 'string') return date;
            const d = new Date(date);
            const offset = d.getTimezoneOffset();
            const adjustedDate = new Date(d.getTime() - (offset * 60 * 1000));
            return !isNaN(adjustedDate.getTime()) ? adjustedDate.toISOString().split('T')[0] : null;
        };

        const userPayload: any = {
            username: data.username,
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
            phone: data.phone,
            address: data.address,
            gender: data.gender,
            date_of_birth: formatDate(data.date_of_birth),
            cnic: data.cnic,
        };

        if (data.password) {
            userPayload.password = data.password;
        }

        const profilePayload = {
            ...data, 
            admission_date: formatDate(data.admission_date),
            joining_date: formatDate(data.joining_date),
            user: userPayload 
        };

        // Cleanup user fields from root profilePayload
        delete profilePayload.username;
        delete profilePayload.email;
        delete profilePayload.password;
        delete profilePayload.first_name;
        delete profilePayload.last_name;
        delete profilePayload.phone;
        delete profilePayload.address;
        delete profilePayload.gender;
        delete profilePayload.date_of_birth;
        delete profilePayload.cnic;

        onSubmit(profilePayload);
    };

    const onErrors = (errors: any) => {
        // If errors exist in account fields, switch to account tab
        const accountFields = ['first_name', 'last_name', 'username', 'email', 'phone', 'address', 'cnic', 'gender', 'date_of_birth'];
        const hasAccountError = accountFields.some(field => errors[field]);
        if (hasAccountError) {
            setActiveTab('account');
            toast.error("Please fill in all required fields in the Account Details tab.");
        } else {
            setActiveTab('profile');
            toast.error(`Please fill in all required fields in the ${role.charAt(0).toUpperCase() + role.slice(1)} Profile tab.`);
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
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-dark-surface border border-dark-border p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-bold leading-6 text-dark-text mb-4 flex justify-between items-center"
                                >
                                    <span>{initialData ? 'Edit' : 'Add New'} {role.charAt(0).toUpperCase() + role.slice(1)}</span>
                                    <button onClick={onClose} className="text-slate-500 hover:text-dark-text">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </Dialog.Title>

                                {/* Tabs */}
                                <div className="flex space-x-4 border-b border-dark-border mb-6">
                                    <button
                                        onClick={() => setActiveTab('account')}
                                        className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'account' ? 'border-primary-500 text-primary-400' : 'border-transparent text-slate-400 hover:text-white'}`}
                                    >
                                        Account Details
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('profile')}
                                        className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === 'profile' ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:text-dark-text'}`}
                                    >
                                        {role.charAt(0).toUpperCase() + role.slice(1)} Profile
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit(handleFormSubmit, (errors) => {
                                    console.log("Form validation errors:", errors);
                                    toast.error("Validation failed! Please check both the 'Account Details' and 'Profile' tabs for missing required fields.");
                                })} className="flex flex-col h-[calc(100%-80px)]">

                                    {/* Account Details Tab */}
                                    <div className={activeTab === 'account' ? 'block space-y-4' : 'hidden'}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">First Name *</label>
                                                <input {...register('first_name', { required: 'First name is required' })} className={`w-full bg-dark-bg border ${errors.first_name ? 'border-red-500' : 'border-dark-border'} rounded-lg px-4 py-2 text-dark-text focus:outline-none focus:border-primary-500`} />
                                                {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name.message as string}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Last Name *</label>
                                                <input {...register('last_name', { required: 'Last name is required' })} className={`w-full bg-dark-bg border ${errors.last_name ? 'border-red-500' : 'border-dark-border'} rounded-lg px-4 py-2 text-dark-text focus:outline-none focus:border-primary-500`} />
                                                {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name.message as string}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Username *</label>
                                                <input {...register('username', { required: 'Username is required' })} className={`w-full bg-dark-bg border ${errors.username ? 'border-red-500' : 'border-dark-border'} rounded-lg px-4 py-2 text-dark-text focus:outline-none focus:border-primary-500`} />
                                                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message as string}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email *</label>
                                                <input type="email" {...register('email', { required: 'Email is required' })} className={`w-full bg-dark-bg border ${errors.email ? 'border-red-500' : 'border-dark-border'} rounded-lg px-4 py-2 text-dark-text focus:outline-none focus:border-primary-500`} />
                                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
                                            </div>
                                            {initialData ? (
                                                <div className="md:col-span-2 mt-2">
                                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Set New Password (Optional)</label>
                                                    <div className="flex space-x-2">
                                                        <div className="relative flex-grow">
                                                            <input 
                                                                type={showPassword ? "text" : "password"} 
                                                                placeholder="Leave blank to keep current" 
                                                                {...register('password')} 
                                                                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:outline-none focus:border-primary-500 pr-10"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowPassword(!showPassword)}
                                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                                            >
                                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                            </button>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
                                                                let newPass = "";
                                                                // Ensure enterprise policy: 8 chars, 1 upper, 1 lower, 1 num, 1 special
                                                                newPass += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
                                                                newPass += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
                                                                newPass += "0123456789"[Math.floor(Math.random() * 10)];
                                                                newPass += "!@#$%^&*"[Math.floor(Math.random() * 8)];
                                                                for (let i = 0; i < 4; i++) {
                                                                    newPass += chars[Math.floor(Math.random() * chars.length)];
                                                                }
                                                                // Shuffle
                                                                newPass = newPass.split('').sort(() => 0.5 - Math.random()).join('');
                                                                setValue('password', newPass);
                                                                setShowPassword(true);
                                                            }}
                                                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                                        >
                                                            Generate
                                                        </button>
                                                    </div>
                                                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>}
                                                </div>
                                            ) : (
                                                <div className="md:col-span-2 mt-2 bg-primary-500/10 border border-primary-500/20 rounded-lg p-3">
                                                    <p className="text-sm text-primary-400">
                                                        <strong>Secure Password:</strong> A temporary secure password will be automatically generated and displayed after you click Create User.
                                                    </p>
                                                </div>
                                            )}

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Address</label>
                                                <textarea {...register('address')} rows={2} className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:outline-none focus:border-primary-500" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                                                <input {...register('phone')} className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:outline-none focus:border-primary-500" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">CNIC</label>
                                                <input {...register('cnic')} className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:outline-none focus:border-primary-500" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Gender</label>
                                                <select {...register('gender')} className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:outline-none focus:border-primary-500">
                                                    <option value="">Select Gender</option>
                                                    <option value="M">Male</option>
                                                    <option value="F">Female</option>
                                                    <option value="O">Other</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date of Birth</label>
                                                <Controller
                                                    control={control}
                                                    name="date_of_birth"
                                                    render={({ field }) => (
                                                        <DatePicker
                                                            selected={field.value ? new Date(field.value) : null}
                                                            onChange={(date) => field.onChange(date)}
                                                            className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:outline-none focus:border-primary-500"
                                                            placeholderText="Select Date"
                                                            showYearDropdown
                                                            showMonthDropdown
                                                            dropdownMode="select"
                                                            yearDropdownItemNumber={100}
                                                            scrollableYearDropdown
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Profile Details Tab */}
                                    <div className={activeTab === 'profile' ? 'block space-y-4' : 'hidden'}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {role === 'student' && (
                                                <>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Roll Number *</label>
                                                        <input {...register('roll_number', { required: 'Roll Number is required' })} className={`w-full bg-dark-bg border ${errors.roll_number ? 'border-red-500' : 'border-dark-border'} rounded-lg px-4 py-2 text-dark-text focus:outline-none focus:border-primary-500`} />
                                                        {errors.roll_number && <p className="text-red-500 text-xs mt-1">{errors.roll_number.message as string}</p>}
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Department *</label>
                                                        <input {...register('department', { required: 'Department is required' })} className={`w-full bg-dark-bg border ${errors.department ? 'border-red-500' : 'border-dark-border'} rounded-lg px-4 py-2 text-dark-text focus:outline-none focus:border-primary-500`} />
                                                        {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department.message as string}</p>}
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Program</label>
                                                        <input {...register('program')} className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:outline-none focus:border-primary-500" placeholder="e.g. BSCS" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Semester</label>
                                                        <input {...register('semester')} className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:outline-none focus:border-primary-500" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Section</label>
                                                        <input {...register('section')} className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:outline-none focus:border-primary-500" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Admission Date</label>
                                                        <Controller
                                                            control={control}
                                                            name="admission_date"
                                                            render={({ field }) => (
                                                                <DatePicker
                                                                    selected={field.value ? new Date(field.value) : null}
                                                                    onChange={(date) => field.onChange(date)}
                                                                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:outline-none focus:border-primary-500"
                                                                    placeholderText="Select Date"
                                                                    showYearDropdown
                                                                    showMonthDropdown
                                                                    dropdownMode="select"
                                                                    yearDropdownItemNumber={50}
                                                                    scrollableYearDropdown
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Guardian Name</label>
                                                        <input {...register('guardian_name')} className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:outline-none focus:border-primary-500" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Guardian Contact</label>
                                                        <input {...register('guardian_contact')} className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:outline-none focus:border-primary-500" />
                                                    </div>
                                                </>
                                            )}

                                            {role === 'teacher' && (
                                                <>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Department *</label>
                                                        <input {...register('department', { required: 'Department is required' })} className={`w-full bg-dark-bg border ${errors.department ? 'border-red-500' : 'border-dark-border'} rounded-lg px-4 py-2 text-dark-text focus:outline-none focus:border-primary-500`} />
                                                        {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department.message as string}</p>}
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Designation</label>
                                                        <input {...register('designation')} className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:outline-none focus:border-primary-500" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Qualification</label>
                                                        <input {...register('qualification')} className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:outline-none focus:border-primary-500" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Specialization</label>
                                                        <input {...register('specialization')} className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:outline-none focus:border-primary-500" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Joining Date</label>
                                                        <Controller
                                                            control={control}
                                                            name="joining_date"
                                                            render={({ field }) => (
                                                                <DatePicker
                                                                    selected={field.value ? new Date(field.value) : null}
                                                                    onChange={(date) => field.onChange(date)}
                                                                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:outline-none focus:border-primary-500"
                                                                    placeholderText="Select Date"
                                                                    showYearDropdown
                                                                    showMonthDropdown
                                                                    dropdownMode="select"
                                                                    yearDropdownItemNumber={50}
                                                                    scrollableYearDropdown
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                </>
                                            )}

                                            {role === 'staff' && (
                                                <>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Job Role *</label>
                                                        <input {...register('role', { required: 'Job Role is required' })} className={`w-full bg-dark-bg border ${errors.role ? 'border-red-500' : 'border-dark-border'} rounded-lg px-4 py-2 text-dark-text focus:outline-none focus:border-primary-500`} placeholder="e.g. Accountant" />
                                                        {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message as string}</p>}
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Designation</label>
                                                        <input {...register('designation')} className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:outline-none focus:border-primary-500" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Joining Date</label>
                                                        <Controller
                                                            control={control}
                                                            name="joining_date"
                                                            render={({ field }) => (
                                                                <DatePicker
                                                                    selected={field.value ? new Date(field.value) : null}
                                                                    onChange={(date) => field.onChange(date)}
                                                                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:outline-none focus:border-primary-500"
                                                                    placeholderText="Select Date"
                                                                    showYearDropdown
                                                                    showMonthDropdown
                                                                    dropdownMode="select"
                                                                    yearDropdownItemNumber={50}
                                                                    scrollableYearDropdown
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-dark-border">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-slate-600 hover:text-dark-text transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        {activeTab === 'account' ? (
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab('profile')}
                                                className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors flex items-center gap-2"
                                            >
                                                Next
                                            </button>
                                        ) : (
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors flex items-center gap-2"
                                            >
                                                {isLoading ? (
                                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                ) : (
                                                    initialData ? 'Update User' : 'Create User'
                                                )}
                                            </button>
                                        )}
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
