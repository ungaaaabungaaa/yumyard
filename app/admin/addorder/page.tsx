"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useOrder } from "../context/OrderContext";
import { Id } from "../../../convex/_generated/dataModel";
import { useRouter } from "next/navigation";

export default function AdminAddOrder() {
  const [searchTerm, setSearchTerm] = useState("");
  const { addItem, selectedItems } = useOrder();
  const router = useRouter();
  
  // Get all menu items and filter based on search
  const allMenuItems = useQuery(api.menu.getAllMenuItems);
  
  const filteredMenuItems = allMenuItems?.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const handleAddToOrder = (menuItem: any) => {
    addItem({
      menuId: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  if (!allMenuItems) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <h1 className="text-2xl font-bold text-typography-heading mb-6">Add Order</h1>
      
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search For Food"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Menu Items List */}
      <div className="space-y-4">
        {filteredMenuItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No items found' : 'No menu items available'}
            </h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'Add menu items to get started'}
            </p>
          </div>
        ) : (
          filteredMenuItems.map((item) => (
            <div
              key={item._id}
              className="overflow-hidden"
            >
              {/* Main Card Content */}
              <div className="p-2 border-1 rounded-4xl">
                <div className="flex items-start space-x-4">
                  {/* Image */}
                  <div className="flex-shrink-0">
                    <div className="w-36 h-30 rounded-tl-3xl rounded-bl-3xl rounded-tr-lg rounded-br-lg overflow-hidden">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-food.jpg';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-medium text-typography-heading mt-2">
                          {item.name}
                        </h3>
                        {item.description && (
                          <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                            {item.description}
                          </p>
                        )}

                        {/* Price and Add Button Row */}
                        <div className="flex items-center justify-between">
                          {/* Price on the left */}
                          <h4 className="text-2xl font-semibold text-typography-heading">
                            {formatPrice(item.price)} 
                          </h4>

                          {/* Add Button on the right */}
                          <button
                            onClick={() => handleAddToOrder(item)}
                            className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors"
                            title="Add to order"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Navigation to Create Order */}
      {selectedItems.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-full lg:max-w-2xl mx-auto px-4">
          <button
            onClick={() => router.push('/admin/createorder')}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-2xl text-lg font-bold transition-colors shadow-lg"
          >
            Review Order ({selectedItems.length} items)
          </button>
        </div>
      )}
    </div>
  );
}