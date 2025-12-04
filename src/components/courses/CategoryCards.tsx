import React from "react";
import { ArrowLeft, BookOpen } from "lucide-react";

interface CategoryCardProps {
  categories: any[];
  onSelect: (category: any) => void;
}

export const CategoryCards = ({ categories, onSelect }: CategoryCardProps) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
    {categories.map((cat) => (
      <button
        key={cat.id}
        onClick={() => onSelect(cat)}
        className="flex flex-col items-center justify-center p-6 bg-white border border-gray-200 rounded-md hover:border-[#2694C6] hover:shadow transition-all group text-center"
      >
        <div className="h-12 w-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-[#e0f2fe] transition-colors overflow-hidden">
             {cat.thumbnail ? (
                 <img src={cat.thumbnail} alt={cat.name} className="h-full w-full object-cover" />
             ) : (
                 <BookOpen className="h-6 w-6 text-gray-400 group-hover:text-[#2694C6]" />
             )}
        </div>
        <h3 className="font-semibold text-gray-900 group-hover:text-[#2694C6]">{cat.name}</h3>
      </button>
    ))}
  </div>
);

export const ActiveCategoryHeader = ({ category, onBack }: { category: any; onBack: () => void }) => (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6">
        <button 
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors self-start sm:self-auto"
        >
            <div className="p-1 bg-gray-100 rounded-full group-hover:bg-gray-200 transition-colors">
                <ArrowLeft size={16} />
            </div>
            <span className="whitespace-nowrap">Back to Categories</span>
        </button>
    </div>
);