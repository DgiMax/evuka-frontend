"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";

type WishlistButtonProps = {
  slug: string;
  type: "course" | "event";
};

type IconProps = {
  className?: string;
  fill?: string;
  strokeWidth?: number;
};


// --- HEART ICON ---
const HeartIcon = ({ className = "w-6 h-6", fill = "none", strokeWidth = 1.8 }: IconProps) => (
  <svg
    className={className}
    fill={fill}
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.273l-7.682-7.682a4.5 4.5 0 010-6.273z"
    />
  </svg>
);


export const WishlistButton: React.FC<WishlistButtonProps> = ({ slug, type }) => {
  const { user } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist, loading } = useWishlist();
  const [processing, setProcessing] = useState(false);

  const inWishlist = isInWishlist(slug);

  const toggleWishlist = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent parent (card) click navigation
    if (!user || processing) return;

    setProcessing(true);
    try {
      if (inWishlist) {
        await removeFromWishlist(slug);
      } else {
        await addToWishlist(slug, type);
      }
    } catch (err) {
      console.error("Error toggling wishlist:", err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <button
      aria-label="Toggle wishlist"
      onClick={toggleWishlist}
      disabled={!user || loading || processing}
      className={`transition-colors ${
        !user
          ? "text-gray-300 cursor-not-allowed"
          : inWishlist
          ? "text-red-500 hover:text-red-600"
          : "text-gray-400 hover:text-red-500"
      }`}
    >
      <HeartIcon
        className="w-7 h-7"
        fill={inWishlist ? "currentColor" : "none"}
        strokeWidth={1.8}
      />
    </button>
  );
};