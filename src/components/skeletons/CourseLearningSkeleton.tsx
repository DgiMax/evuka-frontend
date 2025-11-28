import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Don't forget this import!
import { Loader2 } from "lucide-react";

export default function CourseLearningSkeleton() {
  return (
    // Base color matches your bg-gray-200, Highlight is the "shimmer" (lighter gray)
    <SkeletonTheme baseColor="#e5e7eb" highlightColor="#f3f4f6">
      <div className="flex flex-1 relative w-full h-[calc(100vh-5rem)] overflow-hidden bg-white">
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 w-full">
          
          {/* Course Header Skeleton */}
          <div className="h-16 border-b border-gray-200 flex items-center justify-between px-4 bg-white shrink-0">
            {/* Replaced generic div with Skeleton */}
            <div className="w-1/3">
              <Skeleton height={24} />
            </div>
            {/* Mobile menu icon placeholder */}
            <div className="lg:hidden">
               <Skeleton circle height={32} width={32} />
            </div>
          </div>

          <main className="flex-1 w-full overflow-y-auto p-4 pb-8 space-y-6">
            {/* Video Player / Main Content Skeleton */}
            {/* We keep the container for the aspect ratio, but fill it with a Skeleton */}
            <div className="w-full aspect-video rounded-md overflow-hidden relative">
               <Skeleton height="100%" className="absolute inset-0 top-0 left-0" />
               {/* Optional: Keep the spinner in the middle of the shimmer if you want double feedback */}
               <div className="absolute inset-0 flex items-center justify-center z-10">
                 <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
               </div>
            </div>

            {/* Tabs Skeleton */}
            <div className="flex gap-4 border-b border-gray-200 pb-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-24">
                   <Skeleton height={32} />
                </div>
              ))}
            </div>

            {/* Tab Content Skeleton */}
            <div className="space-y-4 max-w-3xl">
              <div className="w-3/4">
                 <Skeleton height={24} />
              </div>
              <div className="space-y-2">
                <Skeleton count={3} />
                <div className="w-5/6">
                   <Skeleton />
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Sidebar Skeleton (Hidden on Mobile) */}
        <div className="hidden lg:flex w-80 border-l border-gray-200 flex-col bg-gray-50 h-full">
          <div className="p-4 border-b border-gray-200">
             <div className="w-1/2 mb-4">
                <Skeleton height={16} />
             </div>
             <Skeleton height={8} />
          </div>
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-3">
                 {/* Square icon skeleton */}
                 <div>
                    <Skeleton height={40} width={40} borderRadius={4} />
                 </div>
                 <div className="flex-1 py-1">
                   <Skeleton height={12} width="75%" style={{ marginBottom: 6 }} />
                   <Skeleton height={8} width="50%" />
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
}