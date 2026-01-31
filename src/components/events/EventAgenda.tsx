"use client";

import React, { useState } from "react";
import { ChevronDown, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export const EventAgenda = ({ agenda }: { agenda: any[] }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!agenda?.length) return (
    <div className="p-6 border-2 border-dashed border-gray-100 text-center bg-gray-50/30">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">No agenda items scheduled</p>
    </div>
  );

  return (
    <div className="space-y-1">
      {agenda.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div 
            key={index} 
            className={cn(
              "border-x border-t last:border-b transition-all duration-300 overflow-hidden rounded-none",
              isOpen ? "border-gray-200 bg-white" : "border-gray-100 hover:border-gray-200 bg-white"
            )}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-center justify-between p-3 sm:p-4 text-left group"
            >
              <div className="flex items-center gap-3 sm:gap-6">
                <div className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-black uppercase tracking-tighter border transition-colors shrink-0",
                  isOpen 
                    ? "bg-[#2694C6] text-white border-[#2694C6]" 
                    : "bg-muted text-muted-foreground border-border"
                )}>
                  <Clock size={12} /> {item.time}
                </div>
                <span className={cn(
                  "font-black text-sm uppercase tracking-wider transition-colors truncate",
                  isOpen ? "text-[#2694C6]" : "text-gray-900 group-hover:text-[#2694C6]"
                )}>
                  {item.title}
                </span>
              </div>
              <ChevronDown className={cn(
                "h-4 w-4 text-gray-400 transition-transform duration-300 shrink-0", 
                isOpen && "rotate-180 text-[#2694C6]"
              )} />
            </button>

            <div className={cn(
              "transition-all duration-500 ease-in-out", 
              isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            )}>
              <div className="px-3 sm:px-4 pb-4 pt-0 ml-0 sm:ml-[88px]">
                <div className="p-4 rounded-none bg-muted/40 border-l-4 border-[#2694C6] text-[13px] sm:text-[14px] text-muted-foreground font-medium leading-relaxed sm:leading-loose">
                  {item.description || "No further details provided for this segment."}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};