import { useState } from 'react';
import TeacherLayout from '../../../../components/layout/TeacherLayout';
import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight, Download } from 'lucide-react';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const times = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

const scheduleData = [
    {
        id: 1,
        course: 'CS-101 Intro to CS',
        day: 'Monday',
        time: '09:00',
        duration: 2, // hours
        room: 'Lecture Hall 1',
        type: 'Lecture',
        color: 'bg-indigo-600'
    },
    {
        id: 2,
        course: 'CS-201 Data Structures',
        day: 'Monday',
        time: '11:00',
        duration: 1.5,
        room: 'Lab 3',
        type: 'Lab',
        color: 'bg-purple-600'
    },
    {
        id: 3,
        course: 'SE-301 Web Engineering',
        day: 'Tuesday',
        time: '10:00',
        duration: 1.5,
        room: 'Room 304',
        type: 'Lecture',
        color: 'bg-emerald-600'
    },
    {
        id: 4,
        course: 'CS-101 Intro to CS',
        day: 'Wednesday',
        time: '09:00',
        duration: 2,
        room: 'Lecture Hall 1',
        type: 'Lecture',
        color: 'bg-indigo-600'
    },
    {
        id: 5,
        course: 'Consultation Hours',
        day: 'Thursday',
        time: '14:00',
        duration: 2,
        room: 'Faculty Office',
        type: 'Support',
        color: 'bg-amber-600'
    }
];

export default function TeacherSchedule() {
    const [currentWeek] = useState(new Date());

    return (
        <TeacherLayout title="Schedule">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Weekly Timetable</h1>
                    <p className="text-slate-500 dark:text-slate-400">View your class schedule and upcoming events.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border text-slate-600 dark:text-slate-300 rounded-lg hover:text-indigo-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-all shadow-sm">
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                </button>
            </div>

            <div className="bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border rounded-xl overflow-hidden shadow-sm">
                {/* Calendar Header */}
                <div className="p-4 border-b border-slate-200 dark:border-dark-border flex items-center justify-between bg-slate-50 dark:bg-dark-bg">
                    <button className="p-2 hover:bg-white dark:hover:bg-white/5 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                        Week of {currentWeek.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </h2>
                    <button className="p-2 hover:bg-white dark:hover:bg-white/5 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Calendar Grid */}
                <div className="overflow-x-auto">
                    <div className="min-w-[1000px]">
                        {/* Days Header */}
                        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-surface/50">
                            <div className="p-4 text-center border-r border-slate-200 dark:border-dark-border text-slate-500 font-medium bg-slate-100 dark:bg-dark-bg/30">Time</div>
                            {days.map(day => (
                                <div key={day} className="p-4 text-center border-r border-slate-200 dark:border-dark-border last:border-r-0 font-bold text-slate-700 dark:text-slate-300">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Time Slots */}
                        <div className="relative">
                            {times.map((time) => (
                                <div key={time} className="grid grid-cols-7 border-b border-slate-200 dark:border-dark-border h-24">
                                    <div className="p-2 text-center border-r border-slate-200 dark:border-dark-border text-xs text-slate-500 font-mono flex items-center justify-center bg-slate-50 dark:bg-dark-bg/10">
                                        {time}
                                    </div>
                                    {/* Empty cells for grid structure */}
                                    {days.map(day => (
                                        <div key={`${day}-${time}`} className="border-r border-slate-200 dark:border-dark-border last:border-r-0 relative group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors"></div>
                                    ))}
                                </div>
                            ))}

                            {/* Schedule Items (Absolute Positioning) */}
                            {scheduleData.map((item) => {
                                const dayIndex = days.indexOf(item.day);
                                if (dayIndex === -1) return null;

                                const startHour = parseInt(item.time.split(':')[0]);
                                const rowHeight = 96; // h-24 = 6rem = 96px
                                const topOffset = (startHour - 8) * rowHeight; // Starts at 8:00
                                const height = item.duration * rowHeight;

                                return (
                                    <div
                                        key={item.id}
                                        className={`absolute z-10 p-1`}
                                        style={{
                                            top: `${topOffset}px`,
                                            left: `${(dayIndex + 1) * 14.28}%`, // 100/7 approx 14.28%
                                            width: '14.28%',
                                            height: `${height}px`
                                        }}
                                    >
                                        <div className={`w-full h-full ${item.color} rounded-lg p-3 shadow-lg border border-white/20 hover:brightness-110 cursor-pointer transition-all hover:scale-[1.02] flex flex-col`}>
                                            <p className="font-bold text-white text-sm line-clamp-1">{item.course}</p>
                                            <div className="mt-auto space-y-1">
                                                <p className="text-xs text-white/90 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {item.time} - {parseInt(item.time.split(':')[0]) + Math.floor(item.duration)}:{(item.duration % 1) * 60 === 0 ? '00' : '30'}
                                                </p>
                                                <p className="text-xs text-white/90 flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {item.room}
                                                </p>
                                                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-black/20 text-white font-medium border border-white/10">
                                                    {item.type}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}
