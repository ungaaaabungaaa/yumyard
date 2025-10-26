"use client";

import { useRouter } from "next/navigation";
import { CheckCircle, ArrowLeft, Home } from 'lucide-react';
import Lottie from "lottie-react";
import orderConfirmed from "@/public/lottie/Order Confirmed.json";

export default function OrderCompleted() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className=" w-full mx-4">
        <div className="p-8 text-center">
          {/* Success Icon */}
          <div className="w-3/4 h-auto  flex items-center justify-center mx-auto mb-6">
            <Lottie animationData={orderConfirmed} loop={true} />;
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Order Created Successfully!
          </h1>
          
          <p className="text-gray-600 mb-8">
            Your order has been placed and is now being processed by the kitchen.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => router.push('/admin/addorder')}
              className="w-full bg-background-primary text-white py-3 px-6 rounded-xl font-medium transition-colors hover:bg-opacity-90"
            >
              Create Another Order
            </button>
            
            <button
              onClick={() => router.push('/admin/orders')}
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium transition-colors hover:bg-gray-200 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>View All Orders</span>
            </button>
            
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="w-full bg-gray-50 text-gray-600 py-3 px-6 rounded-xl font-medium transition-colors hover:bg-gray-100 flex items-center justify-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Go to Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
