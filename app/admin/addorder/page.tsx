"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useOrder } from "../context/OrderContext";
import { useRouter } from "next/navigation";
import { Search, Plus, Image, Minus, Trash } from 'lucide-react';
import { Id } from "../../../convex/_generated/dataModel";

export default function AdminAddOrder() {
  const [searchTerm, setSearchTerm] = useState("");
  const { addItem, selectedItems, removeItem, updateQuantity } = useOrder();
  const router = useRouter();
  
  // Get all menu items and filter based on search
  const allMenuItems = useQuery(api.menu.getAllMenuItems);
  
  const filteredMenuItems = allMenuItems?.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const handleAddToOrder = (menuItem: { _id: Id<"menu">; name: string; price: number; imageUrl?: string }) => {
    addItem({
      menuId: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
      imageUrl: menuItem.imageUrl,
    });
  };

  const handleQuantityChange = (menuId: Id<"menu">, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(menuId);
    } else {
      updateQuantity(menuId, newQuantity);
    }
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
    <div className="pb-10">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-6 h-6 text-typography-disabled" />
          </div>
          <input
            type="text"
            placeholder="Search For Food"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-4 border border-border-secondary rounded-2xl  outline-none"
          />
        </div>
      </div>

      {/* Menu Items List */}
      <div className="space-y-4">
        {filteredMenuItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
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
                    <div className="w-32 h-32 rounded-tl-3xl rounded-bl-3xl rounded-tr-lg rounded-br-lg overflow-hidden">
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
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Image className="w-8 h-8" />
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
                       
                        {/* Price */}
                        <h4 className="text-2xl font-semibold text-typography-heading mt-2">
                          {formatPrice(item.price)} 
                        </h4>

                        {/* Quantity Controls or Add Button */}
                        {(() => {
                          const selectedItem = selectedItems.find(selected => selected.menuId === item._id);
                          if (selectedItem) {
                            return (
                              <div className="flex items-center justify-end space-x-2 mr-2 my-2">
                                {selectedItem.quantity > 1 ? (
                                  <button
                                    onClick={() => handleQuantityChange(item._id, selectedItem.quantity - 1)}
                                    className="w-8 h-8 bg-background-secondary  text-background-primary rounded-full flex items-center justify-center transition-colors"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => removeItem(item._id)}
                                    className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                                  >
                                    <Trash className="w-4 h-4" />
                                  </button>
                                )}
                                
                                <span className="text-lg font-medium text-typography-heading min-w-[1.5rem] text-center">
                                  {selectedItem.quantity}
                                </span>
                                
                                <button
                                  onClick={() => handleQuantityChange(item._id, selectedItem.quantity + 1)}
                                  className="w-8 h-8  bg-background-secondary  text-background-primary rounded-full flex items-center justify-center transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            );
                          } else {
                            return (
                              <div className="w-full flex items-center justify-end mt-2">
                                <button
                                  onClick={() => handleAddToOrder(item)}
                                  className="w-12 h-12 bg-background-secondary rounded-full flex items-center justify-center transition-colors"
                                  title="Add to order"
                                >
                                  <Plus className="w-6 h-6 text-background-primary" />
                                </button>
                              </div>
                            );
                          }
                        })()}
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
            className="w-full bg-background-primary  text-typography-white py-4 px-6 rounded-2xl text-lg font-bold transition-colors shadow-lg"
          >
            Next Step ({selectedItems.length} items)
          </button>
        </div>
      )}
    </div>
  );
}