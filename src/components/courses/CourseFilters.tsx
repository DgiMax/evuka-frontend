"use client";

import React, { useState, useEffect, useCallback } from "react";
import { SlidersHorizontal, X, ChevronUp, ChevronDown } from "lucide-react";
import { debounce } from "lodash";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

// --- TYPE DEFINITIONS ---
type FilterOption = { id: string; label: string; };

type FilterData = { 
  categories?: FilterOption[]; 
  levels?: FilterOption[]; 
  languages?: FilterOption[]; 
  price?: { min: number; max: number; }; 
};

type FiltersState = { 
  categories: Record<string, boolean>; 
  levels: Record<string, boolean>; 
  languages: Record<string, boolean>; 
  price: { min: number; max: number; }; 
};

export type QueryParams = { 
  category?: string[]; 
  level?: string[]; 
  min_price?: string; 
  max_price?: string; 
};

type CourseFiltersProps = { 
  data?: FilterData; 
  onFilterChange?: (filters: QueryParams) => void; 
  defaultValues?: Partial<FiltersState>; 
};

const PRIMARY_COLOR_CLASS = 'text-[#2694C6] focus:ring-[#2694C6] accent-[#2694C6]';

// --- SUB-COMPONENTS (Restored to your original styles) ---

const Checkbox = ({ label, id, checked, onChange }: { label: string; id: string; checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }) => (
  <label
    htmlFor={id}
    className="flex items-center space-x-3 cursor-pointer text-gray-700 text-sm py-1"
  >
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={onChange}
      className={`h-4 w-4 border-gray-400 rounded ${PRIMARY_COLOR_CLASS}`}
    />
    <span>{label}</span>
  </label>
);

