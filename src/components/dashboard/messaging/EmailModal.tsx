import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Mail, X } from 'lucide-react';
import { MessagesService } from '../../../services/messages';
import { toast } from 'react-hot-toast';

interface EmailModalProps {
    isOpen: boolean;
    onClose: () => void;
    recipient: {
        id: number;
        name: string;
        email: string;
    } | null;
}

export default function EmailModal({ isOpen, onClose, recipient }: EmailModalProps) {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!recipient || !subject.trim() || !message.trim() || isLoading) return;

        try {
            setIsLoading(true);
            await MessagesService.sendEmail({
                email: recipient.email,
                subject,
                message
            });
            toast.success("Email sent successfully!");
            onClose();
            setSubject('');
            setMessage('');
        } catch (error: any) {
            const msg = error.response?.data?.error || "Failed to send email";
            toast.error(msg);
            console.error("Email send details:", error.response?.data);
        } finally {
            setIsLoading(false);
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
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-2xl transition-all border border-slate-200 dark:border-slate-800 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <Dialog.Title as="h3" className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                                    <Mail className="w-6 h-6 text-indigo-600" />
                                    Send Email
                                </Dialog.Title>
                                <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">To</p>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">{recipient?.name} ({recipient?.email})</p>
                            </div>

                            <form onSubmit={handleSendEmail} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                                    <input
                                        type="text"
                                        required
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="e.g., Regarding your assignment"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/50 dark:text-white focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Message</label>
                                    <textarea
                                        required
                                        rows={6}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Write your email content here..."
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/50 dark:text-white focus:outline-none resize-none"
                                    ></textarea>
                                </div>
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all transform active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {isLoading ? 'Sending...' : 'Send Now'}
                                    </button>
                                </div>
                            </form>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}
