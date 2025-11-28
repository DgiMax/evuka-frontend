import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function EventDetailSkeleton() {
  return (
    <SkeletonTheme baseColor="#e5e7eb" highlightColor="#f3f4f6">
      <div className="bg-white text-gray-800 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          <div className="lg:grid lg:grid-cols-3 lg:gap-x-8 xl:gap-x-10">
            
            {/* SIDEBAR SKELETON */}
            {/* Matches logic: order-2 on mobile (bottom), order-1 on desktop (left) */}
            <aside className="mt-8 lg:mt-0 order-2 lg:order-1">
              <div className="sticky top-2">
                <div className="border border-gray-200 rounded-lg bg-white p-6 shadow-sm">
                  {/* Last Updated */}
                  <Skeleton width="50%" height={12} className="mb-4" />

                  {/* Date/Time/Location Rows */}
                  <div className="space-y-3 mt-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Skeleton circle width={20} height={20} />
                        <Skeleton width="80%" height={16} />
                      </div>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="mt-6 mb-4">
                    <Skeleton width="40%" height={36} />
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                     <Skeleton height={48} borderRadius={8} />
                     <Skeleton height={48} borderRadius={8} />
                  </div>
                </div>
              </div>
            </aside>

            {/* MAIN CONTENT SKELETON */}
            <main className="lg:col-span-2 order-1 lg:order-2">
              
              {/* Hero Image */}
              <div className="aspect-video bg-gray-100 rounded-md mb-6 overflow-hidden relative">
                <Skeleton height="100%" className="absolute inset-0" />
              </div>

              {/* Title */}
              <Skeleton height={40} width="90%" className="mb-4" />
              
              {/* Overview */}
              <div className="mb-6 space-y-2">
                <Skeleton count={3} />
              </div>

              {/* Organizer / Meta */}
              <div className="flex gap-4 mb-8">
                 <Skeleton width={150} />
                 <Skeleton width={100} />
              </div>

              {/* Agenda Box Skeleton */}
              <div className="border border-gray-200 rounded p-6 my-6">
                <Skeleton width="30%" height={24} className="mb-4" />
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4">
                       <Skeleton width={60} height={20} />
                       <div className="flex-1">
                          <Skeleton height={20} className="mb-1" />
                          <Skeleton count={2} height={12} />
                       </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Learning Objectives Skeleton */}
              <div className="border border-gray-200 rounded p-6 my-8">
                 <Skeleton width="40%" height={24} className="mb-4" />
                 <div className="space-y-2">
                    <Skeleton count={4} />
                 </div>
              </div>

              {/* Long Description */}
              <div className="space-y-2 mt-8">
                 <Skeleton width="25%" height={28} className="mb-4" />
                 <Skeleton count={6} />
                 <Skeleton width="80%" />
                 <Skeleton count={4} />
              </div>

            </main>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
}