const FilterSection = ({
  title,
  children,
  defaultOpen = true,
}: { title: string; children: React.ReactNode; defaultOpen?: boolean; }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full flex justify-between items-center py-3 px-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-bold text-gray-800 text-base">{title}</h3>
        <ChevronUp
          className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${
            isOpen ? "" : "rotate-180"
          }`}
        />
      </button>
      {isOpen && <div className="p-4 space-y-3 bg-white">{children}</div>}
    </div>
  );
};

// --- UTILITY: Converts FiltersState to Backend Query Params ---
const buildQueryParams = (filtersState: FiltersState): QueryParams => {
  const params: QueryParams = {};
  const selectedCategories = Object.keys(filtersState.categories).filter((key) => filtersState.categories[key]);
  if (selectedCategories.length > 0) { params.category = selectedCategories; }
  
  const selectedLevels = Object.keys(filtersState.levels).filter((key) => filtersState.levels[key]);
  if (selectedLevels.length > 0) { params.level = selectedLevels; }
  
  const defaultMaxPrice = 5999;
  if (filtersState.price.min > 0) { params.min_price = String(filtersState.price.min); }
  if (filtersState.price.max < defaultMaxPrice) { params.max_price = String(filtersState.price.max); }
  
  return params;
};

// --- 1. REUSABLE FILTER CONTENT (Handles logic, uses restored styles) ---
type FilterContentProps = {
  data?: FilterData;
  filters: FiltersState;
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
};

const FilterFormContent = ({ data, filters, setFilters }: FilterContentProps) => {
  
  const handleCheckboxChange = (
    section: keyof FiltersState,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const currentSection = filters[section] as Record<string, boolean>;
    const updated = {
      ...filters,
      [section]: {
        ...currentSection,
        [e.target.id]: e.target.checked,
      },
    };
    setFilters(updated);
  };

  const handlePriceChange = (type: "min" | "max", value: number) => {
    if (filters.price[type] === value) return;
    const updated = {
      ...filters,
      price: { ...filters.price, [type]: value },
    };
    setFilters(updated);
  };

  return (
    <div className="flex flex-col">
      {/* CATEGORIES */}
      {data?.categories && data.categories.length > 0 && (
        <FilterSection title="Categories">
          {data.categories.map((cat) => (
            <Checkbox
              key={cat.id}
              id={cat.id}
              label={cat.label}
              checked={!!filters.categories[cat.id]}
              onChange={(e) => handleCheckboxChange("categories", e)}
            />
          ))}
        </FilterSection>
      )}

      {/* LEVELS */}
      {data?.levels && data.levels.length > 0 && (
        <FilterSection title="Level">
          {data.levels.map((lvl) => (
            <Checkbox
              key={lvl.id}
              id={lvl.id}
              label={lvl.label}
              checked={!!filters.levels[lvl.id]}
              onChange={(e) => handleCheckboxChange("levels", e)}
            />
          ))}
        </FilterSection>
      )}

      {/* LANGUAGES */}
      {data?.languages && data.languages.length > 0 && (
        <FilterSection title="Language">
          {data.languages.map((lang) => (
            <Checkbox
              key={lang.id}
              id={lang.id}
              label={lang.label}
              checked={!!filters.languages[lang.id]}
              onChange={(e) => handleCheckboxChange("languages", e)}
            />
          ))}
        </FilterSection>
      )}

      {/* PRICE SLIDER */}
      {data?.price && (
        <FilterSection title="Price">
          <div className="space-y-4">
            {/* Price Range Slider */}
            <input
              type="range"
              min="0"
              max={data.price.max}
              value={filters.price.max}
              onChange={(e) => handlePriceChange("max", parseInt(e.target.value) || 0)}
              className={`w-full h-2 bg-gray-200 rounded-lg cursor-pointer ${PRIMARY_COLOR_CLASS} transition-colors`}
            />
            
            {/* Price Inputs */}
            <div className="flex items-center justify-between space-x-2">
              <input
                type="number"
                value={filters.price.min}
                onChange={(e) => handlePriceChange("min", parseInt(e.target.value) || 0)}
                className="w-full px-2 py-1 text-center border border-gray-300 rounded-md text-sm focus:border-[#2694C6] focus:ring-1 focus:ring-[#2694C6]"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                value={filters.price.max}
                onChange={(e) => handlePriceChange("max", parseInt(e.target.value) || 0)}
                className="w-full px-2 py-1 text-center border border-gray-300 rounded-md text-sm focus:border-[#2694C6] focus:ring-1 focus:ring-[#2694C6]"
              />
            </div>
          </div>
        </FilterSection>
      )}
    </div>
  );
};

// --- MAIN EXPORTED COMPONENT ---

const CourseFilters = ({
  data,
  onFilterChange,
  defaultValues,
}: CourseFiltersProps) => {
  const defaultMaxPrice = data?.price?.max || 5999; 
  
  const initialFilters: FiltersState = {
    categories: defaultValues?.categories || {},
    levels: defaultValues?.levels || {},
    languages: defaultValues?.languages || {},
    price: defaultValues?.price || { min: 0, max: defaultMaxPrice },
  };
  
  // 1. DESKTOP STATE (Live)
  const [filters, setFilters] = useState<FiltersState>(initialFilters);

  // 2. MOBILE STATE (Buffer)
  const [mobileFilters, setMobileFilters] = useState<FiltersState>(filters);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Debounce logic - Only watches 'filters' (Desktop state)
  const debouncedOnFilterChange = useCallback(
    debounce((params: QueryParams) => {
      onFilterChange?.(params);
    }, 400),
    [onFilterChange]
  );
  
  // Effect triggered ONLY when 'filters' changes (Live or after Mobile Apply)
  useEffect(() => {
    const queryParams = buildQueryParams(filters);
    debouncedOnFilterChange(queryParams);
    return () => debouncedOnFilterChange.cancel();
  }, [filters, debouncedOnFilterChange]); 

  const clearAll = () => {
    const cleared: FiltersState = {
      categories: {},
      levels: {},
      languages: {},
      price: { min: 0, max: defaultMaxPrice },
    };
    setFilters(cleared);
  };

  // --- MOBILE HANDLERS ---

  const handleMobileOpen = () => {
    setMobileFilters(filters); // 1. Sync Mobile state with current Active state
    setIsSheetOpen(true);
  };

  const handleMobileApply = () => {
    setFilters(mobileFilters); // 2. Push Mobile state to Active state (Triggers API)
    setIsSheetOpen(false);
  };
  
  const handleMobileClear = () => {
    const cleared: FiltersState = {
        categories: {},
        levels: {},
        languages: {},
        price: { min: 0, max: defaultMaxPrice },
    };
    setMobileFilters(cleared); // 3. Clear Mobile state visually only
  };

  return (
    <>
      {/* --- DESKTOP VIEW (Visible lg+) --- */}
      <div className="hidden lg:block w-full bg-white border border-gray-200 rounded-lg shadow font-sans overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Filters</h2>
          <button
            onClick={clearAll}
            className="bg-[#2694C6] hover:bg-[#1f7ba5] text-white font-semibold py-1.5 px-3 rounded text-sm transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Content */}
        <div>
            <FilterFormContent 
                data={data} 
                filters={filters} 
                setFilters={setFilters} 
            />
        </div>
      </div>

      {/* --- MOBILE VIEW (Visible < lg) --- */}
      <div className="lg:hidden w-full mb-6">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button 
              onClick={handleMobileOpen}
              variant="outline" 
              className="w-full justify-between h-12 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <span className="flex items-center gap-2 font-semibold">
                <SlidersHorizontal size={18} /> Filter Courses
              </span>
              <span className="bg-gray-100 text-xs px-2 py-1 rounded-full text-gray-600">
                Customize
              </span>
            </Button>
          </SheetTrigger>
          
          <SheetContent 
            side="left" 
            className="w-[300px] sm:w-[400px] flex flex-col h-full p-0 rounded-none border-r-0 shadow-xl overflow-hidden [&>button]:hidden"
          >
             {/* Header with Custom Close Button */}
             <SheetHeader className="p-5 border-b border-gray-200 bg-white flex flex-row items-center justify-between space-y-0">
              <SheetTitle className="text-xl font-bold">
                Filter Courses
              </SheetTitle>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200">
                   <X size={18} />
                </Button>
              </SheetClose>
            </SheetHeader>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
                <FilterFormContent 
                    data={data} 
                    filters={mobileFilters} 
                    setFilters={setMobileFilters} // Updates buffer state
                />
            </div>

            {/* Footer with Clear & Apply */}
            <SheetFooter className="p-5 border-t border-gray-200 bg-gray-50/50 mt-auto flex flex-row gap-3 sm:justify-between">
              <Button 
                variant="outline"
                onClick={handleMobileClear}
                className="flex-1 border-gray-300 text-gray-700 hover:bg-white hover:text-red-600 hover:border-red-200"
              >
                Clear
              </Button>
              <Button 
                onClick={handleMobileApply}
                className="flex-[2] bg-[#2694C6] hover:bg-[#1f7ba5] text-white"
              >
                Show Results
              </Button>
            </SheetFooter>

          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default CourseFilters;