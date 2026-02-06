"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api/axios";
import StandaloneBookReader from "@/components/books/StandaloneBookReader";
import { toast } from "sonner";

const ReaderSkeleton = () => (
    <div className="fixed inset-0 z-[100] bg-[#121212] flex flex-col animate-pulse">
        <div className="h-16 border-b border-white/5 bg-[#1a1a1a] flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
                <div className="h-8 w-24 bg-white/5 rounded-md" />
                <div className="h-8 w-48 bg-white/5 rounded-md" />
            </div>
            <div className="flex gap-3">
                <div className="h-8 w-8 bg-white/5 rounded-md" />
                <div className="h-8 w-8 bg-white/5 rounded-md" />
            </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-6 md:p-12">
            <div className="w-full max-w-5xl h-full bg-white/5 rounded-md" />
        </div>

        <div className="h-14 border-t border-white/5 bg-[#1a1a1a] flex items-center px-8 gap-6">
            <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-full bg-white/5" />
                <div className="h-4 w-32 bg-white/5 rounded-md" />
            </div>
            <div className="h-4 w-px bg-white/5" />
            <div className="h-6 w-16 bg-white/5 rounded-md" />
        </div>
    </div>
);

export default function BookReaderPage() {
    const { slug } = useParams();
    const router = useRouter();
    const [book, setBook] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookContent = async () => {
            try {
                const { data } = await api.get(`/books/library/${slug}/read/`);
                setBook(data);
            } catch (err: any) {
                toast.error("Unable to open book. Check your access.");
                router.push("/my-library");
            } finally {
                setTimeout(() => setLoading(false), 800);
            }
        };

        if (slug) fetchBookContent();
    }, [slug, router]);

    if (loading) return <ReaderSkeleton />;
    if (!book) return null;

    return (
        <StandaloneBookReader 
            book={book} 
            onClose={() => router.push("/my-library")} 
        />
    );
}