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
import { toast } from "sonner";

// --- INTERFACES ---
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
    hls_playback_url: string | null;
    is_active: boolean;
    description?: string;
    status?: string;
}
interface Resource {
    id: number;
    title: string;
    description: string;
    resource_type: 'file' | 'link' | 'book_ref';
    file: string | null;
    external_url: string | null;
    reading_instructions: string;
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
export type ActiveContent = {
    type: "lesson" | "quiz" | "assignment" | "live";
    data: any;
};

export default function CourseLearningView() {
    const params = useParams();
    const searchParams = useSearchParams();
    const slug = params.slug as string;
    const { user, loading } = useAuth();
    const hasInitialized = useRef(false);

    const [course, setCourse] = useState<Course | null>(null);
    const [activeContent, setActiveContent] = useState<ActiveContent | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>("Overview");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLiveMode, setIsLiveMode] = useState(false); 
    const [isJoiningLive, setIsJoiningLive] = useState(false);

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
        return flattened;
    }, [course]);

    const fetchCourseData = useCallback(async (initialLoad = false) => {
        if (!user || !slug) return;
        if (initialLoad) setFetching(true);
        try {
            const res = await api.get(`/courses/${slug}/learn/`);
            const data: Course = res.data;
            setCourse(data);

            if (initialLoad && !hasInitialized.current) {
                const allItems: ActiveContent[] = [];
                data.modules?.forEach((m) => {
                    m.lessons?.forEach((l) => {
                        allItems.push({ type: "lesson", data: l });
                        l.quizzes?.forEach((q) => allItems.push({ type: "quiz", data: q }));
                    });
                    allItems.push(...m.assignments.map(a => ({ type: "assignment" as const, data: a })));
                });

                const urlType = searchParams.get('type');
                const urlId = searchParams.get('id');
                let target = allItems.find(c => c.type === urlType && c.data.id.toString() === urlId);
                
                if (!target && data.current_lesson_id) {
                    target = allItems.find(c => c.type === "lesson" && c.data.id === data.current_lesson_id);
                }

                const initialItem = target || allItems[0];
                if (initialItem) {
                    setActiveContent(initialItem);
                    setActiveTab(["lesson", "quiz", "assignment"].includes(initialItem.type) ? "Content" : "Overview");
                }
                hasInitialized.current = true;
            }
        } catch (err: any) {
            setError("Failed to load course data.");
        } finally {
            if (initialLoad) setFetching(false);
        }
    }, [slug, user]); 

    useEffect(() => { fetchCourseData(true); }, [fetchCourseData]);

    const handleContentSwitch = useCallback((content: ActiveContent) => {
        setIsLiveMode(false);
        setActiveContent(content);
        const newParams = new URLSearchParams(window.location.search);
        newParams.set('type', content.type);
        newParams.set('id', content.data.id.toString());
        window.history.replaceState(null, "", `?${newParams.toString()}`);
        if (["lesson", "quiz", "assignment"].includes(content.type)) setActiveTab("Content");
        setIsSidebarOpen(false);
    }, []);

    const updateLessonProgress = useCallback(async (lessonId: number, timestamp: number, completed?: boolean) => {
        try {
            await api.post(`/lessons/${lessonId}/progress/`, { timestamp, completed });
            
            // 🟢 ATOMIC STATE UPDATE: Functional update ensures latest course data is used
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

            // 🟢 SYNC ACTIVE CONTENT: Ensures sidebar checkmark reflects the change immediately
            setActiveContent((prevActive) => {
                if (prevActive?.type === 'lesson' && prevActive.data.id === lessonId) {
                    return {
                        ...prevActive,
                        data: { 
                            ...prevActive.data, 
                            last_watched_timestamp: timestamp, 
                            is_completed: completed ?? prevActive.data.is_completed 
                        }
                    };
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
        if (nextIncomplete) {
            handleContentSwitch(nextIncomplete);
            toast.success(`Next: ${nextIncomplete.data.title}`);
        } else {
            toast("Course items complete! 🎉");
        }
    }, [activeContent, flatContent, handleContentSwitch]);

    const handleSubmissionSuccess = useCallback(() => { fetchCourseData(); setActiveTab("Content"); }, [fetchCourseData]);

    const joinLiveSession = useCallback(() => {
        if (activeContent?.type === "live" && activeContent.data.hls_playback_url) setIsLiveMode(true);
        else toast.error("Live session has not started.");
    }, [activeContent]);

    if (loading || fetching) return <CourseLearningSkeleton />;
    if (error || !course) return <div className="p-20 text-center text-red-500 font-bold">{error}</div>;

    return (
        <div className="flex flex-1 relative w-full m-0 p-0 min-h-0 bg-background font-sans">
            <div className="flex-1 flex flex-col min-w-0 w-full max-w-full">
                <CourseHeader courseTitle={course.title} setIsSidebarOpen={setIsSidebarOpen} />
                <main className="flex-1 w-full overflow-y-auto m-0 p-4 pb-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
                    
                    {activeContent?.type === "lesson" && activeContent.data && (
                        <>
                            {activeContent.data.video_url ? (
                                <VideoPlayer
                                    key={`vid-${activeContent.data.id}`} 
                                    videoUrl={activeContent.data.video_url.replace(/\\/g, '/')} 
                                    lessonId={activeContent.data.id}
                                    startTime={activeContent.data.last_watched_timestamp}
                                    onProgressUpdate={updateLessonProgress}
                                    onLessonComplete={handleGoToNextContent} 
                                />
                            ) : (
                                <TextLessonStage
                                    key={`text-${activeContent.data.id}`}
                                    title={activeContent.data.title}
                                    content={activeContent.data.content}
                                    isCompleted={activeContent.data.is_completed}
                                    onToggleComplete={() => handleToggleComplete(activeContent.data.id)}
                                />
                            )}
                        </>
                    )}

                    {activeContent?.type === "live" && (
                        <>{isLiveMode && activeContent.data.hls_playback_url ? <EvukaLivePlayer playbackUrl={activeContent.data.hls_playback_url} onExit={() => setIsLiveMode(false)} /> : <LiveDetailComponent liveLesson={activeContent.data} joinLiveSession={joinLiveSession} setIsJoiningLive={setIsJoiningLive} />}</>
                    )}
                    {activeContent?.type === "assignment" && <div className="w-full rounded-xl bg-card border shadow-sm p-4 md:p-8"><AssignmentSubmissionFormComponent assignment={activeContent.data} onSubmissionSuccess={handleSubmissionSuccess} /></div>}
                    {activeContent?.type === "quiz" && <div className="w-full rounded-xl bg-card border shadow-sm p-4 md:p-8"><QuizAttemptFormComponent quiz={activeContent.data} onAttemptSubmitted={handleSubmissionSuccess} /></div>}

                    <CourseContentTabs activeTab={activeTab} setActiveTab={setActiveTab} activeContent={activeContent} />
                    <TabContent activeTab={activeTab} courseSlug={course.slug} course={course} activeContent={activeContent} allContent={flatContent} onToggleComplete={handleToggleComplete} setActiveContent={handleContentSwitch} joinLiveSession={joinLiveSession} setJoiningLive={setIsJoiningLive} />
                </main>
                <Footer />
            </div>
            <CourseSidebar course={course} activeContent={activeContent} setActiveContent={handleContentSwitch} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} onToggleComplete={handleToggleComplete} />
            <LearningAssistant courseSlug={course.slug} courseTitle={course.title} currentLessonId={activeContent?.type === 'lesson' ? activeContent.data.id : undefined} />
        </div>
    );
}