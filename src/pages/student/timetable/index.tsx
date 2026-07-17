import React, { useEffect, useState } from 'react';
import StudentLayout from '../../../components/layout/StudentLayout';
import { TimetableService, TimeSlot } from '../../../services/timetable.service';
import { Calendar, Clock, MapPin, User, ChevronLeft, ChevronRight } from 'lucide-react';

type ViewMode = 'day' | 'week' | 'month';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Professional color palette for courses
const COURSE_COLORS = [
    { bg: 'bg-indigo-500', light: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-600 dark:text-indigo-400' },
    { bg: 'bg-emerald-500', light: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400' },
    { bg: 'bg-amber-500', light: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400' },
    { bg: 'bg-rose-500', light: 'bg-rose-50 dark:bg-rose-900/20', text: 'text-rose-600 dark:text-rose-400' },
    { bg: 'bg-cyan-500', light: 'bg-cyan-50 dark:bg-cyan-900/20', text: 'text-cyan-600 dark:text-cyan-400' },
    { bg: 'bg-violet-500', light: 'bg-violet-50 dark:bg-violet-900/20', text: 'text-violet-600 dark:text-violet-400' },
];

export default function StudentTimetablePage() {
    const [viewMode, setViewMode] = useState<ViewMode>('week');
    const [timetable, setTimetable] = useState<TimeSlot[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [courseColorMap, setCourseColorMap] = useState<Record<number, typeof COURSE_COLORS[0]>>({});

    useEffect(() => {
        fetchTimetable();
    }, []);

    useEffect(() => {
        // Assign unique colors to each course
        const colorMap: Record<number, typeof COURSE_COLORS[0]> = {};
        const seenCourses = new Set<number>();
        timetable.forEach(slot => {
            if (!seenCourses.has(slot.course)) {
                colorMap[slot.course] = COURSE_COLORS[seenCourses.size % COURSE_COLORS.length];
                seenCourses.add(slot.course);
            }
        });
        setCourseColorMap(colorMap);
    }, [timetable]);

    const fetchTimetable = async () => {
        setLoading(true);
        try {
            const data = await TimetableService.getTimetable();
            setTimetable(Array.isArray(data) ? data : (data as any).results || []);
        } catch (error) {
            console.error("Failed to fetch timetable", error);
        } finally {
            setLoading(false);
        }
    };

    const getDayName = (date: Date) => DAYS[(date.getDay() + 6) % 7] || 'Sunday';
    const filterByDay = (dayName: string) => timetable.filter(slot => slot.day === dayName);
    const getColor = (courseId: number) => courseColorMap[courseId] || COURSE_COLORS[0];

    return (
        <StudentLayout title="Timetable">
            {/* Header */}
            <div className="mb-10">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Class Schedule</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Your weekly academic timetable</p>
                    </div>

                    {/* View Toggle */}
                    <div className="inline-flex bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-lg p-1 shadow-sm">
                        {(['day', 'week', 'month'] as ViewMode[]).map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${viewMode === mode
                                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                {mode.charAt(0).toUpperCase() + mode.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32">
                    <div className="w-8 h-8 border-2 border-slate-200 dark:border-slate-700 border-t-primary-600 rounded-full animate-spin"></div>
                    <p className="mt-4 text-sm text-slate-500">Loading schedule...</p>
                </div>
            ) : (
                <>
                    {viewMode === 'day' && (
                        <DayView
                            timetable={filterByDay(getDayName(selectedDate))}
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            getColor={getColor}
                        />
                    )}
                    {viewMode === 'week' && <WeekView timetable={timetable} getColor={getColor} />}
                    {viewMode === 'month' && (
                        <MonthView
                            timetable={timetable}
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            getColor={getColor}
                        />
                    )}
                </>
            )}
        </StudentLayout>
    );
}

interface ViewProps {
    timetable: TimeSlot[];
    getColor: (courseId: number) => typeof COURSE_COLORS[0];
}

interface DayViewProps extends ViewProps {
    selectedDate: Date;
    setSelectedDate: (d: Date) => void;
}

function DayView({ timetable, selectedDate, setSelectedDate, getColor }: DayViewProps) {
    const navigateDay = (offset: number) => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() + offset);
        setSelectedDate(d);
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Date Navigator */}
            <div className="flex items-center justify-between mb-8 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl p-4">
                <button onClick={() => navigateDay(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                    <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
                <div className="text-center">
                    <p className="text-xl font-semibold text-slate-900 dark:text-white">
                        {selectedDate.toLocaleDateString(undefined, { weekday: 'long' })}
                    </p>
                    <p className="text-sm text-slate-500">
                        {selectedDate.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>
                <button onClick={() => navigateDay(1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                    <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
            </div>

            {timetable.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 dark:bg-dark-card/50 border border-dashed border-slate-200 dark:border-dark-border rounded-xl">
                    <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                    <p className="text-lg font-medium text-slate-500 dark:text-slate-400">No classes scheduled</p>
                    <p className="text-sm text-slate-400 mt-1">Enjoy your free day!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {timetable.sort((a, b) => a.start_time.localeCompare(b.start_time)).map((slot) => {
                        const color = getColor(slot.course);
                        return (
                            <div key={slot.id} className="flex bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                                <div className={`w-1.5 ${color.bg}`}></div>
                                <div className="flex-1 p-5">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-slate-900 dark:text-white">{slot.course_title}</h3>
                                            <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                                                <User className="w-3.5 h-3.5" /> {slot.teacher_name}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-sm font-medium ${color.text}`}>{slot.start_time} - {slot.end_time}</p>
                                            <p className="text-xs text-slate-400 mt-1 flex items-center justify-end gap-1">
                                                <MapPin className="w-3 h-3" /> {slot.room_number || 'TBA'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function WeekView({ timetable, getColor }: ViewProps) {
    return (
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <div className="min-w-[900px]">
                    {/* Header Row */}
                    <div className="grid grid-cols-6 border-b border-slate-200 dark:border-dark-border">
                        {DAYS.map((day, idx) => (
                            <div key={day} className={`p-4 text-center ${idx > 0 ? 'border-l border-slate-200 dark:border-dark-border' : ''}`}>
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{day.substring(0, 3)}</p>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">{day}</p>
                            </div>
                        ))}
                    </div>

                    {/* Content Row */}
                    <div className="grid grid-cols-6 min-h-[400px]">
                        {DAYS.map((day, idx) => {
                            const daySlots = timetable.filter(s => s.day === day).sort((a, b) => a.start_time.localeCompare(b.start_time));
                            return (
                                <div key={day} className={`p-3 ${idx > 0 ? 'border-l border-slate-200 dark:border-dark-border' : ''}`}>
                                    {daySlots.length === 0 ? (
                                        <p className="text-center text-sm text-slate-300 dark:text-slate-700 py-8 italic">No classes</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {daySlots.map((slot) => {
                                                const color = getColor(slot.course);
                                                return (
                                                    <div key={slot.id} className={`p-3 rounded-lg ${color.bg} text-white shadow-sm hover:shadow-md transition-shadow cursor-pointer`}>
                                                        <p className="text-[10px] font-medium opacity-80">{slot.start_time}</p>
                                                        <p className="text-sm font-semibold leading-tight mt-0.5 line-clamp-2">{slot.course_title}</p>
                                                        <p className="text-[10px] mt-2 opacity-70 flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" /> {slot.room_number || 'TBA'}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

function MonthView({ timetable, selectedDate, setSelectedDate, getColor }: DayViewProps) {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startingBlankDays = (firstDayOfMonth + 6) % 7;
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const getDayNameForDate = (d: Date) => DAYS[(d.getDay() + 6) % 7] || 'Sunday';

    return (
        <div className="bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl overflow-hidden">
            {/* Month Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-dark-border">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {selectedDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex items-center gap-1">
                    <button onClick={() => setSelectedDate(new Date(year, month - 1, 1))} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    </button>
                    <button onClick={() => setSelectedDate(new Date())} className="px-3 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/10 rounded-lg transition-colors">
                        Today
                    </button>
                    <button onClick={() => setSelectedDate(new Date(year, month + 1, 1))} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    </button>
                </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 border-b border-slate-200 dark:border-dark-border">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <div key={day} className="p-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
                {Array.from({ length: startingBlankDays }).map((_, i) => (
                    <div key={`blank-${i}`} className="min-h-[100px] p-2 bg-slate-50/50 dark:bg-slate-900/20 border-b border-r border-slate-100 dark:border-slate-800"></div>
                ))}
                {days.map(day => {
                    const date = new Date(year, month, day);
                    const dayName = getDayNameForDate(date);
                    const daySlots = timetable.filter(s => s.day === dayName);
                    const isToday = new Date().toDateString() === date.toDateString();

                    return (
                        <div key={day} className={`min-h-[100px] p-2 border-b border-r border-slate-100 dark:border-slate-800 ${isToday ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}>
                            <span className={`inline-block text-sm font-medium mb-2 w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-primary-600 text-white' : 'text-slate-500'}`}>
                                {day}
                            </span>
                            <div className="space-y-1">
                                {daySlots.slice(0, 2).map(slot => {
                                    const color = getColor(slot.course);
                                    return (
                                        <div key={slot.id} className={`text-[10px] px-1.5 py-0.5 rounded ${color.bg} text-white truncate`}>
                                            {slot.start_time} {slot.course_title}
                                        </div>
                                    );
                                })}
                                {daySlots.length > 2 && (
                                    <p className="text-[10px] text-slate-400 pl-1">+{daySlots.length - 2} more</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
