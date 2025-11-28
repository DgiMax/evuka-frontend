"use client";

import Image from "next/image";
import Link from "next/link";

interface EventCardProps {
  title: string;
  description: string;
  dateLocation: string;
  imageSrc: string;
  buttonHref: string;
}

export default function EventCardComponent({
  title,
  description,
  dateLocation,
  imageSrc,
  buttonHref,
}: EventCardProps) {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    (e.target as HTMLImageElement).src =
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="#a0a0a0" viewBox="0 0 24 24"><rect width="24" height="24" rx="4"/><path fill="#fff" d="M20 6.5l-6 6-3-3-5 5v-3l5-5 3 3 6-6z"/></svg>';
  };

  return (
    <Link
      href={buttonHref}
      className="block max-w-xs w-full rounded overflow-hidden bg-cyan-600 p-1"
    >
      {/* Image */}
      <div className="relative h-36 bg-gray-100 rounded">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover rounded"
          onError={handleError}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between min-h-[160px] text-center text-white p-3 bg-cyan-600">
        {/* Text */}
        <div className="space-y-1">
          <h4 className="text-lg font-bold leading-tight">{title}</h4>
          <p className="text-sm opacity-90 line-clamp-3">{description}</p>
          <p className="text-xs font-semibold">{dateLocation}</p>
        </div>

        {/* Fixed button */}
        <button className="mt-4 bg-white text-cyan-600 font-medium text-base py-2 px-6 rounded hover:bg-gray-100 transition duration-200">
          Reserve Spot
        </button>
      </div>
    </Link>
  );
}
