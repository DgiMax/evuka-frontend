'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CartItem = {
  type: 'course' | 'event' | 'book'; 
  slug: string;
  title: string;
  instructor_name: string; 
  price: string; 
  priceValue: number; 
  thumbnail?: string;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (slug: string) => void;
  clearCart: () => void;
  itemCount: number;
  cartTotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

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

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Failed to save cart items to localStorage', error);
    }
  }, [cartItems, hydrated]);

  const addToCart = (itemToAdd: CartItem) => {
    setCartItems(prevItems => {
      if (prevItems.some(item => item.slug === itemToAdd.slug)) {
        return prevItems;
      }
      return [...prevItems, itemToAdd];
    });
  };

  const removeFromCart = (slugToRemove: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.slug !== slugToRemove));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const itemCount = cartItems.length;
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
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};