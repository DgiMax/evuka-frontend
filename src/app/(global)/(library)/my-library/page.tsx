"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api/axios";
import { BookOpen, Search, ArrowRight, ShoppingBag, Book as BookIcon } from "lucide-react";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface Book {
    id: string;
    title: string;
    slug: string;
    authors: string;
    cover_image: string;
    book_format: string;
    publisher: {
        display_name: string;
    };
}

const LibrarySkeleton = () => (
    <SkeletonTheme baseColor="#e5e7eb" highlightColor="#f3f4f6">
        <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-12 bg-white min-h-screen">
            <div className="w-full">
                <Skeleton height={160} borderRadius={6} />
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-4">
                    <Skeleton width={320} height={40} />
                    <Skeleton width={180} height={14} />
                </div>
                <div className="w-full md:w-96">
                    <Skeleton height={52} borderRadius={6} />
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                    <div key={i} className="flex flex-col h-full gap-3">
                        <div className="aspect-[3/4] w-full">
                            <Skeleton height="100%" borderRadius={6} />
                        </div>
                        <div className="space-y-2">
                            <Skeleton height={18} width="90%" />
                            <Skeleton height={12} width="60%" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </SkeletonTheme>
);

export default function MyLibraryPage() {
    const router = useRouter();
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchLibrary = async () => {
            try {
                const { data } = await api.get("/books/my-library/");
                setBooks(data);
            } catch (err) {
                console.error("Failed to load library");
            } finally {
                setLoading(false);
            }
        };
        fetchLibrary();
    }, []);

    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.authors.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <LibrarySkeleton />;

    return (
        <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-12 bg-white min-h-screen">
            <div className="bg-[#2694C6] rounded-md p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                <div className="absolute right-0 top-0 opacity-10 -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-700">
                    <BookOpen size={240} className="text-white" />
                </div>
                
                <div className="flex items-center gap-6 relative z-10">
                    <div className="h-16 w-16 bg-white/20 backdrop-blur-md rounded-md flex items-center justify-center text-white shrink-0 border border-white/10">
                        <ShoppingBag size={28} />
                    </div>
                    <div className="text-white">
                        <h2 className="text-lg font-black uppercase tracking-widest">Expand Your Knowledge</h2>
                        <p className="text-[11px] font-bold opacity-80 uppercase tracking-tight mt-1">Discover premium digital resources in our global bookstore.</p>
                    </div>
                </div>
                
                <button 
                    onClick={() => router.push('/bookstore')}
                    className="relative z-10 bg-white text-[#2694C6] px-10 py-4 rounded-md text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-50 transition-all flex items-center gap-3 shrink-0 active:scale-95 shadow-lg shadow-black/10"
                >
                    Visit Bookstore <ArrowRight size={14} />
                </button>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tighter uppercase text-gray-900 leading-none">Personal Library</h1>
                    <div className="flex items-center gap-3">
                        <span className="h-px w-8 bg-[#2694C6]" />
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Private Collection</p>
                    </div>
                </div>
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                        type="text"
                        placeholder="FILTER COLLECTION..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-md pl-12 pr-4 py-3.5 text-[10px] font-bold uppercase tracking-widest focus:border-[#2694C6] focus:bg-white outline-none transition-all placeholder:text-gray-300"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {filteredBooks.length === 0 ? (
                <div className="py-24 text-center border border-gray-100 rounded-md bg-gray-50/50">
                    <BookIcon className="h-10 w-10 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">No matches found in your library</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
                    {filteredBooks.map((book) => (
                        <div
                            key={book.id}
                            onClick={() => router.push(`/read/${book.slug}`)}
                            className="group cursor-pointer flex flex-col h-full rounded-md border border-gray-100 bg-white p-2.5 transition-all duration-300 hover:border-[#2694C6]/40"
                        >
                            <div className="aspect-[3/4] relative overflow-hidden rounded-md bg-gray-100 border border-gray-200">
                                {book.cover_image ? (
                                    <img
                                        src={book.cover_image}
                                        alt={book.title}
                                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-center bg-gradient-to-br from-gray-100 to-gray-200">
                                        <BookIcon className="w-8 h-8 text-gray-300 mb-2" />
                                        <p className="text-xs font-semibold text-gray-500 px-4 line-clamp-3">
                                            {book.title}
                                        </p>
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <div className="px-4 py-2 rounded-md bg-[#2694C6] backdrop-blur-sm scale-95 group-hover:scale-100 transition-transform duration-300">
                                        <span className="text-xs font-semibold text-white uppercase tracking-wide">
                                            Open Reader
                                        </span>
                                    </div>
                                </div>

                                <div className="absolute top-2 left-2">
                                    <div className="px-1.5 py-0.5 bg-gray-900/80 backdrop-blur text-white rounded-sm border border-white/10">
                                        <p className="text-[9px] font-bold uppercase leading-none">
                                            {book.book_format}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3 px-1 flex flex-col gap-1">
                                <h3 className="font-bold text-sm text-gray-900 leading-snug line-clamp-2 transition-colors group-hover:text-[#2694C6]">
                                    {book.title}
                                </h3>
                                <p className="text-xs text-gray-500 font-medium truncate">
                                    {book.authors}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}