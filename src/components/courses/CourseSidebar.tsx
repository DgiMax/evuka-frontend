// components/courses/CourseSidebar.tsx

"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

/* ---------------- Icons ---------------- */
import {
  X,
  ChevronDown,
  CheckCircle,
  HelpCircle,
  FileText,
  Video,
} from "lucide-react";

// --- Custom Icon Components ---
const XIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <X className={className} />
);
const ChevronDownIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <ChevronDown className={className} />
);
const CheckCircleIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <CheckCircle className={className} />
);
const QuizIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <HelpCircle className={className} />
);
const AssignmentIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <FileText className={className} />
);
const LiveIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <Video className={className} />
);

/* --- Data Structures for Props (Unchanged) --- */
interface Quiz {
  id: number;
  title: string;
  max_attempts: number;
  latest_attempt: any;
}
interface CourseAssignment {
  id: number;
  title: string;
  latest_submission: any;
}
interface LiveLesson {
  id: number;
  title: string;
  jitsi_meeting_link: string;
}
interface LiveClass {
  id: number;
  title: string;
  lessons: LiveLesson[];
}
interface Lesson {
  id: number;
  title: string;
  is_completed: boolean;
  quizzes: Quiz[];
}
interface Module {
  title: string;
  lessons: Lesson[];
  assignments: CourseAssignment[];
}
interface Course {
  modules: Module[];
  live_classes: LiveClass[];
}
type ActiveContent = {
  type: "lesson" | "quiz" | "assignment" | "live";
  data: any;
};

/* --- Component Props Definition (Unchanged) --- */
interface CourseSidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  course: Course | null;
  activeContent: ActiveContent | null;
  setActiveContent: (content: ActiveContent) => void;
  onToggleComplete: (lessonId: number) => void;
}

/* ---------------- Main Sidebar Component ---------------- */
const CourseSidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  course,
  activeContent,
  setActiveContent,
  onToggleComplete,
}: CourseSidebarProps) => {
  const [openSections, setOpenSections] = useState<{ [key: number]: boolean }>({
    0: true,
  });

  const toggleSection = (index: number) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Helper function (Themed)
  const renderContentItem = (
    item: any,
    type: ActiveContent["type"],
    parentType: "module" | "lesson" | "live-class",
    parentIndex: number
  ) => {
    let IconComponent: React.FC<{ className?: string }> = Video;
    let iconColor = "text-muted-foreground";

    if (type === "lesson") {
      IconComponent = Video;
      iconColor = item.is_completed
        ? "text-green-600"
        : "text-muted-foreground";
    } else if (type === "quiz") {
      IconComponent = QuizIcon;
      iconColor = "text-primary";
    } else if (type === "assignment") {
      IconComponent = AssignmentIcon;
      iconColor = "text-yellow-600";
    } else if (type === "live") {
      IconComponent = LiveIcon;
      iconColor = "text-destructive";
    }

    const isActive =
      activeContent?.type === type && activeContent.data.id === item.id;
    const isNested = parentType === "lesson";

    return (
      <li
        key={`${type}-${item.id || item.title}-${parentIndex}`}
        onClick={() => {
          setActiveContent({ type, data: item });
          setIsSidebarOpen(false);
        }}
        className={cn(
          "flex items-center justify-between border-l-4 cursor-pointer transition-all pr-4 text-sm",
          isActive
            ? "bg-primary/10 border-primary text-foreground font-semibold"
            : "hover:bg-accent hover:border-primary/50 border-transparent text-foreground"
        )}
      >
        <span
          className={cn(
            "px-4 py-3 flex-1 flex items-center",
            isNested ? "pl-8" : "pl-4"
          )}
        >
          <IconComponent className={cn("mr-2 w-4 h-4", iconColor)} />
          {item.title}
        </span>

        {type === "lesson" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete(item.id);
            }}
            className={cn(
              "p-1 rounded-full",
              item.is_completed
                ? "text-green-600"
                : "text-muted-foreground/30 hover:text-green-600"
            )}
            aria-label={
              item.is_completed ? "Mark as incomplete" : "Mark as complete"
            }
          >
            <CheckCircleIcon className="w-5 h-5" />
          </button>
        )}
        {(type === "quiz" || type === "assignment") && (
          <span
            className={cn(
              "text-xs mr-2 p-1 rounded-md font-medium",
              item.latest_submission || item.latest_attempt
                ? "bg-green-100 text-green-800"
                : "bg-muted text-muted-foreground"
            )}
          >
            {item.latest_submission || item.latest_attempt ? "Done" : "ToDo"}
          </span>
        )}
      </li>
    );
  };

  if (!course) {
    return (
      <aside
        className={cn(
          "fixed top-0 right-0 lg:sticky lg:top-0 h-screen w-full lg:w-80 bg-background border-l border-border flex flex-col z-40"
        )}
      >
        <div className="p-4">
          <h2 className="text-lg font-bold">Loading...</h2>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "fixed top-0 right-0 h-dvh w-full bg-background border-l border-border flex flex-col z-80 md:z-40 transition-transform duration-300 ease-in-out", // Mobile: Full screen
        "lg:w-80 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0", // Desktop: Sticky
        isSidebarOpen ? "translate-x-0" : "translate-x-full" // Mobile open/close
      )}
    >
      <div className="p-4 flex justify-between items-center border-b border-border bg-background flex-shrink-0">
        <h2 className="text-lg font-bold text-foreground">Course Content</h2>
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden text-muted-foreground hover:text-foreground transition"
        >
          <XIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {course.modules.map((module, moduleIndex) => (
          <div key={moduleIndex} className="border-b border-border">
            <button
              onClick={() => toggleSection(moduleIndex)}
              className="w-full p-4 flex justify-between items-center text-left text-foreground hover:bg-accent transition-colors"
            >
              <span className="font-semibold">{module.title}</span>
              <ChevronDownIcon
                className={cn(
                  "w-5 h-5 text-muted-foreground transform transition-transform duration-200",
                  openSections[moduleIndex] ? "rotate-180" : ""
                )}
              />
            </button>

            {openSections[moduleIndex] && (
              <ul className="bg-background">
                {module.lessons.map((lesson) => (
                  <React.Fragment key={lesson.id}>
                    {renderContentItem(lesson, "lesson", "module", lesson.id)}
                    {lesson.quizzes.map((quiz) => (
                      <div key={`quiz-${quiz.id}`} className="">
                        {renderContentItem(quiz, "quiz", "lesson", quiz.id)}
                      </div>
                    ))}
                  </React.Fragment>
                ))}
                {module.assignments.map((assignment) => (
                  <React.Fragment key={assignment.id}>
                    {renderContentItem(
                      assignment,
                      "assignment",
                      "module",
                      assignment.id
                    )}
                  </React.Fragment>
                ))}
              </ul>
            )}
          </div>
        ))}

        {course.live_classes.length > 0 && (
          <div className="border-b border-border">
            <h3 className="p-4 font-bold text-foreground bg-muted/50">
              Live Sessions
            </h3>
            <ul className="bg-background">
              {course.live_classes.flatMap((liveClass) =>
                liveClass.lessons.map((liveLesson) => (
                  <React.Fragment key={liveLesson.id}>
                    {renderContentItem(
                      liveLesson,
                      "live",
                      "live-class",
                      liveLesson.id
                    )}
                  </React.Fragment>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
};

export default CourseSidebar;