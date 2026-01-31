"use client";

import React from "react";
import Link from "next/link";
import { Star, Users, BarChart } from "lucide-react";
import { useCart, CartItem } from "@/context/CartContext";
import { toast } from "sonner";
import { WishlistButton } from "../ui/WishlistButton";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg";
import { cn } from "@/lib/utils";

export default function LongCourseCard({
  slug, title, short_description, instructor_name, rating_avg, num_students,
  price, thumbnail, is_enrolled, category, level, progress,
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
    <div className="w-full bg-white border border-gray-200 p-3 sm:p-4 flex flex-col sm:flex-row gap-4 sm:gap-6 rounded-md transition-all duration-200 hover:border-primary group">
      
      <div className="w-full sm:w-64 md:w-72 flex-shrink-0">
        <Link href={courseDetailHref} className="relative aspect-video block overflow-hidden rounded-lg bg-gray-50 border border-gray-100">
          <img 
            src={thumbnail || "https://placehold.co/320x180?text=Course"} 
            alt={title} 
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" 
          />
          {category && (
            <div className="absolute top-2 left-2 bg-white/95 text-[10px] font-bold px-2 py-0.5 rounded text-primary uppercase shadow-sm tracking-tighter">
              {category}
            </div>
          )}
        </Link>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex justify-between items-start gap-4">
          <Link href={courseDetailHref} className="flex-1">
            <h3 className="font-bold text-[18px] sm:text-[19px] leading-tight text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>
          <div className="flex-shrink-0">
            {!is_enrolled && <WishlistButton slug={slug} type="course" />}
          </div>
        </div>

        <p className="text-[14px] text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
          {short_description}
        </p>
        
        <p className="text-[13px] text-gray-900 font-bold mt-2">{instructor_name}</p>

        <div className="flex flex-wrap items-center justify-between mt-3 pt-3 border-t border-gray-50 gap-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-black text-yellow-700">
              {rating_avg > 0 ? rating_avg.toFixed(1) : "0.0"}
            </span>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={20} 
                  strokeWidth={2.5}
                  className={cn(
                    "transition-colors",
                    i < Math.round(rating_avg) ? "fill-yellow-400 text-yellow-400" : "text-gray-200 fill-transparent"
                  )} 
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 text-[12px] text-gray-500 font-bold">
            <div className="flex items-center gap-1.5"><BarChart size={18} className="text-gray-400" /><span>{level}</span></div>
            <div className="flex items-center gap-1.5"><Users size={18} className="text-gray-400" /><span>{num_students?.toLocaleString()}</span></div>
          </div>
        </div>

        <div className="mt-auto pt-4 flex flex-row items-center justify-between border-t border-gray-100 gap-4">
          <div className="flex-1">
            {is_enrolled ? (
              <div className="w-full max-w-[280px]">
                <div className="flex justify-between text-[11px] font-bold text-primary mb-1.5 uppercase tracking-tight">
                  <span>Course Progress</span>
                  <span>{Math.round(progress || 0)}%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-700" 
                    style={{ width: `${progress || 0}%` }} 
                  />
                </div>
              </div>
            ) : (
              <span className="font-bold text-[20px] text-gray-900 tracking-tight">
                {parseFloat(price) > 0 ? `KES ${parseFloat(price).toLocaleString()}` : "Free"}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {is_enrolled ? (
              <Link 
                href={courseLearningHref} 
                className="bg-green-600 text-white font-bold py-2.5 px-6 rounded-md text-xs hover:bg-green-700 transition-colors uppercase tracking-wider shadow-sm"
              >
                Continue
              </Link>
            ) : (
              <button 
                onClick={handleAddToCart} 
                className="bg-primary text-white font-bold py-2.5 px-6 rounded-md text-xs hover:bg-primary/90 transition-all active:scale-95 uppercase tracking-wider shadow-sm"
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}