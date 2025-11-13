"use client";

import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, TrendingUp, Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id, Doc } from '../../../convex/_generated/dataModel';
import { Cards } from '@/components/ui/card';
import { ChipList } from '@/components/ui/chip-list';
import Image from 'next/image';
import PAN from '@/public/lottie/Prepare Food.json';
import CHIEF from '@/public/lottie/Cooking.json';
import DELIVERY from '@/public/lottie/Cooking egg.json';
import { useCart } from './context/CartContext';

export default function TablePage() {
  const params = useParams();
  const router = useRouter();
  const tableNumber = params?.tableNumber as string || '';
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  // Cache menu items to persist on refresh
  const cachedMenuItemsRef = useRef<Doc<"menu">[]>([]);

  // Fetch all menu items once
  const allMenuItemsQuery = useQuery(api.menu.getAllMenuItems);
  
  // Use cached items if query is undefined (during refresh/loading)
  const allMenuItems = allMenuItemsQuery ?? cachedMenuItemsRef.current;
  
  // Update cache when new data arrives
  useEffect(() => {
    if (allMenuItemsQuery) {
      cachedMenuItemsRef.current = allMenuItemsQuery;
    }
  }, [allMenuItemsQuery]);

  // Extract unique categories from menu items
  const categories = useMemo(() => {
    if (!allMenuItems) return [];
    const categorySet = new Set<string>();
    allMenuItems.forEach((item) => {
      if (item.category) {
        categorySet.add(item.category);
      }
    });
    return Array.from(categorySet).sort();
  }, [allMenuItems]);

  // Filter menu items by selected category
  const categoryFilteredItems = useMemo(() => {
    if (!allMenuItems) return [];
    if (selectedCategory === null) return allMenuItems;
    return allMenuItems.filter((item) => item.category === selectedCategory);
  }, [allMenuItems, selectedCategory]);

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const showDropdown = isFocused && filteredItems.length > 0;

  return (
    <>
    <div className='w-full min-h-full bg-background-surface-background flex flex-col items-center'>
    {/* Search Bar */}
    <div className="w-full mb-4 relative">
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
      <div className="w-full">
        <Cards
        cards={[
          {
            lottieAnimation: PAN,
            title: (
              <>
                Try Out <br /> BBQ <br></br> Burger!
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
                 Free Home  <br /> Delivery! <br></br> 10Min+
              </>
            ),
           
          },
         
        ]}
        />
      </div>
      
      {/* Chip List */}
      <div className="w-full">
        <ChipList
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />
      </div>
      
      {/* Menu Items Grid */}
      <div className="w-full">
        <div className="grid grid-cols-2 gap-2">
          {categoryFilteredItems.map((item) => (
              <div
                key={item._id}
                onClick={() => handleItemClick(item._id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleItemClick(item._id);
                  }
                }}
                className="flex flex-col  rounded-2xl border p-1 overflow-hidden"
              >
                {/* Image */}
                <div className="relative w-full aspect-square">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover rounded-t-2xl rounded-b-xl"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-food.jpg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-background-element-background">
                      <svg className="w-12 h-12 text-typography-disabled" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-3 flex flex-col gap-2">
                  <h3 className="text-xl font-medium text-typography-heading text-left line-clamp-2">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg  font-medium text-typography-heading">
                      {formatPrice(item.price)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({
                          menuId: item._id,
                          name: item.name,
                          price: item.price,
                          imageUrl: item.imageUrl,
                          description: item.description,
                          category: item.category,
                        });
                      }}
                      className="w-8 h-8 rounded-full bg-background-secondary flex items-center justify-center hover:bg-background-primary transition-colors"
                    >
                      <Plus className="w-5 h-5 text-typography-primary" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        
      </div>
    </div>
    </>
  );
}
