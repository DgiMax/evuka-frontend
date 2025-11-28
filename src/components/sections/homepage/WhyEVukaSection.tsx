import WhyEVukaComponent from "@/components/cards/WhyEVukaComponent";

// Data for the six feature cards
const dvukaFeatures = [
  {
    title: "Languages",
    description: "Learn in your mother tongue and connect with the world.",
    items: ["Kiswahili", "Kikuyu", "Dholuo", "More Coming Soon"],
    buttonText: "Start Learning a Language",
    buttonHref: "/courses/languages",
    imageSrc: "/whyDVuka/Languages Banner.jpg",
    bgColor: "bg-primary",
  },
  {
    title: "IT & Digital Skills",
    description: "Gain future-ready skills in coding, design, and digital literacy.",
    items: ["Web Development", "Graphic Design", "Digital Marketing", "AI Basics"],
    buttonText: "Explore IT Courses",
    buttonHref: "/courses/it-digital",
    imageSrc: "/whyDVuka/IT & Digital Skills.jpg",
    bgColor: "bg-primary",
  },
  {
    title: "Vocational Training",
    description: "Practical courses to empower careers and entrepreneurship.",
    items: ["Agribusiness", "Fashion & Crafts", "Carpentry", "Electrical Basics"],
    buttonText: "Discover Vocational Skills",
    buttonHref: "/courses/vocational",
    imageSrc: "/whyDVuka/Vocational Training Banner.jpg",
    bgColor: "bg-primary",
  },
  {
    title: "Homeschooling Hub",
    description: "Flexible learning resources for families and learners at home.",
    items: ["Family Plans", "Interactive Lessons", "Parent Resources", "Progress Tracking"],
    buttonText: "Start Homeschooling",
    buttonHref: "/homeschooling",
    imageSrc: "/whyDVuka/Homeschooling Hub Banner.jpg",
    bgColor: "bg-primary",
  },
  {
    title: "CBC-Aligned Learning",
    description: "Supporting Kenya's Competency-Based Curriculum (CBC).",
    items: ["Lesson Support", "Resources", "Student Communities", "Assessment Tools"],
    buttonText: "Explore CBC Courses",
    buttonHref: "/courses/cbc",
    imageSrc: "/whyDVuka/CBC-Aligned Learning Banner.jpg",
    bgColor: "bg-primary",
  },
  {
    title: "Events & Community",
    description: "Where learning meets real-world experience and heritage.",
    items: ["Poetry Nights", "Digital Storytelling", "Cultural Festivals", "Hackathons"],
    buttonText: "Join an Event",
    buttonHref: "/events",
    imageSrc: "/whyDVuka/Events & Community Banner.jpg",
    bgColor: "bg-primary",
  },
];

export default function WhyEVukaSection() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl text-center">

        {/* Header */}
        <h4 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3">
          Why evuka?
        </h4>

        <p className="text-lg sm:text-xl text-muted-foreground mb-12 mx-auto max-w-[500px]">
          Learning that connects culture, technology, and community.
        </p>

        {/* RESPONSIVE GRID */}
        <div className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-3 
          gap-4 
          sm:gap-6
          place-items-center
        ">
          {dvukaFeatures.map((feature) => (
            <div key={feature.title} className="w-full max-w-sm">
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
