"use client";

import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, TrendingUp } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';
import { Cards } from '@/components/ui/card';
import PAN from '@/public/lottie/Prepare Food.json';
import CHIEF from '@/public/lottie/Cooking.json';
import DELIVERY from '@/public/lottie/Delivery.json';

export default function TablePage() {
  const params = useParams();
  const router = useRouter();
  const tableNumber = params?.tableNumber as string || '';
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch all menu items once
  const allMenuItems = useQuery(api.menu.getAllMenuItems);

  // Cache 5 random items that only change when allMenuItems changes
  const randomItems = useMemo(() => {
    if (!allMenuItems || allMenuItems.length === 0) return [];
    const shuffled = [...allMenuItems].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  }, [allMenuItems]);

  // Filter menu items on frontend based on search term
  const filteredItems = useMemo(() => {
    if (!allMenuItems) return [];
    
    // If search term is empty, show 5 random items
    if (!searchTerm.trim()) {
      return randomItems;
    }
    
    // Otherwise, filter based on search term
    const term = searchTerm.toLowerCase();
    return allMenuItems.filter((item) => {
      const nameMatch = item.name.toLowerCase().includes(term);
      const descriptionMatch = item.description?.toLowerCase().includes(term);
      const categoryMatch = item.category?.toLowerCase().includes(term);
      
      return nameMatch || descriptionMatch || categoryMatch;
    }).slice(0, 10); // Limit to 10 results for dropdown
  }, [allMenuItems, searchTerm, randomItems]);

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFocused(false);
        searchInputRef.current?.blur();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleItemClick = (itemId: Id<"menu">) => {
    router.push(`/tables/${tableNumber}/details/${itemId}`);
    setSearchTerm('');
    setIsFocused(false);
  };

  const showDropdown = isFocused && filteredItems.length > 0;

  return (
    <>
    <div className='w-full min-h-full bg-background-surface-background flex flex-col items-center justify-center'>
    {/* Search Bar */}
    <div className="min-w-full mb-4 relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <Search className="w-6 h-6 text-typography-disabled" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search Menu Items"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            className={`w-full pl-10 pr-4 py-4 border rounded-2xl outline-none transition-all ${
              isFocused 
                ? 'border-borders-separators-primary ring-2 ring-background-primary' 
                : 'border-border-secondary'
            }`}
          />
        </div>
        
        {/* Dropdown */}
        {showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-border-secondary rounded-2xl z-50 max-h-80 overflow-y-auto"
          >
            {filteredItems.map((item, index) => (
              <button
                key={item._id}
                onClick={() => handleItemClick(item._id)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-background-element-background transition-colors text-left ${
                  index < filteredItems.length - 1 ? '' : ''
                }`}
              >
                <TrendingUp className="w-5 h-5 text-typography-disabled flex-shrink-0" />
                <span className="text-typography-heading font-medium flex-1">
                  {item.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Cards Section */}
      <Cards
        cards={[
          {
            lottieAnimation: PAN,
            title: (
              <>
                Try Out <br /> BBQ Burger!
              </>
            ),
           
          },
          {
            lottieAnimation: CHIEF,
            title: (
              <>
                 Delicious <br /> Pasta!
              </>
            ),
          },
          {
            lottieAnimation: DELIVERY,
            title: (
              <>
                 Free Home  <br /> Delivery!
              </>
            ),
           
          },
         
        ]}
      />
      
      <div>Menu Items</div>
    </div>
    </>
  );
}
