"use client";

import React, { useState, useEffect } from "react";
import { SlidersHorizontal, ChevronUp, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const FilterSection = ({ title, children, defaultOpen = true }: any) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button className="w-full flex justify-between items-center py-4 px-1 text-left group" onClick={() => setIsOpen(!isOpen)}>
        <h3 className="font-black text-[11px] uppercase tracking-widest text-gray-900 group-hover:text-[#2694C6] transition-colors">{title}</h3>
        <ChevronUp className={cn("w-4 h-4 text-gray-400 transition-transform duration-300", !isOpen && "rotate-180")} />
      </button>
      {isOpen && <div className="overflow-hidden pb-5 px-1 animate-in slide-in-from-top-1 duration-300 flex flex-col gap-1">{children}</div>}
    </div>
  );
};

export default function EventFilters({ data, onFilterChange, searchParams }: any) {
  const getInitialState = () => ({
    category: searchParams.get("category")?.split(",")?.reduce((acc: any, val: string) => ({ ...acc, [val]: true }), {}) || {},
    price: searchParams.get("price") || "all",
    upcoming: searchParams.get("upcoming") || "all"
  });

  const [filters, setFilters] = useState<any>(getInitialState());

  useEffect(() => {
    setFilters(getInitialState());
  }, [searchParams]);

  const handleToggle = (section: string, id: string, checked: boolean) => {
    const next = { ...filters, [section]: { ...filters[section], [id]: checked } };
    notify(next);
  };

  const handleRadio = (section: string, id: string) => {
    const next = { ...filters, [section]: id };
    notify(next);
  };

  const clearAll = () => {
    onFilterChange?.({ category: [], price: "all", upcoming: "all" });
  };

  const notify = (state: any) => {
    const params: any = {};
    const cats = Object.keys(state.category).filter(k => state.category[k]);
    if (cats.length) params.category = cats.join(',');
    if (state.price !== 'all') params.price = state.price;
    if (state.upcoming !== 'all') params.upcoming = state.upcoming;
    onFilterChange?.(params);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6 px-1">
        <h2 className="text-sm font-black uppercase tracking-tighter text-gray-900 flex items-center gap-2"><SlidersHorizontal size={16} /> Filters</h2>
        <button onClick={clearAll} className="text-[10px] font-bold text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"><RotateCcw size={12} /> RESET</button>
      </div>

      <div className="flex flex-col">
        {data.upcoming_options && (
          <FilterSection title="Timeframe">
            {data.upcoming_options?.map((opt: any) => (
              <label key={opt.id} className="flex items-center py-2 cursor-pointer group">
                <input type="radio" name="upcoming" checked={filters.upcoming === opt.id} onChange={() => handleRadio("upcoming", opt.id)} className="h-4 w-4 border-2 border-gray-300 transition-all accent-[#2694C6]" />
                <span className={cn("ml-3 text-[13px]", filters.upcoming === opt.id ? "text-[#2694C6] font-bold" : "text-gray-600")}>{opt.label}</span>
              </label>
            ))}
          </FilterSection>
        )}

        {data.categories && (
          <FilterSection title="Categories">
            {data.categories?.map((cat: any) => (
              <label key={cat.id} className="flex items-center py-2 cursor-pointer group">
                <input type="checkbox" checked={!!filters.category[cat.id]} onChange={(e) => handleToggle("category", cat.id, e.target.checked)} className="h-4 w-4 border-2 border-gray-300 rounded-md checked:bg-[#2694C6] checked:border-[#2694C6] transition-all accent-[#2694C6]" />
                <span className={cn("ml-3 text-[13px]", filters.category[cat.id] ? "text-[#2694C6] font-bold" : "text-gray-600")}>{cat.label}</span>
              </label>
            ))}
          </FilterSection>
        )}

        {data.price_options && (
          <FilterSection title="Price">
            {data.price_options?.map((opt: any) => (
              <label key={opt.id} className="flex items-center py-2 cursor-pointer group">
                <input type="radio" name="price" checked={filters.price === opt.id} onChange={() => handleRadio("price", opt.id)} className="h-4 w-4 border-2 border-gray-300 transition-all accent-[#2694C6]" />
                <span className={cn("ml-3 text-[13px]", filters.price === opt.id ? "text-[#2694C6] font-bold" : "text-gray-600")}>{opt.label}</span>
              </label>
            ))}
          </FilterSection>
        )}
      </div>
    </div>
  );
}