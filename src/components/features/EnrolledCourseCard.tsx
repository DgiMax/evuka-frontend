"use client";

import Link from "next/link";
import Image from "next/image";
import { PlayCircle, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg";
import { cn } from "@/lib/utils";

export interface Course {
  slug: string;
  title: string;
  thumbnail?: string | null; 
  progress?: number;
  is_completed?: boolean;
  next_lesson?: string;
}

export default function EnrolledCourseCard({ course }: { course: Course }) {
  const { activeSlug } = useActiveOrg(); 
  const courseLearningHref = activeSlug
    ? `/${activeSlug}/course-learning/${course.slug}`
    : `/course-learning/${course.slug}`;

  const progressValue = Math.round(course.progress || 0);

  return (
    <Link href={courseLearningHref} className="block group h-full">
      <div className="bg-white border border-gray-200 h-full flex flex-col rounded-md shadow-sm hover:border-[#2694C6] transition-all relative overflow-hidden">
        <div className="relative aspect-video bg-gray-100 w-full shrink-0 overflow-hidden">
          <Image
            src={course.thumbnail || "/placeholder.svg"}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {course.is_completed && (
            <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full shadow-lg">
              <CheckCircle2 size={16} />
            </div>
          )}
        </div>
        
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-black text-sm text-gray-900 uppercase tracking-tighter leading-tight mb-2 line-clamp-2 transition-colors group-hover:text-[#2694C6]">
            {course.title}
          </h3>
          
          <div className="bg-gray-50 rounded p-2 mb-4">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
              {course.is_completed ? "Course Status" : "Continue With"}
            </p>
            <div className="flex items-center gap-2">
              {course.is_completed ? (
                <CheckCircle2 size={14} className="text-green-500 shrink-0" />
              ) : (
                <PlayCircle size={14} className="text-[#2694C6] shrink-0" />
              )}
              <span className="text-[11px] font-bold text-gray-700 truncate">
                {course.next_lesson || "Start Learning"}
              </span>
            </div>
          </div>
          
          <div className="mt-auto">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Progress</span>
              <span className="text-xs font-black text-[#2694C6]">{progressValue}%</span>
            </div>
            <Progress
              value={progressValue}
              className="h-1.5 w-full bg-gray-100 rounded-full [&>div]:bg-[#2694C6]"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}