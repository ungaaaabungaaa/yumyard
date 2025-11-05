"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Search } from "lucide-react";

export default function TablesExplore() {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch categories - Convex automatically caches queries
  const categories = useQuery(api.categories.getAllCategories);
  
  // Fetch menu items for search - Convex automatically caches queries
  const menuItems = useQuery(api.menu.getAllMenuItems);

  // Filter menu items based on search term
  const filteredItems = useMemo(() => {
    if (!menuItems || !searchTerm.trim()) return [];
    
    const term = searchTerm.toLowerCase();
    return menuItems.filter((item) => {
      const nameMatch = item.name.toLowerCase().includes(term);
      const descriptionMatch = item.description?.toLowerCase().includes(term);
      const categoryMatch = item.category?.toLowerCase().includes(term);
      
      return nameMatch || descriptionMatch || categoryMatch;
    });
  }, [menuItems, searchTerm]);

  // Show categories when search is empty, show search results when searching
  const displayItems = searchTerm.trim() ? filteredItems : categories || [];

  const handleItemClick = (item: any, type: "category" | "menuItem") => {
    if (type === "category") {
      console.log("Category clicked:", item);
    } else {
      console.log("Menu item clicked:", item);
    }
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
            placeholder="Search Menu Items"
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
              {searchTerm.trim() ? "No items found" : "No categories available"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {displayItems.map((item) => {
              const isCategory = "name" in item && "imageUrl" in item && !("price" in item);
              const imageUrl = isCategory ? item.imageUrl : item.imageUrl;
              const name = isCategory ? item.name : item.name;
              
              return (
                <button
                  key={item._id}
                  onClick={() => handleItemClick(item, isCategory ? "category" : "menuItem")}
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
