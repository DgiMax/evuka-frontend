// app/cart/page.tsx (or wherever your CartPage component lives)

"use client";

import React from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { Trash2, ShoppingCart, ArrowRight, ShieldCheck, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// --- Custom Components ---
const EmptyPlaceholder = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center p-12 bg-muted/20 border-2 border-dashed border-border rounded-lg h-64 text-center">
        <ShoppingCart className="w-12 h-12 text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground text-lg font-medium">{message}</p>
        <Button variant="outline" className="mt-4" asChild>
            <Link href="/courses">Browse Courses</Link>
        </Button>
    </div>
);

export default function CartPage() {
    const { cartItems, removeFromCart } = useCart();

    const subtotal = cartItems.reduce((acc, item) => acc + item.priceValue, 0);
    const taxes = subtotal * 0.16;
    const total = subtotal + taxes;

    const isCartEmpty = cartItems.length === 0;

    return (
        <div className="bg-background min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                
                <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT: Cart Items List (2/3 width) */}
                    <div className="lg:col-span-2 space-y-4">
                        
                        {cartItems.length > 0 ? (
                            cartItems.map(item => (
                                <div
                                    key={item.slug}
                                    className="flex flex-col sm:flex-row bg-card p-4 border border-border rounded-lg hover:border-primary/30 transition-all gap-4 group"
                                >
                                    {/* Thumbnail */}
                                    <div className="w-full sm:w-32 h-32 sm:h-24 flex-shrink-0 relative rounded-md overflow-hidden bg-muted">
                                        {item.thumbnail ? (
                                            <img
                                                src={item.thumbnail}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
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
                                                <h3 className="font-semibold text-lg text-foreground line-clamp-2 leading-tight">
                                                    {item.title}
                                                </h3>
                                                <p className="font-bold text-lg text-foreground whitespace-nowrap">
                                                    {item.price}
                                                </p>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {item.type === 'course' ? 'Instructor' : 'Organizer'}: {item.instructor_name}
                                            </p>
                                            <p className="text-xs text-muted-foreground/80 mt-0.5 capitalize">
                                                Type: {item.type}
                                            </p>
                                        </div>

                                        <div className="flex justify-end mt-4 sm:mt-0">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeFromCart(item.slug);
                                                }}
                                                className="text-sm text-muted-foreground hover:text-destructive flex items-center gap-1.5 transition-colors px-2 py-1 rounded hover:bg-destructive/10"
                                                title="Remove from cart"
                                            >
                                                <Trash2 className="w-4 h-4" /> Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <EmptyPlaceholder message="Your cart is empty." />
                        )}
                    </div>

                    {/* RIGHT: Summary Sidebar (1/3 width) */}
                    <div className="lg:col-span-1">
                        <Card className="shadow-none border-border sticky top-6 bg-muted/20">
                            <CardHeader className="pb-4 border-b border-border/50">
                                <CardTitle className="text-xl">Order Summary</CardTitle>
                            </CardHeader>
                            
                            <CardContent className="p-6 space-y-4">
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Subtotal ({cartItems.length} items)</span>
                                        <span>KES {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Tax (16%)</span>
                                        <span>KES {taxes.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                    
                                    <Separator className="my-4" />
                                    
                                    <div className="flex justify-between text-lg font-bold text-foreground">
                                        <span>Total</span>
                                        <span>KES {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="p-6 pt-0 flex-col gap-4">
                                <Button 
                                    className="w-full h-12 text-base font-bold shadow-none" 
                                    asChild 
                                    disabled={isCartEmpty}
                                >
                                    <Link href={isCartEmpty ? "#" : "/checkout"}>
                                        Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </Button>
                                
                                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground w-full">
                                    <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                                    <span>30-Day Money-Back Guarantee</span>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    );
}