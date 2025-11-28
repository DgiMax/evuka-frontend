"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCart, CartItem } from "@/context/CartContext";
import { Heart, Trash2, ShoppingCart, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// --- Custom Components ---
const EmptyPlaceholder = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center p-12 bg-muted/20 border-2 border-dashed border-border rounded-lg h-64 text-center">
        <Heart className="w-12 h-12 text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground text-lg font-medium">{message}</p>
    </div>
);

export default function WishlistPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const { wishlist, removeFromWishlist, loading } = useWishlist();
    const { addToCart } = useCart();

    // Handler to add to cart and remove from wishlist
    const handleAddToCartAndRemoveFromWishlist = (wishlistItem: any) => {
        const newCartItem: CartItem = {
            type: wishlistItem.type || 'course',
            slug: wishlistItem.slug,
            title: wishlistItem.title,
            instructor_name: wishlistItem.instructor || "N/A",
            thumbnail: wishlistItem.imageUrl,
            price: wishlistItem.price || "Free",
            priceValue: parseFloat(String(wishlistItem.price).replace(/[^0-9.]/g, "")) || 0,
        };

        addToCart(newCartItem);
        removeFromWishlist(wishlistItem.slug);
    };

    // Redirect unauthenticated users
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    if (authLoading || loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh] text-muted-foreground">
                Loading your wishlist...
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="bg-background min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                
                <h1 className="text-3xl font-bold text-foreground mb-8">My Wishlist</h1>

                {wishlist.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {wishlist.map((item) => (
                            <div
                                key={item.id || item.slug}
                                onClick={() =>
                                    router.push(
                                        item.type === "course"
                                            ? `/courses/${item.slug}`
                                            : `/events/${item.slug}`
                                    )
                                }
                                className="flex flex-col sm:flex-row bg-card p-4 border border-border rounded-lg hover:border-primary/30 transition-all gap-4 group cursor-pointer"
                            >
                                {/* Thumbnail */}
                                <div className="w-full sm:w-48 h-48 sm:h-32 flex-shrink-0 relative rounded-md overflow-hidden bg-muted">
                                    {item.imageUrl ? (
                                        <Image
                                            src={item.imageUrl}
                                            alt={item.title || "Wishlist item"}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 20vw"
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                                            <ImageIcon className="w-8 h-8 opacity-20" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start gap-4">
                                            <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                                                {item.title || "Untitled"}
                                            </h3>
                                            <p className="font-bold text-xl text-foreground whitespace-nowrap">
                                                {item.price || "Free"}
                                            </p>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-2 mt-1.5">
                                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary/10 text-muted-foreground capitalize border border-border">
                                                {item.type}
                                            </span>
                                            {item.instructor && (
                                                <span className="text-xs text-muted-foreground pt-0.5">
                                                    by {item.instructor}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-4 sm:mt-0 flex items-center justify-end gap-3 pt-4 sm:pt-0 border-t sm:border-0 border-border">
                                        <Button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddToCartAndRemoveFromWishlist(item);
                                            }}
                                            className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 text-sm font-semibold shadow-none"
                                        >
                                            <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                                        </Button>
                                        
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFromWishlist(item.slug);
                                            }}
                                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-9 w-9"
                                            title="Remove from wishlist"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyPlaceholder message="Your wishlist is empty. Browse the marketplace to add courses or events!" />
                )}
            </div>
        </div>
    );
}