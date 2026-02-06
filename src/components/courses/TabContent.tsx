"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TabType } from "./CourseContentTabs";
import { cn } from "@/lib/utils";
import CourseAnnouncementsList from "./CourseAnnouncementsList";
import CourseNotepad from "./CourseNotepad";
import CourseQnA from "./CourseQnA";
import ReactMarkdown from "react-markdown"; 
import remarkGfm from "remark-gfm";
import { Image as ImageIcon, Link as LinkIcon, BookOpen, Download, File, CheckCircle2, FileText, ArrowRight, X } from "lucide-react";

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

interface Quiz { 
    id: number; 
    title: string; 
    description: string; 
    max_attempts: number; 
    questions_count: number; 
    latest_attempt: any; 
    max_score: number; 
}

interface Lesson { 
    id: number; 
    title: string; 
    content: string; 
    resources: Resource[]; 
    is_completed: boolean; 
    quizzes: Quiz[]; 
    video_url?: string;
}

interface Course { 
    long_description: string; 
    learning_objectives: string[]; 
}

export type ActiveContent = { 
    type: 'lesson' | 'quiz' | 'assignment' | 'live' | 'resource'; 
    data: any; 
} 

interface TabContentProps {
    activeTab: TabType;
    courseSlug: string;
    course: Course | null;
    activeContent: ActiveContent | null; 
    allContent: ActiveContent[]; 
    onToggleComplete: (lessonId: number) => void;
    setActiveContent: (content: ActiveContent) => void; 
    joinLiveSession?: () => void;
    setJoiningLive?: React.Dispatch<React.SetStateAction<boolean>>;
    onPurchaseResource: (slug?: string) => void;
    onOpenResource: (resource: Resource) => void;
}

