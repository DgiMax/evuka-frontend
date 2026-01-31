"use client";

import React from "react";
import Link from "next/link";
import { Star, ShoppingCart, HardDrive } from "lucide-react";
import { useCart, CartItem } from "@/context/CartContext";
import { toast } from "sonner";
import { WishlistButton } from "../ui/WishlistButton";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg";
import { cn } from "@/lib/utils";

export default function LongBookCard({ 
  slug, title, authors, cover_image, short_description, rating_avg, 
  price, is_free, book_format, is_owned 
}: any) {
  const { activeSlug } = useActiveOrg();
  const { addToCart } = useCart();
  const bookHref = activeSlug ? `/${activeSlug}/books/${slug}` : `/books/${slug}`;

  return (
    <div className="group flex flex-col sm:flex-row gap-4 p-4 bg-white border border-gray-200 rounded-md hover:border-primary transition-all">
      <Link href={bookHref} className="w-full sm:w-32 aspect-[3/4] shrink-0 overflow-hidden rounded-sm border border-gray-100">
        <img src={cover_image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </Link>

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex justify-between items-start gap-4">
          <Link href={bookHref} className="flex-1">
            <h3 className="font-black text-lg text-gray-900 group-hover:text-primary transition-colors uppercase tracking-tighter leading-none mb-1">
              {title}
            </h3>
            <p className="text-sm text-gray-400 font-bold mb-3 uppercase tracking-wider">By {authors}</p>
          </Link>
          <div className="hidden sm:block">
            <WishlistButton slug={slug} type="book" />
          </div>
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">{short_description}</p>

        <div className="mt-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-1.5 text-yellow-600 font-black text-xs">
               <Star size={14} className="fill-current" /> {rating_avg?.toFixed(1) || "0.0"}
             </div>
             <div className="flex items-center gap-1.5 text-gray-400 font-black text-[10px] uppercase">
               <HardDrive size={14} /> {book_format}
             </div>
          </div>
          
          <div className="flex items-center gap-4">
            <p className="text-lg font-black text-gray-900 tracking-tighter">
              {is_free ? "FREE" : `KES ${parseFloat(price).toLocaleString()}`}
            </p>
            {!is_owned && (
              <button onClick={() => {}} className="bg-primary text-white p-2 rounded-md hover:bg-primary/90">
                <ShoppingCart size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}