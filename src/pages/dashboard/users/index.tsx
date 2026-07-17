import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { UsersService } from '../../../services/users.service';
import UserModal from '../../../components/dashboard/users/UserModal';
import PasswordGeneratorModal from '../../../components/dashboard/users/PasswordGeneratorModal';

export default function UsersPage() {
    const [activeTab, setActiveTab] = useState<'students' | 'teachers' | 'staff'>('students');
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);

    const [editingUser, setEditingUser] = useState<any>(null);

    useEffect(() => {
        loadUsers();
    }, [activeTab]);

    const loadUsers = async () => {
        setLoading(true);
        try {
            let data;
            if (activeTab === 'students') data = await UsersService.getStudents() as any;
            else if (activeTab === 'teachers') data = await UsersService.getTeachers() as any;
            else if (activeTab === 'staff') data = await UsersService.getStaff() as any;

            // Handle pagination or straight array (assuming DRF returns { results: [], ... } or [])
            setUsers(Array.isArray(data) ? data : data.results || []);
        } catch (error) {
            console.error("Failed to load users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrUpdateUser = async (data: any) => {
        setLoading(true);
        try {
            // Data structure from modal is { user: { first_name, ... }, ... }
            const firstName = data.user?.first_name || data.first_name || '';
            const lastName = data.user?.last_name || data.last_name || '';
            let userName = `${firstName} ${lastName}`.trim() || 'User';

            if (editingUser) {
                // Update Logic
                if (activeTab === 'students') await UsersService.updateStudent(editingUser.id, data);
                else if (activeTab === 'teachers') await UsersService.updateTeacher(editingUser.id, data);
                else if (activeTab === 'staff') await UsersService.updateStaff(editingUser.id, data);
                toast.success(`${userName} updated successfully`);
            } else {
                // Create Logic
                let responseData;
                if (activeTab === 'students') responseData = await UsersService.createStudent(data);
                else if (activeTab === 'teachers') responseData = await UsersService.createTeacher(data);
                else if (activeTab === 'staff') responseData = await UsersService.createStaff(data);
                toast.success(`${userName} created successfully`);

                if (responseData?.user?.temporary_password) {
                    setGeneratedPassword(responseData.user.temporary_password);
                }
            }

            setIsModalOpen(false);
            setEditingUser(null);
            loadUsers(); // Refresh list
        } catch (error: any) {
            console.warn("API Validation Error occurred during save");
            let message = "Failed to save user. Please check inputs.";
            if (error.response?.data) {
                const data = error.response.data;
                if (typeof data === 'string') {
                    message = data;
                } else if (data.detail) {
                    message = data.detail;
                } else {
                    // Extract first validation error recursively
                    const getFirstError = (obj: any): string => {
                        for (const key in obj) {
                            if (Array.isArray(obj[key])) return `${key.charAt(0).toUpperCase() + key.slice(1)}: ${obj[key][0]}`;
                            if (typeof obj[key] === 'object' && obj[key] !== null) return getFirstError(obj[key]);
                            return `${key}: ${obj[key]}`;
                        }
                        return "Unknown validation error";
                    };
                    message = getFirstError(data);
                }
            }
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (user: any) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleDeleteUser = async (id: number) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            if (activeTab === 'students') await UsersService.deleteStudent(id);
            else if (activeTab === 'teachers') await UsersService.deleteTeacher(id);
            else if (activeTab === 'staff') await UsersService.deleteStaff(id);
            toast.success("User deleted successfully");
            loadUsers();
        } catch (error) {
            console.error("Failed to delete user", error);
            toast.error("Failed to delete user.");
        }
    }

    const openCreateModal = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const getRole = () => {
        if (activeTab === 'students') return 'student';
        if (activeTab === 'teachers') return 'teacher';
        return 'staff';
    };

    return (
        <DashboardLayout title="User Management">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-dark-text">User Management</h1>
                    <p className="text-slate-500 mt-1">Manage students, teachers, and staff members.</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg shadow-lg shadow-primary-500/20 transition-all flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-dark-border mb-6">
                {['students', 'teachers', 'staff'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`pb-3 px-2 font-medium capitalize transition-all border-b-2 ${activeTab === tab
                            ? 'text-primary-600 border-primary-600'
                            : 'text-slate-500 border-transparent hover:text-dark-text hover:border-slate-600'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-dark-surface/50 backdrop-blur-md border border-dark-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-dark-surface border-b border-dark-border text-slate-500 text-sm uppercase tracking-wider">
                                <th className="p-4 font-medium">Name</th>
                                <th className="p-4 font-medium">Email</th>
                                <th className="p-4 font-medium">Role</th>
                                <th className="p-4 font-medium">Status & Security</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">Loading...</td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">No users found.</td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
                                                    {(user.user?.first_name?.[0] || user.user?.username?.[0] || 'U').toUpperCase()}
                                                </div>
                                                <span className="font-medium text-dark-text">{user.user?.first_name} {user.user?.last_name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-600 font-medium">{user.user?.email}</td>
                                        <td className="p-4 text-slate-600 capitalize">{activeTab.slice(0, -1)}</td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1 items-start">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${user.user?.is_active ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                                    {user.user?.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${
                                                    user.user?.password_status === 'ACTIVE' || user.user?.password_status === 'PERMANENT' 
                                                        ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20' 
                                                        : user.user?.password_status === 'LOCKED'
                                                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                            : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                                }`}>
                                                    {user.user?.password_status ? `PWD: ${user.user.password_status}` : 'PWD: UNKNOWN'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleEditClick(user)}
                                                className="text-primary-400 hover:text-primary-300 mr-3"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <UserModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleCreateOrUpdateUser}
                    role={activeTab === 'staff' ? 'staff' : (activeTab === 'teachers' ? 'teacher' : 'student')}
                    isLoading={loading}
                    initialData={editingUser}
                />
            )}

            <PasswordGeneratorModal
                isOpen={!!generatedPassword}
                onClose={() => setGeneratedPassword(null)}
                password={generatedPassword || ''}
                onGenerateAgain={async () => {
                    toast.error("To generate again, edit the user and force a reset.");
                }}
            />
        </DashboardLayout>
    );
}
