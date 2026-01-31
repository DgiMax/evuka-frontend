"use client";

import React, { useState, useRef, useEffect } from "react";
import { SlidersHorizontal, ChevronUp, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface FiltersState {
  categories: Record<string, boolean>;
  levels: Record<string, boolean>;
  formats: Record<string, boolean>;
  price: { min: number; max: number };
}

const FilterSection = ({ title, children, defaultOpen = true }: any) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button className="w-full flex justify-between items-center py-4 px-1 text-left group" onClick={() => setIsOpen(!isOpen)}>
        <h3 className="font-black text-[11px] uppercase tracking-widest text-gray-900 group-hover:text-[#2694C6] transition-colors">{title}</h3>
        <ChevronUp className={cn("w-4 h-4 text-gray-400 transition-transform duration-300", !isOpen && "rotate-180")} />
      </button>
      {isOpen && <div className="overflow-hidden pb-5 px-1 animate-in slide-in-from-top-1 duration-300">{children}</div>}
    </div>
  );
};

export default function BookFilters({ data, onFilterChange }: any) {
  const DEFAULT_MAX_PRICE = data?.price?.max ?? 10000;
  const isInitialMount = useRef(true);

  const [filters, setFilters] = useState<FiltersState>({
    categories: {},
    levels: {},
    formats: {},
    price: { min: 0, max: DEFAULT_MAX_PRICE },
  });

  const updateFilters = (next: FiltersState) => {
    setFilters(next);
    const params: any = {};
    const selectedCats = Object.keys(next.categories).filter(k => next.categories[k]);
    if (selectedCats.length > 0) params.category = selectedCats;
    
    const selectedLvls = Object.keys(next.levels).filter(k => next.levels[k]);
    if (selectedLvls.length > 0) params.reading_level = selectedLvls;

    const selectedFmts = Object.keys(next.formats).filter(k => next.formats[k]);
    if (selectedFmts.length > 0) params.book_format = selectedFmts;

    if (next.price.min > 0) params.min_price = String(next.price.min);
    if (next.price.max < DEFAULT_MAX_PRICE) params.max_price = String(next.price.max);

    onFilterChange?.(params);
  };

  const handlePriceChange = (type: 'min' | 'max', val: number) => {
    const next = { ...filters, price: { ...filters.price, [type]: val } };
    updateFilters(next);
  };

  const handleToggle = (section: keyof Omit<FiltersState, 'price'>, id: string, checked: boolean) => {
    updateFilters({ ...filters, [section]: { ...filters[section], [id]: checked } });
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6 px-1">
        <h2 className="text-sm font-black uppercase tracking-tighter text-gray-900 flex items-center gap-2"><SlidersHorizontal size={16} /> Filters</h2>
        <button onClick={() => updateFilters({ categories: {}, levels: {}, formats: {}, price: { min: 0, max: DEFAULT_MAX_PRICE } })} className="text-[10px] font-bold text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"><RotateCcw size={12} /> RESET</button>
      </div>

      <div className="flex flex-col">
        {data?.globalCategories?.length > 0 && (
          <FilterSection title="Categories">
            {data.globalCategories.map((cat: any) => (
              <label key={cat.id} className="flex items-center py-2 cursor-pointer group">
                <input type="checkbox" checked={!!filters.categories[cat.slug]} onChange={(e) => handleToggle("categories", cat.slug, e.target.checked)} className="h-4 w-4 border-2 border-gray-300 rounded-md checked:bg-primary checked:border-primary accent-[#2694C6]" />
                <span className={cn("ml-3 text-[13px] transition-colors", filters.categories[cat.slug] ? "text-primary font-bold" : "text-gray-600 group-hover:text-gray-900")}>{cat.name}</span>
              </label>
            ))}
          </FilterSection>
        )}

        <FilterSection title="Format">
          {['pdf', 'epub', 'audio'].map((fmt) => (
            <label key={fmt} className="flex items-center py-2 cursor-pointer group">
              <input type="checkbox" checked={!!filters.formats[fmt]} onChange={(e) => handleToggle("formats", fmt, e.target.checked)} className="h-4 w-4 border-2 border-gray-300 rounded-md checked:bg-primary checked:border-primary accent-[#2694C6]" />
              <span className={cn("ml-3 text-[13px] transition-colors uppercase", filters.formats[fmt] ? "text-primary font-bold" : "text-gray-600 group-hover:text-gray-900")}>{fmt}</span>
            </label>
          ))}
        </FilterSection>

        <FilterSection title="Price Range">
          <div className="pt-4 space-y-6">
            <div className="relative w-full px-1">
              <div className="h-1.5 w-full bg-gray-100 rounded-md overflow-hidden">
                <div 
                  className="h-full bg-[#2694C6]" 
                  style={{ width: `${(filters.price.max / DEFAULT_MAX_PRICE) * 100}%` }}
                />
              </div>
              <input 
                type="range" min="0" max={DEFAULT_MAX_PRICE} value={filters.price.max}
                onChange={(e) => handlePriceChange('max', parseInt(e.target.value))}
                className="absolute -top-1 left-0 w-full h-4 appearance-none bg-transparent cursor-pointer accent-[#2694C6] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-md [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#2694C6] [&::-webkit-slider-thumb]:shadow-sm"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
               <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-gray-400 uppercase">Min</label>
                 <div className="flex items-center border border-gray-200 rounded-md px-3 py-2 bg-white focus-within:border-[#2694C6] transition-colors">
                   <span className="text-[11px] font-bold text-gray-400 mr-2">KES</span>
                   <input 
                     type="number" value={filters.price.min}
                     onChange={(e) => handlePriceChange('min', parseInt(e.target.value) || 0)}
                     className="w-full bg-transparent text-sm font-bold outline-none text-gray-900"
                   />
                 </div>
               </div>
               <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-gray-400 uppercase">Max</label>
                 <div className="flex items-center border border-gray-200 rounded-md px-3 py-2 bg-white focus-within:border-[#2694C6] transition-colors">
                   <span className="text-[11px] font-bold text-gray-400 mr-2">KES</span>
                   <input 
                     type="number" value={filters.price.max}
                     onChange={(e) => handlePriceChange('max', parseInt(e.target.value) || 0)}
                     className="w-full bg-transparent text-sm font-bold outline-none text-gray-900"
                   />
                 </div>
               </div>
            </div>
          </div>
        </FilterSection>
      </div>
    </div>
  );
}