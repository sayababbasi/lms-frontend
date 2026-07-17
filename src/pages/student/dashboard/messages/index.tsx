import { useEffect, useState, useRef } from 'react';
import StudentLayout from '../../../../components/layout/StudentLayout';
import { useAuth } from '../../../../hooks/useAuth';
import { MessagesService, Message } from '../../../../services/messages';
import { Send, User, Clock, MessageSquare, Search, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Contact {
    id: number;
    name: string;
    last_message: string;
    timestamp: string;
    unread_count: number;
    is_online: boolean;
}

export default function StudentMessages() {
    const { user: currentUser } = useAuth();
    const [conversations, setConversations] = useState<Contact[]>([]);
    const [activeChat, setActiveChat] = useState<Contact | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showChat, setShowChat] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadConversations();
        const interval = setInterval(loadConversations, 10000); // Poll every 10s for new messages
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (activeChat) {
            loadMessages(activeChat.id);
            markRead(activeChat.id);
            setShowChat(true); // Switch to chat view on mobile
        }
    }, [activeChat]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const loadConversations = async () => {
        try {
            const data = await MessagesService.getConversations();
            setConversations(data);
            if (data.length > 0 && !activeChat) {
                // Don't auto-set if we already have one
            }
        } catch (error) {
            console.error("Failed to load conversations", error);
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
            loadConversations(); // Refresh unread counts
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

    const filteredConversations = conversations.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <StudentLayout title="Messages">
            <div className="flex h-[calc(100vh-140px)] gap-4 md:gap-6 relative overflow-hidden">
                {/* Conversations Sidebar */}
                <div className={`${showChat ? 'hidden md:flex' : 'flex'} w-full md:w-80 shrink-0 flex flex-col bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-all duration-300`}>
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Messages</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search chats..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {filteredConversations.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-sm">
                                No conversations found.
                            </div>
                        ) : (
                            filteredConversations.map(conv => (
                                <button
                                    key={conv.id}
                                    onClick={() => setActiveChat(conv)}
                                    className={`w-full p-4 flex gap-3 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors border-l-4 ${activeChat?.id === conv.id
                                        ? 'bg-indigo-50/50 dark:bg-indigo-500/5 border-indigo-600'
                                        : 'border-transparent'
                                        }`}
                                >
                                    <div className="relative shrink-0">
                                        <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                                            {conv.name[0]}
                                        </div>
                                        {conv.is_online && (
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 text-left">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-bold text-slate-900 dark:text-white truncate">{conv.name}</span>
                                            <span className="text-[10px] text-slate-400 shrink-0">
                                                {new Date(conv.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate pr-2">
                                                {conv.last_message}
                                            </p>
                                            {conv.unread_count > 0 && (
                                                <span className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded-full">
                                                    {conv.unread_count}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Window */}
                <div className={`${!showChat ? 'hidden md:flex' : 'flex'} flex-1 flex flex-col bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transform transition-all duration-300 relative`}>
                    {activeChat ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-4 bg-slate-50/50 dark:bg-slate-900/20">
                                <button
                                    onClick={() => setShowChat(false)}
                                    className="md:hidden p-2 text-slate-500 hover:text-indigo-600 transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                                    {activeChat.name[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">{activeChat.name}</h3>
                                    <span className="text-[10px] text-green-500 flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                        Active Now
                                    </span>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div
                                ref={scrollRef}
                                className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/30 dark:bg-slate-900/10"
                            >
                                {messages.map((msg, idx) => {
                                    const isMe = msg.sender === currentUser?.id;
                                    return (
                                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] group flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                                <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${isMe
                                                    ? 'bg-gradient-to-br from-indigo-600 to-primary-600 text-white rounded-tr-none'
                                                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none'
                                                    }`}>
                                                    <p className="leading-relaxed">{msg.content}</p>
                                                </div>
                                                <p className="text-[10px] mt-1 text-slate-400 font-medium px-1">
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Message Input */}
                            <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none dark:text-white"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim() || isLoading}
                                        className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-6">
                                <MessageSquare className="w-10 h-10 text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Select a Conversation</h3>
                            <p className="max-w-xs mx-auto">Click on a chat to view your message history with instructors.</p>
                        </div>
                    )}
                </div>
            </div>
        </StudentLayout>
    );
}
