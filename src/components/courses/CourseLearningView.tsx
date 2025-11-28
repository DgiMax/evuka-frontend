// views/CourseLearningView.tsx

"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import CourseSidebar from "@/components/courses/CourseSidebar";
import Footer from "@/components/layouts/Footer";
import VideoPlayer from "@/components/courses/VideoPlayer";
import CourseHeader from "@/components/courses/CourseHeader";
import CourseContentTabs, { TabType } from "@/components/courses/CourseContentTabs";
import TabContent from "@/components/courses/TabContent";
import api from "@/lib/api/axios";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg";
import LiveDetailComponent from "@/components/courses/LiveDetailComponent";
import AssignmentSubmissionFormComponent from "@/components/courses/AssignmentSubmissionFormComponent";
import QuizAttemptFormComponent from "@/components/courses/QuizAttemptFormComponent";
import { Loader2, Maximize2, Minimize2, X } from "lucide-react";
import CourseLearningSkeleton from "@/components/skeletons/CourseLearningSkeleton";
import LearningAssistant from '@/components/ai/LearningAssistant'; 


// --- INTERFACES (Unchanged) ---
interface Quiz {
  id: number;
  title: string;
  max_attempts: number;
  questions_count: number;
  latest_attempt: any;
  max_score: number;
  quizzes: any[];
  description: string;
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

export interface LiveLesson {
  id: number;
  title: string;
  jitsi_meeting_link: string;
  date: string;
  start_time: string;
  end_time: string;
  jitsi_token: string | null;
}

interface LiveClass {
  id: number;
  title: string;
  lessons: LiveLesson[];
}

interface Lesson {
  id: number;
  title: string;
  content: string;
  video_file: string;
  resources: any;
  estimated_duration_minutes: number;
  is_completed: boolean;
  last_watched_timestamp: number;
  quizzes: Quiz[];
}

interface Module {
  title: string;
  description: string;
  lessons: Lesson[];
  assignments: CourseAssignment[];
}

interface Course {
  title: string;
  slug: string;
  modules: Module[];
  live_classes: LiveClass[];
  long_description: string;
  learning_objectives: string[];
}

export type ActiveContent = {
  type: "lesson" | "quiz" | "assignment" | "live";
  data: any;
};

export default function CourseLearningView() {
  const params = useParams();
  const searchParams = useSearchParams(); // 🟢 To read URL params
  const slug = params.slug as string;
  const router = useRouter();
  const { user, loading } = useAuth();
  const { activeSlug } = useActiveOrg();

  const [course, setCourse] = useState<Course | null>(null);
  const [activeContent, setActiveContent] = useState<ActiveContent | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("Overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isJitsiMode, setIsJitsiMode] = useState(false);
  const [isJoiningLive, setIsJoiningLive] = useState(false);

  // 🟢 Fullscreen Logic Refs
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 🟢 fetchCourseData wrapped in useCallback (Required for dependency)
  const fetchCourseData = useCallback(async () => {
    if (!user || !slug) return;

    setFetching(true);
    setError(null);
    setCourse(null);

    try {
      const res = await api.get(`/courses/${slug}/learn/`);
      const data: Course = res.data;
      setCourse(data);

      const allContent: ActiveContent[] = [];

      data.modules.forEach((m) => {
        m.lessons.forEach((lesson) => {
          allContent.push({ type: "lesson", data: lesson });
          lesson.quizzes.forEach((quiz) => {
            allContent.push({ type: "quiz", data: quiz });
          });
        });

        m.assignments.forEach((assignment) => {
          allContent.push({ type: "assignment", data: assignment });
        });
      });

      data.live_classes.forEach((lc) => {
        lc.lessons.forEach((liveLesson) => {
          allContent.push({ type: "live", data: liveLesson });
        });
      });

      if (allContent.length > 0) {
        // 🟢 RESTORE LOGIC: Check URL params first
        const urlType = searchParams.get('type');
        const urlId = searchParams.get('id');
        
        let targetContent: ActiveContent | undefined;

        if (urlType && urlId) {
            targetContent = allContent.find(c => c.type === urlType && c.data.id.toString() === urlId);
        }

        if (targetContent) {
             setActiveContent(targetContent);
             // Restore tab based on type
             if (['lesson', 'quiz', 'assignment'].includes(targetContent.type)) {
                 setActiveTab("Content");
             } else {
                 setActiveTab("Overview");
             }
        } else {
            // Default Fallback: First uncompleted item
            const firstUncompletedItem =
              allContent.find(
                (item) =>
                  item.type === "lesson" &&
                  !(item.data as Lesson).is_completed
              ) || allContent[0];
    
            setActiveContent(firstUncompletedItem);
            setActiveTab("Overview");
        }
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.status === 403
          ? "You are not enrolled in this course or it's not available."
          : "Failed to load course data.";
      setError(errorMessage);
    } finally {
      setFetching(false);
    }
  }, [slug, user, activeSlug]); // Removed searchParams from dependency to prevent loop, we read it once on load

  useEffect(() => {
    fetchCourseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, user, activeSlug]); // Run only when core identifiers change

  // 🟢 handleSubmissionSuccess (for quiz/assignment refresh)
  const handleSubmissionSuccess = useCallback(() => {
    fetchCourseData();
    setActiveTab("Content");
  }, [fetchCourseData]);

  const updateLessonProgress = useCallback(
    async (lessonId: number, timestamp: number, completed?: boolean) => {
      try {
        await api.post(`/lessons/${lessonId}/progress/`, {
          timestamp,
          completed,
        });

        if (course) {
          const newModules = course.modules.map((module) => ({
            ...module,
            lessons: module.lessons.map((lesson) =>
              lesson.id === lessonId
                ? {
                    ...lesson,
                    last_watched_timestamp: timestamp,
                    is_completed: completed ?? lesson.is_completed,
                  }
                : lesson
            ),
          }));

          setCourse({ ...course, modules: newModules });
        }
      } catch (err) {}
    },
    [course]
  );

  const handleToggleComplete = (lessonId: number) => {
    if (!course) return;
    let targetLesson: Lesson | undefined;

    const newModules = course.modules.map((module) => ({
      ...module,
      lessons: module.lessons.map((lesson) => {
        if (lesson.id === lessonId) {
          targetLesson = { ...lesson, is_completed: !lesson.is_completed };
          return targetLesson;
        }
        return lesson;
      }),
    }));

    if (targetLesson) {
      setCourse({ ...course, modules: newModules });

      if (
        activeContent?.type === "lesson" &&
        activeContent.data.id === lessonId
      ) {
        setActiveContent({ type: "lesson", data: targetLesson });
      }

      updateLessonProgress(
        lessonId,
        targetLesson.last_watched_timestamp,
        targetLesson.is_completed
      );
    }
  };

  const handleGoToNextLesson = () => {
    if (!course) return;

    const allLessons = course.modules.flatMap((module) => module.lessons);

    if (activeContent?.type !== "lesson") return;

    const currentLesson = activeContent.data as Lesson;
    const currentIndex = allLessons.findIndex(
      (lesson) => lesson.id === currentLesson.id
    );

    if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1];
      // 🟢 Use the updated switcher to ensure URL updates
      handleContentSwitch({ type: "lesson", data: nextLesson });
      setActiveTab("Overview");
    }
  };

  const handleContentSwitch = (content: ActiveContent) => {
    setIsJitsiMode(false);
    setIsJoiningLive(false);
    setActiveContent(content);

    // 🟢 UPDATE URL: Persist state to URL so reload works
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('type', content.type);
    newParams.set('id', content.data.id);
    router.replace(`?${newParams.toString()}`, { scroll: false });

    if (
      content.type === "quiz" ||
      content.type === "assignment" ||
      content.type === "lesson"
    ) {
      setActiveTab("Content");
    } else {
      setActiveTab("Overview");
    }

    setIsSidebarOpen(false);
  };

  const joinLiveSession = useCallback(() => {
    if (activeContent?.type !== "live") return;

    const liveLesson = activeContent.data as LiveLesson;

    let joinUrl = liveLesson.jitsi_meeting_link;
    if (liveLesson.jitsi_token) {
      joinUrl = `${joinUrl}?jwt=${liveLesson.jitsi_token}`;
    }

    if (joinUrl) {
      setIsJitsiMode(true);
      setIsJoiningLive(false);
    } else {
      alert("Meeting link not available.");
      setIsJoiningLive(false);
    }
  }, [activeContent]);

  // 🟢 Fullscreen Toggle Function
  const toggleFullscreen = () => {
    if (!jitsiContainerRef.current) return;
    if (!document.fullscreenElement) {
        jitsiContainerRef.current.requestFullscreen();
        setIsFullscreen(true);
    } else {
        document.exitFullscreen();
        setIsFullscreen(false);
    }
  };

  if (loading || fetching) {
    return <CourseLearningSkeleton />;
  }

  if (error || !course) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-5rem)] bg-background">
        <p className="text-destructive">{error || "Course not found."}</p>
      </div>
    );
  }

  const activeLessonData =
    (activeContent?.type === "lesson" ? activeContent.data : null) as
      | Lesson
      | null;

  const activeLiveData =
    (activeContent?.type === "live" ? activeContent.data : null) as
      | LiveLesson
      | null;

  const activeAssignmentData =
    (activeContent?.type === "assignment" ? activeContent.data : null) as
      | CourseAssignment
      | null;

  const activeQuizData =
    (activeContent?.type === "quiz" ? activeContent.data : null) as Quiz | null;

  // 🟢 DERIVE CONTEXT FOR THE ASSISTANT
  const currentLessonId = activeLessonData?.id; 

  const isVideoPlayerVisible = !!activeLessonData;
  const isLiveDetailVisible = !!activeLiveData && !isJitsiMode;
  const isJitsiFrameVisible = !!activeLiveData && isJitsiMode;
  const isAssignmentFormVisible = !!activeAssignmentData;
  const isQuizAttemptFormVisible = !!activeQuizData;

  const isMainSlotOccupied =
    isVideoPlayerVisible ||
    isLiveDetailVisible ||
    isJitsiFrameVisible ||
    isAssignmentFormVisible ||
    isQuizAttemptFormVisible;

  const isPlaceholderVisible = !isMainSlotOccupied;

  const jitsiUrl = activeLiveData?.jitsi_meeting_link
    ? `${activeLiveData.jitsi_meeting_link}?jwt=${activeLiveData.jitsi_token}`
    : "";

  return (
    <div className="flex flex-1 relative w-full m-0 p-0 min-h-0">
      <div className="flex-1 flex flex-col min-w-0 w-full max-w-full">
        <CourseHeader
          courseTitle={course.title}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <main className="flex-1 w-full overflow-y-auto m-0 p-4 pb-8">
          {isVideoPlayerVisible && (
            <VideoPlayer
              videoUrl={activeLessonData!.video_file}
              lessonId={activeLessonData!.id}
              startTime={activeLessonData!.last_watched_timestamp}
              onProgressUpdate={updateLessonProgress}
              onLessonComplete={handleGoToNextLesson}
            />
          )}

          {/* 🟢 Jitsi Container with Fullscreen & Exit Controls */}
          {isJitsiFrameVisible && (
            <div 
                ref={jitsiContainerRef}
                className="relative w-full aspect-video rounded-md overflow-hidden bg-black flex items-center justify-center group shadow-2xl"
            >
              {isJoiningLive ? (
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                    <p className="text-white font-medium">Connecting to classroom...</p>
                </div>
              ) : (
                <>
                  <iframe
                    src={jitsiUrl}
                    allow="camera; microphone; display-capture; fullscreen"
                    className="w-full h-full border-0"
                  />
                  
                  {/* Overlay Controls (Visible on Hover or active) */}
                  <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-b from-black/50 to-transparent">
                      
                      {/* Maximize/Minimize Button */}
                      <button
                        onClick={toggleFullscreen}
                        className="bg-black/40 hover:bg-black/60 text-white p-2 rounded backdrop-blur-sm transition-colors"
                        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                      >
                        {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                      </button>

                      {/* Exit Meeting Button */}
                      <button
                        onClick={() => {
                            if (document.fullscreenElement) document.exitFullscreen();
                            setIsJitsiMode(false);
                            setIsFullscreen(false);
                        }}
                        className="flex items-center gap-2 bg-destructive/90 hover:bg-destructive text-white px-4 py-2 rounded text-sm font-semibold shadow-sm backdrop-blur-sm transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Exit Class
                      </button>
                  </div>
                </>
              )}
            </div>
          )}

          {isLiveDetailVisible && (
            <LiveDetailComponent
              liveLesson={activeLiveData}
              joinLiveSession={joinLiveSession}
              setIsJoiningLive={setIsJoiningLive}
            />
          )}

          {isAssignmentFormVisible && (
            <div className="w-full rounded bg-card border border-border p-4 md:p-8">
              <AssignmentSubmissionFormComponent
                assignment={activeAssignmentData!}
                onSubmissionSuccess={handleSubmissionSuccess}
              />
            </div>
          )}

          {isQuizAttemptFormVisible && (
            <div className="w-full rounded bg-card border border-border p-4 md:p-8">
              <QuizAttemptFormComponent
                quiz={activeQuizData!}
                onAttemptSubmitted={handleSubmissionSuccess}
              />
            </div>
          )}

          {isPlaceholderVisible && (
            <div className="w-full aspect-video flex items-center justify-center rounded-md bg-foreground">
              <p className="text-background text-lg">
                Select content from the sidebar to begin.
              </p>
            </div>
          )}

          <CourseContentTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            activeContent={activeContent}
          />

          <TabContent
            activeTab={activeTab}
            courseSlug={course.slug}
            course={course}
            activeContent={activeContent}
            onToggleComplete={handleToggleComplete}
            joinLiveSession={joinLiveSession}
            setJoiningLive={setIsJoiningLive}
            setActiveContent={handleContentSwitch} // 🟢 Pass the enhanced switcher
          />
        </main>

        <Footer />
      </div>

      <CourseSidebar
        course={course}
        activeContent={activeContent}
        setActiveContent={handleContentSwitch}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        onToggleComplete={handleToggleComplete}
      />

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
        />
      )}
      {/* 🟢 NEW: Learning Assistant Component */}
      <LearningAssistant 
          courseSlug={course.slug}
          courseTitle={course.title}
          currentLessonId={activeLessonData?.id}
      />
    </div>
  );
}