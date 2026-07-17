import { useState, useEffect } from 'react';
import TeacherLayout from '../../../../components/layout/TeacherLayout';
import { NotificationService } from '../../../../services/notification.service';
import { Bell, CheckCircle2, Clock, Info, AlertTriangle } from 'lucide-react';

export default function TeacherNotificationsPage() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        setLoading(true);
        try {
            const data = await NotificationService.getNotifications() as any;
            setNotifications(Array.isArray(data) ? data : data.results || []);
        } catch (error) {
            console.error("Failed to load notifications", error);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
            case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
            case 'info': return <Info className="w-5 h-5 text-indigo-500" />;
            default: return <Bell className="w-5 h-5 text-slate-400" />;
        }
    };

    return (
        <TeacherLayout title="Notifications">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-dark-text">Notifications</h1>
                    <p className="text-slate-500 mt-1">Updates on submissions and course activities.</p>
                </div>
                <button className="px-4 py-2 text-sm font-semibold text-indigo-500 hover:bg-indigo-500/10 rounded-xl transition-all border border-indigo-500/20">
                    Mark all as read
                </button>
            </div>

            <div className="bg-dark-surface/50 backdrop-blur-md border border-dark-border rounded-2xl overflow-hidden shadow-xl">
                {loading ? (
                    <div className="p-20 text-center text-slate-500 flex flex-col items-center">
                        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="font-medium text-indigo-400">Loading alerts...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-20 text-center text-slate-500 flex flex-col items-center">
                        <div className="w-16 h-16 bg-dark-bg rounded-full flex items-center justify-center mb-6 border border-dark-border">
                            <Bell className="w-8 h-8 opacity-20" />
                        </div>
                        <h3 className="text-xl font-bold text-dark-text mb-2">No new alerts</h3>
                        <p className="max-w-xs mx-auto">You're all up to date with your students and assignments.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-dark-border/50">
                        {notifications.map((notif) => (
                            <div key={notif.id} className={`p-6 hover:bg-white/5 transition-all flex gap-5 group ${!notif.read ? 'bg-indigo-500/5' : ''}`}>
                                <div className="mt-1 flex-shrink-0 transition-transform group-hover:scale-110">
                                    {getIcon(notif.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between gap-4 mb-1">
                                        <h4 className={`text-sm font-bold tracking-tight ${!notif.read ? 'text-dark-text' : 'text-slate-400'}`}>
                                            {notif.title}
                                        </h4>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 whitespace-nowrap">
                                            <Clock className="w-3 h-3" />
                                            {new Date(notif.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 leading-relaxed font-medium">{notif.message}</p>
                                </div>
                                {!notif.read && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] self-center"></div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </TeacherLayout>
    );
}
