import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function CoursesListSkeleton() {
  return (
    <SkeletonTheme baseColor="#e5e7eb" highlightColor="#f3f4f6">
      <div className="w-full p-4 sm:p-6 lg:p-8 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* LEFT COLUMN: Filters Skeleton */}
          <div className="lg:col-span-1 space-y-8">
            {/* Filter Section 1 (e.g. Categories) */}
            <div>
              <Skeleton height={24} width="60%" className="mb-4" />
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton height={20} width={20} /> {/* Checkbox */}
                    <Skeleton height={16} width="80%" /> {/* Label */}
                  </div>
                ))}
              </div>
            </div>

            {/* Filter Section 2 (e.g. Levels) */}
            <div>
              <Skeleton height={24} width="50%" className="mb-4" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton height={20} width={20} />
                    <Skeleton height={16} width="70%" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Course List Skeleton */}
          <div className="lg:col-span-3">
            {/* Header */}
            <Skeleton height={32} width={200} className="mb-6" />

            {/* List of LongCourseCards */}
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="border border-gray-100 rounded-lg p-4 flex flex-col md:flex-row gap-4">
                  {/* Thumbnail Image */}
                  <div className="w-full md:w-64 shrink-0">
                    <Skeleton height={160} className="w-full h-full rounded-md" />
                  </div>

                  {/* Course Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      {/* Title & Desc */}
                      <Skeleton height={24} width="90%" className="mb-2" />
                      <Skeleton count={2} height={16} className="mb-3" />
                      
                      {/* Instructor / Meta */}
                      <div className="flex gap-4 mb-2">
                        <Skeleton height={14} width={100} />
                        <Skeleton height={14} width={80} />
                      </div>
                    </div>

                    {/* Footer: Rating & Price */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                      <Skeleton height={20} width={120} /> {/* Stars */}
                      <Skeleton height={24} width={80} />  {/* Price */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </SkeletonTheme>
  );
}