import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Check, Copy, RefreshCw, Mail, Printer } from 'lucide-react';
import toast from 'react-hot-toast';

interface PasswordGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    password: string;
    onGenerateAgain: () => void;
}

export default function PasswordGeneratorModal({ isOpen, onClose, password, onGenerateAgain }: PasswordGeneratorModalProps) {
    
    const handleCopy = () => {
        navigator.clipboard.writeText(password);
        toast.success('Password copied to clipboard');
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                <head>
                    <title>Temporary Password</title>
                    <style>
                        body { font-family: sans-serif; padding: 40px; }
                        .container { border: 1px solid #ccc; padding: 20px; border-radius: 8px; max-width: 400px; }
                        .title { font-size: 18px; font-weight: bold; margin-bottom: 20px; }
                        .password { font-size: 24px; font-family: monospace; background: #f4f4f4; padding: 10px; border-radius: 4px; text-align: center; letter-spacing: 2px; }
                        .warning { color: #d9534f; margin-top: 20px; font-size: 14px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="title">Temporary Credentials</div>
                        <p>Your temporary password is:</p>
                        <div class="password">${password}</div>
                        <p class="warning">Please change this password upon your first login. Do not share this document.</p>
                    </div>
                    <script>
                        window.onload = () => { window.print(); window.close(); }
                    </script>
                </body>
                </html>
            `);
            printWindow.document.close();
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => {}}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-dark-card border border-dark-border p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-bold leading-6 text-dark-text mb-4"
                                >
                                    Generated Password
                                </Dialog.Title>
                                
                                <div className="mt-2 mb-6">
                                    <p className="text-sm text-slate-400 mb-4">
                                        A secure temporary password has been generated. Please copy or save it now. 
                                        <span className="text-red-400 block mt-1">It will never be shown again after closing this window.</span>
                                    </p>
                                    
                                    <div className="flex items-center justify-between bg-dark-bg border border-dark-border rounded-lg p-4">
                                        <code className="text-xl font-mono text-primary-400 tracking-wider">
                                            {password || 'Generating...'}
                                        </code>
                                        <button 
                                            onClick={handleCopy}
                                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                                            title="Copy Password"
                                        >
                                            <Copy size={20} />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 mt-6">
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            className="flex-1 inline-flex justify-center items-center gap-2 rounded-lg bg-dark-bg border border-dark-border px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                                            onClick={onGenerateAgain}
                                        >
                                            <RefreshCw size={16} />
                                            Regenerate
                                        </button>
                                        <button
                                            type="button"
                                            className="flex-1 inline-flex justify-center items-center gap-2 rounded-lg bg-dark-bg border border-dark-border px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                                            onClick={handlePrint}
                                        >
                                            <Printer size={16} />
                                            Print
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        className="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-primary-600 px-4 py-3 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                                        onClick={onClose}
                                    >
                                        <Check size={18} />
                                        I have saved the password (Done)
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
