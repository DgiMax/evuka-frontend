"use client";

import Image from 'next/image';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  const titlePart1 = "Rooted in";
  const titlePart2 = "Rising with";
  const highlight1 = "culture";
  const highlight2 = "technology";
  const description = "Discover culture-rich learning experiences that blend African heritage with digital skills for the future.";

  return (
    <section className="relative overflow-hidden bg-background pt-12 pb-16 lg:pt-24 lg:pb-24">
      
      {/* 🟢 NEW: African-Inspired Geometric Texture (Subtle Overlay) */}
      <div 
        className="absolute inset-0 -z-20 opacity-[0.03] pointer-events-none"
        style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
        }}
      />

      {/* Background Decoration (Gradient Blobs) - Kept for modern blend */}
      <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] bg-primary/10 blur-[100px] rounded-full opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 -z-10 h-[300px] w-[300px] bg-secondary/20 blur-[80px] rounded-full opacity-60 pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          
          {/* LEFT: Text Content */}
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
            
            {/* Badge */}
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-background/50 px-3 py-1 text-sm font-medium text-primary mb-5 backdrop-blur-sm shadow-sm">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              <span>Future-Ready Learning</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15] mb-5">
              {titlePart1}{' '}
              <span className="text-primary relative inline-block">
                {highlight1}
                {/* SVG Underline Decoration - Stylized brush stroke */}
                <svg className="absolute w-full h-3 -bottom-1.5 left-0 text-primary/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span>
              .
              <br className="hidden sm:block" />
              {titlePart2}{' '}
              <span className="text-primary">
                {highlight2}
              </span>
              .
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground mb-7 max-w-lg leading-relaxed">
              {description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button asChild size="lg" className="h-11 px-8 text-base font-semibold shadow-md rounded-md bg-primary hover:bg-primary/90 text-primary-foreground transition-all">
                <Link href="/signup">
                  Start Learning <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-11 px-8 text-base font-semibold border-2 bg-transparent rounded-md hover:bg-secondary/20">
                <Link href="/creator-onboarding">
                  Become a Creator
                </Link>
              </Button>
            </div>
          </div>

          {/* RIGHT: Image Content */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative mt-8 lg:mt-0">
            
            <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px]">
              
              {/* Spinning Circle - Changed border to be slightly thicker/more distinct */}
              <div className="absolute inset-4 rounded-full border-2 border-dashed border-primary/20 animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl" />

              <Image
                src="/heroSectionImage.png"
                alt="Young woman rooted in culture, rising with technology"
                fill
                priority
                className="object-contain drop-shadow-xl"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}