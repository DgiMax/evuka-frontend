"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Minus, 
  BookOpen, 
  List,
  ChevronLeft,
  User,
  Sun,
  Moon
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StandaloneBookReaderProps {
    book: any;
    onClose: () => void;
}

const StandaloneBookReader = ({ book, onClose }: StandaloneBookReaderProps) => {
    const [zoom, setZoom] = useState(100);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("book-reader-theme");
            return saved !== null ? JSON.parse(saved) : true;
        }
        return true;
    });

    useEffect(() => {
        localStorage.setItem("book-reader-theme", JSON.stringify(isDarkMode));
    }, [isDarkMode]);
    
    const absoluteUrl = book.book_file?.startsWith('http') 
        ? book.book_file 
        : `${process.env.NEXT_PUBLIC_API_URL}${book.book_file}`;

    const format = book.book_format?.toLowerCase();
    const isPdf = format === 'pdf';
    const isImage = ['jpg', 'jpeg', 'png', 'webp'].includes(format);
    const isAudio = format === 'audio';
    const hasToc = book.table_of_contents?.length > 0;

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 20, 300));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 20, 20));

    return (
        <div className={cn(
            "fixed inset-0 z-[100] flex flex-col font-sans transition-colors duration-300",
            isDarkMode ? "bg-[#121212] text-white" : "bg-gray-100 text-gray-900"
        )}>
            <div className={cn(
                "h-16 border-b flex items-center justify-between px-6 shrink-0 transition-colors",
                isDarkMode ? "bg-[#1a1a1a] border-white/5" : "bg-white border-gray-200 shadow-sm"
            )}>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onClose}
                        className={cn(
                            "p-2 rounded-md transition-all flex items-center gap-2 group",
                            isDarkMode ? "hover:bg-white/5 text-gray-400 hover:text-white" : "hover:bg-gray-100 text-gray-500 hover:text-gray-900"
                        )}
                    >
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Library</span>
                    </button>
                    <div className={cn("h-6 w-px mx-2 hidden md:block", isDarkMode ? "bg-white/10" : "bg-gray-200")} />
                    <div className="flex flex-col min-w-0">
                        <h1 className="text-xs font-black uppercase tracking-widest truncate max-w-[150px] md:max-w-md">
                            {book.title}
                        </h1>
                        <p className="text-[9px] font-bold text-[#2694C6] uppercase tracking-tighter">Secure Reader</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    <button 
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={cn(
                            "p-2.5 rounded-md transition-all border shrink-0",
                            isDarkMode 
                                ? "bg-white/5 border-white/5 text-yellow-400 hover:bg-white/10" 
                                : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                        )}
                    >
                        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    {isImage && (
                        <div className={cn(
                            "flex items-center rounded-md border p-1",
                            isDarkMode ? "bg-black/40 border-white/5" : "bg-gray-50 border-gray-200"
                        )}>
                            <button onClick={handleZoomOut} className="p-1.5 hover:opacity-70 transition-opacity"><Minus size={14} /></button>
                            <span className="text-[10px] font-bold w-10 text-center">{zoom}%</span>
                            <button onClick={handleZoomIn} className="p-1.5 hover:opacity-70 transition-opacity"><Plus size={14} /></button>
                        </div>
                    )}

                    {hasToc && (
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className={cn(
                                "p-2.5 rounded-md transition-all border",
                                isSidebarOpen 
                                    ? "bg-[#2694C6] border-[#2694C6] text-white" 
                                    : isDarkMode ? "bg-white/5 border-white/5 text-gray-400" : "bg-gray-50 border-gray-200 text-gray-600"
                            )}
                        >
                            <List size={18} />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden relative">
                {hasToc && (
                    <div className={cn(
                        "absolute md:relative z-20 h-full transition-all duration-300 ease-in-out overflow-y-auto border-r",
                        isDarkMode ? "bg-[#1a1a1a] border-white/5" : "bg-white border-gray-200",
                        isSidebarOpen ? "w-72 translate-x-0 opacity-100" : "w-0 -translate-x-full opacity-0"
                    )}>
                        <div className="p-8">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2694C6] mb-8">Table of Contents</h4>
                            <nav className="space-y-1">
                                {book.table_of_contents.map((item: any, idx: number) => (
                                    <button 
                                        key={idx}
                                        className={cn(
                                            "w-full text-left p-4 rounded-md text-[11px] font-bold transition-all group border border-transparent",
                                            isDarkMode 
                                                ? "text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/5" 
                                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-200"
                                        )}
                                    >
                                        <span className="text-[#2694C6]/40 mr-3 tabular-nums">{(idx + 1).toString().padStart(2, '0')}</span>
                                        {item.title || item}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>
                )}

                <div className={cn(
                    "flex-1 relative overflow-auto flex items-center justify-center transition-colors",
                    isDarkMode ? "bg-[#121212]" : "bg-gray-200/50"
                )}>
                    {isPdf ? (
                        <iframe 
                            src={`${absoluteUrl}#toolbar=0&view=FitH&theme=${isDarkMode ? 'dark' : 'light'}`} 
                            className={cn(
                                "w-full h-full border-none",
                                isDarkMode ? "bg-[#1a1a1a]" : "bg-white"
                            )} 
                            title="Reader" 
                        />
                    ) : isImage ? (
                        <div className="transition-all duration-300 p-10" style={{ transform: `scale(${zoom / 100})` }}>
                            <img src={absoluteUrl} alt="Page View" className="max-w-full max-h-[85vh] shadow-2xl rounded-md" />
                        </div>
                    ) : isAudio ? (
                        <div className="flex flex-col items-center gap-10 p-12 text-center">
                            <div className="w-64 h-64 rounded-md shadow-2xl overflow-hidden border-4 border-white/10">
                                <img src={book.cover_image || "/placeholder-cover.jpg"} className="w-full h-full object-cover" alt="Cover" />
                            </div>
                            <audio controls className="w-full max-w-md accent-[#2694C6]" controlsList="nodownload">
                                <source src={absoluteUrl} />
                            </audio>
                        </div>
                    ) : (
                        <div className="text-center p-20">
                            <BookOpen className="h-16 w-16 opacity-10 mx-auto mb-6" />
                            <h4 className="font-black uppercase tracking-[0.2em]">Format Unsupported</h4>
                        </div>
                    )}
                </div>
            </div>

            <div className={cn(
                "h-14 border-t flex items-center justify-between px-8 shrink-0 transition-colors",
                isDarkMode ? "bg-[#1a1a1a] border-white/5" : "bg-white border-gray-200"
            )}>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="h-7 w-7 rounded-full bg-[#2694C6]/10 border border-[#2694C6]/20 flex items-center justify-center text-[#2694C6]">
                            <User size={14} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-70">{book.authors || "Unassigned Author"}</span>
                    </div>
                    <div className={cn("h-4 w-px", isDarkMode ? "bg-white/5" : "bg-gray-200")} />
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold opacity-40 uppercase tracking-widest">Format</span>
                        <span className={cn(
                            "px-2 py-0.5 text-[8px] font-black uppercase rounded-sm border",
                            isDarkMode ? "bg-white/5 text-white border-white/10" : "bg-gray-100 text-gray-900 border-gray-200"
                        )}>{format}</span>
                    </div>
                </div>
                
                <div className="hidden sm:flex items-center gap-4">
                   <p className="text-[9px] font-bold opacity-40 uppercase tracking-widest">Published by <span className="opacity-100 ml-1">{book.publisher?.display_name}</span></p>
                </div>
            </div>
        </div>
    );
};

export default StandaloneBookReader;