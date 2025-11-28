"use client";

import React from "react";
import Link from "next/link";
import { useCart, CartItem } from "@/context/CartContext";
import { toast } from "sonner";
import { WishlistButton } from "../ui/WishlistButton"; // Ensure this path is correct
import { useActiveOrg } from "@/lib/hooks/useActiveOrg"; // ✅ Import the hook

type StarRatingProps = {
  rating: number;
  reviewCount: number;
};

type CourseCardProps = {
  slug: string;
  title: string;
  description: string;
  instructor: string; // Assuming this is instructor_name from serializer
  rating: number;
  reviewCount: number;
  price: string; // Already formatted as 'KES XXX'
  thumbnail?: string;
  is_enrolled: boolean;
};

// --- STAR ICON (Unchanged) ---
const StarIcon = ({
  filled = true,
  className = "w-5 h-5",
}: {
  filled?: boolean;
  className?: string;
}) => (
  <svg
    className={`${className} ${filled ? "text-yellow-400" : "text-gray-300"}`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.176 0l-3.368 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
  </svg>
);

// --- STAR RATING (Unchanged) ---
const StarRating = ({ rating, reviewCount }: StarRatingProps) => (
  <div className="flex items-center space-x-1">
    {/* Display stars only if rating is positive */}
    {rating > 0 && [...Array(5)].map((_, i) => (
       <StarIcon key={i} filled={i < Math.round(rating)} /> // Use Math.round for better representation
    ))}
    {/* Display review count only if positive */}
    {reviewCount > 0 && (
      <span className="text-gray-600 text-sm ml-1">
        ({reviewCount.toLocaleString()})
      </span>
    )}
     {/* Fallback if no rating/reviews */}
     {rating <= 0 && reviewCount <= 0 && (
        <span className="text-gray-500 text-xs italic">No reviews yet</span>
     )}
  </div>
);

// --- MAIN CARD COMPONENT ---
const LongCourseCard = ({
  slug,
  title,
  description,
  instructor,
  rating,
  reviewCount,
  price, // Expecting formatted price like 'KES 1000' or 'Free'
  thumbnail,
  is_enrolled,
}: CourseCardProps) => {
  const { activeSlug } = useActiveOrg(); // ✅ Get the active context

  // ✅ Dynamically create the correct links based on the active context
  const courseDetailHref = activeSlug
    ? `/${activeSlug}/courses/${slug}`
    : `/courses/${slug}`;
  const courseLearningHref = activeSlug
    ? `/${activeSlug}/course-learning/${slug}` // Adjusted path
    : `/course-learning/${slug}`;            // Adjusted path

  const { addToCart } = useCart();

const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  e.stopPropagation();

  const priceValue = price && price.startsWith("KES")
    ? parseFloat(price.split(" ")[1])
    : 0;

  const itemToAdd: CartItem = {
    type: "course",
    slug,
    title,
    instructor_name: instructor || "Unknown Instructor",
    price,
    priceValue,
    thumbnail,
  };

  addToCart(itemToAdd);

  toast.success(`${title} added to cart`);
};


  return (
    <div className="w-full max-w-4xl mx-auto bg-white border border-gray-200 p-3 flex flex-col sm:flex-row gap-4 rounded hover:shadow-sm transition-shadow duration-300">
      {/* IMAGE */}
      <div className="w-full sm:w-1/3 md:w-1/3 flex justify-center items-center flex-shrink-0"> {/* Added flex-shrink-0 */}
        <Link
          href={courseDetailHref} // ✅ Use dynamic link
          className="relative aspect-video bg-gray-100 flex items-center justify-center overflow-hidden rounded-md w-full"
        >
           <img
             // Provide a default placeholder
             src={thumbnail || "https://placehold.co/320x180/eee/ccc?text=Course"}
             alt={title}
             className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" // Use group-hover
           />
        </Link>
      </div>

      {/* CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* ✅ Use dynamic link */}
        <Link href={courseDetailHref}>
          <h3 className="font-bold text-lg text-gray-900 hover:text-[#2694C6] transition-colors line-clamp-1"> {/* Added line-clamp */}
            {title}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description || 'No description provided.'}</p>
        <p className="text-xs text-gray-500 mt-2">{instructor || 'Unknown Instructor'}</p>

        <div className="mt-2">
          {/* Use Math.max to ensure reviewCount isn't negative */}
          <StarRating rating={rating || 0} reviewCount={Math.max(0, reviewCount || 0)} />
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between flex-wrap gap-2"> {/* Added flex-wrap and gap */}

          {is_enrolled ? (
            <span className="text-sm font-semibold bg-green-100 text-green-700 py-1 px-3 rounded-full whitespace-nowrap"> {/* Added whitespace-nowrap */}
              Enrolled
            </span>
          ) : (
            // Display 'Free' if price is not a typical currency format or is 0
            <p className="font-bold text-lg text-gray-900">
              {price && price.startsWith('KES') && parseFloat(price.split(' ')[1]) > 0 ? price : 'Free'}
            </p>
          )}

          {is_enrolled ? (
            <Link
              href={courseLearningHref} // ✅ Use dynamic link
              className="bg-green-600 text-white font-semibold py-2 px-5 rounded text-sm hover:bg-green-700 transition-colors whitespace-nowrap" // Added whitespace-nowrap
            >
              Continue Learning
            </Link>
          ) : (
            <div className="flex items-center space-x-3">
              {/* Ensure WishlistButton receives the correct slug */}
              <WishlistButton slug={slug} type="course" />
              <button
                className="bg-[#2694C6] text-white font-semibold py-2 px-5 rounded-md text-sm hover:bg-[#1f7ba5] transition-colors whitespace-nowrap" // Added whitespace-nowrap
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default LongCourseCard;