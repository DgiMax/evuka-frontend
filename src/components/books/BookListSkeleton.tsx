"use client";

import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface BookListSkeletonProps {
  viewMode?: 'grid' | 'list';
  stateMode?: 'ROOT' | 'PARENT' | 'CHILD';
}

export default function BookListSkeleton({ viewMode = 'grid', stateMode = 'ROOT' }: BookListSkeletonProps) {
  return (
    <SkeletonTheme baseColor="#e5e7eb" highlightColor="#f3f4f6">
      <div className="w-full">
        {/* Navigation Skeleton */}
        <div className="mb-10">
          {stateMode === 'ROOT' ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} height={100} className="rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Skeleton circle height={40} width={40} />
              <Skeleton height={32} width={250} />
            </div>
          )}
        </div>

        {/* Layout: Sidebar + Main Content */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Skeleton */}
          <aside className="hidden lg:block w-[300px] shrink-0">
            <div className="border border-gray-200 rounded-md p-5 bg-white space-y-8">
              {[1, 2, 3].map((section) => (
                <div key={section}>
                  <Skeleton height={20} width="60%" className="mb-4" />
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Skeleton height={16} width={16} />
                        <Skeleton height={14} width="80%" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Main Content Skeleton */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
               <Skeleton height={32} width={200} />
               <div className="flex gap-2">
                 <Skeleton height={32} width={32} />
                 <Skeleton height={32} width={32} />
               </div>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton height={240} className="rounded-md" />
                    <Skeleton height={18} width="90%" />
                    <Skeleton height={14} width="60%" />
                    <Skeleton height={20} width="40%" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="border border-gray-100 rounded-lg p-4 flex gap-6">
                    <Skeleton height={180} width={130} className="rounded-md shrink-0" />
                    <div className="flex-1 space-y-4">
                      <Skeleton height={24} width="70%" />
                      <Skeleton count={2} height={14} />
                      <div className="flex justify-between items-center pt-4">
                        <Skeleton height={20} width={100} />
                        <Skeleton height={36} width={120} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </SkeletonTheme>
  );
}