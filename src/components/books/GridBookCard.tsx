"use client";

import React from "react";
import Link from "next/link";
import { Star, ShoppingCart, BookOpen, HardDrive } from "lucide-react";
import { useCart, CartItem } from "@/context/CartContext";
import { toast } from "sonner";
import { WishlistButton } from "../ui/WishlistButton";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg";
import { cn } from "@/lib/utils";

export function GridBookCard({ 
  slug, title, authors, cover_image, publisher, rating_avg, 
  price, is_free, book_format, categories, is_owned 
}: any) {
  const { activeSlug } = useActiveOrg();
  const { addToCart } = useCart();

  const bookHref = activeSlug ? `/${activeSlug}/books/${slug}` : `/books/${slug}`;
  const readHref = activeSlug ? `/${activeSlug}/books/read/${slug}` : `/books/read/${slug}`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const item: CartItem = {
      type: "book", slug, title, instructor_name: authors || publisher?.publisher_name || "Unknown",
      price: is_free ? "Free" : `KES ${price}`,
      priceValue: parseFloat(price) || 0,
      thumbnail: cover_image,
    };
    addToCart(item);
    toast.success(`${title} added to cart`);
  };

  return (
    <div className="group bg-white border border-gray-200 rounded-md overflow-hidden flex flex-col h-full transition-all hover:border-primary relative">
      <Link href={bookHref} className="relative aspect-[3/4] block bg-gray-50 border-b border-gray-100 overflow-hidden">
        <img 
          src={cover_image || "https://placehold.co/300x400?text=Book+Cover"} 
          alt={title} 
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" 
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {categories?.[0] && (
            <div className="bg-white/95 text-[8px] font-black px-1.5 py-0.5 rounded-sm text-primary uppercase shadow-sm">
              {categories[0].name}
            </div>
          )}
          <div className="bg-black/80 text-[8px] font-black px-1.5 py-0.5 rounded-sm text-white uppercase shadow-sm flex items-center gap-1">
            <HardDrive size={8} /> {book_format}
          </div>
        </div>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          {!is_owned && <WishlistButton slug={slug} type="book" />}
        </div>
      </Link>
      
      <div className="p-3 flex flex-col flex-1">
        <Link href={bookHref} className="mb-1">
          <h3 className="font-black text-[13px] sm:text-[15px] leading-tight text-gray-900 line-clamp-2 min-h-none group-hover:text-primary transition-colors uppercase tracking-tight">
            {title}
          </h3>
        </Link>

        <p className="text-[10px] text-gray-400 font-bold mb-2 truncate">
          By {authors || publisher?.publisher_name}
        </p>

        <div className="flex items-center gap-1.5 mb-3 border-t border-gray-50 pt-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={10} className={cn(i < Math.round(rating_avg) ? "fill-yellow-400 text-yellow-400" : "text-gray-200 fill-transparent")} />
            ))}
          </div>
          <span className="text-[11px] font-black text-yellow-700">
            {rating_avg > 0 ? rating_avg.toFixed(1) : "0.0"}
          </span>
        </div>

        <div className="mt-auto pt-2 border-t border-gray-100 flex items-center justify-between">
          <div className="flex-1 pr-2">
            <p className="font-black text-[14px] text-gray-900">
              {is_free ? "FREE" : `KES ${parseFloat(price).toLocaleString()}`}
            </p>
          </div>

          <div className="flex-shrink-0">
            {is_owned ? (
              <Link href={readHref} className="text-[10px] font-black text-green-600 uppercase hover:underline">Read Now</Link>
            ) : (
              <button onClick={handleAddToCart} className="p-1 text-gray-400 hover:text-primary transition-all active:scale-90">
                <ShoppingCart size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}