"use client";
import Link from "next/link";
import Image from "next/image";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg"; // ✅ Import the hook

// FIXED: The Event type now matches the data from your API
export type Event = {
  slug: string;
  title: string;
  start_time: string;
  organizer_name: string;
  banner_image: string | null;
  course_title: string; // Make sure your EventListSerializer includes course_title
};

// Helper function to format the date nicely
const formatEventDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    // timeZone: 'Africa/Nairobi' // Optional: Specify timezone if needed globally
  };
  try {
    // Add basic error handling for invalid dates
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return date.toLocaleDateString("en-US", options);
  } catch (e) {
    console.error("Error formatting date:", e);
    return "Invalid Date";
  }
};

export default function EventCard({ event }: { event: Event }) {
  const { activeSlug } = useActiveOrg(); // ✅ Get the current context

  // FIXED: Using new property names like 'start_time' and 'organizer_name'
  const { slug, title, start_time, organizer_name, banner_image, course_title } = event;

  // ✅ Dynamically create the correct link based on the active context
  const eventDetailHref = activeSlug
    ? `/${activeSlug}/events/${slug}`
    : `/events/${slug}`;

  return (
    // ✅ Use the dynamic href
    <Link href={eventDetailHref} className="block group border rounded-md overflow-hidden hover:shadow transition-shadow duration-300">
      <div className="relative w-full h-36 bg-gray-200"> {/* Added bg for placeholder */}
        <Image
          // Provide a default placeholder if banner_image is null or empty
          src={banner_image || "https://placehold.co/600x400/2694C6/FFFFFF?text=Event"}
          alt={`Banner for ${title}`}
          fill // Use fill instead of layout
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Add sizes prop for optimization
          style={{ objectFit: "cover" }} // Use style objectFit with fill
        />
      </div>
      <div className="p-4 bg-white">
        <p className="text-sm font-semibold text-[#2694C6] mb-1 truncate">
          {/* Ensure course_title exists or provide fallback */}
          {course_title || 'General Event'}
        </p>
        <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-[#2694C6] transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-600 mt-2">{formatEventDate(start_time)}</p>
        <p className="text-sm text-gray-500 mt-1">
          Hosted by <span className="font-medium">{organizer_name || 'Organizer'}</span>
        </p>
      </div>
    </Link>
  );
}