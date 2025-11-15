"use client";

import { useCart } from '../context/CartContext';
import { Minus, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Lottie from "lottie-react";
import ComingSoon from "@/public/lottie/Cooking egg.json";

export default function TablesCart() {
  const { cartItems, updateQuantity, removeFromCart, getTotalAmount } = useCart();
  const router = useRouter();
  const params = useParams();
  const tableNumber = params?.tableNumber as string || '';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8">
        {/* Illustration Section */}
        <div className="relative mb-8 flex items-center justify-center">
        <Lottie animationData={ComingSoon} className="w-full h-96" loop={true} />
        </div>
        
        {/* Text Content */}
        <div className="text-center mb-8 max-w-sm">
          <h2 className="text-4xl font-bold text-typography-heading mb-3">
            Your cart is empty!
          </h2>
          <p className="text-gray-600 text-base leading-relaxed">
            Explore and add items to the cart <br></br> to show here...
          </p>
        </div>
        {/* Explore Button */}
        <button 
          onClick={() => router.push(`/tables/${tableNumber}`)}
          className="bg-background-primary text-white font-medium px-24 py-4 rounded-lg"
        >
          Explore
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Cart Items List */}
      <div className="space-y-4 mb-6">
        {cartItems.map((item) => (
          <div
            key={item.menuId}
            className="overflow-hidden"
          >
            {/* Main Card Content */}
            <div className="p-2 border-1 rounded-4xl">
              <div className="flex items-start space-x-4">
                {/* Image */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-tl-3xl rounded-bl-3xl rounded-tr-lg rounded-br-lg overflow-hidden relative">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-food.jpg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ImageIcon className="w-8 h-8" />
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
                      <div className="flex items-center justify-end space-x-2 mr-2 my-2">
                        {item.quantity > 1 ? (
                          <button
                            onClick={() => updateQuantity(item.menuId, item.quantity - 1)}
                            className="w-8 h-8 bg-background-secondary text-background-primary rounded-full flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => removeFromCart(item.menuId)}
                            className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        
                        <span className="text-lg font-medium text-typography-heading min-w-[1.5rem] text-center">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => updateQuantity(item.menuId, item.quantity + 1)}
                          className="w-8 h-8 bg-background-secondary text-background-primary rounded-full flex items-center justify-center transition-colors"
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
      </div>

      {/* Sticky Bottom Section */}
      <div className="fixed bottom-20 left-4 right-4 max-w-full py-4 z-[60]">
        <div className="flex items-center justify-between px-4">
          {/* Total Amount */}
          <div>
            <span className="text-2xl font-bold text-typography-heading">
              {formatPrice(getTotalAmount())}
            </span>
          </div>
          
          {/* Place Order Button */}
          <button
            onClick={() => router.push(`/tables/${tableNumber}/checkout`)}
            className="bg-background-primary text-white px-8 py-4 rounded-2xl text-lg font-bold transition-colors hover:bg-opacity-90"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
