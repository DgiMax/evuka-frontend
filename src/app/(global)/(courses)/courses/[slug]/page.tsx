import CourseDetailView from "@/components/courses/CourseDetailView";

export default function GlobalCourseDetailPage() {
  // This page is wrapped by (global)/layout.tsx,
  // which sets activeSlug = null
  return <CourseDetailView />;
}