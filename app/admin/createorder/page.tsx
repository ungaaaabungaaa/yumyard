"use client";

import { useOrder } from "../context/OrderContext";
import { useRouter } from "next/navigation";
import { Id } from "../../../convex/_generated/dataModel";
import { FileText, Image, Minus, Plus, Trash2 } from 'lucide-react';
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";

export default function AdminCreateOrder() {
  const { selectedItems, removeItem, updateQuantity, getTotalAmount, clearOrder } = useOrder();
  const router = useRouter();
  const createOrder = useMutation(api.order.createOrder);
  const [isCreating, setIsCreating] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const handleCreateOrder = async () => {
    if (selectedItems.length === 0) {
      alert("Please add items to your order first!");
      return;
    }

    if (isCreating) return; // Prevent multiple submissions

    setIsCreating(true);

    try {
      // Prepare order items for Convex
      const orderItems = selectedItems.map(item => ({
        menuId: item.menuId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        specialRequest: undefined, // No special requests for admin orders
      }));

      // Create the order in Convex with hardcoded admin values
      await createOrder({
        // User details (hardcoded for admin)
        userId: undefined, // No user for admin orders
        username: "Admin",
        userType: "authenticated",
        
        // Address details (hardcoded for admin)
        apartment: "Yumyard Cafe",

        // Order details (hardcoded for admin)
        orderType: "walk-up",
        deliveryNote: "walk-up order",
        
        // Order items
        items: orderItems,
        totalAmount: getTotalAmount(),
        
        // Payment details (hardcoded for admin)
        paymentStatus: "pending",
        paymentMethod: undefined,
        
        // Kitchen staff details
        staffName: "Admin",
      });

      // Clear the order after successful creation
      clearOrder();
      
      // Navigate to order completed page
      router.push('/admin/ordercompleted');
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleQuantityChange = (menuId: Id<"menu">, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(menuId);
    } else {
      updateQuantity(menuId, newQuantity);
    }
  };

  return (
    <div className="pb-24">
      {selectedItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gray-100">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items in order</h3>
          <p className="text-gray-500 mb-6">Add items from the menu to create an order</p>
          <button
            onClick={() => router.push('/admin/addorder')}
            className="bg-background-primary text-typography-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Add Items
          </button>
        </div>
      ) : (
        <>
          {/* Selected Items List */}
          <div className="space-y-4 mb-6">
            {selectedItems.map((item) => (
              <div
                key={item.menuId}
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

                          {/* Quantity Controls below price, aligned to right */}
                          <div className="flex items-center justify-end space-x-2 my-2">
                            {item.quantity > 1 ? (
                              <button
                                onClick={() => handleQuantityChange(item.menuId, item.quantity - 1)}
                                className="w-8 h-8 bg-background-secondary  text-background-primary  rounded-full flex items-center justify-center transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => removeItem(item.menuId)}
                                className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                            
                            <span className="text-lg font-medium text-typography-heading min-w-[1.5rem] text-center">
                              {item.quantity}
                            </span>
                            
                            <button
                              onClick={() => handleQuantityChange(item.menuId, item.quantity + 1)}
                              className="w-8 h-8 bg-background-secondary  text-background-primary   rounded-full flex items-center justify-center transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between my-4">
              <div>
                <span className="text-2xl font-bold text-typography-heading">
                  {formatPrice(getTotalAmount())}
                </span>
              </div>
              <button
                onClick={handleCreateOrder}
                disabled={isCreating}
                className={`bg-background-primary text-white px-8 py-4 rounded-2xl text-lg font-bold transition-colors ${
                  isCreating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'
                }`}
              >
                {isCreating ? 'Creating Order...' : 'Create Order'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
