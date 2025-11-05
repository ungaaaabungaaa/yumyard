"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Doc } from "../../../../convex/_generated/dataModel";
import { Search } from "lucide-react";

export default function TablesExplore() {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch categories - Convex automatically caches queries
  const categories = useQuery(api.categories.getAllCategories);

  // Filter categories based on search term
  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    
    if (!searchTerm.trim()) return categories;
    
    const term = searchTerm.toLowerCase();
    return categories.filter((category) => {
      const nameMatch = category.name.toLowerCase().includes(term);
      return nameMatch;
    });
  }, [categories, searchTerm]);

  // Show filtered categories
  const displayItems = filteredCategories;

  const handleItemClick = (item: Doc<"categories">) => {
    console.log("Category clicked:", item);
  };

  return (
    <div className="w-full min-h-full bg-background-surface-background flex flex-col">
      {/* Search Bar */}
      <div className="w-full mb-6 relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <Search className="w-5 h-5 text-typography-disabled" />
          </div>
          <input
            type="text"
            placeholder="Search Categories"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-borders-separators-default rounded-2xl outline-none focus:ring-2 focus:ring-background-primary focus:border-background-primary transition-all"
          />
        </div>
      </div>

      {/* List View */}
      <div className="flex-1 w-full">
        {displayItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-typography-secondary">
              {searchTerm.trim() ? "No categories found" : "No categories available"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {displayItems.map((item) => {
              const imageUrl = item.imageUrl;
              const name = item.name;
              
              return (
                <button
                  key={item._id}
                  onClick={() => handleItemClick(item)}
                  className="relative w-full h-78 rounded-2xl overflow-hidden group"
                  style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* Overlay for better text readability */}
                  <div className="absolute inset-0 bg-black/40" />
                  
                  {/* Text centered */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-black text-2xl text-center px-2 z-10">
                      {name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
