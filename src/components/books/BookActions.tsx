"use client";

import React from "react";
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, CartItem } from '@/context/CartContext';
import { WishlistButton } from "@/components/ui/WishlistButton";
import { toast } from "sonner";

export function BookActions({ book }: { book: any }) {
  const { addToCart } = useCart();
  const router = useRouter();

  const handleAddToCart = () => {
    const item: CartItem = {
      type: 'book',
      slug: book.slug,
      title: book.title,
      instructor_name: book.authors || book.publisher?.publisher_name || 'Unknown Author',
      price: `KES ${book.price}`,
      priceValue: parseFloat(book.price) || 0,
      thumbnail: book.cover_image,
    };
    addToCart(item);
    toast.success(`${book.title} added to cart`);
  };

  const handleMainAction = () => {
    if (book.is_owned) {
      router.push(`/read/${book.slug}`);
    } else {
      handleAddToCart();
      router.push('/cart');
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <Button 
        onClick={handleMainAction}
        className="w-full h-12 bg-[#2694C6] text-white font-black uppercase text-[11px] tracking-widest rounded-md shadow-none hover:bg-[#1e7ca8] transition-all active:scale-[0.98]"
      >
        {book.is_owned ? (
          <span className="flex items-center gap-2"><BookOpen size={16} /> Read Now</span>
        ) : (
          'Buy Now'
        )}
      </Button>

      {!book.is_owned && (
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleAddToCart}
            variant="outline" 
            className="flex-grow h-12 border-2 border-gray-900 text-gray-900 bg-white font-black uppercase text-[11px] tracking-widest rounded-md shadow-none hover:bg-gray-50 transition-all active:scale-[0.98]"
          >
            Add to Cart
          </Button>
          <WishlistButton slug={book.slug} type="book" />
        </div>
      )}
      
      <p className="text-[9px] text-center text-gray-400 font-black uppercase tracking-[0.15em] mt-2 leading-none">
        Secure Digital Delivery
      </p>
    </div>
  );
}