"use client";

import React from "react";
import { TabType } from "./CourseContentTabs";
import { cn } from "@/lib/utils";
import CourseAnnouncementsList from "./CourseAnnouncementsList";
import CourseNotepad from "./CourseNotepad";
import CourseQnA from "./CourseQnA";
import ReactMarkdown from "react-markdown"; 
import { Download, ExternalLink, BookOpen, CheckCircle2, FileText, Link as LinkIcon, ArrowRight } from "lucide-react";

interface Resource {
    id: number;
    title: string;
    description: string;
    resource_type: 'file' | 'link' | 'book_ref';
    file: string | null;
    external_url: string | null;
    reading_instructions: string;
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
}

interface Course { 
    long_description: string; 
    learning_objectives: string[]; 
}

export type ActiveContent = { 
    type: 'lesson' | 'quiz' | 'assignment' | 'live'; 
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

        if (lessonQuiz && !quizDone) {
            return { type: 'quiz' as const, data: lessonQuiz, label: "Lesson Quiz" };
        }

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
        <div className="space-y-8 max-w-4xl animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-border/50">
                <h3 className="text-3xl font-extrabold tracking-tight text-foreground leading-tight">
                    {lesson.title}
                </h3>
                <button 
                    onClick={() => onToggleComplete(lesson.id)}
                    className={cn(
                        'px-5 py-2 rounded-full text-sm font-bold transition-all border flex items-center gap-2 shadow-sm shrink-0',
                        lesson.is_completed 
                            ? 'bg-green-500 border-green-600 text-white hover:bg-green-600'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-primary hover:text-primary'
                    )}
                >
                    {lesson.is_completed ? <CheckCircle2 className="w-4 h-4" /> : null}
                    {lesson.is_completed ? 'Completed' : 'Mark as Complete'}
                </button>
            </div>
            
            <div className="prose prose-slate prose-blue max-w-none dark:prose-invert leading-relaxed text-sm">
                <ReactMarkdown>{lesson.content || "_No descriptive content provided for this lesson._"}</ReactMarkdown>
            </div>
            
            {nextAction && (
                <div className="mt-12 p-8 rounded-2xl border-2 border-primary/20 bg-primary/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-inner animate-in slide-in-from-bottom-4 duration-700">
                    <div className="space-y-2">
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary uppercase tracking-wider">
                            {lesson.is_completed ? "Keep Going" : "Recommended Next Step"}
                        </div>
                        <h4 className="text-xl font-bold text-foreground">{nextAction.label}: {nextAction.data.title}</h4>
                        <p className="text-sm text-muted-foreground">
                            {nextAction.type === 'quiz' ? `Verify your knowledge with ${nextAction.data.questions_count} questions.` : "Continue your learning journey with the next module item."}
                        </p>
                    </div>
                    <button 
                        onClick={() => setActiveContent({ type: nextAction.type, data: nextAction.data })} 
                        className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2"
                    >
                        {nextAction.type === 'lesson' ? <ArrowRight className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                        {lesson.is_completed ? "Go to Next Item" : "Start Now"}
                    </button>
                </div>
            )}
        </div>
    );
};

const LessonResourcesTab: React.FC<{ lesson: Lesson }> = ({ lesson }) => {
    const resources = lesson.resources || [];

    if (resources.length === 0) {
        return (
            <div className="py-16 text-center border-2 border-dashed border-border rounded-2xl bg-gray-50/50">
                <p className="text-muted-foreground font-medium">No supplementary files or links for this lesson.</p>
            </div>
        );
    }

    return (
        <div className="mt-4 space-y-8">
            <div>
                <h4 className="text-2xl font-black tracking-tight text-gray-900">Learning Materials</h4>
                <p className="text-sm text-muted-foreground mt-1">Downloadable files and external references for this session.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {resources.map((res) => {
                    const isBook = res.resource_type === 'book_ref';
                    const isLink = res.resource_type === 'link';

                    return (
                        <div key={res.id} className="flex flex-col p-5 bg-white border border-gray-200 rounded-2xl hover:shadow-xl hover:border-primary/40 transition-all group relative overflow-hidden">
                            <div className="flex items-start gap-4 mb-4">
                                <div className={cn(
                                    "p-3 rounded-xl shrink-0 transition-colors",
                                    isLink ? "bg-blue-50 text-blue-600" : isBook ? "bg-orange-50 text-orange-600" : "bg-primary/10 text-primary"
                                )}>
                                    {isLink ? <LinkIcon size={22} /> : isBook ? <BookOpen size={22} /> : <Download size={22} />}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-bold text-gray-900 truncate text-base leading-snug">{res.title}</p>
                                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mt-1">{res.description || "Referenced material."}</p>
                                </div>
                            </div>
                            
                            {res.reading_instructions && (
                                <div className="mb-5 text-[11px] bg-gray-50 p-3 rounded-lg italic text-gray-600 border-l-4 border-primary/20 leading-relaxed">
                                    &ldquo;{res.reading_instructions}&rdquo;
                                </div>
                            )}

                            <a 
                                href={res.external_url || res.file || "#"} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="mt-auto w-full text-center py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.12em] bg-gray-900 text-white hover:bg-primary transition-all shadow-sm"
                            >
                                {isLink ? "Open Link" : isBook ? "Access Book" : "Download File"}
                            </a>
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
    joinLiveSession,
    setJoiningLive
}: TabContentProps) => {
    if (!course) return null;

    const { type, data } = activeContent || {};

    const content = (() => {
        switch (activeTab) {
            case 'Overview':
                return (
                    <div className="space-y-10 max-w-4xl animate-in fade-in duration-500">
                        <div>
                            <h3 className="text-2xl font-bold tracking-tight mb-6 text-foreground border-b border-gray-100 pb-2">
                                About this Course
                            </h3>
                            <div className="prose prose-slate max-w-none text-muted-foreground leading-relaxed text-sm">
                                <ReactMarkdown>{course.long_description || "_No full course description provided._"}</ReactMarkdown>
                            </div>
                        </div>

                        {course.learning_objectives && course.learning_objectives.length > 0 && (
                            <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8">
                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-8">
                                    Course Learning Objectives
                                </h4>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
                                    {course.learning_objectives.map((obj: string, index: number) => (
                                        <li key={index} className="flex items-start text-sm text-gray-700 font-bold leading-snug">
                                            <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 mr-3 mt-[-2px]">
                                                <CheckCircle2 className="h-3.5 w-3.5" />
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
                return <div className="py-20 text-center text-muted-foreground italic font-medium">Select a lesson to view detailed content.</div>;
            
            case "Resources":
                if (type === 'lesson') {
                    return <LessonResourcesTab lesson={data as Lesson} />;
                }
                return <div className="py-20 text-center text-muted-foreground italic font-medium">Resources are contextual to the active lesson.</div>;
            
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
        <div className="p-6 md:p-10 bg-white border border-gray-200 border-t-0 rounded-b-2xl shadow-sm min-h-[450px]">
            {content}
        </div>
    );
};

export default TabContent;