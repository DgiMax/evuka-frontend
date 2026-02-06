"use client";

import WhyEVukaComponent from "@/components/cards/WhyEVukaComponent";

const dvukaFeatures = [
  {
    title: "Languages",
    description: "Learn in your mother tongue and connect with the world.",
    items: ["Kiswahili", "Kikuyu", "Dholuo", "More Coming Soon"],
    buttonText: "Start Learning a Language",
    buttonHref: "/courses?category=languages",
    imageSrc: "/whyDVuka/languages-banner.jpg",
    bgColor: "bg-primary",
  },
  {
    title: "IT & Digital Skills",
    description: "Gain future-ready skills in coding, design, and digital literacy.",
    items: ["Web Development", "Graphic Design", "Digital Marketing", "AI Basics"],
    buttonText: "Explore IT Courses",
    buttonHref: "/courses?category=it-digital-skills",
    imageSrc: "/whyDVuka/it-digital-skills.jpg",
    bgColor: "bg-primary",
  },
  {
    title: "Vocational Training",
    description: "Practical courses to empower careers and entrepreneurship.",
    items: ["Agribusiness", "Fashion & Crafts", "Carpentry", "Electrical Basics"],
    buttonText: "Discover Vocational Skills",
    buttonHref: "/courses?category=vocational-training",
    imageSrc: "/whyDVuka/vocational-training-banner.jpg",
    bgColor: "bg-primary",
  },
  {
    title: "Homeschooling Hub",
    description: "Flexible learning resources for families and learners at home.",
    items: ["Family Plans", "Interactive Lessons", "Parent Resources", "Progress Tracking"],
    buttonText: "Start Homeschooling",
    buttonHref: "/organizations/browse",
    imageSrc: "/whyDVuka/homeschooling-hub-banner.jpg",
    bgColor: "bg-primary",
  },
  {
    title: "CBC-Aligned Learning",
    description: "Supporting Kenya's Competency-Based Curriculum (CBC).",
    items: ["Lesson Support", "Resources", "Student Communities", "Assessment Tools"],
    buttonText: "Explore CBC Courses",
    buttonHref: "/courses?category=competency-based-curriculum",
    imageSrc: "/whyDVuka/cbc-aligned-learning-banner.jpg",
    bgColor: "bg-primary",
  },
  {
    title: "Events & Community",
    description: "Where learning meets real-world experience and heritage.",
    items: ["Poetry Nights", "Digital Storytelling", "Cultural Festivals", "Hackathons"],
    buttonText: "Join an Event",
    buttonHref: "/events",
    imageSrc: "/whyDVuka/events-community-banner.jpg",
    bgColor: "bg-primary",
  },
];

export default function WhyEVukaSection() {
  return (
    <section className="py-16 sm:py-24 bg-white border-t border-border/40 shadow-none overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12 sm:mb-16">
          <h4 className="text-3xl sm:text-4xl font-black text-foreground mb-4 tracking-tight">
            Why Evuka?
          </h4>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed font-medium">
            Learning that connects culture, technology, and community.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 shadow-none">
          {dvukaFeatures.map((feature) => (
            <div 
              key={feature.title} 
              className="w-full flex shadow-none transition-transform duration-300 hover:-translate-y-1"
            >
              <WhyEVukaComponent
                title={feature.title}
                description={feature.description}
                items={feature.items}
                buttonText={feature.buttonText}
                buttonHref={feature.buttonHref}
                imageSrc={feature.imageSrc}
                bgColor={feature.bgColor}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}