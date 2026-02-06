"use client";

import dynamic from 'next/dynamic';

const SectionSkeleton = () => (
  <div className="w-full py-16 sm:py-24 bg-white animate-pulse">
    <div className="container mx-auto px-6 max-w-7xl">
      <div className="h-8 w-48 bg-gray-200 rounded mb-6 mx-auto lg:mx-0"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="h-64 bg-gray-100 rounded-md"></div>
        <div className="h-64 bg-gray-100 rounded-md"></div>
        <div className="h-64 bg-gray-100 rounded-md"></div>
      </div>
    </div>
  </div>
);

const HeroSection = dynamic(() => import('@/components/sections/homepage/HeroSection'), {
  loading: () => <div className="w-full h-[80vh] bg-gray-50 animate-pulse" />,
});

const WhyEVukaSection = dynamic(() => import('@/components/sections/homepage/WhyEVukaSection'), {
  loading: () => <SectionSkeleton />,
});

const FeaturedCoursesSection = dynamic(() => import('@/components/sections/homepage/FeaturedCoursesSection'), {
  loading: () => <SectionSkeleton />,
});

const EventsCommunitySection = dynamic(() => import('@/components/sections/homepage/EventsCommunitySection'), {
  loading: () => <SectionSkeleton />,
});

const OrganizationAccessSection = dynamic(() => import('@/components/sections/homepage/OrganizationAccessSection'), {
  loading: () => <SectionSkeleton />,
});

const LibrarySection = dynamic(() => import('@/components/sections/homepage/LibrarySection'), {
  loading: () => <div className="w-full py-20 bg-primary/10 animate-pulse h-96" />,
});

const ContentCreatorSection = dynamic(() => import('@/components/sections/homepage/ContentCreatorSection'), {
  loading: () => <SectionSkeleton />,
});

const VisionImpactSection = dynamic(() => import('@/components/sections/homepage/VisionImpactSection'), {
  loading: () => <div className="w-full h-64 bg-gray-50 animate-pulse" />,
});

const TestimonialsSection = dynamic(() => import('@/components/sections/homepage/TestimonialsSection'), {
  loading: () => <SectionSkeleton />,
});

export default function HomePage() {
  return (
    <>
        <HeroSection />
        <WhyEVukaSection />
        <FeaturedCoursesSection />
        <EventsCommunitySection />
        <OrganizationAccessSection />
        <LibrarySection />
        <ContentCreatorSection />
        <VisionImpactSection />
        <TestimonialsSection />
    </>
  );
}