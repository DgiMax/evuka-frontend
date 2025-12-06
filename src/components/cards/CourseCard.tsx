"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

interface CourseCardProps {
  title: string;
  description: string;
  rating: number;
  reviewCount: number;
  imageSrc: string;
  courseHref: string;
  className?: string; // Added this
}

export default function CourseCard({
  title,
  description,
  rating,
  reviewCount,
  imageSrc,
  courseHref,
  className, // Added this
}: CourseCardProps) {
  const renderStars = () => {
    const fullStars = Math.round(rating);
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < fullStars ? "fill-amber-400 text-amber-400" : "fill-muted-foreground/70 text-muted-foreground/70"
        }`}
      />
    ));
  };

  return (
    <Link
      href={courseHref}
      // Appended className to the end so you can override styles from the parent
      className={`block group max-w-xs rounded overflow-hidden px-1 py-1 bg-primary ${className || ""}`}
    >
      <div className="relative h-32 w-full bg-muted rounded">
        <Image
          src={imageSrc}
          alt={title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover rounded"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#a0a0a0"><path d="M4 4h16v16H4zM20 6.5l-6 6-3-3-5 5v-3l5-5 3 3 6-6z"/></svg>';
          }}
        />
      </div>

      <div className="bg-primary text-secondary-foreground text-center p-4">
        <h3 className="text-xl font-extrabold mb-1 leading-tight line-clamp-3">
          {title}
        </h3>
        
        <p className="text-sm opacity-95 line-clamp-2 mb-3">
          {description}
        </p>

        <div className="flex items-center justify-center space-x-1">
          {renderStars()}
          <span className="text-sm font-semibold opacity-80">({reviewCount.toLocaleString()})</span>
        </div>
      </div>
    </Link>
  );
}