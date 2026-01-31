"use client";

import React from "react";
import Link from "next/link";
import { Star, ShoppingCart, Users, BarChart } from "lucide-react";
import { useCart, CartItem } from "@/context/CartContext";
import { toast } from "sonner";
import { WishlistButton } from "../ui/WishlistButton";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg";
import { cn } from "@/lib/utils";

export function GridCourseCard({ 
  slug, title, short_description, instructor_name, rating_avg, num_students, 
  price, thumbnail, is_enrolled, category, level, progress 
}: any) {
  const { activeSlug } = useActiveOrg();
  const { addToCart } = useCart();

  const courseDetailHref = activeSlug ? `/${activeSlug}/courses/${slug}` : `/courses/${slug}`;
  const courseLearningHref = activeSlug ? `/${activeSlug}/course-learning/${slug}` : `/course-learning/${slug}`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const isFree = parseFloat(price) === 0;
    const item: CartItem = {
      type: "course", slug, title, instructor_name: instructor_name || "Expert Instructor",
      price: isFree ? "Free" : `KES ${price}`,
      priceValue: parseFloat(price) || 0,
      thumbnail,
    };
    addToCart(item);
    toast.success(`${title} added to cart`);
  };

  return (
    <div className="group bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col h-full transition-all duration-200 hover:border-primary relative">
      <Link href={courseDetailHref} className="relative aspect-video block bg-gray-50 border-b border-gray-100">
        <img 
          src={thumbnail || "https://placehold.co/320x180?text=Course"} 
          alt={title} 
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" 
        />
        {category && (
          <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-white/95 text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded text-primary uppercase shadow-sm z-10">
            {category}
          </div>
        )}
        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          {!is_enrolled && <WishlistButton slug={slug} type="course" />}
        </div>
      </Link>
      
      <div className="p-2.5 sm:p-4 flex flex-col flex-1">
        <Link href={courseDetailHref} className="mb-1">
          <h3 className="font-bold text-[14px] sm:text-[16px] leading-tight text-gray-900 line-clamp-2 min-h-[auto] sm:min-h-[2.4rem] group-hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>
        
        <p className="text-[14px] text-gray-500 mb-2 line-clamp-3 leading-snug flex-1 hidden sm:block">
          {short_description}
        </p>

        <p className="text-[11px] sm:text-[13px] text-gray-400 font-bold mb-1 sm:mb-3 truncate">
          {instructor_name}
        </p>

        <div className="flex flex-col gap-1.5 mb-1.5 sm:mb-3 border-t border-gray-50 pt-1.5 sm:pt-2">
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={14} 
                  strokeWidth={2.5}
                  className={cn(
                    "sm:w-4 sm:h-4", 
                    i < Math.round(rating_avg) ? "fill-yellow-400 text-yellow-400" : "text-gray-200 fill-transparent"
                  )} 
                />
              ))}
            </div>
            <span className="text-[12px] sm:text-[14px] font-black text-yellow-700">
              {rating_avg > 0 ? rating_avg.toFixed(1) : "0.0"}
            </span>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] text-gray-400 font-bold">
             <div className="flex items-center gap-0.5"><BarChart size={14} className="w-3.5 h-3.5 sm:w-4 sm:h-4" /><span>{level}</span></div>
             <div className="flex items-center gap-0.5"><Users size={14} className="w-3.5 h-3.5 sm:w-4 sm:h-4" /><span>{num_students}</span></div>
          </div>
        </div>

        <div className="mt-auto pt-1.5 sm:pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex-1 pr-1 sm:pr-2">
            {is_enrolled ? (
              <div className="h-1 sm:h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-700" style={{ width: `${progress || 0}%` }} />
              </div>
            ) : (
              <p className="font-bold text-[15px] sm:text-[18px] text-gray-900 tracking-tight">
                {parseFloat(price) > 0 ? `KES ${parseFloat(price).toLocaleString()}` : "Free"}
              </p>
            )}
          </div>

          <div className="flex-shrink-0">
            {is_enrolled ? (
              <Link href={courseLearningHref} className="text-[10px] sm:text-[11px] font-bold text-green-600 uppercase hover:underline">Resume</Link>
            ) : (
              <button 
                onClick={handleAddToCart} 
                className="p-1 sm:p-2 text-gray-400 hover:text-primary transition-all active:scale-90"
              >
                <ShoppingCart size={20} className="sm:w-6 sm:h-6" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}