const LessonContentContainer: React.FC<{ 
    lesson: Lesson, 
    allContent: ActiveContent[],
    onToggleComplete: (id: number) => void, 
    setActiveContent: (content: ActiveContent) => void 
}> = ({ lesson, allContent, onToggleComplete, setActiveContent }) => {
    
    const getRecommendation = () => {
        if (!allContent || allContent.length === 0) return null;
        const lessonQuiz = lesson.quizzes?.[0];
        const quizDone = lessonQuiz?.latest_attempt?.is_completed;
        if (lessonQuiz && !quizDone) return { type: 'quiz' as const, data: lessonQuiz, label: "Lesson Quiz" };
        const currentIndex = allContent.findIndex(c => c.type === 'lesson' && c.data.id === lesson.id);
        if (currentIndex === -1) return null;
        const nextIncomplete = allContent.slice(currentIndex + 1).find(item => {
            if (item.type === 'lesson') return !item.data.is_completed;
            if (item.type === 'quiz') return !item.data.latest_attempt?.is_completed;
            if (item.type === 'assignment') return !item.data.latest_submission;
            return false;
        });
        if (nextIncomplete) {
            return { 
                type: nextIncomplete.type, 
                data: nextIncomplete.data, 
                label: `Next ${nextIncomplete.type.charAt(0).toUpperCase() + nextIncomplete.type.slice(1)}`
            };
        }
        return null;
    };

    const nextAction = getRecommendation();

    return (
        <div className="w-full bg-white rounded-md border border-gray-200 overflow-hidden flex flex-col max-h-[75vh] animate-in fade-in duration-500">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                <h3 className="text-xl font-black tracking-tight text-gray-900 uppercase truncate mr-4">
                    {lesson.title}
                </h3>
                <button 
                    onClick={() => onToggleComplete(lesson.id)}
                    className={cn(
                        'px-5 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-2 shrink-0',
                        lesson.is_completed 
                            ? 'bg-green-600 border-green-700 text-white hover:bg-green-700'
                            : 'bg-white border-gray-900 text-gray-900 hover:bg-gray-50'
                    )}
                >
                    {lesson.is_completed ? <CheckCircle2 size={14} /> : null}
                    {lesson.is_completed ? 'Completed' : 'Mark Done'}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 md:px-10 pt-8 pb-12 scroll-smooth bg-white
                [&::-webkit-scrollbar]:w-1.5 
                [&::-webkit-scrollbar-thumb]:bg-gray-200 
                hover:[&::-webkit-scrollbar-thumb]:bg-gray-300"
            >
                <div className="prose prose-slate max-w-none">
                    <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h1: ({...p}) => <h1 className="text-3xl font-black text-gray-900 mt-2 mb-6 tracking-tighter uppercase" {...p} />,
                            h2: ({...p}) => <h2 className="text-xl font-black text-gray-900 mt-10 mb-4 tracking-tight border-b border-gray-100 pb-2 uppercase" {...p} />,
                            h3: ({...p}) => <h3 className="text-lg font-bold text-gray-900 mt-8 mb-3 uppercase" {...p} />,
                            p: ({...p}) => <p className="text-[15px] leading-[1.7] mb-6 text-gray-600 font-medium" {...p} />,
                            ul: ({...p}) => <ul className="list-disc pl-5 mb-6 space-y-2 text-gray-600 font-medium" {...p} />,
                            ol: ({...p}) => <ol className="list-decimal pl-5 mb-6 space-y-2 text-gray-600 font-medium" {...p} />,
                            blockquote: ({...p}) => (
                                <blockquote className="border-l-4 border-[#2694C6] bg-gray-50 p-5 italic rounded-r-md my-8 text-gray-700 font-medium" {...p} />
                            ),
                            code: ({node, inline, className, children, ...p}: any) => (
                                <code className={cn(
                                    "bg-gray-100 text-[#2694C6] px-1.5 py-0.5 rounded font-mono text-xs font-bold",
                                    !inline && "block p-5 bg-gray-900 text-gray-100 border border-gray-800 overflow-x-auto my-8 rounded-md leading-relaxed"
                                )} {...p}>
                                    {children}
                                </code>
                            ),
                            a: ({...p}) => <a className="text-[#2694C6] font-black underline underline-offset-4 hover:text-[#1e7ca8]" target="_blank" rel="noopener noreferrer" {...p} />,
                            img: ({...p}) => <img className="rounded-md border border-gray-100 shadow-sm mx-auto my-10 max-h-[450px] object-contain" alt="" {...p} />,
                            hr: () => <hr className="my-10 border-gray-100" />,
                        }}
                    >
                        {lesson.content || "_No descriptive content provided for this lesson._"}
                    </ReactMarkdown>
                </div>

                {nextAction && (
                    <div className="mt-12 p-8 rounded-md border-2 border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-[#2694C6] transition-colors group">
                        <div className="space-y-1">
                            <div className="inline-flex items-center px-2 py-0.5 rounded-sm text-[9px] font-black bg-[#2694C6]/10 text-[#2694C6] uppercase tracking-[0.2em]">
                                {lesson.is_completed ? "Continue" : "Recommended"}
                            </div>
                            <h4 className="text-lg font-black text-gray-900 uppercase tracking-tight">{nextAction.label}: {nextAction.data.title}</h4>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                {nextAction.type === 'quiz' ? `Test knowledge with ${nextAction.data.questions_count} items.` : "Proceed to the next module item."}
                            </p>
                        </div>
                        <button 
                            onClick={() => setActiveContent({ type: nextAction.type, data: nextAction.data })} 
                            className="bg-gray-900 text-white px-8 py-4 rounded-md text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-[0.98] flex items-center gap-2 group-hover:bg-[#2694C6] shrink-0"
                        >
                            {nextAction.type === 'lesson' ? <ArrowRight size={14} /> : <FileText size={14} />}
                            {lesson.is_completed ? "Next Item" : "Start Now"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const LessonResourcesTab: React.FC<{ 
    lesson: Lesson, 
    onPurchaseResource: (slug?: string) => void, 
    onOpenResource: (res: Resource) => void 
}> = ({ lesson, onPurchaseResource, onOpenResource }) => {
    const router = useRouter();
    const resources = lesson.resources || [];

    if (resources.length === 0) {
        return (
            <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-md bg-gray-50/30">
                <p className="text-gray-400 font-black uppercase tracking-widest text-[11px]">No supplementary materials for this lesson</p>
            </div>
        );
    }

    const normalizeUrl = (url: string | null) => {
        if (!url) return "";
        return url.replace(/\\/g, '/');
    };

    const isInternalPreview = (res: Resource) => {
        const file = normalizeUrl(res.file);
        if (!file) return false;
        const ext = file.split('.').pop()?.toLowerCase();
        return ['pdf', 'png', 'jpg', 'jpeg', 'webp'].includes(ext || '');
    };

    const getFileMetadata = (res: Resource) => {
        if (res.resource_type === 'link') return { icon: <LinkIcon size={18} />, color: "blue" };
        if (res.resource_type === 'book_ref') return { icon: <BookOpen size={18} />, color: "orange" };
        
        const file = res.file;
        if (!file) return { icon: <File size={18} />, color: "gray" };
        
        const ext = file.split('.').pop()?.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) return { icon: <ImageIcon size={18} />, color: "emerald" };
        if (ext === 'pdf') return { icon: <FileText size={18} />, color: "rose" };
        
        return { icon: <Download size={18} />, color: "cyan" };
    };

    const handleAction = (res: Resource) => {
        const fixedRes = { ...res, file: normalizeUrl(res.file) };
        
        if (fixedRes.resource_type === 'book_ref') {
            if (fixedRes.access_status?.has_access) {
                onOpenResource(fixedRes);
            } else {
                onPurchaseResource(fixedRes.book_details?.slug);
            }
        } else if (isInternalPreview(fixedRes)) {
            onOpenResource(fixedRes);
        } else if (fixedRes.resource_type === 'link' && fixedRes.external_url) {
            window.open(fixedRes.external_url, '_blank');
        } else if (fixedRes.resource_type === 'file' && fixedRes.file) {
            window.open(fixedRes.file, '_blank');
        }
    };

    return (
        <div className="mt-4 space-y-8">
            <div>
                <h4 className="text-xl font-black tracking-tighter text-gray-900 uppercase">Learning Materials</h4>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Supplementary files and references.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {resources.map((res) => {
                    const isBook = res.resource_type === 'book_ref';
                    const isLink = res.resource_type === 'link';
                    const isPreviewable = isInternalPreview(res);
                    const hasAccess = res.access_status?.has_access;
                    const meta = getFileMetadata(res);

                    return (
                        <div key={res.id} className="flex flex-col bg-white border border-gray-100 rounded-md transition-all hover:border-[#2694C6] hover:shadow-sm group overflow-hidden">
                            <div className="p-4 flex-1">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className={cn(
                                        "p-2 rounded-md shrink-0 border transition-colors",
                                        meta.color === 'blue' && "bg-blue-50 border-blue-100 text-blue-600",
                                        meta.color === 'orange' && "bg-orange-50 border-orange-100 text-orange-600",
                                        meta.color === 'emerald' && "bg-emerald-50 border-emerald-100 text-emerald-600",
                                        meta.color === 'rose' && "bg-rose-50 border-rose-100 text-rose-600",
                                        meta.color === 'cyan' && "bg-cyan-50 border-cyan-100 text-cyan-600",
                                        meta.color === 'gray' && "bg-gray-50 border-gray-100 text-gray-600"
                                    )}>
                                        {meta.icon}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-bold text-gray-900 truncate text-[13px] uppercase tracking-tight leading-tight">
                                            {res.title}
                                        </p>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">
                                            {res.resource_type.replace('_', ' ')}
                                        </p>
                                    </div>
                                </div>
                                
                                {res.description && (
                                    <p className="text-[11px] font-medium text-gray-500 line-clamp-2 leading-relaxed mb-3 italic">
                                        {res.description}
                                    </p>
                                )}
                            </div>

                            <div className="px-4 pb-4">
                                <button 
                                    onClick={() => handleAction(res)}
                                    className={cn(
                                        "w-full py-2.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all",
                                        (isBook && !hasAccess) || isPreviewable
                                            ? "bg-gray-900 text-white hover:bg-[#2694C6]" 
                                            : "bg-gray-50 text-gray-900 hover:bg-gray-100 border border-gray-100"
                                    )}
                                >
                                    {isBook ? (hasAccess ? "Read eBook" : "Unlock Book") : 
                                     isLink ? "Visit Link" : 
                                     isPreviewable ? "Open in Viewer" : 
                                     "Download"}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const TabContent = ({ 
    activeTab, 
    course, 
    activeContent, 
    allContent = [],
    courseSlug, 
    onToggleComplete, 
    setActiveContent,
    onPurchaseResource,
    onOpenResource
}: TabContentProps) => {
    if (!course) return null;

    const { type, data } = activeContent || {};

    const content = (() => {
        switch (activeTab) {
            case 'Overview':
                return (
                    <div className="space-y-10 max-w-4xl animate-in fade-in duration-500">
                        <div>
                            <h3 className="text-xl font-black tracking-tight mb-6 text-gray-900 uppercase border-b border-gray-100 pb-3">
                                Course Context
                            </h3>
                            <div className="prose prose-slate max-w-none text-gray-600 leading-relaxed text-sm font-medium">
                                <ReactMarkdown>{course.long_description || "_No full course description provided._"}</ReactMarkdown>
                            </div>
                        </div>

                        {course.learning_objectives && course.learning_objectives.length > 0 && (
                            <div className="bg-gray-50/50 border border-gray-100 rounded-md p-8">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-8">
                                    Learning Outcomes
                                </h4>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                                    {course.learning_objectives.map((obj: string, index: number) => (
                                        <li key={index} className="flex items-start text-[13px] text-gray-900 font-bold leading-snug">
                                            <div className="h-5 w-5 rounded-sm bg-[#2694C6]/10 text-[#2694C6] flex items-center justify-center shrink-0 mr-3 mt-0.5 border border-[#2694C6]/10">
                                                <CheckCircle2 size={12} />
                                            </div>
                                            {obj}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                );

            case 'Content':
                if (type === 'lesson') {
                    return (
                        <LessonContentContainer 
                            lesson={data as Lesson} 
                            allContent={allContent}
                            onToggleComplete={onToggleComplete} 
                            setActiveContent={setActiveContent} 
                        />
                    );
                } 
                return <div className="py-20 text-center text-gray-400 font-black uppercase tracking-widest text-[11px]">Select a lesson to view detail</div>;
            
            case "Resources":
                if (type === 'lesson') {
                    return <LessonResourcesTab lesson={data as Lesson} onPurchaseResource={onPurchaseResource} onOpenResource={onOpenResource} />;
                }
                return <div className="py-20 text-center text-gray-400 font-black uppercase tracking-widest text-[11px]">Resources are tied to the active lesson</div>;
            
            case "Q&A":
                return <CourseQnA courseSlug={courseSlug} />;
            
            case "Notes": 
                return <CourseNotepad courseSlug={courseSlug} />;
            
            case "Announcements":
                return <CourseAnnouncementsList courseSlug={courseSlug} />;
            
            default:
                return null;
        }
    })();

    if (content === null) return null;

    return (
        <div className="p-6 md:p-10 bg-white border border-gray-200 border-t-0 rounded-b-md min-h-[500px]">
            {content}
        </div>
    );
};

export default TabContent;