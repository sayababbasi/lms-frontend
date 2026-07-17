import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { TimetableService } from '../../../services/timetable.service';
import { CoursesService } from '../../../services/courses.service';
import toast from 'react-hot-toast';

export default function TimetablePage() {
    const [timetable, setTimetable] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [day, setDay] = useState('Monday');

    // Add Class State
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [courses, setCourses] = useState<any[]>([]);
    const [newClass, setNewClass] = useState({
        course: '',
        day: 'Monday',
        start_time: '',
        end_time: '',
        room_number: ''
    });

    useEffect(() => {
        loadTimetable();
    }, [day]);

    useEffect(() => {
        if (showModal) {
            loadCourses();
        }
    }, [showModal]);

    const loadTimetable = async () => {
        setLoading(true);
        try {
            const data = await TimetableService.getTimetable(day) as any;
            setTimetable(Array.isArray(data) ? data : data.results || []);
        } catch (error) {
            console.error("Failed to load timetable", error);
            toast.error("Failed to load schedule");
        } finally {
            setLoading(false);
        }
    };

    const loadCourses = async () => {
        try {
            const data = await CoursesService.getAll() as any;
            setCourses(Array.isArray(data) ? data : data.results || []);
        } catch (error) {
            console.error("Failed to load courses", error);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await TimetableService.createClass(newClass);
            toast.success("Class scheduled successfully");
            setShowModal(false);
            setNewClass({ course: '', day: day, start_time: '', end_time: '', room_number: '' });
            loadTimetable();
        } catch (error) {
            console.error("Failed to schedule class", error);
            toast.error("Failed to schedule class");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to remove this class?")) return;
        try {
            await TimetableService.deleteClass(id);
            toast.success("Class removed");
            loadTimetable();
        } catch (error) {
            toast.error("Failed to remove class");
        }
    };

    return (
        <DashboardLayout title="Timetable">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-dark-text">Timetable</h1>
                    <p className="text-slate-600 mt-1">Class schedules and timings.</p>
                </div>
                <button
                    onClick={() => {
                        setNewClass(prev => ({ ...prev, day: day })); // Pre-select current day
                        setShowModal(true);
                    }}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg shadow-lg shadow-primary-500/20 transition-all flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Add Class
                </button>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((d) => (
                    <button
                        key={d}
                        onClick={() => setDay(d)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${day === d
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                            : 'bg-dark-card border border-dark-border text-slate-600 hover:text-dark-text hover:border-slate-500'
                            }`}
                    >
                        {d}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [1, 2, 3].map(n => <div key={n} className="h-40 bg-dark-card rounded-xl animate-pulse"></div>)
                ) : timetable.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-slate-500 bg-dark-card/50 rounded-xl border border-dashed border-dark-border">
                        <svg className="w-16 h-16 mx-auto mb-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <p className="text-lg text-slate-600">No classes scheduled for {day}.</p>
                        <button onClick={() => setShowModal(true)} className="mt-2 text-primary-400 hover:text-white underline">Schedule a class</button>
                    </div>
                ) : (
                    timetable.map((slot) => (
                        <div key={slot.id} className="bg-dark-card border border-dark-border rounded-xl p-6 hover:border-primary-500/50 transition-colors border-l-4 border-l-primary-500 relative group">
                            <button
                                onClick={() => handleDelete(slot.id)}
                                className="absolute top-4 right-4 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Remove Class"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>

                            <div className="flex justify-between items-start mb-2 pr-6">
                                <h3 className="text-xl font-bold text-dark-text">{slot.course_title}</h3>
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="bg-primary-500/10 text-primary-400 px-2 py-1 rounded text-sm font-mono font-bold border border-primary-500/20">
                                    {slot.start_time} - {slot.end_time}
                                </span>
                            </div>

                            <div className="space-y-2 text-sm text-slate-600">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                    <span>Room: <span className="text-slate-700 font-medium">{slot.room_number || 'TBA'}</span></span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    <span className="text-slate-700 font-medium">{slot.teacher_name}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Class Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-dark-card border border-dark-border rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-dark-border flex justify-between items-center bg-dark-surface">
                            <h3 className="text-xl font-bold text-dark-text">Schedule New Class</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-600 hover:text-dark-text">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="p-6 space-y-4 bg-dark-card">
                            <div>
                                <label className="block text-sm text-slate-600 mb-1">Course *</label>
                                <select
                                    required
                                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-dark-text focus:outline-none focus:border-primary-500"
                                    value={newClass.course}
                                    onChange={e => setNewClass({ ...newClass, course: e.target.value })}
                                >
                                    <option value="">Select Course</option>
                                    {courses.map(c => (
                                        <option key={c.id} value={c.id}>{c.title} ({c.code})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-slate-600 mb-1">Day *</label>
                                    <select
                                        required
                                        className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-dark-text focus:outline-none focus:border-primary-500"
                                        value={newClass.day}
                                        onChange={e => setNewClass({ ...newClass, day: e.target.value })}
                                    >
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-600 mb-1">Room Number</label>
                                    <input
                                        type="text"
                                        className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-dark-text focus:outline-none focus:border-primary-500"
                                        value={newClass.room_number}
                                        onChange={e => setNewClass({ ...newClass, room_number: e.target.value })}
                                        placeholder="e.g. 301"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-slate-600 mb-1">Start Time *</label>
                                    <input
                                        type="time"
                                        required
                                        className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-dark-text focus:outline-none focus:border-primary-500"
                                        value={newClass.start_time}
                                        onChange={e => setNewClass({ ...newClass, start_time: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-600 mb-1">End Time *</label>
                                    <input
                                        type="time"
                                        required
                                        className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-dark-text focus:outline-none focus:border-primary-500"
                                        value={newClass.end_time}
                                        onChange={e => setNewClass({ ...newClass, end_time: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-slate-600 hover:text-dark-text"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-medium shadow-lg shadow-primary-500/20 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {submitting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                                    Schedule
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
