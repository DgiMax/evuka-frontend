"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import CourseSidebar from "@/components/courses/CourseSidebar";
import Footer from "@/components/layouts/Footer";
import VideoPlayer from "@/components/courses/VideoPlayer";
import CourseHeader from "@/components/courses/CourseHeader";
import CourseContentTabs, { TabType } from "@/components/courses/CourseContentTabs";
import TabContent from "@/components/courses/TabContent";
import api from "@/lib/api/axios";
import LiveDetailComponent from "@/components/courses/LiveDetailComponent";
import AssignmentSubmissionFormComponent from "@/components/courses/AssignmentSubmissionFormComponent";
import QuizAttemptFormComponent from "@/components/courses/QuizAttemptFormComponent";
import CourseLearningSkeleton from "@/components/skeletons/CourseLearningSkeleton";
import LearningAssistant from '@/components/ai/LearningAssistant'; 
import EvukaLivePlayer from "@/components/courses/EvukaLivePlayer"; 
import TextLessonStage from "@/components/courses/TextLessonStage"; 
import { ResourcePurchaseModal } from "@/components/courses/ResourcePurchaseModal";
import InternalDocumentViewer from "@/components/courses/InternalDocumentViewer";
import { toast } from "sonner";
import { X, Book, ArrowRight, Maximize2, EyeOff, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressStats { total: number; completed: number; }
interface CourseProgress {
    percent: number;
    is_completed: boolean;
    breakdown: { lessons: ProgressStats; assignments: ProgressStats; quizzes: ProgressStats; };
}
interface Quiz {
    id: number;
    title: string;
    max_attempts: number;
    questions_count: number;
    latest_attempt: any;
    max_score: number;
    description: string;
}
export interface LiveLesson {
    id: number;
    title: string;
    start_datetime: string;
    end_datetime: string;  
    status: string; 
    is_active?: boolean;
    chat_room_id?: string;
}
interface Resource {
    id: number;
    title: string;
    description: string;
    resource_type: 'file' | 'link' | 'book_ref';
    file: string | null;
    external_url: string | null;
    reading_instructions: string;
    access_status?: {
        has_access: boolean;
        reason: string;
        price?: string;
        currency?: string;
    };
    book_details?: any;
}
interface Lesson {
    id: number;
    title: string;
    content: string; 
    video_url: string; 
    resources: Resource[];
    is_completed: boolean;
    last_watched_timestamp: number;
    quizzes: Quiz[];
}
interface Module {
    id: number;
    title: string;
    lessons: Lesson[];
    assignments: any[];
}
interface Course {
    id: number;
    title: string;
    slug: string;
    modules: Module[];
    live_classes: any[];
    long_description: string;
    learning_objectives: string[];
    progress: CourseProgress; 
    current_lesson_id: number | null;
}
export interface ActiveContent {
    type: "lesson" | "quiz" | "assignment" | "live" | "resource";
    data: any;
};

const PurchaseResourcesBanner = ({ count, onOpen, onClose }: { count: number, onOpen: () => void, onClose: () => void }) => (
    <AnimatePresence>
        <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
        >
            <div className="bg-[#2694C6] text-white p-3 md:px-6 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-md hidden sm:block">
                        <Book size={18} />
                    </div>
                    <div>
                        <p className="text-[11px] font-black uppercase tracking-widest leading-none">Resource Required</p>
                        <p className="text-[10px] font-bold opacity-80 uppercase tracking-tight mt-1">
                            This course requires {count} additional {count === 1 ? 'book' : 'books'} to unlock all lessons.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onOpen}
                        className="bg-white text-[#2694C6] text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-md hover:bg-gray-100 transition-all shadow-sm flex items-center gap-2"
                    >
                        Purchase Now <ArrowRight size={12} />
                    </button>
                    <button onClick={onClose} className="hover:bg-black/10 p-1 rounded-md transition-colors">
                        <X size={18} />
                    </button>
                </div>
            </div>
        </motion.div>
    </AnimatePresence>
);

