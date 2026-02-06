"use client";

import Link from "next/link";
import { BookOpen, Search, Bookmark, ArrowRight, Library } from "lucide-react";

const libraryFeatures = [
  {
    title: "Vast Digital Repository",
    description:
      "Access a high-quality collection of textbooks, research papers, and literary works curated specifically for your academic and professional growth.",
    icon: Library,
  },
  {
    title: "Precision Research",
    description:
      "Find exactly what you need. Our advanced indexing allows you to search through thousands of volumes by subject, author, or specific level.",
    icon: Search,
  },
  {
    title: "Curated Collections",
    description:
      "Save and organize resources into your personal reading list. Sync your research materials directly with your active courses and levels.",
    icon: Bookmark,
  },
];

export default function LibraryEcosystemSection() {
  return (
    <section className="py-16 sm:py-24 bg-primary text-primary-foreground overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          <div className="lg:w-1/2 space-y-8 text-center lg:text-left w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-widest">
              <BookOpen className="w-3 h-3" /> E-Library Ecosystem
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight">
              A World of Knowledge <br /> 
              <span className="opacity-70 font-light italic text-2xl sm:text-4xl">At Your Fingertips.</span>
            </h2>
            
            <p className="text-lg text-primary-foreground/80 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Knowledge shouldn't be scattered. The Evuka E-Library is a centralized hub 
              for deep research and academic excellence. From specialized manuscripts 
              to global textbooks, we provide the references you need to master your field.
            </p>

            <div className="hidden lg:block pt-4">
              <Link
                href="/books"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary font-black px-8 py-4 rounded-md shadow-xl hover:bg-gray-100 transition-all active:scale-95 group"
              >
                OPEN LIBRARY
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="lg:w-1/2 grid grid-cols-1 gap-4 w-full">
            {libraryFeatures.map((feature, index) => (
              <div
                key={index}
                className="group flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 p-6 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="shrink-0">
                  <div className="p-3 rounded-md bg-white text-primary shadow-lg group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-bold tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-primary-foreground/70 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:hidden w-full pt-4">
            <Link
              href="/books"
              className="flex items-center justify-center gap-2 bg-white text-primary font-black px-8 py-4 rounded-md shadow-xl hover:bg-gray-100 transition-all active:scale-95 group w-full"
            >
              OPEN LIBRARY
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}