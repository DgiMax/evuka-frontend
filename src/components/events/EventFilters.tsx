"use client";

import React, { useState, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react"; 
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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
type FilterOption = {
  id: string;
  label: string;
};

type FilterData = {
  event_types?: FilterOption[];
  categories?: FilterOption[];
  price_options?: FilterOption[];
  upcoming_options?: FilterOption[];
};

export type FiltersState = {
  type: Record<string, boolean>;
  category: string;
  price: string;
  upcoming: string;
};

type EventFiltersProps = {
  data: FilterData;
  onFilterChange: (filters: FiltersState) => void;
  defaultValues?: Partial<FiltersState>;
};

// --- SUB-COMPONENTS ---

const ChevronUpIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6l-6 6z"/></svg>
);

const Checkbox = ({ id, label, checked, onChange }: { id: string, label: string, checked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <label htmlFor={id} className="flex items-center space-x-3 cursor-pointer text-gray-700 hover:text-gray-900 transition-colors py-1">
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={onChange}
      className="h-5 w-5 accent-[#2694C6] border-gray-300 rounded focus:ring-[#2694C6]"
    />
    <span className="text-sm">{label}</span>
  </label>
);

// Added borders here to match desktop look
const FilterSection = ({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean; }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 last:border-0 py-4">
      <button
        className="w-full flex justify-between items-center text-left hover:bg-gray-50/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-semibold text-sm text-gray-900 uppercase tracking-wide">{title}</h3>
        <ChevronUpIcon
          className={`text-gray-400 transform transition-transform duration-200 ${isOpen ? "" : "rotate-180"}`}
        />
      </button>
      {isOpen && <div className="pt-3 space-y-2">{children}</div>}
    </div>
  );
};

// --- 1. REUSABLE FILTER CONTENT (Pure UI) ---

type FilterContentProps = {
  data: FilterData;
  filters: FiltersState;
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
};

const FilterFormContent = ({ data, filters, setFilters }: FilterContentProps) => {
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      type: { ...prev.type, [e.target.id]: e.target.checked },
    }));
  };

  const handleFilterChange = (section: keyof Omit<FiltersState, 'type'>, value: string) => {
    setFilters((prev) => ({ ...prev, [section]: value }));
  };

  return (
    <div className="flex flex-col">
      {/* EVENT TYPES */}
      {data?.event_types && data.event_types.length > 0 && (
        <FilterSection title="Event Type">
            {data.event_types.map((type) => (
              <Checkbox
                key={type.id}
                id={type.id}
                label={type.label}
                checked={!!filters.type[type.id]}
                onChange={handleCheckboxChange}
              />
            ))}
        </FilterSection>
      )}

      {/* CATEGORIES */}
      {data?.categories && data.categories.length > 0 && (
        <FilterSection title="Category">
          <Select
            value={filters.category}
            onValueChange={(value) => handleFilterChange("category", value)}
          >
            <SelectTrigger className="w-full"><SelectValue placeholder="All Categories" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {data.categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterSection>
      )}

      {/* PRICE */}
      {data?.price_options && data.price_options.length > 0 && (
        <FilterSection title="Price">
            {data.price_options.map((option) => (
              <label key={option.id} className="flex items-center space-x-3 cursor-pointer text-gray-700 hover:text-gray-900 py-1">
                <input
                  type="radio"
                  name="price"
                  value={option.id}
                  checked={filters.price === option.id}
                  onChange={(e) => handleFilterChange("price", e.target.value)}
                  className="accent-[#2694C6] h-4 w-4 border-gray-300"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
        </FilterSection>
      )}

      {/* UPCOMING */}
      {data?.upcoming_options && data.upcoming_options.length > 0 && (
        <FilterSection title="Time">
          <Select
            value={filters.upcoming}
            onValueChange={(value) => handleFilterChange("upcoming", value)}
          >
            <SelectTrigger className="w-full"><SelectValue placeholder="Any time" /></SelectTrigger>
            <SelectContent>
              {data.upcoming_options.map((option) => (
                <SelectItem key={option.id} value={option.id}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterSection>
      )}
    </div>
  );
};

// --- MAIN EXPORTED COMPONENT ---

const EventFilters = ({ data, onFilterChange, defaultValues }: EventFiltersProps) => {
  const initialFilters: FiltersState = {
    type: defaultValues?.type || {},
    category: defaultValues?.category || "all",
    price: defaultValues?.price || "all",
    upcoming: defaultValues?.upcoming || "all",
  };

  const [filters, setFilters] = useState<FiltersState>(initialFilters);

  // Trigger parent update whenever filters change (Desktop behavior)
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);


  const clearAll = () => {
    setFilters(initialFilters);
  };

  // --- MOBILE LOGIC ---
  const [mobileFilters, setMobileFilters] = useState<FiltersState>(filters);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleMobileOpen = () => {
    setMobileFilters(filters);
    setIsSheetOpen(true);
  };

  const handleMobileApply = () => {
    setFilters(mobileFilters);
    setIsSheetOpen(false);
  };
  
  const handleMobileClear = () => {
    setMobileFilters(initialFilters);
  }

  return (
    <>
      {/* --- DESKTOP VIEW (Visible lg+) --- */}
      <div className="hidden lg:block w-full max-w-sm bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <SlidersHorizontal size={18} /> Filters
          </h2>
          <button
            onClick={clearAll}
            className="text-xs text-muted-foreground hover:text-[#2694C6] font-medium transition-colors"
          >
            Reset
          </button>
        </div>
        
        <FilterFormContent 
          data={data} 
          filters={filters} 
          setFilters={setFilters} 
        />
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
                <SlidersHorizontal size={18} /> Filter Events
              </span>
              <span className="bg-gray-100 text-xs px-2 py-1 rounded-full text-gray-600">
                Customize
              </span>
            </Button>
          </SheetTrigger>
          
          {/* FIXES:
              1. [&>button]:hidden -> Hides the duplicate default close button provided by Shadcn
              2. rounded-none -> Removes border radius completely
              3. w-[300px] -> Sets a standard manageable width
          */}
          <SheetContent 
            side="left" 
            className="w-[300px] sm:w-[400px] flex flex-col h-full p-0 rounded-none border-r-0 shadow-xl overflow-hidden [&>button]:hidden"
          >
            {/* Header with Custom Close Button */}
            <SheetHeader className="p-5 border-b border-gray-200 bg-white flex flex-row items-center justify-between space-y-0">
              <SheetTitle className="text-xl font-bold">
                Filter Events
              </SheetTitle>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200">
                   <X size={18} />
                </Button>
              </SheetClose>
            </SheetHeader>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto px-5 py-2">
              <FilterFormContent 
                data={data} 
                filters={mobileFilters} 
                setFilters={setMobileFilters} 
              />
            </div>

            {/* Fixed Footer with Clear & Apply Buttons */}
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

export default EventFilters;