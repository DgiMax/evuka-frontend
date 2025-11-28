"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Inbox } from "lucide-react";
import CourseCard from "@/components/cards/CourseCard";
import api from "@/lib/api/axios";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg";

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
  <div className="mx-auto lg:w-3/4">
    <div className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-border rounded-lg bg-muted/50 p-4">
      <Inbox className="h-8 w-8 text-muted-foreground" />
      <p className="text-muted-foreground mt-2 text-center">{message}</p>
    </div>
  </div>
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
      setCourses(response.data || []);
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

  const cardContainerClasses = `
    flex flex-nowrap space-x-5 overflow-x-auto scroll-smooth
    lg:grid lg:grid-cols-4 lg:gap-5 lg:space-x-0
    [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
  `;

  const centeringClasses =
    courses.length > 0 && courses.length < 4 ? "lg:justify-center lg:gap-x-8" : "";

  return (
    <section className="py-12 sm:py-20 bg-background">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex justify-between items-center mb-10">
          <h4 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2 !leading-tight">
            Featured Courses & Languages
          </h4>
          <Link
            href="/courses"
            className="bg-secondary text-secondary-foreground font-semibold py-3 px-6 rounded hover:bg-secondary/90 transition duration-200 hidden sm:block"
          >
            Explore All Courses
          </Link>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground text-center">Loading featured courses...</p>
        ) : error ? (
          <EmptyState message={error} />
        ) : courses.length === 0 ? (
          <EmptyState message="No featured courses found at this time." />
        ) : (
          <div
            className={`${cardContainerClasses} ${centeringClasses} ${
              courses.length < 4 ? "lg:grid-cols-3" : ""
            }`}
          >
            {courses.map((course) => (
              <div
                key={course.slug}
                className="snap-start shrink-0 w-[80vw] sm:w-[50vw] md:w-[280px] lg:w-auto"
              >
                <CourseCard
                  title={course.title}
                  description={course.short_description}
                  rating={course.rating_avg}
                  reviewCount={course.num_ratings}
                  imageSrc={course.thumbnail || "/images.png"}
                  courseHref={`/courses/${course.slug}`}
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/courses"
            className="bg-secondary text-secondary-foreground w-full max-w-xs block mx-auto font-semibold py-3 px-6 rounded-lg hover:bg-secondary/90 transition duration-200"
          >
            Explore All Courses
          </Link>
        </div>
      </div>
    </section>
  );
}
