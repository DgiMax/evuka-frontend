'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingCart as BasketIcon } from "lucide-react";

export function CartButton() {
  const { itemCount } = useCart();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  return (
    <Link
      href="/cart"
      aria-label="Shopping Cart"
      className="relative p-2 hover:text-gray-900"
    >
      <BasketIcon className="w-8 h-8" />
      {hydrated && itemCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
