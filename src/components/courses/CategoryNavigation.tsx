// src/components/courses/CategoryNavigation.tsx

import React from "react";
import { Inbox } from "lucide-react";
import { CategoryCards, ActiveCategoryHeader } from "@/components/courses/CategoryCards";

// Define the shape of the View State passed from the parent
export type ViewState = 
  | { mode: 'ROOT'; activeParent: null; activeSub: null }
  | { mode: 'PARENT'; activeParent: any; activeSub: null }
  | { mode: 'CHILD'; activeParent: any; activeSub: any };

interface CategoryNavigationProps {
  viewState: ViewState;
  filterData: any;
  isLoading: boolean;
  onParentSelect: (category: any) => void;
  onChildSelect: (subCategory: any) => void;
  onBack: () => void;
}

export const CategoryNavigation: React.FC<CategoryNavigationProps> = ({
  viewState,
  filterData,
  isLoading,
  onParentSelect,
  onChildSelect,
  onBack
}) => {
  // 1. Loading State
  if (isLoading || !filterData) return null;

  // 2. Helper to get subcategories for the current parent
  const getSubCategories = () => {
    if (viewState.activeParent) {
      return filterData.globalSubCategories.filter(
        (sub: any) => sub.parent_slug === viewState.activeParent.slug
      );
    }
    return [];
  };

  // --- RENDER LOGIC ---

  // MODE A: Root View (Show Main Categories)
  if (viewState.mode === 'ROOT') {
    return (
      <div className="animate-in fade-in duration-500">
        <CategoryCards 
          categories={filterData.globalCategories} 
          onSelect={onParentSelect} 
        />
      </div>
    );
  }

  // MODE B: Parent View (Show Header + Subcategory Cards)
  if (viewState.mode === 'PARENT' && viewState.activeParent) {
    const subCategories = getSubCategories();
    return (
      <div className="mb-8 animate-in fade-in slide-in-from-left-4 duration-300">
        <ActiveCategoryHeader 
          category={viewState.activeParent} 
          onBack={onBack} 
        />
        {subCategories.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Explore {viewState.activeParent.name}
            </h3>
            <CategoryCards 
              categories={subCategories} 
              onSelect={onChildSelect} 
            />
          </div>
        )}
      </div>
    );
  }

  // MODE C: Child View (Deep Focus - Header Only)
  if (viewState.mode === 'CHILD' && viewState.activeParent && viewState.activeSub) {
    return (
      <div className="mb-8 animate-in fade-in slide-in-from-left-4 duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6">
          
          <button 
            onClick={onBack}
            className="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors w-full sm:w-auto"
          >
            <div className="p-1 bg-gray-100 rounded-full group-hover:bg-gray-200 transition-colors">
                 <Inbox className="w-4 h-4 rotate-180" /> 
            </div>
            
            <span className="truncate max-w-[200px] sm:max-w-[150px] block" title={`Back to ${viewState.activeParent.name}`}>
                Back to {viewState.activeParent.name}
            </span>
          </button>

          <div className="hidden sm:block h-6 w-px bg-gray-300"></div>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight break-words">
            {viewState.activeSub.name}
          </h2>
        </div>
      </div>
    );
}

  return null;
};