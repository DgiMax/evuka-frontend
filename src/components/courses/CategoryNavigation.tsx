import React from "react";
import { ChevronLeft } from "lucide-react";
import { CategoryCards, ActiveCategoryHeader } from "@/components/courses/CategoryCards";

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
  if (isLoading || !filterData) return null;

  const getSubCategories = () => {
    if (viewState.activeParent) {
      return filterData.globalSubCategories.filter(
        (sub: any) => sub.parent_slug === viewState.activeParent.slug
      );
    }
    return [];
  };

  if (viewState.mode === 'ROOT') {
    return (
      <div className="animate-in fade-in duration-500 mb-6 md:mb-10">
        <CategoryCards 
          categories={filterData.globalCategories} 
          onSelect={onParentSelect} 
        />
      </div>
    );
  }

  if (viewState.mode === 'PARENT' && viewState.activeParent) {
    const subCategories = getSubCategories();
    return (
      <div className="mb-6 md:mb-10 animate-in fade-in slide-in-from-left-4 duration-300">
        <ActiveCategoryHeader 
          category={viewState.activeParent} 
          onBack={onBack} 
        />
        {subCategories.length > 0 && (
          <div className="mt-6 md:mt-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4 px-1">
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

  if (viewState.mode === 'CHILD' && viewState.activeParent && viewState.activeSub) {
    return (
      <div className="mb-6 md:mb-10 animate-in fade-in slide-in-from-left-4 duration-300">
        <div className="flex flex-row items-center gap-3 sm:gap-6 px-1 overflow-hidden">
          <button 
            onClick={onBack}
            className="group flex items-center gap-1 text-[10px] sm:text-xs font-bold text-gray-500 hover:text-primary transition-all flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-1" /> 
            <span className="uppercase tracking-wider whitespace-nowrap">
                Back to {viewState.activeParent.name}
            </span>
          </button>

          <div className="h-6 sm:h-8 w-px bg-gray-200 flex-shrink-0"></div>

          <h2 className="text-lg sm:text-2xl font-black text-gray-900 leading-tight tracking-tight truncate">
            {viewState.activeSub.name}
          </h2>
        </div>
      </div>
    );
  }

  return null;
};