export default function CourseLearningView() {
    const params = useParams();
    const searchParams = useSearchParams();
    const slug = params.slug as string;
    const { user, loading: authLoading } = useAuth();
    const hasInitialized = useRef(false);

    const [course, setCourse] = useState<Course | null>(null);
    const [activeContent, setActiveContent] = useState<ActiveContent | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>("Overview");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLiveMode, setIsLiveMode] = useState(false); 
    const [isJoiningLive, setIsJoiningLive] = useState(false);

    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
    const [preSelectedBookSlug, setPreSelectedBookSlug] = useState<string | null>(null);
    const [isBannerVisible, setIsBannerVisible] = useState(true);

    const [activeResource, setActiveResource] = useState<Resource | null>(null);
    const [viewMode, setViewMode] = useState<'full' | 'pip'>('full');
    const [isPipHidden, setIsPipHidden] = useState(false);

    const flatContent = useMemo(() => {
        if (!course) return [];
        const flattened: ActiveContent[] = [];
        course.modules?.forEach((m) => {
            m.lessons?.forEach((l) => {
                flattened.push({ type: "lesson", data: l });
                l.quizzes?.forEach((q) => flattened.push({ type: "quiz", data: q }));
            });
            m.assignments?.forEach((a) => flattened.push({ type: "assignment", data: a }));
        });
        course.live_classes?.forEach(lc => {
            if (lc.active_lesson) flattened.push({ type: "live", data: lc.active_lesson });
            lc.upcoming_lessons?.forEach((ul: any) => flattened.push({ type: "live", data: ul }));
            lc.past_lessons?.forEach((pl: any) => flattened.push({ type: "live", data: pl }));
        });
        return flattened;
    }, [course]);

    const unownedBooks = useMemo(() => {
        if (!course) return [];
        const booksMap = new Map();
        course.modules.forEach(m => {
            m.lessons.forEach(l => {
                l.resources.forEach(r => {
                    if (r.resource_type === 'book_ref' && !r.access_status?.has_access) {
                        const book = r.book_details;
                        if (book) booksMap.set(book.slug, { ...book, access_status: r.access_status });
                    }
                });
            });
        });
        return Array.from(booksMap.values());
    }, [course]);

    const openPurchaseModal = (specificSlug?: string) => {
        setPreSelectedBookSlug(specificSlug || null);
        setIsPurchaseModalOpen(true);
    };

    const updateUrl = useCallback((params: Record<string, string | null>) => {
        const newParams = new URLSearchParams(window.location.search);
        Object.entries(params).forEach(([key, value]) => {
            if (value === null) newParams.delete(key);
            else newParams.set(key, value);
        });
        window.history.replaceState(null, "", `?${newParams.toString()}`);
    }, []);

    const fetchCourseData = useCallback(async (isInitial = false) => {
        if (!user || !slug) return;
        if (isInitial && !course) setIsFetching(true);

        try {
            const res = await api.get(`/courses/${slug}/learn/`);
            const data: Course = res.data;
            setCourse(data);

            if (!hasInitialized.current) {
                const allItems: ActiveContent[] = [];
                const allResources: Resource[] = [];
                
                data.modules?.forEach((m) => {
                    m.lessons?.forEach((l) => {
                        allItems.push({ type: "lesson", data: l });
                        l.quizzes?.forEach((q) => allItems.push({ type: "quiz", data: q }));
                        allResources.push(...l.resources);
                    });
                    allItems.push(...m.assignments.map(a => ({ type: "assignment" as const, data: a })));
                });

                data.live_classes?.forEach(lc => {
                    if (lc.active_lesson) allItems.push({ type: "live", data: lc.active_lesson });
                    lc.upcoming_lessons?.forEach((ul: any) => allItems.push({ type: "live", data: ul }));
                    lc.past_lessons?.forEach((pl: any) => allItems.push({ type: "live", data: pl }));
                });

                const urlType = searchParams.get('type');
                const urlId = searchParams.get('id');
                const resId = searchParams.get('resourceId');
                const mode = searchParams.get('mode');
                
                let target = allItems.find(c => c.type === urlType && c.data.id.toString() === urlId);
                
                if (!target && data.current_lesson_id) {
                    target = allItems.find(c => c.type === "lesson" && c.data.id === data.current_lesson_id);
                }

                const initialItem = target || allItems[0];
                if (initialItem) {
                    setActiveContent(initialItem);
                    setActiveTab(["lesson", "quiz", "assignment"].includes(initialItem.type) ? "Content" : "Overview");
                    
                    if (initialItem.type === "live" && mode === 'player') {
                        setIsLiveMode(true);
                    }

                    if (resId) {
                        const resObj = allResources.find(r => r.id.toString() === resId);
                        if (resObj) {
                            setActiveResource(resObj);
                            if (initialItem.type === 'lesson' && initialItem.data.video_url) setViewMode('pip');
                        }
                    }
                }
                hasInitialized.current = true;
            }
        } catch (err: any) {
            setError("Failed to load course data.");
        } finally {
            setIsFetching(false);
        }
    }, [slug, user, searchParams, course]); 

    useEffect(() => { 
        if (!hasInitialized.current) {
            fetchCourseData(true); 
        }
    }, [fetchCourseData]);

    const handleContentSwitch = useCallback((content: ActiveContent) => {
        setIsLiveMode(false);
        setActiveResource(null);
        setViewMode('full');
        setIsPipHidden(false);
        setActiveContent(content);
        
        updateUrl({
            type: content.type,
            id: content.data.id.toString(),
            resourceId: null,
            mode: null
        });

        if (["lesson", "quiz", "assignment"].includes(content.type)) setActiveTab("Content");
        if (typeof window !== 'undefined' && window.innerWidth < 1024) setIsSidebarOpen(false);
    }, [updateUrl]);

    const updateLessonProgress = useCallback(async (lessonId: number, timestamp: number, completed?: boolean) => {
        try {
            await api.post(`/lessons/${lessonId}/progress/`, { timestamp, completed });
            setCourse((prevCourse) => {
                if (!prevCourse) return null;
                const updatedModules = prevCourse.modules.map((m) => ({
                    ...m,
                    lessons: m.lessons.map((l) => 
                        l.id === lessonId ? { ...l, last_watched_timestamp: timestamp, is_completed: completed ?? l.is_completed } : l
                    )
                }));
                return { ...prevCourse, modules: updatedModules };
            });

            setActiveContent((prevActive) => {
                if (prevActive?.type === 'lesson' && prevActive.data.id === lessonId) {
                    return { ...prevActive, data: { ...prevActive.data, last_watched_timestamp: timestamp, is_completed: completed ?? prevActive.data.is_completed } };
                }
                return prevActive;
            });
        } catch (e) {}
    }, []);

    const handleToggleComplete = (lessonId: number) => {
        const lesson = course?.modules.flatMap(m => m.lessons).find(l => l.id === lessonId);
        if (lesson) {
            const nextStatus = !lesson.is_completed;
            updateLessonProgress(lessonId, lesson.last_watched_timestamp, nextStatus);
            if (nextStatus) toast.success("Lesson marked as completed!");
        }
    };

    const handleGoToNextContent = useCallback(() => {
        if (!activeContent || flatContent.length === 0) return;
        const currentIndex = flatContent.findIndex(i => i.type === activeContent.type && i.data.id === activeContent.data.id);
        const nextIncomplete = flatContent.slice(currentIndex + 1).find(item => {
            if (item.type === 'lesson') return !item.data.is_completed;
            if (item.type === 'quiz') return !item.data.latest_attempt?.is_completed;
            if (item.type === 'assignment') return !item.data.latest_submission;
            return false; 
        });
        if (nextIncomplete) handleContentSwitch(nextIncomplete);
        else toast("Course items complete! 🎉");
    }, [activeContent, flatContent, handleContentSwitch]);

    const handleSubmissionSuccess = useCallback(() => { fetchCourseData(false); setActiveTab("Content"); }, [fetchCourseData]);

    const joinLiveSession = useCallback(() => {
        if (activeContent?.type === "live") {
            const lesson = activeContent.data;
            const now = new Date();
            const start = new Date(lesson.start_datetime);
            const tenMinsBefore = new Date(start.getTime() - 10 * 60 * 1000);
            
            const isReady = lesson.status === 'live' || now >= tenMinsBefore;

            if (isReady) {
                setIsLiveMode(true);
                updateUrl({ mode: 'player' });
            } else {
                toast.error("This session isn't open yet. Please wait for the countdown.");
            }
        }
    }, [activeContent, updateUrl]);

    const handleOpenResource = (res: Resource) => {
        setActiveResource(res);
        updateUrl({ resourceId: res.id.toString() });
        if (activeContent?.type === 'lesson' && activeContent.data.video_url) {
            setViewMode('pip');
            setIsPipHidden(false);
        } else {
            setViewMode('full');
        }
    };

    const handleCloseResource = () => {
        setActiveResource(null);
        setViewMode('full');
        setIsPipHidden(false);
        updateUrl({ resourceId: null });
    };

    if (authLoading || (isFetching && !course)) return <div className="fixed inset-0 bg-background z-[200] overflow-hidden"><CourseLearningSkeleton /></div>;
    if (error || !course) return <div className="p-20 text-center text-red-500 font-bold">{error}</div>;

    return (
        <div className="flex h-screen w-full bg-background font-sans overflow-hidden">
            <div className="flex-1 flex flex-col min-w-0 h-full relative">
                <CourseHeader courseTitle={course.title} setIsSidebarOpen={setIsSidebarOpen} />
                
                {unownedBooks.length > 0 && isBannerVisible && (
                    <PurchaseResourcesBanner count={unownedBooks.length} onOpen={() => openPurchaseModal()} onClose={() => setIsBannerVisible(false)} />
                )}

                <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth bg-background [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-none [&::-webkit-scrollbar-thumb]:border-x-[1px] [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-clip-content">
                    <div className="max-w-[1600px] mx-auto p-4 md:p-6 pb-20">
                        <div className="min-h-[45vh] flex flex-col relative">
                            
                            {activeContent?.type === 'lesson' && activeContent.data.video_url && (
                                <>
                                    <div className={cn(
                                        "transition-all duration-500 ease-in-out",
                                        viewMode === 'pip' 
                                            ? cn(
                                                "fixed bottom-8 left-8 w-[420px] aspect-video shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] rounded-xl border-2 border-white/10 overflow-hidden bg-black z-[100]",
                                                isPipHidden ? "-translate-x-full opacity-0 pointer-events-none" : "translate-x-0 opacity-100"
                                            )
                                            : "relative w-full aspect-video rounded-xl overflow-hidden mb-6 z-0"
                                    )}>
                                        <div className="relative group w-full h-full">
                                            <VideoPlayer
                                                videoUrl={activeContent.data.video_url.replace(/\\/g, '/')} 
                                                lessonId={activeContent.data.id}
                                                startTime={activeContent.data.last_watched_timestamp}
                                                onProgressUpdate={updateLessonProgress}
                                                onLessonComplete={handleGoToNextContent}
                                                isMini={viewMode === 'pip'}
                                            />
                                            
                                            {viewMode === 'pip' && (
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-4 z-[110]">
                                                    <div className="flex gap-2">
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); setIsPipHidden(true); }}
                                                            className="bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-[#2694C6] border border-white/10 transition-all"
                                                        >
                                                            <EyeOff size={18} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleCloseResource()}
                                                            className="bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-[#2694C6] border border-white/10 transition-all"
                                                        >
                                                            <Maximize2 size={18} />
                                                        </button>
                                                    </div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-white shadow-sm">Video Controls</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {isPipHidden && (
                                            <motion.button
                                                initial={{ scale: 0.5, opacity: 0, x: -20 }}
                                                animate={{ scale: 1, opacity: 1, x: 0 }}
                                                exit={{ scale: 0.5, opacity: 0, x: -20 }}
                                                onClick={() => setIsPipHidden(false)}
                                                className="fixed bottom-8 left-8 z-[110] bg-[#2694C6] text-white p-4 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all border-4 border-white group"
                                            >
                                                <Play size={20} className="fill-current animate-pulse" />
                                                <div className="absolute left-full ml-4 bg-white text-gray-900 px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gray-100 pointer-events-none">
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Resume Video</span>
                                                </div>
                                            </motion.button>
                                        )}
                                    </AnimatePresence>
                                </>
                            )}

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeContent?.type + (activeContent?.data?.id || 'none') + (activeResource?.id || 'main')}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="w-full flex-1"
                                >
                                    {activeResource ? (
                                        <InternalDocumentViewer resource={activeResource} onClose={handleCloseResource} />
                                    ) : (
                                        <>
                                            {activeContent?.type === "lesson" && !activeContent.data.video_url && (
                                                <TextLessonStage 
                                                    title={activeContent.data.title} 
                                                    content={activeContent.data.content} 
                                                    isCompleted={activeContent.data.is_completed} 
                                                    onToggleComplete={() => handleToggleComplete(activeContent.data.id)} 
                                                />
                                            )}
                                            {activeContent?.type === "live" && (
                                                <div className="w-full">
                                                    {isLiveMode ? (
                                                        <EvukaLivePlayer 
                                                            idOrSlug={activeContent.data.id} 
                                                            type={searchParams.get("type") === "event" ? "event" : "lesson"}
                                                            onExit={() => { 
                                                                setIsLiveMode(false); 
                                                                updateUrl({ mode: null, type: null, id: null }); 
                                                            }} 
                                                        />
                                                    ) : (
                                                        <LiveDetailComponent 
                                                            liveLesson={activeContent.data} 
                                                            joinLiveSession={joinLiveSession} 
                                                            setIsJoiningLive={setIsJoiningLive} 
                                                        />
                                                    )}
                                                </div>
                                            )}
                                            {activeContent?.type === "assignment" && <div className="w-full rounded-xl bg-card border shadow-sm p-4 md:p-8"><AssignmentSubmissionFormComponent assignment={activeContent.data} onSubmissionSuccess={handleSubmissionSuccess} /></div>}
                                            {activeContent?.type === "quiz" && <div className="w-full rounded-xl bg-card border shadow-sm p-4 md:p-8"><QuizAttemptFormComponent quiz={activeContent.data} onAttemptSubmitted={handleSubmissionSuccess} /></div>}
                                        </>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="mt-8 relative">
                            <CourseContentTabs activeTab={activeTab} setActiveTab={setActiveTab} activeContent={activeContent} />
                            <TabContent 
                                activeTab={activeTab} courseSlug={course.slug} course={course} activeContent={activeContent} allContent={flatContent} 
                                onToggleComplete={handleToggleComplete} setActiveContent={handleContentSwitch} joinLiveSession={joinLiveSession} 
                                setJoiningLive={setIsJoiningLive} onPurchaseResource={openPurchaseModal} onOpenResource={handleOpenResource}
                            />
                        </div>
                    </div>
                    <Footer />
                </main>
            </div>
            
            <CourseSidebar course={course} activeContent={activeContent} setActiveContent={handleContentSwitch} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} onToggleComplete={handleToggleComplete} />
            <LearningAssistant courseSlug={course.slug} courseTitle={course.title} currentLessonId={activeContent?.type === 'lesson' ? activeContent.data.id : undefined} />
            <ResourcePurchaseModal isOpen={isPurchaseModalOpen} onClose={() => setIsPurchaseModalOpen(false)} books={unownedBooks} preSelectedSlug={preSelectedBookSlug} />
        </div>
    );
}