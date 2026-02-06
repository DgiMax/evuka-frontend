"use client";

import Link from "next/link";
import { Unlock, Layers, GraduationCap, ArrowRight } from "lucide-react";

const accessBenefits = [
  {
    title: "Unlock Whole Levels",
    description:
      "Stop buying courses one by one. Subscribe to a specific Grade or Level (e.g., Grade 1) and instantly unlock every course included in that package.",
    icon: Unlock,
  },
  {
    title: "Structured Curriculums",
    description:
      "Follow a clear path. Organizations group courses into Levels (like Primary, High School, or Bootcamp), so you know exactly what to study next.",
    icon: Layers,
  },
  {
    title: "Consistent Quality",
    description:
      "Join a Home School or Institution and learn from a consistent team of teachers with a unified teaching style across all subjects.",
    icon: GraduationCap,
  },
];

export default function OrganizationAccessSection() {
  return (
    <section className="py-16 sm:py-24 bg-[#f7f7f8] border-t border-border/40">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-6">
            More Than Just Courses—Join a <span className="text-primary">School</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            With evuka Organizations, you don't just buy a video. You join a 
            <strong> Level</strong>. Whether it's <em>"Grade 5 Homeschooling"</em> or 
            <em>"Advanced Coding Bootcamp,"</em> get full access to the entire curriculum with one simple membership.
          </p>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {accessBenefits.map((item, index) => (
            <div
              key={index}
              className="group flex flex-col items-center text-center p-8 rounded-md bg-white border border-border hover:shadow-sm hover:border-primary/20 transition-all duration-300"
            >
              {/* Animated Icon Container */}
              <div className="mb-6 p-4 rounded-full bg-primary/5 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <item.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>

              <h3 className="text-xl font-bold text-foreground mb-3">
                {item.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/organizations"
            className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground font-semibold px-8 py-4 rounded-md shadow hover:opacity-90 transition-all"
          >
            Browse Organizations
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </section>
  );
}