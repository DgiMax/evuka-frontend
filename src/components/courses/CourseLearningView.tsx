// views/CourseLearningView.tsx

"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import CourseLearningSkeleton from "@/components/skeletons/CourseLearningSkeleton";
import LearningAssistant from '@/components/ai/LearningAssistant'; 
import EvukaLivePlayer from "@/components/courses/EvukaLivePlayer"; // 🟢 Imported New Player


// --- INTERFACES ---
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

// 🟢 UPDATED: Matches new Django/Bunny Model
export interface LiveLesson {
  id: number;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  
  // New Fields
  hls_playback_url: string | null;
  chat_room_id: string | null;
  is_active: boolean;
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
  const searchParams = useSearchParams();
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
  
  // 🟢 State for New Player
  const [isLiveMode, setIsLiveMode] = useState(false); 
  const [isJoiningLive, setIsJoiningLive] = useState(false);

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
        const urlType = searchParams.get('type');
        const urlId = searchParams.get('id');
        
        let targetContent: ActiveContent | undefined;

        if (urlType && urlId) {
            targetContent = allContent.find(c => c.type === urlType && c.data.id.toString() === urlId);
        }

        if (targetContent) {
             setActiveContent(targetContent);
             if (['lesson', 'quiz', 'assignment'].includes(targetContent.type)) {
                 setActiveTab("Content");
             } else {
                 setActiveTab("Overview");
             }
        } else {
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
  }, [slug, user, activeSlug]); 

  useEffect(() => {
    fetchCourseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, user, activeSlug]);

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
      handleContentSwitch({ type: "lesson", data: nextLesson });
      setActiveTab("Overview");
    }
  };

  const handleContentSwitch = (content: ActiveContent) => {
    setIsLiveMode(false);
    setIsJoiningLive(false);
    setActiveContent(content);

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

  // 🟢 UPDATED: Join Logic for HLS Stream
  const joinLiveSession = useCallback(() => {
    if (activeContent?.type !== "live") return;

    const liveLesson = activeContent.data as LiveLesson;

    if (liveLesson.hls_playback_url) {
        setIsLiveMode(true);
        setIsJoiningLive(false);
    } else {
        alert("The tutor has not started the stream yet.");
        setIsJoiningLive(false);
    }
  }, [activeContent]);

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

  const currentLessonId = activeLessonData?.id; 

  const isVideoPlayerVisible = !!activeLessonData;
  const isLiveDetailVisible = !!activeLiveData && !isLiveMode;
  const isLivePlayerVisible = !!activeLiveData && isLiveMode; // 🟢 New Visibility Check
  const isAssignmentFormVisible = !!activeAssignmentData;
  const isQuizAttemptFormVisible = !!activeQuizData;

  const isMainSlotOccupied =
    isVideoPlayerVisible ||
    isLiveDetailVisible ||
    isLivePlayerVisible ||
    isAssignmentFormVisible ||
    isQuizAttemptFormVisible;

  const isPlaceholderVisible = !isMainSlotOccupied;

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

          {/* 🟢 NEW: EvukaLivePlayer Component */}
          {isLivePlayerVisible && activeLiveData?.hls_playback_url && (
             <EvukaLivePlayer 
                playbackUrl={activeLiveData.hls_playback_url}
                onExit={() => setIsLiveMode(false)}
             />
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
            setActiveContent={handleContentSwitch}
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
      <LearningAssistant 
          courseSlug={course.slug}
          courseTitle={course.title}
          currentLessonId={activeLessonData?.id}
      />
    </div>
  );
}