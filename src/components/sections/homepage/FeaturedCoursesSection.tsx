"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Inbox } from "lucide-react";
import CourseCard from "@/components/cards/CourseCard";
import api from "@/lib/api/axios";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface Course {
  slug: string;
  title: string;
  thumbnail: string;
  short_description: string;
  rating_avg: number;
  num_ratings: number;
  price: string;
  num_students: number;
}

interface EmptyStateProps {
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message }) => (
  <div className="col-span-full mx-auto w-full lg:w-3/4">
    <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-border rounded-lg bg-muted/50 p-4">
      <Inbox className="h-8 w-8 text-muted-foreground" />
      <p className="text-muted-foreground mt-2 text-center">{message}</p>
    </div>
  </div>
);

const LoadingSkeleton: React.FC = () => (
  <SkeletonTheme baseColor="#e5e7eb" highlightColor="#f3f4f6">
    <div
      // FIXED: Using gap-4 instead of space-x-5 for tighter spacing
      // FIXED: Added snap classes for smooth scrolling feel
      className="flex flex-nowrap gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth
               lg:grid lg:grid-cols-4 lg:gap-5 lg:space-x-0
               [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-1"
    >
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          // FIXED: Changed w-[80vw] to w-[280px] to fix "too big" issue
          className="snap-start shrink-0 w-[280px] lg:w-auto p-1"
        >
          <Skeleton height={150} className="rounded-lg mb-2" />
          <Skeleton height={20} width="90%" className="mb-2" />
          <Skeleton count={1} className="mb-3" />

          <div className="flex justify-between items-center mt-3">
            <Skeleton width={50} height={16} />
            <Skeleton width={80} height={16} />
          </div>
        </div>
      ))}
    </div>
  </SkeletonTheme>
);

export default function FeaturedCoursesSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { activeSlug } = useActiveOrg();

  const fetchFeaturedCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get("/courses/most-popular/");
      const courseList = Array.isArray(response.data)
        ? response.data.slice(0, 4)
        : [];
      setCourses(courseList);
    } catch (err) {
      console.error("Error fetching featured courses:", err);
      setError("Failed to load featured courses.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeaturedCourses();
  }, [activeSlug, fetchFeaturedCourses]);

  // FIXED: Layout logic updated to use gap instead of space-x for better control
  const baseCardContainerClasses = `
    flex flex-nowrap gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth
    lg:grid lg:grid-cols-4 lg:gap-5 
    [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
    px-1 pb-4
  `;

  const dynamicGridClasses =
    courses.length < 4
      ? `lg:grid-cols-${courses.length || 1} lg:justify-center lg:w-fit lg:mx-auto`
      : "";

  return (
    <section className="py-12 sm:py-20 sm:px-8 bg-background">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 space-y-4 sm:space-y-0 text-center sm:text-left">
          <h4 className="text-xl sm:text-3xl font-extrabold text-foreground leading-tight mx-auto sm:mx-0">
            Featured Courses & Languages
          </h4>

          <Link
            href="/courses"
            className="bg-secondary text-secondary-foreground font-semibold py-2 px-4 rounded-md hover:bg-secondary/90 transition duration-200 hidden sm:block whitespace-nowrap"
          >
            View All
          </Link>
        </div>

        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <EmptyState message={error} />
        ) : courses.length === 0 ? (
          <EmptyState message="No featured courses found at this time." />
        ) : (
          <div className={`${baseCardContainerClasses} ${dynamicGridClasses}`}>
            {courses.map((course) => (
              <div
                key={course.slug}
                // FIXED: Set fixed width (w-[280px]) to prevent card from being "too big" on mobile.
                // snap-center makes it stop exactly in the middle or start of the screen.
                className="snap-start shrink-0 w-[280px] lg:w-auto"
              >
                <CourseCard
                  title={course.title}
                  description={course.short_description}
                  rating={course.rating_avg}
                  reviewCount={course.num_ratings}
                  imageSrc={course.thumbnail || "/images.png"}
                  courseHref={`/courses/${course.slug}`}
                  className="!shadow-none !hover:shadow-none border border-border"
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/courses"
            className="bg-secondary text-secondary-foreground w-full max-w-xs block mx-auto font-semibold py-3 px-6 rounded-md hover:bg-secondary/90 transition duration-200"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  );
}