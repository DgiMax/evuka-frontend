// components/courses/TabContent.tsx

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { TabType } from "./CourseContentTabs";
import { cn } from "@/lib/utils";
import CourseAnnouncementsList from "./CourseAnnouncementsList";
import CourseNotepad from "./CourseNotepad";
import CourseQnA from "./CourseQnA";

// --- Interface Definitions ---
interface Quiz { 
    id: number; 
    title: string; 
    description: string; 
    max_attempts: number; 
    questions_count: number; 
    latest_attempt: any; 
    max_score: number; 
    time_limit_minutes: number | null; 
}

interface CourseAssignment { 
    id: number; 
    title: string; 
    description: string; 
    due_date: string | null; 
    max_score: number; 
    latest_submission: any; 
}

interface Lesson { 
    id: number; 
    title: string; 
    content: string; 
    resources: any; 
    is_completed: boolean; 
    quizzes: Quiz[]; 
}

interface LiveLesson { 
    id: number; 
    title: string; 
    description?: string; 
}

interface Course { 
    long_description?: string; 
    learning_objectives?: string[]; 
}

const CustomListIcon = () => (
  <div className="mt-0.5 mr-3 flex-shrink-0 text-primary">
    <svg 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  </div>
);

export type ActiveContent = { 
    type: 'lesson' | 'quiz' | 'assignment' | 'live'; 
    data: any; 
} 

interface TabContentProps {
    activeTab: TabType;
    courseSlug: string;
    course: Course | null;
    activeContent: ActiveContent | null; 
    onToggleComplete: (lessonId: number) => void;
    joinLiveSession: () => void;
    setJoiningLive: React.Dispatch<React.SetStateAction<boolean>>;
    // 🚨 Added setActiveContent to props definition
    setActiveContent: (content: ActiveContent) => void; 
}

// -----------------------------------------------------------------
// 🔹 Shared Lesson Content Container (UPDATED)
// -----------------------------------------------------------------
const LessonContentContainer: React.FC<{ 
    lesson: Lesson, 
    onToggleComplete: (id: number) => void, 
    router: any,
    setActiveContent: (content: ActiveContent) => void 
}> = ({ lesson, onToggleComplete, router, setActiveContent }) => {
    
    const quiz = lesson.quizzes?.[0];

    return (
        <div className="space-y-8 max-w-4xl">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-border/50">
                <h3 className="text-2xl font-bold tracking-tight text-foreground">
                    {lesson.title}
                </h3>
                <button 
                    onClick={() => onToggleComplete(lesson.id)}
                    className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium transition-colors border',
                        lesson.is_completed 
                            ? 'bg-primary/10 border-primary/20 text-primary hover:bg-primary/20'
                            : 'bg-background border-border text-muted-foreground hover:text-foreground hover:border-primary/50'
                    )}
                >
                    {lesson.is_completed ? '✔ Completed' : 'Mark as Complete'}
                </button>
            </div>
            
            <div className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {lesson.content || "No description for this lesson."}
            </div>
            
            {quiz && (
                <div className="mt-8 p-6 rounded-xl border border-secondary/20 bg-secondary/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h4 className="text-lg font-semibold text-foreground">Assessment: {quiz.title}</h4>
                        <p className="text-sm text-muted-foreground">
                            Questions: {quiz.questions_count} | Attempts: {quiz.max_attempts}
                        </p>
                    </div>
                    <button 
                        onClick={() => setActiveContent({ type: 'quiz', data: quiz })} 
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
                    >
                        Start Quiz
                    </button>
                </div>
            )}
        </div>
    );
};

