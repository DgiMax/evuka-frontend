"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { wishlistService } from "@/services/wishlistService";
import { useAuth } from "@/context/AuthContext";

interface WishlistItem {
  id: number;
  slug: string;
  title: string;
  price?: string;
  type: "course" | "event";
  imageUrl?: string;
  instructor?: string | null;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  loading: boolean;
  addToWishlist: (slug: string, type: "course" | "event") => Promise<void>;
  removeFromWishlist: (slug: string) => Promise<void>;
  isInWishlist: (slug: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWishlist = async () => {
      if (authLoading) return;

      if (!user) {
        setWishlist([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await wishlistService.fetchWishlist();
        setWishlist(data);
      } catch (err) {
        console.error("Failed to load wishlist:", err);
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, [user, authLoading]);

  const addToWishlist = async (slug: string, type: "course" | "event") => {
    try {
      const newItem = (await wishlistService.addToWishlist(slug, type)) as WishlistItem;
      setWishlist((prev) => {
        const exists = prev.some((i) => i.slug === newItem.slug);
        return exists ? prev : [...prev, newItem];
      });
    } catch (err) {
      console.error("Add wishlist failed:", err);
    }
  };

  const removeFromWishlist = async (slug: string) => {
    try {
      await wishlistService.removeFromWishlist(slug);
      setWishlist((prev) => prev.filter((item) => item.slug !== slug));
    } catch (err) {
      console.error("Remove wishlist failed:", err);
    }
  };

  const isInWishlist = (slug: string) =>
    wishlist.some((item) => item.slug === slug);

  return (
    <WishlistContext.Provider
      value={{ wishlist, loading, addToWishlist, removeFromWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};