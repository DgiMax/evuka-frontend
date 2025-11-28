import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function EventsSkeleton() {
  return (
    <SkeletonTheme baseColor="#e5e7eb" highlightColor="#f3f4f6">
      <div className="w-full p-4 sm:p-6 lg:p-8 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* LEFT COLUMN: Filters Skeleton */}
          <div className="lg:col-span-1 space-y-8">
            {/* Search Bar Placeholder */}
            <Skeleton height={40} borderRadius={8} />

            {/* Filter Sections (Type, Category, Price) */}
            {[1, 2, 3].map((section) => (
              <div key={section} className="border-t border-gray-100 pt-6">
                <Skeleton height={20} width="60%" className="mb-4" />
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton height={18} width={18} /> {/* Checkbox */}
                      <Skeleton height={16} width="75%" /> {/* Label */}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT COLUMN: Events Grid Skeleton */}
          <div className="lg:col-span-3">
            {/* Header */}
            <Skeleton height={32} width={200} className="mb-6" />

            {/* Grid of Event Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                  {/* Event Image */}
                  <div className="relative w-full aspect-[4/3] md:aspect-[16/9]">
                    <Skeleton height="100%" className="absolute inset-0" />
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-3 flex-1 flex flex-col">
                    {/* Date / Badge */}
                    <div className="flex justify-between items-center">
                      <Skeleton width={100} height={14} />
                      <Skeleton width={60} height={20} borderRadius={12} />
                    </div>

                    {/* Title */}
                    <Skeleton height={24} width="90%" />
                    
                    {/* Location/Meta */}
                    <div className="space-y-2 mt-2">
                       <Skeleton height={16} width="60%" />
                       <Skeleton height={16} width="40%" />
                    </div>

                    {/* Footer / Price */}
                    <div className="pt-4 mt-auto flex justify-between items-center border-t border-gray-50">
                       <Skeleton width={80} height={24} />
                       <Skeleton circle width={32} height={32} />
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