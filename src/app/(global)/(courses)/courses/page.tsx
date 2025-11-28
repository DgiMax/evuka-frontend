import CoursesClient from "@/components/courses/CoursesClient";

export default function GlobalCoursesPage() {
  // This page is wrapped by (global)/layout.tsx, so the activeSlug is null.
  // It just renders the smart component, which will now fetch its own data.
  return <CoursesClient />;
}