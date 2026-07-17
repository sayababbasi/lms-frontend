import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { NotificationService } from '../../../services/notification.service';

export default function NotificationsPage() {
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

    return (
        <DashboardLayout title="Notifications">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-dark-text">Notifications</h1>
                    <p className="text-slate-600 mt-1">Updates and alerts.</p>
                </div>
                <button className="text-sm text-primary-600 hover:text-dark-text transition-colors">
                    Mark all as read
                </button>
            </div>

            <div className="bg-dark-surface/50 backdrop-blur-md border border-dark-border rounded-xl">
                {loading ? (
                    <div className="p-8 text-center text-slate-600">Loading...</div>
                ) : notifications.length === 0 ? (
                    <div className="p-12 text-center text-slate-600 flex flex-col items-center">
                        <svg className="w-12 h-12 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                        <p>No new notifications.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-dark-border">
                        {notifications.map((notif) => (
                            <div key={notif.id} className={`p-4 hover:bg-white/5 transition-colors flex gap-4 ${!notif.read ? 'bg-primary-500/5' : ''}`}>
                                <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${!notif.read ? 'bg-primary-600' : 'bg-slate-400'}`}></div>
                                <div>
                                    <h4 className={`text-sm font-medium ${!notif.read ? 'text-dark-text' : 'text-slate-700'}`}>{notif.title}</h4>
                                    <p className="text-sm text-slate-600 mt-1">{notif.message}</p>
                                    <p className="text-xs text-slate-600 mt-2">{new Date(notif.created_at).toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
