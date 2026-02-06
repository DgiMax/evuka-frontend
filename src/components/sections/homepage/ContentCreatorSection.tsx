"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const creatorBenefits = [
  {
    title: "Revenue Share",
    description: "Earn consistent income from every learner who engages with your courses or level packages.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24">
        <g fill="none">
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M6 10h4"
          />
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M21.998 12.5c0-.077.002-.533 0-.565c-.036-.501-.465-.9-1.005-.933c-.035-.002-.076-.002-.16-.002h-2.602C16.446 11 15 12.343 15 14s1.447 3 3.23 3h2.603c.084 0 .125 0 .16-.002c.54-.033.97-.432 1.005-.933c.002-.032.002-.488.002-.565"
          />
          <circle cx="18" cy="14" r="1" fill="currentColor" />
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M10 22h3c3.771 0 5.657 0 6.828-1.172c.809-.808 1.06-1.956 1.137-3.828m0-6c-.078-1.872-.328-3.02-1.137-3.828C18.657 6 16.771 6 13 6h-3C6.229 6 4.343 6 3.172 7.172S2 10.229 2 14s0 5.657 1.172 6.828c.653.654 1.528.943 2.828 1.07M6 6l3.735-2.477a3.24 3.24 0 0 1 3.53 0L17 6"
          />
        </g>
      </svg>
    ),
  },
  {
    title: "Global Exposure",
    description: "Scale your influence. Grow your professional audience across Africa and international markets.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0"
        />
      </svg>
    ),
  },
  {
    title: "Cultural Impact",
    description: "Preserve and celebrate local heritage while sharing your expertise with the next generation.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 48 48">
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.752 26.697s.981 2 3.28 2.617c2.3.616 4.15-.626 4.15-.626m-.548-6.583c1.231-.753 2.78-.21 3.614.969M19.675 20.24c1.23-.754 2.78-.211 3.614.968"
          strokeWidth="1"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m17.84 13.387l-2.554 10.217c-1.04 4.167.32 8.16 6.097 11.407c6.628.077 9.8-2.701 10.983-6.83l2.899-10.125s-3.424-2.246-8.381-3.574s-9.046-1.095-9.046-1.095z"
          strokeWidth="1"
        />
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M42.057 24c0 9.255-1.21 11.402-9.03 16.03c-7.817 4.627-10.237 4.627-18.055 0c-7.82-4.628-9.029-6.775-9.029-16.03s1.21-11.402 9.03-16.03c7.817-4.627 10.237-4.627 18.055 0c7.82 4.628 9.029 6.775 9.029 16.03"
          strokeWidth="1"
        />
      </svg>
    ),
  },
];

interface BenefitCardProps {
  title: string;
  description: string;
  icon: ReactNode;
}

function BenefitCard({ title, description, icon }: BenefitCardProps) {
  return (
    <div className="group bg-primary p-8 rounded-md flex flex-col items-center text-center w-full h-full transition-all duration-300 hover:-translate-y-2 border border-white/10 shadow-none">
      <div className="mb-5 text-primary-foreground p-3 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
        {icon}
      </div>
      <h4 className="text-xl font-black text-primary-foreground mb-3 uppercase tracking-tight">
        {title}
      </h4>
      <p className="text-sm leading-relaxed text-primary-foreground/80 font-medium">
        {description}
      </p>
    </div>
  );
}

export default function ContentCreatorSection() {
  return (
    <section className="py-16 sm:py-24 bg-background overflow-hidden shadow-none">
      <div className="container mx-auto px-6 max-w-6xl text-center">
        
        <div className="mb-16 space-y-4">
          <Badge variant="outline" className="px-4 py-1 border-primary/30 text-primary bg-primary/5 rounded-full uppercase text-[10px] font-bold tracking-[0.2em] shadow-none">
            Creators & Educators
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-foreground tracking-tighter">
            Share Your Knowledge. <br className="hidden sm:block" />
            <span className="text-primary">Build Your Legacy.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Whether you are an educator, storyteller, or industry trainer, Evuka provides the ecosystem to reach motivated learners and monetize your expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 shadow-none">
          {creatorBenefits.map((benefit) => (
            <BenefitCard
              key={benefit.title}
              title={benefit.title}
              description={benefit.description}
              icon={benefit.icon}
            />
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="https://tutors.e-vuka.com/onboarding"
            className="w-full sm:w-auto group flex items-center justify-center gap-2 bg-secondary text-secondary-foreground font-black text-sm uppercase tracking-widest py-4 px-10 rounded-md transition-all duration-300 hover:opacity-90 hover:gap-4 shadow-none active:scale-95"
          >
            Start Creating
            <ArrowRight className="w-4 h-4" />
          </Link>
          
          <p className="text-[11px] uppercase font-bold text-muted-foreground tracking-widest sm:ml-4">
            Join 500+ educators today
          </p>
        </div>

      </div>
    </section>
  );
}