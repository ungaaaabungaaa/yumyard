"use client";
import { useState } from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { useRouter } from 'next/navigation'
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";
import { Search } from 'lucide-react';

export default function AdminOrders() {
  const adminSegments = [
    { label: 'Menu', path: '/admin/menu' },
    { label: 'Orders', path: '/admin/orders' }
  ];
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch all orders with menu details
  const orders = useQuery(api.order.getAllOrdersWithMenuDetails);


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

  // Filter orders to show only today's orders
  const todaysOrders = orders?.filter(order => isToday(order.createdAt)) || [];
  
  // Filter orders based on search term (search by order ID)
  const filteredOrders = todaysOrders.filter(order =>
    order._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!orders) {
    return (
      <div className="pb-20">
        <div className="mb-6">
          <SegmentedControl segments={adminSegments} />
        </div>
        <div className="flex justify-center items-center h-64 flex-col gap-4">
        <Spinner className="size-8 text-typography-primary" />
        <p className="text-typography-disabled text-lg font-medium">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Segmented Control Navigation */}
      <div className="mb-6">
        <SegmentedControl segments={adminSegments} />
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-6 h-6 text-typography-disabled" />
          </div>
          <input
            type="text"
            placeholder="Search Order ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-4 border border-border-secondary rounded-2xl outline-none"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No orders found' : 'No orders found'}
            </h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'No orders for today'}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
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
                        {getStatusText(order.status)  }
                      </h3>
                    </div>

                    {/* Order Summary */}
                    <div>
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-typography-disabled">
                              Delivered on :
                            </span>
                            <span className="text-sm text-right font-semibold text-typography-paragraph">
                              {new Date(order.createdAt).toLocaleDateString('en-US', { 
                                day: 'numeric', 
                                month: 'long', 
                              })}
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

                {/* View Details Button */}
                <div className="mt-6">
                  <button
                    onClick={() => router.push(`/admin/orderdetails?id=${order._id}`)}
                    className="w-full bg-transparent text-typography-heading border-2 rounded-3xl py-6 px-8  text-xl font-black"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

       
      {/* Sticky Bottom Button */}
      <div className="fixed bottom-4 left-4 right-4 max-w-full py-4 z-40">
        <button
          onClick={() => router.push('/admin/addorder')}
          type="submit"
          className="w-full bg-background-primary text-typography-white py-6 px-8 rounded-2xl text-lg font-black"
        >
          Add Order
        </button>
      </div>
    </div>
  );
}

