"use client";

import Image from "next/image";
import Link from "next/link";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg"; // ✅ Import the hook

type RelatedCourse = {
  slug: string;
  title: string;
  price: string;
  rating_avg: number;
  num_ratings: number;
  thumbnail: string;
};

type RelatedCourseCardProps = {
  course: RelatedCourse;
};

export function RelatedCourseCard({ course }: RelatedCourseCardProps) {
  const { activeSlug } = useActiveOrg(); // ✅ Get the current context

  // ✅ Dynamically create the correct link based on the active context
  const courseDetailHref = activeSlug
    ? `/${activeSlug}/courses/${course.slug}` // Use org-specific URL
    : `/courses/${course.slug}`;             // Use global URL

  return (
    // ✅ Use the dynamic href
    <Link
      href={courseDetailHref}
      className="group flex items-center w-full bg-white border border-gray-200 rounded-md overflow-hidden" // Added hover shadow
    >
      <div className="relative w-40 h-28 flex-shrink-0 bg-gray-200"> {/* Added bg for placeholder */}
        <Image
          src={course.thumbnail || "https://placehold.co/320x180/eee/ccc?text=Course"}
          alt={course.title}
          fill
          sizes="(max-width: 768px) 40vw, 160px" // Add sizes for optimization
          style={{ objectFit: "cover" }} // Use style for object-fit with fill
          className="group-hover:scale-105 transition-transform duration-300 p-1"
        />
      </div>

      {/* --- Details --- */}
      <div className="flex flex-col justify-center p-4 flex-grow overflow-hidden"> {/* Added overflow-hidden */}
        <h3 className="text-base md:text-lg font-semibold text-gray-900 group-hover:text-[#2694C6] transition-colors duration-200 truncate"> {/* Added text-base, md:text-lg, truncate */}
          {course.title}
        </h3>

        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600 mt-1 flex-wrap"> {/* Added text-xs, md:text-sm, flex-wrap */}
          {/* Added check for positive rating */}
          {course.rating_avg > 0 && (
             <span>⭐ {course.rating_avg.toFixed(1)}</span>
          )}
          {/* Added check for positive ratings count */}
          {course.num_ratings > 0 && (
            <span>({course.num_ratings} {course.num_ratings === 1 ? 'review' : 'reviews'})</span>
          )}
           {/* Fallback if no ratings */}
           {course.rating_avg <= 0 && course.num_ratings <= 0 && (
            <span>No reviews yet</span>
           )}
        </div>

        {/* Added check for valid price */}
        <p className="text-[#2694C6] font-bold mt-1 text-sm md:text-base">
          {parseFloat(course.price) > 0 ? `KES ${course.price}` : 'Free'}
        </p>
      </div>
    </Link>
  );
}