'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// --- TYPE DEFINITIONS ---
export type CartItem = {
  // --- 1. Add the 'type' field ---
  type: 'course' | 'event'; 
  slug: string;
  title: string;
  // This field can hold the instructor's or organizer's name
  instructor_name: string; 
  price: string; // e.g., "KES 2050"
  priceValue: number; // numeric value for calculations
  thumbnail?: string;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (slug: string) => void;
  clearCart: () => void;
  itemCount: number;
  cartTotal: number; // 2. Add a cart total for convenience
};

// --- CREATE CONTEXT ---
const CartContext = createContext<CartContextType | undefined>(undefined);

// --- PROVIDER COMPONENT ---
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage (no changes needed)
  useEffect(() => {
    try {
      const localData = localStorage.getItem('cartItems');
      if (localData) {
        const parsed = JSON.parse(localData);
        if (Array.isArray(parsed)) {
          setCartItems(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to parse cart items from localStorage', error);
      setCartItems([]);
    }
    setHydrated(true);
  }, []);

  // Save to localStorage (no changes needed)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Failed to save cart items to localStorage', error);
    }
  }, [cartItems, hydrated]);

  // Add to cart (no changes needed)
  const addToCart = (itemToAdd: CartItem) => {
    setCartItems(prevItems => {
      if (prevItems.some(item => item.slug === itemToAdd.slug)) {
        return prevItems;
      }
      return [...prevItems, itemToAdd];
    });
  };

  // Remove item (no changes needed)
  const removeFromCart = (slugToRemove: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.slug !== slugToRemove));
  };

  // Clear all (no changes needed)
  const clearCart = () => {
    setCartItems([]);
  };

  const itemCount = cartItems.length;

  // Calculate total price of items in the cart
  const cartTotal = cartItems.reduce((total, item) => total + item.priceValue, 0);

  if (!hydrated) return null;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        itemCount,
        cartTotal, // Expose the total
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// --- CUSTOM HOOK ---
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};