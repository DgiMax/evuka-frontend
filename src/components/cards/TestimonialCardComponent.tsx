"use client";

import Image from "next/image";
import React from "react";

interface TestimonialCardProps {
  statement: string;
  imageSrc: string;
  name: string;
  age: number;
  city: string;
}

export default function TestimonialCardComponent({
  statement,
  imageSrc,
  name,
  age,
  city,
}: TestimonialCardProps) {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    (e.target as HTMLImageElement).src = "/default.JPG";
  };

  return (
    // Added 'mx-auto' here
    <div className="max-w-sm w-full mx-auto bg-card p-4 rounded-md border border-border text-card-foreground flex flex-col items-center text-center min-h-[250px]">
      {/* Statement */}
      <div className="flex flex-col items-center space-y-4 flex-grow justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          className="text-primary"
        >
          <path
            fill="currentColor"
            d="M3.691 6.292C5.094 4.771 7.217 4 10 4h1v2.819l-.804.161c-1.37.274-2.323.813-2.833 1.604A2.9 2.9 0 0 0 6.925 10H10a1 1 0 0 1 1 1v7c0 1.103-.897 2-2 2H3a1 1 0 0 1-1-1v-5l.003-2.919c-.009-.111-.199-2.741 1.688-4.789M20 20h-6a1 1 0 0 1-1-1v-5l.003-2.919c-.009-.111-.199-2.741 1.688-4.789C16.094 4.771 18.217 4 21 4h1v2.819l-.804.161c-1.37.274-2.323.813-2.833 1.604A2.9 2.9 0 0 0 17.925 10H21a1 1 0 0 1 1 1v7c0 1.103-.897 2-2 2"
          />
        </svg>

        <p className="text-md font-normal">{statement}</p>
      </div>

      {/* Profile */}
      <div className="flex flex-col items-center space-y-3 mt-6">
        <div className="relative w-16 h-16 rounded-full border border-primary overflow-hidden">
          <Image
            src={imageSrc}
            alt={`Profile picture of ${name}`}
            fill
            className="object-cover"
            onError={handleError}
          />
        </div>

        <p className="text-sm italic text-muted-foreground opacity-90">
          {name}, {age}, {city}
        </p>
      </div>
    </div>
  );
}