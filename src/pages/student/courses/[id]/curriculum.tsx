import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import StudentLayout from '../../../../components/layout/StudentLayout';
import { CoursesService } from '../../../../services/courses.service';
import { BookOpen, ChevronDown, ChevronRight, Play, Paperclip, Download, Loader2, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface Resource {
    id: number;
    title: string;
    file: string | null;
    external_url: string | null;
}

interface Lesson {
    id: number;
    title: string;
    content: string;
    order: number;
    youtube_video_id: string | null;
    youtube_embed_url: string | null;
    video_duration: string | null;
    resources: Resource[];
}

interface Module {
    id: number;
    title: string;
    order: number;
    lessons: Lesson[];
}

interface Course {
    id: number;
    title: string;
    code: string;
    description: string;
    teacher: string;
    modules: Module[];
}

function getFileExtension(url: string): string {
    const ext = url.split('.').pop()?.split('?')[0]?.toUpperCase() || 'FILE';
    return ext;
}

function getFileIcon(url: string) {
    const ext = url.split('.').pop()?.toLowerCase() || '';
    if (['pdf'].includes(ext)) return { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'PDF' };
    if (['ppt', 'pptx'].includes(ext)) return { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', label: 'PPT' };
    if (['doc', 'docx'].includes(ext)) return { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'DOC' };
    if (['xls', 'xlsx'].includes(ext)) return { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', label: 'XLS' };
    return { color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', label: getFileExtension(url) };
}

export default function StudentCurriculumPage() {
    const router = useRouter();
    const { id } = router.query;
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
    const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({});
    const playerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (id) loadCurriculum();
    }, [id]);

    const loadCurriculum = async () => {
        setLoading(true);
        try {
            const data = await CoursesService.getCurriculum(Number(id)) as any;
            setCourse(data);
            // Auto-expand all modules and open first lesson with video
            const expanded: Record<number, boolean> = {};
            let firstLesson: Lesson | null = null;
            for (const module of (data.modules || [])) {
                expanded[module.id] = true;
                if (!firstLesson && module.lessons?.length > 0) {
                    firstLesson = module.lessons[0];
                }
            }
            setExpandedModules(expanded);
            if (firstLesson) setActiveLesson(firstLesson);
        } catch (err) {
            console.error('Failed to load curriculum', err);
        } finally {
            setLoading(false);
        }
    };

    const totalLessons = course?.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;
    const totalVideos = course?.modules?.reduce((acc, m) =>
        acc + (m.lessons?.filter(l => l.youtube_video_id).length || 0), 0) || 0;

    const toggleModule = (moduleId: number) => {
        setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
    };

    const selectLesson = (lesson: Lesson) => {
        setActiveLesson(lesson);
        // Scroll player into view on mobile
        setTimeout(() => playerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    };

    if (loading) return (
        <StudentLayout title="Course Curriculum">
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                    <p className="text-slate-500">Loading curriculum...</p>
                </div>
            </div>
        </StudentLayout>
    );

    if (!course) return (
        <StudentLayout title="Course Curriculum">
            <div className="text-center py-20">
                <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Course Not Found</h2>
                <p className="text-slate-400">Unable to load curriculum. Please try again.</p>
                <Link href="/student/courses" className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">Back to Courses</Link>
            </div>
        </StudentLayout>
    );

    return (
        <StudentLayout title={`${course.title} — Curriculum`}>
            <div className="max-w-7xl mx-auto space-y-4">
                {/* Header */}
                <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-slate-200 dark:border-dark-border shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <Link href={`/student/courses/${id}`} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{course.title}</h1>
                            <p className="text-slate-500 text-sm mt-0.5">
                                <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs mr-2">{course.code}</span>
                                Instructor: <span className="text-indigo-600 dark:text-indigo-400">{course.teacher}</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-dark-border">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <BookOpen className="w-4 h-4 text-indigo-500" />
                            <span><strong className="text-slate-900 dark:text-white">{course.modules?.length || 0}</strong> Modules</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            <span><strong className="text-slate-900 dark:text-white">{totalLessons}</strong> Lessons</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <Play className="w-4 h-4 text-red-500" />
                            <span><strong className="text-slate-900 dark:text-white">{totalVideos}</strong> Video Lectures</span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Left: Video Player + Content */}
                    <div className="lg:col-span-2 space-y-4" ref={playerRef}>
                        {activeLesson ? (
                            <>
                                {/* Video Player */}
                                {activeLesson.youtube_video_id ? (
                                    <div className="bg-black rounded-2xl overflow-hidden shadow-2xl border border-dark-border">
                                        <div className="aspect-video">
                                            <iframe
                                                key={activeLesson.youtube_video_id}
                                                src={`https://www.youtube.com/embed/${activeLesson.youtube_video_id}?autoplay=0&modestbranding=1&rel=0`}
                                                className="w-full h-full"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                title={activeLesson.title}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-slate-900 rounded-2xl border border-dark-border aspect-video flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <Play className="w-8 h-8 text-slate-500" />
                                            </div>
                                            <p className="text-slate-400 text-sm">No video for this lesson</p>
                                        </div>
                                    </div>
                                )}

                                {/* Lesson Info Card */}
                                <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-slate-200 dark:border-dark-border">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{activeLesson.title}</h2>
                                    {activeLesson.content && (
                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mt-3 whitespace-pre-wrap">{activeLesson.content}</p>
                                    )}

                                    {/* Materials / Resources */}
                                    {activeLesson.resources && activeLesson.resources.length > 0 && (
                                        <div className="mt-5 pt-5 border-t border-slate-100 dark:border-dark-border">
                                            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                                                <Paperclip className="w-4 h-4 text-indigo-500" />
                                                Course Materials ({activeLesson.resources.length})
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {activeLesson.resources.map(res => {
                                                    const fileUrl = res.file || res.external_url || '#';
                                                    const icon = getFileIcon(fileUrl);
                                                    return (
                                                        <a
                                                            key={res.id}
                                                            href={fileUrl}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className={`flex items-center gap-3 p-3 rounded-xl border ${icon.border} ${icon.bg} hover:opacity-80 transition-all group`}
                                                        >
                                                            <span className={`text-xs font-bold px-2 py-1 rounded ${icon.color} bg-white/10 flex-shrink-0`}>{icon.label}</span>
                                                            <span className={`text-sm font-medium ${icon.color} truncate flex-1`}>{res.title}</span>
                                                            <Download className={`w-4 h-4 ${icon.color} flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity`} />
                                                        </a>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-dark-border aspect-video flex items-center justify-center">
                                <div className="text-center">
                                    <BookOpen className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                                    <p className="text-slate-500 dark:text-slate-400">Select a lesson from the right panel to start learning</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Module/Lesson Sidebar */}
                    <div className="space-y-3 lg:max-h-[calc(100vh-200px)] lg:overflow-y-auto lg:pr-1 scrollbar-hide">
                        {(!course.modules || course.modules.length === 0) && (
                            <div className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-dark-border p-8 text-center">
                                <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                                <p className="text-slate-500">No curriculum content yet.</p>
                                <p className="text-slate-400 text-sm mt-1">Check back soon!</p>
                            </div>
                        )}
                        {course.modules?.map((module, moduleIdx) => (
                            <div key={module.id} className="bg-white dark:bg-dark-card rounded-2xl border border-slate-200 dark:border-dark-border overflow-hidden">
                                {/* Module Header */}
                                <button
                                    onClick={() => toggleModule(module.id)}
                                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                                            {moduleIdx + 1}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-white text-sm leading-snug">{module.title}</p>
                                            <p className="text-slate-400 text-xs">{module.lessons?.length || 0} lessons</p>
                                        </div>
                                    </div>
                                    {expandedModules[module.id]
                                        ? <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                        : <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                    }
                                </button>

                                {/* Lessons */}
                                {expandedModules[module.id] && (
                                    <div className="border-t border-slate-100 dark:border-dark-border divide-y divide-slate-100 dark:divide-dark-border/50">
                                        {module.lessons?.length === 0 && (
                                            <p className="text-slate-400 text-xs italic p-4 pl-14">No lessons yet</p>
                                        )}
                                        {module.lessons?.map((lesson, lessonIdx) => {
                                            const isActive = activeLesson?.id === lesson.id;
                                            return (
                                                <button
                                                    key={lesson.id}
                                                    onClick={() => selectLesson(lesson)}
                                                    className={`w-full flex items-center gap-3 p-3 pl-4 text-left transition-all ${isActive
                                                        ? 'bg-indigo-50 dark:bg-indigo-500/10 border-l-2 border-indigo-500'
                                                        : 'hover:bg-slate-50 dark:hover:bg-white/5 border-l-2 border-transparent'
                                                        }`}
                                                >
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${lesson.youtube_video_id
                                                        ? 'bg-red-100 dark:bg-red-500/10 text-red-500'
                                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                                                        }`}>
                                                        {lesson.youtube_video_id
                                                            ? <Play className="w-3.5 h-3.5" />
                                                            : <BookOpen className="w-3.5 h-3.5" />
                                                        }
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm font-medium truncate ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                                            {lessonIdx + 1}. {lesson.title}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            {lesson.youtube_video_id && (
                                                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                                                    <Play className="w-2.5 h-2.5" /> Video
                                                                </span>
                                                            )}
                                                            {lesson.resources?.length > 0 && (
                                                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                                                    <Paperclip className="w-2.5 h-2.5" /> {lesson.resources.length} file{lesson.resources.length > 1 ? 's' : ''}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {isActive && (
                                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0"></div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
