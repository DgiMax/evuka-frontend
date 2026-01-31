"use client";

import { useState } from "react";
import { ChevronDown, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export const TableOfContents = ({ contents }: { contents: any[] }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-5">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Table of Contents</h2>
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            {contents?.length || 0} Chapters
        </span>
      </div>

      <div className="border border-gray-200 rounded-md bg-white overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full px-6 py-4 flex items-center justify-between transition-colors bg-gray-50/50 hover:bg-gray-100",
            isOpen && "border-b border-gray-200"
          )}
        >
          <div className="flex items-center gap-3">
            <BookOpen className="h-4 w-4 text-[#2694C6]" />
            <span className="font-black text-sm text-gray-900">Inside the book</span>
          </div>
          <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform duration-300", isOpen && "rotate-180")} />
        </button>

        {isOpen && (
          <div className="divide-y divide-gray-100">
            {contents?.map((chapter: any, i: number) => (
              <div 
                key={i} 
                className={cn(
                    "px-6 py-4 flex items-center gap-4 group transition-colors hover:bg-gray-50/50",
                    chapter.level > 0 && "pl-12" // Indent sub-chapters
                )}
              >
                <span className="text-xs font-black text-gray-300 tabular-nums">
                    {(i + 1).toString().padStart(2, '0')}
                </span>
                <span className={cn(
                    "text-sm font-medium text-gray-700",
                    chapter.level === 0 ? "font-bold text-gray-900" : "text-gray-500"
                )}>
                    {chapter.title}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};