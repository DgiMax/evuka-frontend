import TestimonialCardComponent from "@/components/cards/TestimonialCardComponent";

const testimonials = [
  {
    id: 1,
    statement: "Learning coding in Kiswahili made me believe tech is for me too.",
    name: "Amina",
    age: 16,
    city: "Nairobi",
    imageSrc: "/Amina.png",
  },
  {
    id: 2,
    statement:
      "The vocational course gave me the skills and confidence to start my own small craft business.",
    name: "Kwame",
    age: 28,
    city: "Accra",
    imageSrc: "/Kwame.png",
  },
  {
    id: 3,
    statement:
      "The resources for CBC are invaluable. They saved me hours of lesson planning every week.",
    name: "Zuri",
    age: 35,
    city: "Kampala",
    imageSrc: "/Kampala.png",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-12 sm:py-20 bg-background">
      <div className="container mx-auto px-6 max-w-6xl text-center">
        <h4 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2">
          Voices From Our Community
        </h4>
        <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
          Hear from learners, creators, and educators shaping the future of
          culture and technology.
        </p>

        {/* Added 'justify-items-center' to center cards within their columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {testimonials.map((testimonial) => (
            <TestimonialCardComponent
              key={testimonial.id}
              statement={testimonial.statement}
              name={testimonial.name}
              age={testimonial.age}
              city={testimonial.city}
              imageSrc={testimonial.imageSrc}
            />
          ))}
        </div>
      </div>
    </section>
  );
}