"use client";

import { useCart, CartItem } from "@/context/CartContext";
import { WishlistButton } from "@/components/ui/WishlistButton";
import type { EventDetails } from "@/types/event"; // ✅ FIXED
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // ✅ Toast import

type EventActionsProps = {
  event: Pick<
    EventDetails,
    | "slug"
    | "title"
    | "price"
    | "banner_image"
    | "organizer_name"
    | "is_full"
    | "is_registered"
  >;
};

export function EventActions({ event }: EventActionsProps) {
  const { addToCart } = useCart();
  const router = useRouter();

  const handleAddToCart = () => {
    const eventPrice = parseFloat(event.price) || 0;

    const itemToAdd: CartItem = {
      type: "event",
      slug: event.slug,
      title: event.title,
      instructor_name: event.organizer_name || "Unknown Organizer",
      price: `KES ${event.price}`,
      priceValue: eventPrice,
      thumbnail: event.banner_image || "/placeholder.jpg",
    };

    addToCart(itemToAdd);

    // ✅ Toast
    toast.success(`${event.title} added to cart`);
  };

  const handleRegister = () => {
    handleAddToCart();

    // ✅ Toast before redirect
    toast.success("Proceeding to checkout...");

    router.push("/cart");
  };

  // ⭐ Already registered
  if (event.is_registered) {
    return (
      <div className="space-y-3">
        <button
          disabled
          className="w-full font-bold py-3 px-4 rounded bg-green-600 text-white cursor-not-allowed"
        >
          ✔ Registered
        </button>
        <Link
          href={`/dashboard/events/${event.slug}`}
          className="block w-full text-center bg-white text-gray-900 font-bold py-3 px-4 rounded border-2 border-gray-800 hover:bg-gray-100 transition-colors duration-200"
        >
          View Access Ticket
        </Link>
      </div>
    );
  }

  // ⭐ Event is full
  if (event.is_full) {
    return (
      <button
        disabled
        className="w-full font-bold py-3 px-4 rounded bg-gray-400 text-white cursor-not-allowed"
      >
        Event Full
      </button>
    );
  }

  // ⭐ Event available + not registered
  return (
    <div>
      {/* Main Action */}
      <button
        onClick={handleRegister}
        className="w-full font-bold py-3 px-4 rounded transition-colors duration-200 mb-3 bg-[#2694C6] text-white hover:bg-[#1f7ba5]"
      >
        Register Now
      </button>

      {/* Secondary Actions */}
      <div className="flex items-center space-x-3">
        <button
          onClick={handleAddToCart}
          className="flex-grow bg-white text-gray-900 font-bold py-3 px-4 rounded border-2 border-gray-800 hover:bg-gray-100 transition-colors duration-200"
        >
          Add to Cart
        </button>

        <WishlistButton slug={event.slug} type="event" />
      </div>
    </div>
  );
}
