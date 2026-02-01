"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart, CartItem } from '@/context/CartContext';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogClose 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Book, ArrowRight, ShoppingBag, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResourcePurchaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    books: any[];
    preSelectedSlug: string | null;
}

export function ResourcePurchaseModal({ 
    isOpen, 
    onClose, 
    books, 
    preSelectedSlug 
}: ResourcePurchaseModalProps) {
    const { addToCart } = useCart();
    const router = useRouter();
    const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            if (preSelectedSlug) {
                setSelectedSlugs([preSelectedSlug]);
            } else {
                setSelectedSlugs(books.map(b => b.slug));
            }
        }
    }, [isOpen, preSelectedSlug, books]);

    const toggleBook = (slug: string) => {
        setSelectedSlugs(prev => 
            prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
        );
    };

    const handleBatchPurchase = () => {
        const selectedBooks = books.filter(b => selectedSlugs.includes(b.slug));
        
        selectedBooks.forEach(book => {
            const item: CartItem = {
                type: 'book',
                slug: book.slug,
                title: book.title,
                instructor_name: book.authors || "Expert Author",
                price: `KES ${book.price}`,
                priceValue: parseFloat(book.price),
                thumbnail: book.cover_image
            };
            addToCart(item);
        });

        router.push('/cart');
        onClose();
    };

    if (books.length === 0) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-[95%] sm:max-w-[480px] p-0 gap-0 max-h-[85vh] h-auto flex flex-col border-border/80 shadow-2xl rounded-md bg-background overflow-hidden [&>button]:hidden transition-all duration-300 top-[5%] md:top-[10%] translate-y-0">
                
                <DialogHeader className="px-4 py-3 md:py-4 border-b bg-muted/50 flex flex-row items-center justify-between shrink-0 backdrop-blur-sm z-10">
                    <DialogTitle className="text-base md:text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
                        <Book className="w-5 h-5 text-primary" />
                        Unlock Course Resources
                    </DialogTitle>
                    <DialogClose className="rounded-md p-2 hover:bg-muted transition">
                        <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                    </DialogClose>
                </DialogHeader>

                <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-none [&::-webkit-scrollbar-thumb]:border-x-[1px] [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-clip-content">
                        <p className="text-[10px] md:text-xs uppercase font-bold text-muted-foreground tracking-wider ml-1 mb-2">
                            Select books to add to your library
                        </p>
                        
                        <div className="space-y-3">
                            {books.map((book) => (
                                <div 
                                    key={book.slug} 
                                    onClick={() => toggleBook(book.slug)}
                                    className={cn(
                                        "flex items-center gap-4 p-4 border rounded-md transition-all cursor-pointer group bg-background",
                                        selectedSlugs.includes(book.slug) 
                                            ? "border-primary bg-primary/5 ring-1 ring-primary/20" 
                                            : "border-border hover:border-primary/50"
                                    )}
                                >
                                    <Checkbox 
                                        id={book.slug}
                                        checked={selectedSlugs.includes(book.slug)}
                                        onCheckedChange={() => toggleBook(book.slug)}
                                        className="h-5 w-5 rounded-sm border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold tracking-tight truncate text-foreground uppercase leading-tight">
                                            {book.title}
                                        </h4>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">
                                            By {book.authors}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-primary tabular-nums">
                                            KES {parseFloat(book.price).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4">
                            <Button 
                                disabled={selectedSlugs.length === 0}
                                onClick={handleBatchPurchase}
                                className="w-full h-12 text-sm md:text-base font-bold shadow-sm transition-all active:scale-[0.98] bg-primary hover:bg-primary/90 flex items-center justify-center gap-2"
                            >
                                <ShoppingBag className="w-5 h-5" /> 
                                Add {selectedSlugs.length} Items to Cart 
                                <ArrowRight className="w-5 h-5 ml-1" />
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}