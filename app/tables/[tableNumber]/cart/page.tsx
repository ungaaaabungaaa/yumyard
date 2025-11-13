"use client";

import { useCart } from '../context/CartContext';
import { Minus, Plus, Trash2, Trash } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

export default function TablesCart() {
  const { cartItems, updateQuantity, removeFromCart, getTotalAmount, getTotalItems } = useCart();
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
        <div className="relative mb-8 w-full h-42">
          <Image src="/Emptystate.png" alt="Empty Cart" width={300} height={300} className="object-cover" />
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
          onClick={() => router.push(`/tables/${tableNumber}/explore`)}
          className="bg-background-primary text-white font-medium px-24 py-4 rounded-lg transition-colors duration-200"
        >
          Explore
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Cart Items */}
      <div className="flex flex-col gap-4">
        {cartItems.map((item) => (
          <div
            key={item.menuId}
            className="flex gap-4 p-4 rounded-2xl border border-border-secondary bg-background-surface-background"
          >
            {/* Image */}
            <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
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
                <div className="w-full h-full flex items-center justify-center bg-background-element-background">
                  <svg className="w-8 h-8 text-typography-disabled" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-typography-heading line-clamp-2">
                    {item.name}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-typography-secondary line-clamp-1 mt-1">
                      {item.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => removeFromCart(item.menuId)}
                  className="ml-2 p-1 text-typography-disabled hover:text-red-500 transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <span className="text-lg font-semibold text-typography-heading">
                  {formatPrice(item.price * item.quantity)}
                </span>
                
                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  {item.quantity > 1 ? (
                    <button
                      onClick={() => updateQuantity(item.menuId, item.quantity - 1)}
                      className="w-8 h-8 bg-background-secondary text-background-primary rounded-full flex items-center justify-center transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => removeFromCart(item.menuId)}
                      className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  )}
                  <span className="text-base font-medium text-typography-heading min-w-[1.5rem] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.menuId, item.quantity + 1)}
                    className="w-8 h-8 bg-background-secondary text-background-primary rounded-full flex items-center justify-center transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="sticky bottom-0 bg-background-surface-background border-t border-border-secondary p-4 rounded-t-2xl">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-medium text-typography-heading">
            Total Items:
          </span>
          <span className="text-lg font-semibold text-typography-heading">
            {getTotalItems()}
          </span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-semibold text-typography-heading">
            Total Amount:
          </span>
          <span className="text-xl font-bold text-typography-heading">
            {formatPrice(getTotalAmount())}
          </span>
        </div>
        <button
          onClick={() => router.push(`/tables/${tableNumber}/checkout`)}
          className="w-full bg-background-primary text-white font-semibold py-4 rounded-xl hover:opacity-90 transition-opacity"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
