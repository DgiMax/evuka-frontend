import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function AnnouncementsSkeleton() {
  return (
    <SkeletonTheme baseColor="#e5e7eb" highlightColor="#f3f4f6">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        {/* Header Section */}
        <div className="mb-8">
           <Skeleton width={250} height={32} className="mb-2" />
           <Skeleton width={400} height={16} />
        </div>

        {/* List of Announcement Cards */}
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-start p-5 border border-gray-100 rounded-xl bg-white shadow-sm">
              
              {/* Icon Placeholder (Left) */}
              <div className="flex-shrink-0 mr-4">
                 <Skeleton circle width={40} height={40} />
              </div>

              {/* Content (Right) */}
              <div className="flex-grow min-w-0">
                
                {/* Title & Date Row */}
                <div className="flex justify-between items-start gap-4 mb-2">
                   <Skeleton width="60%" height={20} />
                   <Skeleton width={80} height={14} />
                </div>

                {/* Content Lines */}
                <div className="space-y-2 mb-3">
                   <Skeleton width="100%" height={14} />
                   <Skeleton width="80%" height={14} />
                </div>

                {/* Footer (Org / User chips) */}
                <div className="flex gap-3">
                   <Skeleton width={120} height={24} borderRadius={6} />
                   <Skeleton width={100} height={24} borderRadius={6} />
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </SkeletonTheme>
  );
}