"use client";

import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import orderConfirmed from "@/public/lottie/Cooking.json";

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
              onClick={() => router.push('/admin/orders')}
              className="w-full bg-background-primary  disabled:bg-background-disabled text-typography-white py-6 px-8 rounded-2xl text-lg font-bold transition-colors duration-200 space-x-2.5"
            >
              View Order
      </button>
    </div>
  </div>
</div>
</div>
);
}
