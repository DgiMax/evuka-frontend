"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  X,
  ChevronDown,
  CheckCircle,
  HelpCircle,
  FileText,
  Video,
  VideoIcon,
} from "lucide-react";

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
  latest_attempt: {
    is_completed: boolean;
    score: number;
  } | null;
}

interface CourseAssignment {
  id: number;
  title: string;
  latest_submission: {
    submission_status: string;
  } | null;
}

interface LiveLesson {
  id: number;
  title: string;
  is_active: boolean; 
}

interface LiveClass {
  id: number;
  title: string;
  active_lesson: LiveLesson | null;
  upcoming_lessons: LiveLesson[];
  past_lessons: LiveLesson[];
}

interface Lesson {
  id: number;
  title: string;
  is_completed: boolean;
  quizzes: Quiz[];
}

interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
  assignments: CourseAssignment[];
}

interface Course {
  modules: Module[];
  live_classes: LiveClass[];
  progress: CourseProgress;
}

type ActiveContent = {
  type: "lesson" | "quiz" | "assignment" | "live";
  data: any;
};

interface CourseSidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  course: Course | null;
  activeContent: ActiveContent | null;
  setActiveContent: (content: ActiveContent) => void;
  onToggleComplete: (lessonId: number) => void;
}

const CourseSidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  course,
  activeContent,
  setActiveContent,
  onToggleComplete,
}: CourseSidebarProps) => {
  const [openSections, setOpenSections] = useState<{ [key: number]: boolean }>({ 0: true });
  const [isPastLessonsOpen, setIsPastLessonsOpen] = useState(false);

  useEffect(() => {
    if (activeContent && course) {
      const activeModuleIndex = course.modules.findIndex((module) => {
        if (activeContent.type === "lesson") {
          return module.lessons.some((l) => l.id === activeContent.data.id);
        }
        if (activeContent.type === "quiz") {
          return module.lessons.some((l) => l.quizzes?.some((q) => q.id === activeContent.data.id));
        }
        if (activeContent.type === "assignment") {
          return module.assignments.some((a) => a.id === activeContent.data.id);
        }
        return false;
      });

      if (activeModuleIndex !== -1) {
        setOpenSections((prev) => ({ ...prev, [activeModuleIndex]: true }));
      }
    }
  }, [activeContent, course]);

  const toggleSection = (index: number) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleItemClick = (type: ActiveContent["type"], item: any) => {
    setActiveContent({ type, data: item });
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const renderContentItem = (
    item: any,
    type: ActiveContent["type"],
    parentType: "module" | "lesson" | "live-class",
    parentIndex: number
  ) => {
    let IconComponent: any = Video;
    let iconColor = "text-muted-foreground";
    let isDone = false;

    if (type === "lesson") {
      IconComponent = Video;
      iconColor = item.is_completed ? "text-green-600" : "text-muted-foreground";
      isDone = item.is_completed;
    } else if (type === "quiz") {
      IconComponent = HelpCircle;
      iconColor = "text-primary";
      isDone = !!item.latest_attempt?.is_completed;
    } else if (type === "assignment") {
      IconComponent = FileText;
      iconColor = "text-orange-500";
      isDone = !!item.latest_submission;
    } else if (type === "live") {
      IconComponent = VideoIcon;
      iconColor = item.is_active ? "text-red-600 animate-pulse" : "text-muted-foreground";
    }

    const isActive = activeContent?.type === type && activeContent.data.id === item.id;
    const isNested = parentType === "lesson";

    return (
      <li
        key={`${type}-${item.id || item.title}-${parentIndex}`}
        onClick={() => handleItemClick(type, item)}
        className={cn(
          "flex items-center justify-between border-l-4 cursor-pointer transition-all pr-4 text-sm group overflow-hidden w-full select-none",
          isActive
            ? "bg-primary/10 border-primary text-foreground font-bold"
            : "hover:bg-primary/5 border-transparent text-gray-600 hover:text-foreground"
        )}
      >
        <span className={cn("py-3.5 flex-1 flex items-center min-w-0", isNested ? "pl-10" : "pl-4")}>
          <IconComponent className={cn("mr-3 w-4 h-4 shrink-0 transition-transform group-hover:scale-110", iconColor)} />
          <span className="truncate block w-full tracking-tight">{item.title}</span>
        </span>

        <div className="flex items-center gap-2 shrink-0">
            {type === "lesson" && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleComplete(item.id);
                    }}
                    className={cn(
                        "p-1 rounded-full transition-all transform hover:scale-125",
                        item.is_completed ? "text-green-600" : "text-gray-200 hover:text-green-600"
                    )}
                >
                    <CheckCircle className="w-4 h-4" />
                </button>
            )}

            {(type === "quiz" || type === "assignment") && (
                <span className={cn(
                    "text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest whitespace-nowrap",
                    isDone ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
                )}>
                    {isDone ? "Done" : "Todo"}
                </span>
            )}

            {type === "live" && item.is_active && (
                <span className="flex h-2 w-2 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
            )}
        </div>
      </li>
    );
  };

  if (!course) {
    return (
      <aside className="fixed top-0 right-0 h-screen w-80 bg-white border-l z-50 flex items-center justify-center">
        <div className="animate-pulse text-xs font-black uppercase tracking-widest text-gray-300">Syncing Curriculum...</div>
      </aside>
    );
  }

  const upcomingLiveLessons = course.live_classes.flatMap(lc => {
    const lessons = [];
    if (lc.active_lesson) lessons.push({ ...lc.active_lesson });
    if (lc.upcoming_lessons) lessons.push(...lc.upcoming_lessons);
    return lessons;
  });

  const pastLiveLessons = course.live_classes.flatMap(lc => lc.past_lessons || []);

  return (
    <aside
      className={cn(
        "fixed top-0 right-0 h-dvh w-full bg-white border-l border-gray-200 flex flex-col z-[100] md:z-40 transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none",
        "lg:w-80 lg:static lg:h-full lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="p-5 flex justify-between items-center border-b border-gray-200 bg-white flex-shrink-0 h-[64px]">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900">Curriculum</h2>
        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1 text-gray-400 hover:text-black">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-none [&::-webkit-scrollbar-thumb]:border-x-[1px] [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-clip-content">
        {course.modules.map((module, mIdx) => (
          <div key={module.id || mIdx} className={cn("border-b border-gray-200 last:border-0", openSections[mIdx] ? "pb-2" : "pb-0")}>
            <button
              onClick={() => toggleSection(mIdx)}
              className={cn(
                  "w-full px-5 py-3 flex justify-between items-center text-left transition-all border-b border-gray-100/50",
                  openSections[mIdx] ? "bg-gray-50/80" : "bg-white hover:bg-gray-50/50"
              )}
            >
              <div className="flex flex-col min-w-0 mr-2">
                <span className="font-black text-gray-900 text-[11px] uppercase tracking-[0.15em] truncate leading-tight">
                    {module.title}
                </span>
              </div>
              <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform duration-300 shrink-0", openSections[mIdx] && "rotate-180")} />
            </button>

            {openSections[mIdx] && (
              <ul className="bg-white animate-in slide-in-from-top-1 duration-200">
                {module.lessons.map((lesson) => (
                  <React.Fragment key={lesson.id}>
                    {renderContentItem(lesson, "lesson", "module", lesson.id)}
                    {lesson.quizzes?.map((quiz) => renderContentItem(quiz, "quiz", "lesson", quiz.id))}
                  </React.Fragment>
                ))}
                {module.assignments?.map((assignment) => renderContentItem(assignment, "assignment", "module", assignment.id))}
              </ul>
            )}
          </div>
        ))}

        {upcomingLiveLessons.length > 0 && (
          <div className="mt-4">
            <div className="px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 bg-gray-50/50 border-y border-gray-100">
              Upcoming Sessions
            </div>
            <ul>
              {upcomingLiveLessons.map((live) => renderContentItem(live, "live", "live-class", live.id))}
            </ul>
          </div>
        )}

        {pastLiveLessons.length > 0 && (
          <div className="mt-2 pb-10">
            <button
              onClick={() => setIsPastLessonsOpen(!isPastLessonsOpen)}
              className="w-full px-5 py-3 flex justify-between items-center text-left transition-all bg-gray-50/30 border-y border-gray-100"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                Past Sessions
              </span>
              <ChevronDown className={cn("w-3 h-3 text-gray-400 transition-transform", isPastLessonsOpen && "rotate-180")} />
            </button>
            {isPastLessonsOpen && (
              <ul className="animate-in slide-in-from-top-1 duration-200">
                {pastLiveLessons.map((live) => renderContentItem(live, "live", "live-class", live.id))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="p-5 bg-white border-t border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
              <span>Course Completion</span>
              <span className="text-primary">{course.progress?.percent || 0}%</span>
          </div>
          <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-1000 ease-in-out shadow-[0_0_10px_rgba(38,148,198,0.3)]" 
                style={{ width: `${course.progress?.percent || 0}%` }} 
              />
          </div>
      </div>
    </aside>
  );
};

export default CourseSidebar;