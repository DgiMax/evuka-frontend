"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SlidersHorizontal, X, ChevronUp } from "lucide-react";

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
type FilterOption = { id: string; label: string };

type FilterData = {
  categories?: FilterOption[];
  levels?: FilterOption[];
  languages?: FilterOption[];
  price?: { min: number; max: number };
};

type FiltersState = {
  categories: Record<string, boolean>;
  levels: Record<string, boolean>;
  languages: Record<string, boolean>;
  price: { min: number; max: number };
};

export type QueryParams = {
  category?: string[];
  level?: string[];
  languages?: string[];
  min_price?: string;
  max_price?: string;
};

type CourseFiltersProps = {
  data?: FilterData;
  onFilterChange?: (filters: QueryParams) => void;
  defaultValues?: Partial<FiltersState>;
};

// Color constant matching EventFilters accent
const PRIMARY_COLOR_CLASS = "accent-[#2694C6] focus:ring-[#2694C6]";

// --- SMALL DEBOUNCE (no external deps) ---
function createDebounce<T extends (...args: any[]) => void>(fn: T, wait = 400) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const debounced = (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, wait);
  };
  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };
  return debounced as T & { cancel: () => void };
}

// --- SUB-COMPONENTS (Styled to match EventFilters) ---

const Checkbox = ({
  label,
  id,
  checked,
  onChange,
}: {
  label: string;
  id: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <label
    htmlFor={id}
    className="flex items-center space-x-3 cursor-pointer text-gray-700 text-sm py-1"
  >
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={onChange}
      className={`h-5 w-5 border-gray-300 rounded ${PRIMARY_COLOR_CLASS}`}
      aria-checked={checked}
    />
    <span className="text-sm">{label}</span>
  </label>
);

const FilterSection = ({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full flex justify-between items-center py-3 px-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
      >
        <h3 className="font-bold text-gray-800 text-base">{title}</h3>
        <ChevronUp
          className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${
            isOpen ? "" : "rotate-180"
          }`}
        />
      </button>
      {isOpen && <div className="p-4 space-y-3 bg-white">{children}</div>}
    </div>
  );
};

// --- UTILITY: Initialize sections so each checkbox is controlled ---
const initializeSection = (items?: FilterOption[], defaults?: Record<string, boolean>) => {
  const result: Record<string, boolean> = {};
  items?.forEach((it) => {
    result[it.id] = defaults?.[it.id] ?? false;
  });
  return result;
};

// ---  UTILITY: Converts FiltersState to Backend Query Params ---
const buildQueryParams = (filtersState: FiltersState, defaultMaxPrice: number): QueryParams => {
  const params: QueryParams = {};

  const selectedCategories = Object.keys(filtersState.categories).filter(
    (key) => filtersState.categories[key]
  );
  if (selectedCategories.length > 0) params.category = selectedCategories;

  const selectedLevels = Object.keys(filtersState.levels).filter((key) => filtersState.levels[key]);
  if (selectedLevels.length > 0) params.level = selectedLevels;

  const selectedLanguages = Object.keys(filtersState.languages).filter(
    (key) => filtersState.languages[key]
  );
  if (selectedLanguages.length > 0) params.languages = selectedLanguages;

  if (filtersState.price.min > 0) params.min_price = String(filtersState.price.min);
  if (filtersState.price.max < defaultMaxPrice) params.max_price = String(filtersState.price.max);

  return params;
};

// --- Filter content component ---
type FilterContentProps = {
  data?: FilterData;
  filters: FiltersState;
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
};

const FilterFormContent = ({ data, filters, setFilters }: FilterContentProps) => {
  const handleCheckboxChange = (
    section: keyof Omit<FiltersState, "price">,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const id = e.target.id;
    const checked = e.target.checked;
    setFilters((prev) => ({
      ...prev,
      [section]: { ...(prev[section] as Record<string, boolean>), [id]: checked },
    }));
  };

  const handlePriceChange = (type: "min" | "max", value: number) => {
    setFilters((prev) => {
      const current = prev.price;
      // Prevent invalid state where min > max
      if (type === "min" && value > current.max) {
        return prev;
      }
      if (type === "max" && value < current.min) {
        return prev;
      }
      return { ...prev, price: { ...current, [type]: value } };
    });
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
          <div className="space-y-4 pt-2">
            {/* Price Range Slider */}
            <input
              type="range"
              min={String(data.price.min ?? 0)}
              max={String(data.price.max)}
              value={filters.price.max}
              onChange={(e) => handlePriceChange("max", parseInt(e.target.value, 10) || 0)}
              className={`w-full h-2 bg-gray-200 rounded-lg cursor-pointer ${PRIMARY_COLOR_CLASS} transition-colors`}
              aria-label="Maximum price"
            />

            {/* Price Inputs */}
            <div className="flex items-center justify-between space-x-2">
              <input
                type="number"
                value={filters.price.min}
                onChange={(e) => handlePriceChange("min", parseInt(e.target.value, 10) || 0)}
                className="w-full px-2 py-1 text-center border border-gray-300 rounded-md text-sm focus:border-[#2694C6] focus:ring-1 focus:ring-[#2694C6]"
                aria-label="Minimum price"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                value={filters.price.max}
                onChange={(e) => handlePriceChange("max", parseInt(e.target.value, 10) || 0)}
                className="w-full px-2 py-1 text-center border border-gray-300 rounded-md text-sm focus:border-[#2694C6] focus:ring-1 focus:ring-[#2694C6]"
                aria-label="Maximum price"
              />
            </div>
          </div>
        </FilterSection>
      )}
    </div>
  );
};

// --- MAIN EXPORTED COMPONENT ---
const CourseFilters = ({ data, onFilterChange, defaultValues }: CourseFiltersProps) => {
  const DEFAULT_MAX_PRICE = data?.price?.max ?? 5999;

  // Initialize sections with known filter options so all inputs are controlled
  const initialFilters: FiltersState = {
    categories: initializeSection(data?.categories, defaultValues?.categories),
    levels: initializeSection(data?.levels, defaultValues?.levels),
    languages: initializeSection(data?.languages, defaultValues?.languages),
    price: defaultValues?.price ?? { min: data?.price?.min ?? 0, max: DEFAULT_MAX_PRICE },
  };

  // 1. DESKTOP STATE (Live)
  const [filters, setFilters] = useState<FiltersState>(initialFilters);

  // 2. MOBILE STATE (Buffer)
  const [mobileFilters, setMobileFilters] = useState<FiltersState>(filters);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Debounce logic (memoized)
  const onFilterChangeRef = useRef(onFilterChange);
  useEffect(() => {
    onFilterChangeRef.current = onFilterChange;
  }, [onFilterChange]);

  // create debounced function once; cancel on unmount
  const debouncedNotify = useMemo(() => {
    const fn = (params: QueryParams) => {
      onFilterChangeRef.current?.(params);
    };
    return createDebounce(fn, 400);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params = buildQueryParams(filters, DEFAULT_MAX_PRICE);
    debouncedNotify(params);
    return () => {
      // do not cancel here each rerender; only cancel on unmount
    };
    // we intentionally exclude debouncedNotify from deps so it remains stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, DEFAULT_MAX_PRICE]);

  useEffect(() => {
    return () => {
      // cleanup on unmount
      debouncedNotify.cancel?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearAll = useCallback(() => {
    setFilters({
      categories: initializeSection(data?.categories, {}),
      levels: initializeSection(data?.levels, {}),
      languages: initializeSection(data?.languages, {}),
      price: { min: data?.price?.min ?? 0, max: DEFAULT_MAX_PRICE },
    });
  }, [data, DEFAULT_MAX_PRICE]);

  // --- MOBILE HANDLERS ---
  const handleMobileOpen = () => {
    setMobileFilters(filters); // sync mobile buffer
    setIsSheetOpen(true);
  };

  const handleMobileApply = () => {
    setFilters(mobileFilters); // push mobile buffer to live filters (triggers API via effect)
    setIsSheetOpen(false);
  };

  const handleMobileClear = () => {
    setMobileFilters({
      categories: initializeSection(data?.categories, {}),
      levels: initializeSection(data?.levels, {}),
      languages: initializeSection(data?.languages, {}),
      price: { min: data?.price?.min ?? 0, max: DEFAULT_MAX_PRICE },
    });
  };

  return (
    <>
      {/* --- DESKTOP VIEW (Visible lg+) --- */}
      <div className="hidden lg:block w-full bg-white border border-gray-200 rounded-md shadow font-sans overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <SlidersHorizontal size={18} />
            Filters
          </h2>
          <button
            onClick={clearAll}
            className="bg-[#2694C6] hover:bg-[#1f7ba5] text-white font-semibold py-1.5 px-3 rounded text-sm transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Content */}
        {/* Added px-4 to match EventFilters inner spacing style */}
        <div> 
          <FilterFormContent data={data} filters={filters} setFilters={setFilters} />
        </div>
      </div>

      {/* --- MOBILE VIEW (Visible < lg) --- */}
      <div className="lg:hidden w-full">
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
              <span className="bg-gray-100 text-xs px-2 py-1 rounded-full text-gray-600">Customize</span>
            </Button>
          </SheetTrigger>

          <SheetContent
            side="left"
            className="w-[300px] sm:w-[400px] flex flex-col h-full p-0 rounded-none border-r-0 shadow-xl overflow-hidden [&>button]:hidden"
          >
            {/* Header */}
            <SheetHeader className="p-5 border-b border-gray-200 bg-white flex flex-row items-center justify-between space-y-0">
              <SheetTitle className="text-xl font-bold">Filter Events</SheetTitle>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                  <X size={18} />
                </Button>
              </SheetClose>
            </SheetHeader>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <FilterFormContent data={data} filters={mobileFilters} setFilters={setMobileFilters} />
            </div>

            {/* Footer */}
            <SheetFooter className="p-5 border-t border-gray-200 bg-gray-50 mt-auto flex flex-row gap-3 sm:justify-between">
              <Button
                variant="outline"
                onClick={handleMobileClear}
                className="flex-1 border-gray-300 text-gray-700 hover:text-red-600 hover:border-red-200"
              >
                Clear
              </Button>
              <Button onClick={handleMobileApply} className="flex-[2] bg-[#2694C6] hover:bg-[#1f7ba5] text-white">
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