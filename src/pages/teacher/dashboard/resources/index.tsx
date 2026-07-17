import { useState } from 'react';
import TeacherLayout from '../../../../components/layout/TeacherLayout';
import { HardDrive, Upload, Folder, File, MoreVertical, Search, FileText, Image, Film } from 'lucide-react';

const files = [
    { id: 1, name: 'Lecture 1 - Intro.pptx', type: 'presentation', size: '2.4 MB', date: '2 days ago', course: 'CS-101' },
    { id: 2, name: 'Assignment 1 Guidelines.pdf', type: 'pdf', size: '1.1 MB', date: '3 days ago', course: 'CS-101' },
    { id: 3, name: 'Data Structures Diagram.png', type: 'image', size: '450 KB', date: '1 week ago', course: 'CS-201' },
    { id: 4, name: 'Week 2 - Arrays.docx', type: 'doc', size: '120 KB', date: '1 week ago', course: 'CS-201' },
    { id: 5, name: 'Project Demo.mp4', type: 'video', size: '150 MB', date: '2 weeks ago', course: 'SE-301' },
];

const getIcon = (type: string) => {
    switch (type) {
        case 'pdf': return <FileText className="w-5 h-5 text-rose-500" />;
        case 'image': return <Image className="w-5 h-5 text-purple-500" />;
        case 'video': return <Film className="w-5 h-5 text-pink-500" />;
        case 'presentation': return <File className="w-5 h-5 text-orange-500" />; // Simplified
        default: return <File className="w-5 h-5 text-slate-400" />;
    }
};

export default function TeacherResources() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredFiles = files.filter(file =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.course.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <TeacherLayout title="Resources">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">My Resources</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage your course materials and files.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium shadow-lg shadow-indigo-600/20 transition-all">
                    <Upload className="w-5 h-5" />
                    <span>Upload File</span>
                </button>
            </div>

            {/* Storage Usage Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                            <HardDrive className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-slate-900 dark:text-white">Storage Usage</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">45% Used</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm mb-2">
                        <span className="text-slate-900 dark:text-white font-medium">2.4 GB</span>
                        <span className="text-slate-500 dark:text-slate-500">/ 5.0 GB</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 w-[45%] rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* File Browser */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <Folder className="w-5 h-5" />
                        <span className="text-sm">/ My Documents / Course Materials</span>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search files..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-4 py-1.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 w-64 placeholder:text-slate-400"
                        />
                        <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm bg-slate-50/50 dark:bg-slate-900/50">
                                <th className="py-3 px-6 font-medium">Name</th>
                                <th className="py-3 px-6 font-medium">Course</th>
                                <th className="py-3 px-6 font-medium">Date Modified</th>
                                <th className="py-3 px-6 font-medium">Size</th>
                                <th className="py-3 px-6 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFiles.map((file) => (
                                <tr key={file.id} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                    <td className="py-3 px-6">
                                        <div className="flex items-center gap-3">
                                            {getIcon(file.type)}
                                            <span className="text-slate-700 dark:text-slate-200 font-medium group-hover:text-indigo-600 dark:group-hover:text-white transition-colors">{file.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-6">
                                        <span className="text-xs bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 px-2 py-1 rounded border border-slate-200 dark:border-slate-600">
                                            {file.course}
                                        </span>
                                    </td>
                                    <td className="py-3 px-6 text-slate-500 dark:text-slate-400 text-sm">{file.date}</td>
                                    <td className="py-3 px-6 text-slate-500 dark:text-slate-400 text-sm font-mono">{file.size}</td>
                                    <td className="py-3 px-6 text-right">
                                        <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </TeacherLayout>
    );
}
