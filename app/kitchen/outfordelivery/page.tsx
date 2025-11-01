"use client";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

const kitchenSegments = [
  { label: 'New Orders', path: '/kitchen' },
  { label: 'Out For Delivery', path: '/kitchen/outfordelivery' }
];

export default function OutForDelivery() {
  const router = useRouter();
  
  // Fetch delivery orders (out-for-delivery and delivered)
  const orders = useQuery(api.order.getDeliveryOrdersWithMenuDetails);
  
  // Mutation to update order status
  const updateOrderStatus = useMutation(api.order.updateOrderStatus);

  // Handle mark as delivered action
  const handleMarkAsDelivered = async (orderId: string) => {
    try {
      await updateOrderStatus({
        id: orderId as Id<"orders">,
        status: "delivered",
        staffName: "Delivery Staff",
        note: "Order delivered"
      });
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "order-received":
        return "Order Received";
      case "cooking":
        return "Cooking";
      case "out-for-delivery":
        return "Out for Delivery";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const formatOrderType = (orderType: string) => {
    switch (orderType) {
      case "dine-in":
        return "Dine In";
      case "walk-up":
        return "Walk Up";
      case "delivery":
        return "Delivery";
      default:
        return orderType;
    }
  };

  // Helper function to check if a date is today
  const isToday = (timestamp: number) => {
    const today = new Date();
    const orderDate = new Date(timestamp);
    
    return (
      orderDate.getDate() === today.getDate() &&
      orderDate.getMonth() === today.getMonth() &&
      orderDate.getFullYear() === today.getFullYear()
    );
  };

  // Filter orders to show only today's delivery orders
  const todaysOrders = orders?.filter(order => 
    isToday(order.createdAt) && order.orderType === "delivery"
  ) || [];

  if (!orders) {
    return (
      <div className="pb-20">
        <div className="mb-6">
          <SegmentedControl segments={kitchenSegments} />
        </div>
        <div className="flex justify-center items-center h-64 flex-col gap-4">
          <Spinner className="size-8 text-typography-primary" />
          <p className="text-typography-disabled text-lg font-medium">Loading delivery orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Segmented Control Navigation */}
      <div className="mb-6">
        <SegmentedControl segments={kitchenSegments} />
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {todaysOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No delivery orders
            </h3>
            <p className="text-gray-500">
              No delivery orders out for delivery today
            </p>
          </div>
        ) : (
          todaysOrders.map((order) => {
            // Determine image layout based on number of items
            const hasMultipleItems = order.items.length > 1;
            const displayItems = order.items.slice(0, 2); // Show max 2 items (1 large + 1 small)
            const additionalItemsCount = Math.max(0, order.items.length - 2); // Count of items beyond the first 2

            return (
              <div
                key={order._id}
              >
                <div className="flex gap-6">
                  {/* Left Section - Images (25% width) */}
                  <div className="w-1/4">
                    {hasMultipleItems ? (
                      <div className="space-y-3">
                        {/* Large image for first item */}
                        <div className="w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center">
                          <Image
                            src={displayItems[0]?.menuDetails?.imageUrl || "/Burger.png"}
                            alt={displayItems[0]?.name || "Food item"}
                            width={200}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Small image and count for remaining items */}
                        {displayItems.length > 1 && (
                          <div className="flex gap-2">
                            {/* Second item image */}
                            <div className="w-1/2 aspect-square rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center">
                              <Image
                                src={displayItems[1]?.menuDetails?.imageUrl || "/Burger.png"}
                                alt={displayItems[1]?.name || "Food item"}
                                width={100}
                                height={100}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            {/* Count display for additional items */}
                            {additionalItemsCount > 0 ? (
                              <div className="w-1/2 aspect-square rounded-2xl bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-600 font-bold text-lg">
                                  +{additionalItemsCount}
                                </span>
                              </div>
                            ) : null}
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Single large image for single item */
                      <div className="w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center">
                        <Image
                          src={displayItems[0]?.menuDetails?.imageUrl || "/Burger.png"}
                          alt={displayItems[0]?.name || "Food item"}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Right Section - Order Details (75% width) */}
                  <div className="w-3/4 space-y-4">
                    {/* Order Status */}
                    <div>
                      <h3 className="text-2xl font-black text-typography-paragraph">
                        {getStatusText(order.status)}
                      </h3>
                    </div>

                    {/* Order Summary */}
                    <div>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-typography-disabled">
                            Order Type:
                          </span>
                          <span className="text-sm text-right font-semibold text-typography-paragraph">
                            {formatOrderType(order.orderType)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-typography-disabled">
                            Customer:
                          </span>
                          <span className="text-sm text-right font-semibold text-typography-paragraph">
                            {order.username}
                          </span>
                        </div>

                        <div className="flex justify-between items-start">
                          <span className="text-sm font-typography-disabled">
                            Order summary:  
                          </span>
                          <div className="flex flex-col items-end">
                            {order.items.map((item, index) => (
                              <span key={index} className="text-sm text-right font-semibold text-typography-paragraph">
                                {item.name.slice(0, 12)}... x{item.quantity}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-typography-disabled">
                            Total :
                          </span>
                          <span className="text-sm text-right font-semibold text-typography-paragraph">
                            ₹{order.totalAmount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-6">
                  {order.status === "out-for-delivery" ? (
                    <button
                      onClick={() => router.push(`/kitchen/deliveryvieworder?id=${order._id}`)}
                      className="w-full bg-red-500 text-white border-2 border-red-500 rounded-3xl py-6 px-8 text-xl font-black"
                    >
                      Out for Delivery
                    </button>
                  ) : (
                    <button
                      onClick={() => handleMarkAsDelivered(order._id)}
                      className="w-full bg-background-primary text-white  rounded-3xl py-6 px-8 text-xl font-black"
                    >
                      Delivered
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}