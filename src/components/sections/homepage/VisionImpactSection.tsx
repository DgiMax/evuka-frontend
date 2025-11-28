"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { Play } from "lucide-react";

export default function VisionImpactSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "0px" }
    );

    if (videoRef.current) observer.observe(videoRef.current);

    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;

    if (inView) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [inView]);

  return (
    <section className="py-16 sm:py-24 bg-gray-900 text-white">
      <div className="container mx-auto px-6 max-w-5xl">
        <h4 className="text-2xl sm:text-3xl font-extrabold text-center mb-10">
          Our Vision & Impact
        </h4>

        <div className="flex flex-col md:flex-row items-center justify-between gap-10 text-center md:text-left">
          <div className="w-full md:w-3/5">
            <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl relative">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                loop
                muted
                playsInline
                poster="/video-thumbnail.jpg"
              >
                <source
                  src="https://www.w3schools.com/html/mov_bbb.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Play className="w-16 h-16 text-white opacity-80" fill="white" />
              </div>
            </div>
          </div>

          <div className="w-full md:w-2/5 text-lg">
            <p className="mb-8 leading-relaxed text-gray-300">
              At <strong>evuka</strong>, we believe learning should be rooted in
              identity. By combining indigenous languages, cultural experiences,
              and cutting-edge technology, we empower learners to succeed
              globally while staying connected to their heritage.
            </p>

            <Link
              href="#"
              className="inline-block bg-primary text-primary-foreground font-semibold py-3 px-8 rounded-md hover:bg-primary/90 transition duration-200"
            >
              Be Part of the Vision
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
