import { useState, useEffect } from 'react';
import { Search, Mail, MessageSquare, BookOpen, GraduationCap } from 'lucide-react';
import TeacherLayout from '../../../../components/layout/TeacherLayout';
import MessagingModal from '../../../../components/dashboard/messaging/MessagingModal';
import EmailModal from '../../../../components/dashboard/messaging/EmailModal';
import { toast, Toaster } from 'react-hot-toast';
import { UsersService, StudentProfile } from '../../../../services/users';

export default function TeacherStudents() {
    const [students, setStudents] = useState<StudentProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    // Modal States
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [isMsgModalOpen, setIsMsgModalOpen] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            setIsLoading(true);
            const data = await UsersService.getStudents();
            setStudents(data);
        } catch (error) {
            toast.error("Failed to load students");
        } finally {
            setIsLoading(false);
        }
    };

    const openMessage = (student: StudentProfile) => {
        setSelectedStudent({
            id: student.user.id,
            name: `${student.user.first_name || student.user.username} ${student.user.last_name || ''}`,
            email: student.user.email
        });
        setIsMsgModalOpen(true);
    };

    const openEmail = (student: StudentProfile) => {
        setSelectedStudent({
            id: student.user.id,
            name: `${student.user.first_name || student.user.username} ${student.user.last_name || ''}`,
            email: student.user.email
        });
        setIsEmailModalOpen(true);
    };

    // Filter Logic
    const filteredStudents = students.filter(student => {
        const fullName = `${student.user.first_name} ${student.user.last_name} ${student.user.username}`.toLowerCase();
        const matchesSearch = fullName.includes(searchQuery.toLowerCase()) ||
            student.roll_number.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    return (
        <TeacherLayout title="My Students">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">My Students</h1>
                    <p className="text-slate-500 dark:text-slate-400">Directory of students enrolled in your courses.</p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
                <div className="relative w-full md:w-96">
                    <input
                        type="text"
                        placeholder="Search by name or roll no..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                    <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                <div className="flex gap-2">
                    {['All', 'Active', 'At Risk'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === status
                                ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Students Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {isLoading ? (
                    <div className="col-span-full text-center py-12 italic text-slate-400">Loading students...</div>
                ) : filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                        <div key={student.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col items-center text-center hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group relative overflow-hidden shadow-sm">

                            {/* Status Indicator */}
                            <div className={`absolute top-4 right-4 text-xs font-bold px-2 py-1 rounded-full border bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20`}>
                                Active
                            </div>

                            {/* Avatar */}
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-white mb-4 shadow-lg shadow-indigo-500/20 ring-4 ring-slate-50 dark:ring-slate-900 group-hover:scale-110 transition-transform duration-300">
                                {student.user.first_name?.[0] || student.user.username[0]}
                            </div>

                            {/* Info */}
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 truncate w-full px-2">
                                {student.user.first_name} {student.user.last_name}
                                {!student.user.first_name && student.user.username}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-mono mb-4 bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-100 dark:border-slate-700">{student.roll_number}</p>

                            <div className="w-full space-y-3 mb-6">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                        <BookOpen className="w-4 h-4" />
                                        Dept
                                    </span>
                                    <span className="text-slate-700 dark:text-slate-200 font-medium truncate max-w-[120px]" title={student.department}>{student.department}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4" />
                                        Program
                                    </span>
                                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">{student.program}</span>
                                </div>
                                {/* Enrolled Courses */}
                                <div className="pt-2 border-t border-slate-100 dark:border-slate-700 w-full">
                                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2 text-left">Courses</p>
                                    <div className="flex flex-wrap gap-1">
                                        {student.enrolled_courses.length > 0 ? (
                                            student.enrolled_courses.map((course, idx) => (
                                                <span key={idx} className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] rounded-md font-medium border border-indigo-100 dark:border-indigo-500/20 truncate max-w-full">
                                                    {course}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-[10px] text-slate-400 italic">Not enrolled in any courses</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 w-full mt-auto">
                                <button
                                    onClick={() => openMessage(student)}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors shadow-lg shadow-indigo-600/20"
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    Message
                                </button>
                                <button
                                    onClick={() => openEmail(student)}
                                    className="p-2 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:border-indigo-300 dark:hover:border-slate-500 transition-colors"
                                >
                                    <Mail className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <p className="text-slate-500 dark:text-slate-400">No students found.</p>
                    </div>
                )}
            </div>

            {/* Modals */}
            <MessagingModal
                isOpen={isMsgModalOpen}
                onClose={() => setIsMsgModalOpen(false)}
                recipient={selectedStudent ? { id: selectedStudent.id, name: selectedStudent.name } : null}
            />

            <EmailModal
                isOpen={isEmailModalOpen}
                onClose={() => setIsEmailModalOpen(false)}
                recipient={selectedStudent ? { id: selectedStudent.id, name: selectedStudent.name, email: selectedStudent.email } : null}
            />

            <Toaster position="top-right" />
        </TeacherLayout>
    );
}
