const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";

const normalizeWishlistItem = (item: any) => {
  return {
    id: item.id,
    slug: item.item_slug,
    title: item.item_title,
    type: item.item_type,
    imageUrl: item.item_image || null,
  };
};

export const wishlistService = {
  async fetchWishlist() {
    const res = await fetch(`${API_URL}/marketplace/wishlist/`, {
      credentials: "include",
    });
    
    if (!res.ok) throw new Error("Failed to load wishlist");
    const data = await res.json();

    return data.map(normalizeWishlistItem);
  },

  async addToWishlist(slug: string, type: "course" | "event") {
    const body =
      type === "course" ? { course_slug: slug } : { event_slug: slug };

    const res = await fetch(`${API_URL}/marketplace/wishlist/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });

    if (!res.ok) throw new Error("Failed to add item to wishlist");
    const item = await res.json();

    return normalizeWishlistItem(item);
  },

  async removeFromWishlist(slug: string) {
    const res = await fetch(`${API_URL}/marketplace/wishlist/remove/${slug}/`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to remove item from wishlist");

    return res.json();
  },
};