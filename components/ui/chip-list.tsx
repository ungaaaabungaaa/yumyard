"use client";

import { cn } from "@/lib/utils";

interface ChipListProps {
  categories: string[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

export function ChipList({ categories, selectedCategory, onCategorySelect }: ChipListProps) {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide mb-4">
      <div className="flex gap-2 px-1">
        {/* "All" chip */}
        <button
          onClick={() => onCategorySelect(null)}
          className={cn(
            "px-4 py-2  rounded-lg text-sm font-medium whitespace-nowrap transition-all",
            selectedCategory === null
              ? "bg-background-primary text-typography-white"
              : "bg-background-element-background text-typography-disabled hover:bg-background-element-background/80"
          )}
        >
          All
        </button>
        
        {/* Category chips */}
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategorySelect(category)}
            className={cn(
              "px-4 py-2  rounded-lg text-sm font-medium whitespace-nowrap transition-all",
              selectedCategory === category
                ? "bg-background-primary text-typography-white"
                : "bg-transparent border  text-typography-disabled"
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

