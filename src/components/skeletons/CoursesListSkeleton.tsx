import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface CoursesListSkeletonProps {
  sidebarOnly?: boolean;
}

export default function CoursesListSkeleton({ sidebarOnly = false }: CoursesListSkeletonProps) {
  
  // --- PART 1: Sidebar Skeleton Content ---
  if (sidebarOnly) {
    return (
      <SkeletonTheme baseColor="#e5e7eb" highlightColor="#f3f4f6">
        <div className="space-y-8">
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
          
           {/* Price Section */}
           <div>
             <Skeleton height={24} width="40%" className="mb-4" />
             <Skeleton height={10} className="mb-4 rounded-full" />
             <div className="flex justify-between gap-2">
                 <Skeleton height={30} width={60} />
                 <Skeleton height={30} width={60} />
             </div>
           </div>
        </div>
      </SkeletonTheme>
    );
  }

  // --- PART 2: Course List Skeleton Content (Default) ---
  return (
    <SkeletonTheme baseColor="#e5e7eb" highlightColor="#f3f4f6">
      <div className="space-y-4">
        {/* Optional Header Skeleton */}
        {/* <Skeleton height={32} width={200} className="mb-6" /> */}

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
                <div className="flex gap-2">
                   <Skeleton height={36} width={36} circle /> {/* Wishlist */}
                   <Skeleton height={36} width={100} /> {/* Add to Cart */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SkeletonTheme>
  );
}