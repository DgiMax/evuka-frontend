import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Loader2 } from "lucide-react";

export default function CourseLearningSkeleton() {
  return (
    <SkeletonTheme baseColor="#e5e7eb" highlightColor="#f3f4f6">
      <div className="fixed inset-0 h-screen w-full bg-background font-sans overflow-hidden z-[200]">
        <div className="flex h-full w-full">
          
          <div className="flex-1 flex flex-col min-w-0 h-full relative">
            <div className="h-[64px] border-b border-gray-200 flex items-center justify-between px-4 md:px-6 bg-white shrink-0">
              <div className="w-1/3 md:w-1/4">
                <Skeleton height={18} />
              </div>
              <div className="flex items-center gap-3 md:gap-4">
                 <div className="hidden sm:block">
                   <Skeleton width={60} height={16} />
                 </div>
                 <Skeleton circle height={32} width={32} />
              </div>
            </div>

            <div className="flex-1 overflow-hidden bg-background">
              <div className="w-full max-w-[1600px] mx-auto p-3 md:p-6 space-y-6 md:space-y-8">
                <div className="w-full aspect-video rounded-lg overflow-hidden bg-black/5 relative border border-gray-100">
                   <Skeleton height="100%" className="absolute inset-0" />
                   <div className="absolute inset-0 flex items-center justify-center z-10">
                     <Loader2 className="h-6 w-6 md:h-8 md:w-8 text-gray-300 animate-spin" />
                   </div>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4 md:gap-8 border-b border-gray-200 overflow-hidden">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="pb-3 w-16 md:w-20">
                         <Skeleton height={10} />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 w-full">
                    <Skeleton height={24} width="70%" />
                    <div className="space-y-3">
                      <Skeleton count={3} height={12} />
                      <Skeleton width="45%" height={12} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex w-80 border-l border-gray-200 flex-col bg-white h-full shrink-0">
            <div className="p-5 h-[64px] border-b border-gray-200 flex items-center">
               <Skeleton width={110} height={14} />
            </div>
            
            <div className="flex-1 p-5 space-y-6 overflow-hidden">
              <div className="space-y-2 mb-8">
                  <Skeleton height={8} width="40%" />
                  <Skeleton height={4} />
              </div>

              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3">
                   <Skeleton height={32} width={32} borderRadius={6} />
                   <div className="flex-1">
                     <Skeleton height={8} width="90%" />
                     <Skeleton height={5} width="40%" style={{ marginTop: 6 }} />
                   </div>
                </div>
              ))}
            </div>

            <div className="p-5 border-t border-gray-200 bg-white">
                <div className="flex justify-between mb-3">
                  <Skeleton width={70} height={7} />
                  <Skeleton width={25} height={7} />
                </div>
                <Skeleton height={3} borderRadius={2} />
            </div>
          </div>

        </div>
      </div>
    </SkeletonTheme>
  );
}