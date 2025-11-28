import HeroSection from '@/components/sections/homepage/HeroSection';
import WhyEVukaSection from '@/components/sections/homepage/WhyEVukaSection';
import FeaturedCoursesSection from '@/components/sections/homepage/FeaturedCoursesSection';
import EventsCommunitySection from '@/components/sections/homepage/EventsCommunitySection';
import ContentCreatorSection from '@/components/sections/homepage/ContentCreatorSection';
import VisionImpactSection from '@/components/sections/homepage/VisionImpactSection';
import TestimonialsSection from '@/components/sections/homepage/TestimonialsSection';
import OrganizationAccessSection from '@/components/sections/homepage/OrganizationAccessSection';

export default function HomePage() {
  return (
    <>
        <HeroSection />
        <WhyEVukaSection />
        <FeaturedCoursesSection />
        <EventsCommunitySection />
        <OrganizationAccessSection />
        <ContentCreatorSection />
        <VisionImpactSection />
        <TestimonialsSection />
    </>
  );
}
