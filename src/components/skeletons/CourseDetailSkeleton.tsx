import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function CourseDetailSkeleton() {
  return (
    <SkeletonTheme baseColor="#e5e7eb" highlightColor="#f3f4f6">
      <div className="bg-white text-gray-800 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Grid Layout: Sidebar on Left, Main Content on Right */}
          <div className="lg:grid lg:grid-cols-3 lg:gap-x-8 xl:gap-x-10">
            
            {/* LEFT COLUMN: Sidebar Skeleton */}
            <aside className="mt-2 lg:mt-0 lg:col-start-1 lg:row-start-1">
              <div className="sticky top-2">
                <div className="border border-gray-200 rounded bg-white p-6">
                  {/* Updated date */}
                  <Skeleton width="40%" height={12} className="mb-4" />
                  
                  {/* Level & Student count */}
                  <div className="space-y-1 mb-3">
                    <Skeleton width="60%" height={14} />
                    <Skeleton width="50%" height={14} />
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map(i => (
                        <Skeleton key={i} circle width={20} height={20} />
                    ))}
                  </div>

                  {/* Price */}
                  <Skeleton width="50%" height={32} className="mb-4" />

                  {/* Buttons (Add to Cart / Buy Now) */}
                  <Skeleton height={48} className="w-full mb-3 rounded" />
                  <Skeleton height={48} className="w-full rounded" />
                </div>
              </div>
            </aside>

            {/* RIGHT COLUMN: Main Content Skeleton */}
            <main className="lg:col-span-2 lg:col-start-2 lg:row-start-1">
              {/* Video Player Placeholder */}
              <div className="aspect-video bg-gray-100 rounded-md mb-6 overflow-hidden">
                <Skeleton height="100%" className="h-full" />
              </div>

              {/* Title */}
              <Skeleton height={32} width="80%" className="mb-2" />
              
              {/* Short Description */}
              <Skeleton count={2} height={16} className="mb-4" />

              {/* Instructor Info */}
              <div className="mb-6 flex items-center gap-2">
                <Skeleton width={120} height={14} />
                <Skeleton width={200} height={14} />
              </div>

              {/* Org & Category Info */}
              <Skeleton width="60%" height={14} className="mb-6" />

              {/* Learning Objectives Box */}
              <div className="border border-gray-200 rounded-md p-6 my-8">
                <Skeleton width="40%" height={24} className="mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {[1, 2, 3, 4].map(i => (
                      <div key={i} className="flex gap-3">
                         <Skeleton circle width={20} height={20} />
                         <Skeleton width="80%" height={16} />
                      </div>
                   ))}
                </div>
              </div>

              {/* Long Description */}
              <div className="mb-8">
                <Skeleton width="30%" height={28} className="mb-4" />
                <Skeleton count={5} height={16} className="mb-2" />
              </div>

              {/* Course Modules (Accordion style) */}
              <div className="space-y-4">
                 {[1, 2, 3].map(i => (
                    <div key={i} className="border border-gray-200 rounded p-4">
                       <div className="flex justify-between items-center">
                          <div className="w-2/3">
                             <Skeleton height={20} />
                             <Skeleton height={12} width="50%" className="mt-2"/>
                          </div>
                          <Skeleton circle width={24} height={24} />
                       </div>
                    </div>
                 ))}
              </div>

            </main>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
}