// -----------------------------------------------------------------
// 🔹 Lesson Resources Tab
// -----------------------------------------------------------------
const LessonResourcesTab: React.FC<{ lesson: Lesson }> = ({ lesson }) => {
    const resources = lesson.resources;
    const hasResources = resources && (resources.links?.length || resources.files?.length);

    if (!hasResources) {
        return <p className="text-muted-foreground">No supplementary files or links available for this lesson.</p>;
    }

    return (
        <div className="mt-4 space-y-6">
            <h4 className="text-2xl font-bold text-foreground mb-4">Lesson Resources</h4>
            {resources.links?.length > 0 && (
                <div className="border-b pb-4">
                    <h5 className="text-xl font-semibold mb-2 text-foreground">External Links</h5>
                    <ul className="list-disc list-inside space-y-2 text-primary">
                        {resources.links.map((link: string, index: number) => (
                            <li key={`link-${index}`} className="flex items-center">
                                <a 
                                    href={link} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="hover:underline text-sm truncate"
                                >
                                    {link}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
            {resources.files?.length > 0 && (
                <div>
                    <h5 className="text-xl font-semibold mb-2 text-foreground">Downloadable Files</h5>
                    <ul className="list-disc list-inside space-y-2 text-primary">
                        {resources.files.map((file: string, index: number) => (
                            <li key={`file-${index}`} className="flex items-center">
                                <a 
                                    href={file} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="hover:underline text-sm truncate"
                                >
                                    Download Resource File
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};


// -----------------------------------------------------------------
// 🔹 Course Overview Tab
// -----------------------------------------------------------------
const CourseOverviewTab: React.FC<{ course: any }> = ({ course }) => (
  <div className="space-y-8 max-w-4xl">
    <div>
      <h3 className="text-xl font-bold tracking-tight mb-4 text-foreground">
        Course Overview
      </h3>
      <div className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
        {course?.long_description || "No full course description provided."}
      </div>
    </div>

    {course?.learning_objectives && course.learning_objectives.length > 0 && (
      <div className="bg-card/50 border border-border/50 rounded-xl p-6">
        <h4 className="text-lg font-semibold mb-4 text-foreground">
          What you'll learn
        </h4>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
          {course.learning_objectives.map((obj: string, index: number) => (
            <li key={index} className="flex items-start text-sm text-muted-foreground">
              <CustomListIcon />
              <span className="leading-snug">{obj}</span>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);


// -----------------------------------------------------------------
// 🔹 Main TabContent Component
// -----------------------------------------------------------------
const TabContent = ({ 
    activeTab, 
    course, 
    activeContent, 
    courseSlug, 
    onToggleComplete, 
    setActiveContent // 🚨 Destructured here
}: TabContentProps) => {
    const router = useRouter();

    if (!course) return null;

    // Handle default view (Overview) if no specific content is selected and not on a special tab
    if (!activeContent && activeTab !== 'Announcements' && activeTab !== 'Notes' && activeTab !== 'Q&A') {
        return <div className="p-4 md:p-8 bg-card border border-border shadow-sm"><CourseOverviewTab course={course} /></div>;
    }

    const { type, data } = activeContent || {};

    // --- Tab Rendering Logic ---
    const content = (() => {
        
        switch (activeTab) {
            case 'Overview':
                return <CourseOverviewTab course={course} />;

            case 'Content':
                if (type === 'assignment' || type === 'quiz') {
                     return null; // Handled by a different view wrapper or component
                }

                if (type === 'lesson') {
                    return (
                        <LessonContentContainer 
                            lesson={data as Lesson} 
                            onToggleComplete={onToggleComplete} 
                            router={router}
                            setActiveContent={setActiveContent} // 🚨 Passed down here
                        />
                    );
                } 
                if (type === 'live') {
                    const liveLesson = data as LiveLesson;
                    return (
                        <div className="space-y-4">
                            <h4 className="text-2xl font-bold text-foreground">Session Details</h4>
                            <p className="text-muted-foreground">{liveLesson.description || "No specific description for this session."}</p>
                        </div>
                    );
                }
                return <p className="text-muted-foreground">Content details not available.</p>;
            
            case "Resources":
                if (type === 'lesson') {
                    return <LessonResourcesTab lesson={data as Lesson} />;
                }
                return <p className="text-muted-foreground">Resources are only available for lessons.</p>;
            
            case "Q&A":
                return <CourseQnA courseSlug={courseSlug} />;
            
            case "Notes": 
                return (
                    <div className="h-full">
                        <CourseNotepad courseSlug={courseSlug} />
                    </div>
                );
            
            case "Announcements":
                if (courseSlug) {
                    return <CourseAnnouncementsList courseSlug={courseSlug} />;
                }
                return <p className="text-muted-foreground">Course identifier is missing.</p>;
            
            default:
                return (<p className="text-muted-foreground">Content not available for this tab/item combination.</p>);
        }
    })();

    // Conditionally render the outer container 
    if (content === null) {
        return null;
    }

    return (
        <div className="p-4 md:p-8 bg-card border border-border border-t-0">
            {content}
        </div>
    );
};

export default TabContent;
