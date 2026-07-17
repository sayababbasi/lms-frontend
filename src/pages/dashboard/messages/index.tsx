import { useEffect, useState, useRef } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { useAuth } from '../../../hooks/useAuth';
import { MessagesService, Message } from '../../../services/messages';
import { Send, User, Clock, MessageSquare, Search, Shield, Eye, Settings, Filter, Plus, X, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { UsersService } from '../../../services/users.service';

interface Contact {
    id: number;
    name: string;
    last_message: string;
    timestamp: string;
    unread_count: number;
    is_online: boolean;
    role?: string;
}

export default function AdminMessages() {
    const { user: currentUser } = useAuth();
    const [view, setView] = useState<'chat' | 'logs'>('chat');
    const [conversations, setConversations] = useState<Contact[]>([]);
    const [activeChat, setActiveChat] = useState<Contact | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [logs, setLogs] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [allStaff, setAllStaff] = useState<any[]>([]);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadStaffList();
        if (view === 'chat') {
            loadConversations();
        } else {
            loadAllLogs();
        }
    }, [view]);

    useEffect(() => {
        if (activeChat && view === 'chat') {
            loadMessages(activeChat.id);
            markRead(activeChat.id);
            setShowChat(true); // Switch to chat view on mobile
        }
    }, [activeChat, view]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const loadConversations = async () => {
        try {
            const data = await MessagesService.getConversations();
            setConversations(data);
        } catch (error) {
            console.error("Failed to load conversations", error);
        }
    };

    const loadStaffList = async () => {
        setSearchLoading(true);
        try {
            const [teachersObj, staffObj] = await Promise.all([
                UsersService.getTeachers(),
                UsersService.getStaff()
            ]);

            const teachers = Array.isArray(teachersObj) ? teachersObj : (teachersObj as any).results || [];
            const staff = Array.isArray(staffObj) ? staffObj : (staffObj as any).results || [];

            const combined = [
                ...teachers.map((u: any) => ({ ...u.user, role: 'Teacher' })),
                ...staff.map((u: any) => ({ ...u.user, role: 'Staff' }))
            ].filter(u => u.id !== currentUser?.id);

            setAllStaff(combined);
            setSearchResults(combined);
        } catch (error) {
            console.error("Failed to load staff list", error);
        } finally {
            setSearchLoading(false);
        }
    };

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        const filtered = allStaff.filter(s =>
            s.first_name.toLowerCase().includes(term.toLowerCase()) ||
            s.last_name.toLowerCase().includes(term.toLowerCase()) ||
            s.email.toLowerCase().includes(term.toLowerCase())
        );
        setSearchResults(filtered);
    };

    const startChat = (contact: any) => {
        const existing = conversations.find(c => c.id === contact.id);
        if (existing) {
            setActiveChat(existing);
        } else {
            const newContact: Contact = {
                id: contact.id,
                name: `${contact.first_name} ${contact.last_name}`,
                last_message: '',
                timestamp: new Date().toISOString(),
                unread_count: 0,
                is_online: false,
                role: contact.role
            };
            setActiveChat(newContact);
            setConversations([newContact, ...conversations]);
        }
        setIsSearchOpen(false);
    };

    const loadAllLogs = async () => {
        setIsLoading(true);
        try {
            const data = await MessagesService.getAllLogs();
            // Filter logs to only show Student-Teacher interactions for the monitoring tab
            // This ensures Admin's private internal chats don't appear in the general audit log
            const auditLogs = data.filter(log =>
                log.sender !== currentUser?.id && log.recipient !== currentUser?.id
            );
            setLogs(auditLogs);
        } catch (error) {
            console.error("Failed to load logs", error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadMessages = async (userId: number) => {
        try {
            const data = await MessagesService.getConversation(userId);
            setMessages(data);
        } catch (error) {
            console.error("Failed to load messages", error);
        }
    };

    const markRead = async (userId: number) => {
        try {
            await MessagesService.markConversationRead(userId);
            loadConversations();
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChat || isLoading) return;

        try {
            setIsLoading(true);
            await MessagesService.sendMessage(activeChat.id, newMessage);
            setNewMessage('');
            loadMessages(activeChat.id);
            loadConversations();
        } catch (error) {
            toast.error("Failed to send message");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DashboardLayout title="Messages & Monitoring">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Control Center</h1>
                    <p className="text-slate-500 mt-1">Manage communications and monitor system activity.</p>
                </div>

                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <button
                        onClick={() => setView('chat')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${view === 'chat'
                            ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        <MessageSquare className="w-4 h-4" />
                        Internal Chat
                    </button>
                    <button
                        onClick={() => setView('logs')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${view === 'logs'
                            ? 'bg-white dark:bg-slate-700 text-primary-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        <Shield className="w-4 h-4" />
                        Monitoring Logs
                    </button>
                </div>
            </div>

            {view === 'chat' ? (
                <div className="flex h-[calc(100vh-280px)] gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative overflow-hidden">
                    {/* Conversations Sidebar */}
                    <div className={`${showChat ? 'hidden md:flex' : 'flex'} w-full md:w-80 shrink-0 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden relative transition-all duration-300`}>
                        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Internal Desk</h2>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
                                    <span className="text-[10px] text-primary-600 font-bold uppercase tracking-wider">Live</span>
                                </div>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Find faculty..."
                                    value={searchTerm}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                            <div className="p-3 bg-slate-100/30 dark:bg-slate-800/20 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                                System Directory
                            </div>
                            {searchLoading ? (
                                <div className="p-12 text-center text-slate-400">
                                    <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                    <p className="text-xs">Loading faculty...</p>
                                </div>
                            ) : searchResults.length === 0 ? (
                                <div className="p-12 text-center text-slate-400">
                                    <p className="text-sm">No internal members found.</p>
                                </div>
                            ) : (
                                searchResults.map(s => {
                                    const conv = conversations.find(c => c.id === s.id);
                                    return (
                                        <button
                                            key={s.id}
                                            onClick={() => startChat(s)}
                                            className={`w-full p-4 flex gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-l-4 ${activeChat?.id === s.id
                                                ? 'bg-primary-50 dark:bg-primary-600/5 border-primary-600'
                                                : 'border-transparent'
                                                }`}
                                        >
                                            <div className="relative shrink-0">
                                                <div className="w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold border border-slate-200 dark:border-slate-700">
                                                    {s.first_name?.[0]}
                                                </div>
                                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                                            </div>
                                            <div className="flex-1 min-w-0 text-left">
                                                <div className="flex justify-between items-start mb-0.5">
                                                    <span className="font-bold text-slate-900 dark:text-white truncate text-sm">{s.first_name} {s.last_name}</span>
                                                    {conv && (
                                                        <span className="text-[9px] text-slate-400 shrink-0 font-medium font-mono">
                                                            {new Date(conv.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${s.role === 'Teacher' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'}`}>
                                                        {s.role}
                                                    </span>
                                                    <p className="text-[11px] text-slate-500 truncate font-medium">
                                                        {conv?.last_message || 'Start a private conversation'}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Chat Window */}
                    <div className={`${!showChat ? 'hidden md:flex' : 'flex'} flex-1 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden relative transition-all duration-300`}>
                        {activeChat ? (
                            <>
                                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 bg-slate-50/50 dark:bg-slate-900/20">
                                    <button
                                        onClick={() => setShowChat(false)}
                                        className="md:hidden p-2 text-slate-500 hover:text-primary-600 transition-colors"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                    <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                                        {activeChat.name[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white">{activeChat.name}</h3>
                                        <span className="text-[10px] text-emerald-500 flex items-center gap-1 font-bold">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                            Active System Connection
                                        </span>
                                    </div>
                                </div>

                                <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/30 dark:bg-slate-900/10">
                                    {messages.map((msg) => {
                                        const isMe = msg.sender === currentUser?.id;
                                        return (
                                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[70%] group flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                                    <div className={`px-4 py-2.5 rounded-2xl text-sm ${isMe
                                                        ? 'bg-primary-600 text-white rounded-tr-none shadow-md'
                                                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none shadow-sm'
                                                        }`}>
                                                        <p>{msg.content}</p>
                                                    </div>
                                                    <span className="text-[10px] mt-1 text-slate-400 font-bold uppercase tracking-tight px-1">
                                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Secure admin message..."
                                            className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500/50 outline-none dark:text-white"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!newMessage.trim() || isLoading}
                                            className="p-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl shadow-lg shadow-primary-600/20 transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            <Send className="w-5 h-5" />
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-50/50 dark:bg-slate-900/50">
                                <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mb-6">
                                    <Shield className="w-10 h-10 text-primary-500" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Secure Link</h3>
                                <p className="max-w-xs mx-auto text-slate-500">Select an instructor or staff member to initiate a secure encrypted session.</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3 text-slate-900 dark:text-white font-bold">
                            <Eye className="w-5 h-5 text-rose-500" />
                            Live System Audit Log
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search logs..."
                                    className="pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-primary-500/50 outline-none w-64"
                                />
                            </div>
                            <button className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                                <Filter className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] bg-slate-50/50 dark:bg-slate-900/50">
                                    <th className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">Sender</th>
                                    <th className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">Recipient</th>
                                    <th className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">Transcript Preview</th>
                                    <th className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">System Time</th>
                                    <th className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="p-20 text-center">
                                            <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                            <p className="text-slate-400 font-medium">Scanning encrypted channels...</p>
                                        </td>
                                    </tr>
                                ) : logs.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-20 text-center">
                                            <p className="text-slate-400">No message logs recorded yet.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    logs.map((log) => (
                                        <tr key={log.id} className="text-sm border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-bold text-[10px]">
                                                        {log.sender_name[0]}
                                                    </div>
                                                    <span className="font-bold text-slate-700 dark:text-slate-300 group-hover:text-primary-600 transition-colors">
                                                        {log.sender_name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 font-bold text-[10px]">
                                                        {log.recipient_name[0]}
                                                    </div>
                                                    <span className="font-bold text-slate-700 dark:text-slate-300">
                                                        {log.recipient_name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-slate-500 dark:text-slate-400 truncate max-w-[300px] font-medium italic">"{log.content}"</p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-[11px] font-bold text-slate-400">
                                                {new Date(log.created_at).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {Boolean(log.is_read) ? (
                                                    <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 text-[10px] font-bold rounded-lg uppercase tracking-wider">Intercepted/Read</span>
                                                ) : (
                                                    <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 text-[10px] font-bold rounded-lg uppercase tracking-wider">Pending</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
