import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { LibraryService } from '../../../services/library.service';
import toast from 'react-hot-toast';

const getMediaUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') : 'http://localhost:8000';
    return `${baseUrl}${url}`;
};

export default function LibraryPage() {
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState<'catalog' | 'issues'>('catalog'); // issues kept for legacy view only if needed

    // Upload State
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [newBook, setNewBook] = useState({
        title: '',
        author: '',
        isbn: '',
        description: ''
    });
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [pdfFile, setPdfFile] = useState<File | null>(null);

    useEffect(() => {
        loadData();
    }, [view]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (view === 'catalog') {
                const data = await LibraryService.getBooks() as any;
                setBooks(Array.isArray(data) ? data : data.results || []);
            } else {
                const data = await LibraryService.getIssues() as any;
                setBooks(Array.isArray(data) ? data : data.results || []);
            }
        } catch (error) {
            console.error("Failed to load library data", error);
            toast.error("Failed to load library data");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'pdf') => {
        if (e.target.files && e.target.files[0]) {
            if (type === 'cover') setCoverFile(e.target.files[0]);
            else setPdfFile(e.target.files[0]);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBook.title || !pdfFile) {
            toast.error("Title and PDF file are required");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('title', newBook.title);
        formData.append('author', newBook.author);
        formData.append('isbn', newBook.isbn);
        formData.append('description', newBook.description);
        formData.append('pdf_file', pdfFile);
        if (coverFile) {
            formData.append('cover_image', coverFile);
        }

        try {
            await LibraryService.uploadBook(formData);
            toast.success("Book uploaded successfully");
            setShowUploadModal(false);
            setNewBook({ title: '', author: '', isbn: '', description: '' });
            setCoverFile(null);
            setPdfFile(null);
            loadData();
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Failed to upload book");
        } finally {
            setUploading(false);
        }
    };

    return (
        <DashboardLayout title="Library">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-dark-text">Digital Library</h1>
                    <p className="text-slate-600 mt-1">Browse and download educational resources.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg shadow-lg shadow-primary-500/20 transition-all flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add Book
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {loading ? (
                    [1, 2, 3, 4].map(n => <div key={n} className="h-80 bg-dark-card rounded-xl animate-pulse"></div>)
                ) : books.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-slate-500 bg-dark-card/50 rounded-xl border border-dashed border-dark-border">
                        <svg className="w-16 h-16 mx-auto mb-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        <p className="text-lg">No books available currently.</p>
                        <button onClick={() => setShowUploadModal(true)} className="mt-2 text-primary-400 hover:text-white underline">Upload your first book</button>
                    </div>
                ) : (
                    books.map((book) => (
                        <div key={book.id} className="bg-dark-card border border-dark-border rounded-xl overflow-hidden hover:border-primary-500/50 transition-all group flex flex-col h-full">
                            {/* Cover Image */}
                            <div className="h-56 bg-slate-800 relative overflow-hidden">
                                {book.cover_image ? (
                                    <img
                                        src={getMediaUrl(book.cover_image)}
                                        alt={book.title}
                                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-900">
                                        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                    {book.pdf_file ? (
                                        <a
                                            href={getMediaUrl(book.pdf_file)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full bg-primary-600 hover:bg-primary-500 text-white py-2 rounded-lg text-center text-sm font-medium shadow-lg"
                                        >
                                            Read / Download
                                        </a>
                                    ) : (
                                        <span className="w-full bg-slate-700 text-slate-400 py-2 rounded-lg text-center text-sm">No PDF Available</span>
                                    )}
                                </div>
                            </div>

                            <div className="p-4 flex flex-col flex-1">
                                <h3 className="text-lg font-bold text-dark-text mb-1 line-clamp-2 leading-tight" title={book.title}>{book.title}</h3>
                                <p className="text-sm text-slate-600 mb-3">{book.author || "Unknown Author"}</p>

                                <div className="mt-auto pt-3 border-t border-dark-border/50 flex justify-between items-center text-xs">
                                    <span className="text-slate-600">{book.uploaded_at ? new Date(book.uploaded_at).toLocaleDateString() : 'N/A'}</span>
                                    {book.isbn && <span className="text-slate-600 bg-white/5 px-2 py-0.5 rounded font-mono">ISBN: {book.isbn}</span>}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-dark-card border border-dark-border rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-dark-border flex justify-between items-center bg-dark-surface">
                            <h3 className="text-xl font-bold text-dark-text">Upload New Book</h3>
                            <button onClick={() => setShowUploadModal(false)} className="text-slate-600 hover:text-dark-text">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={handleUpload} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm text-slate-600 mb-1">Book Title *</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-dark-text focus:outline-none focus:border-primary-500"
                                    value={newBook.title}
                                    onChange={e => setNewBook({ ...newBook, title: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-slate-600 mb-1">Author</label>
                                    <input
                                        type="text"
                                        className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-dark-text focus:outline-none focus:border-primary-500"
                                        value={newBook.author}
                                        onChange={e => setNewBook({ ...newBook, author: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-600 mb-1">ISBN</label>
                                    <input
                                        type="text"
                                        className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-dark-text focus:outline-none focus:border-primary-500"
                                        value={newBook.isbn}
                                        onChange={e => setNewBook({ ...newBook, isbn: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-slate-600 mb-1">Upload PDF *</label>
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    required
                                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-slate-700 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-600 file:text-white hover:file:bg-primary-500"
                                    onChange={e => handleFileChange(e, 'pdf')}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-slate-600 mb-1">Cover Image (Optional)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-slate-700 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-700 file:text-white hover:file:bg-slate-600"
                                    onChange={e => handleFileChange(e, 'cover')}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-slate-600 mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-dark-text focus:outline-none focus:border-primary-500"
                                    value={newBook.description}
                                    onChange={e => setNewBook({ ...newBook, description: e.target.value })}
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowUploadModal(false)}
                                    className="px-4 py-2 text-slate-400 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-medium shadow-lg shadow-primary-500/20 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {uploading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                                    {uploading ? 'Uploading...' : 'Upload Book'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
