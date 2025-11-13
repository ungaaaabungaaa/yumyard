"use client";

import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useParams, useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import Image from 'next/image';
import { Minus, Plus } from 'lucide-react';

export default function TablesCheckout() {
  const { cartItems, updateQuantity, getTotalAmount, getTotalItems, clearCart } = useCart();
  const params = useParams();
  const router = useRouter();
  const tableNumber = params?.tableNumber as string || '';
  const createOrder = useMutation(api.order.createOrder);
  
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phoneNumber?: string }>({});

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const validateForm = () => {
    const newErrors: { name?: string; phoneNumber?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    if (isPlacingOrder) return;

    setIsPlacingOrder(true);

    try {
      // Prepare order items for Convex
      const orderItems = cartItems.map(item => ({
        menuId: item.menuId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        specialRequest: undefined,
      }));

      // Create the order in Convex
      await createOrder({
        // User details
        userId: undefined, // No user for table orders
        username: name.trim(),
        userType: 'guest',
        
        // Contact information
        phoneNumber: phoneNumber.replace(/\D/g, ''), // Remove non-digits
        
        // Address details (not needed for dine-in)
        apartment: undefined,
        flatNumber: undefined,
        otherAddress: undefined,
        
        // Order details
        orderType: 'dine-in',
        tableNumber: tableNumber,
        deliveryNote: undefined,
        
        // Order items
        items: orderItems,
        totalAmount: getTotalAmount(),
        
        // Payment details
        paymentStatus: 'pending',
        paymentMethod: undefined,
        
        // Kitchen staff details
        staffName: undefined,
      });

      // Clear the cart after successful order
      clearCart();
      
      // Navigate to a success page or back to home
      router.push(`/tables/${tableNumber}`);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8">
        <h2 className="text-2xl font-bold text-typography-heading mb-4">
          Your cart is empty!
        </h2>
        <button
          onClick={() => router.push(`/tables/${tableNumber}`)}
          className="bg-background-primary text-white font-medium px-8 py-3 rounded-lg transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 pb-6">
      {/* Customer Information Form */}
      <div className="flex flex-col gap-4 p-4 rounded-2xl border border-border-secondary bg-background-surface-background">
        <h2 className="text-xl font-semibold text-typography-heading mb-2">
          Customer Information
        </h2>
        
        {/* Name Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium text-typography-heading">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) {
                setErrors({ ...errors, name: undefined });
              }
            }}
            placeholder="Enter your name"
            className={`w-full px-4 py-3 border rounded-xl outline-none transition-all ${
              errors.name
                ? 'border-red-500 ring-2 ring-red-200'
                : 'border-border-secondary focus:border-background-primary focus:ring-2 focus:ring-background-primary'
            }`}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        {/* Phone Number Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="phone" className="text-sm font-medium text-typography-heading">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={phoneNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 10);
              setPhoneNumber(value);
              if (errors.phoneNumber) {
                setErrors({ ...errors, phoneNumber: undefined });
              }
            }}
            placeholder="Enter your phone number"
            className={`w-full px-4 py-3 border rounded-xl outline-none transition-all ${
              errors.phoneNumber
                ? 'border-red-500 ring-2 ring-red-200'
                : 'border-border-secondary focus:border-background-primary focus:ring-2 focus:ring-background-primary'
            }`}
          />
          {errors.phoneNumber && (
            <p className="text-sm text-red-500">{errors.phoneNumber}</p>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-typography-heading">
          Order Items ({getTotalItems()})
        </h2>
        
        <div className="flex flex-col gap-3">
          {cartItems.map((item) => (
            <div
              key={item.menuId}
              className="flex gap-4 p-4 rounded-2xl border border-border-secondary bg-background-surface-background"
            >
              {/* Image */}
              <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden">
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
                    <svg className="w-6 h-6 text-typography-disabled" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <p className="text-base font-semibold text-typography-heading mt-1">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.menuId, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-background-secondary flex items-center justify-center hover:bg-background-primary transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4 text-typography-primary" />
                    </button>
                    <span className="text-base font-medium text-typography-heading min-w-[24px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.menuId, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-background-secondary flex items-center justify-center hover:bg-background-primary transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4 text-typography-primary" />
                    </button>
                  </div>
                  <span className="text-lg font-semibold text-typography-heading">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="sticky bottom-0 bg-background-surface-background border-t border-border-secondary p-4 rounded-t-2xl">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-medium text-typography-heading">
            Total Items:
          </span>
          <span className="text-lg font-semibold text-typography-heading">
            {getTotalItems()}
          </span>
        </div>
        <div className="flex items-center justify-between mb-6">
          <span className="text-xl font-semibold text-typography-heading">
            Total Amount:
          </span>
          <span className="text-xl font-bold text-typography-heading">
            {formatPrice(getTotalAmount())}
          </span>
        </div>
        <button
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder}
          className={`w-full bg-background-primary text-white font-semibold py-4 rounded-xl transition-opacity ${
            isPlacingOrder ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
          }`}
        >
          {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
}
