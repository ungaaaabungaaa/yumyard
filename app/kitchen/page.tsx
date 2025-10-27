"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { format } from "date-fns";
import Image from "next/image";
import Lottie from "lottie-react";
import orderConfirmed from "@/public/lottie/Cooking egg.json";

type OrderStatus = "order-received" | "cooking" | "out-for-delivery" | "delivered" | "cancelled";

const getStatusColor = (status: string) => {
  switch (status) {
    case "order-received":
      return "text-blue-600";
    case "cooking":
      return "text-orange-600";
    case "out-for-delivery":
      return "text-purple-600";
    case "delivered":
      return "text-green-600";
    case "cancelled":
      return "text-red-600";
    default:
      return "text-gray-600";
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

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "text-yellow-600";
    case "paid":
      return "text-green-600";
    case "failed":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

const getPaymentStatusText = (status: string) => {
  switch (status) {
    case "pending":
      return "Payment Pending";
    case "paid":
      return "Payment Completed";
    case "failed":
      return "Payment Failed";
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

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: "order-received", label: "Order Received" },
  { value: "cooking", label: "Cooking" },
  { value: "out-for-delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function KitchenOrders() {
  const [orderStatuses, setOrderStatuses] = useState<Record<string, OrderStatus>>({});

  const todaysOrders = useQuery(api.order.getTodaysOrdersWithMenuDetails);
  const updateOrderStatus = useMutation(api.order.updateOrderStatus);

  const handleStatusUpdate = async (orderId: Id<"orders">) => {
    const currentStatus = orderStatuses[orderId] || "order-received";
    try {
      await updateOrderStatus({
        id: orderId,
        status: currentStatus,
      });
      
      alert("Order status updated successfully!");
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    }
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrderStatuses(prev => ({
      ...prev,
      [orderId]: newStatus
    }));
  };

  const formatTime = (timestamp: number) => {
    return format(new Date(timestamp), "HH:mm");
  };

  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp), "MMM dd, yyyy");
  };

  if (todaysOrders === undefined) {
    return (
      <div className="h-auto py-8">
        <div className="w-full mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading today's orders...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-auto py-8">
      <div className="w-full mx-auto px-4">
      

        {/* Orders List */}
        <div className="space-y-6">
          {todaysOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-typography-inactive text-2xl">No orders for today yet</div>
            </div>
          ) : (
            todaysOrders.map((order) => (
              <div key={order._id} className="border rounded-4xl p-6">
                {/* Order Header */}
                <div className="flex flex-col items-center justify-center text-center mb-6">
                  <span className={`text-xl font-medium text-center capitalize ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                  <h2 className="w-full text-center text-4xl font-black text-typography-heading mb-2">
                    Order #{order._id.slice(-6)}
                  </h2>
                  <h3 className="w-full text-center text-3xl font-bold text-typography-inactive mb-1">
                    {formatOrderType(order.orderType)}
                  </h3>
                  <span className={`text-lg font-medium text-center capitalize ${getPaymentStatusColor(order.paymentStatus)}`}>
                    {getPaymentStatusText(order.paymentStatus)}
                  </span>
                  <p className="text-sm text-typography-inactive mt-2">
                    {order.username} • {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
                    {order.tableNumber && ` • Table ${order.tableNumber}`}
                  </p>
                </div>

                {/* Order Items */}
                <div className="space-y-3 mb-6">
                  {order.items.map((item, index) => (
                    <div key={index} className="p-2 border-1 rounded-4xl">
                      <div className="flex items-start space-x-4 h-30">
                        {/* Image */}
                        <div className="flex-shrink-0">
                          <div className="w-36 h-30 rounded-tl-3xl rounded-bl-3xl rounded-tr-lg rounded-br-lg overflow-hidden">
                            <Image
                              src={item.menuDetails?.imageUrl || "/Burger.png"}
                              alt={item.name}
                              width={144}
                              height={120}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 flex flex-col h-full">
                          <div className="flex items-start justify-between flex-1 h-full">
                            <div className="flex-1 flex flex-col h-full">
                              <h3 className="text-xl font-medium text-typography-heading mt-2">
                                {item.name}
                              </h3>
                              {item.specialRequest && (
                                <p className="text-sm text-typography-inactive mt-1">
                                  Special: {item.specialRequest}
                                </p>
                              )}
                              
                              {/* Spacer to push price/quantity to bottom */}
                              <div className="flex-1"></div>

                              {/* Price and Quantity Row */}
                              <div className="flex items-end justify-between mt-4 mb-2">
                                {/* Price on the left */}
                                <h4 className="text-2xl font-semibold text-typography-heading">
                                  ₹{item.price}
                                </h4>

                                {/* Quantity on the right */}
                                <div className="flex items-end">
                                  <span className="text-2xl font-bold text-typography-inactive mr-2">
                                    x{item.quantity}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Total */}
                <div className="my-4 border-t border-b pb-4 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-typography-heading capitalize">Total Amount</span>
                    <span className="text-2xl font-bold text-typography-heading capitalize">₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Status Update Section */}
                <div className="border my-4 p-4 rounded-4xl flex flex-col items-center justify-center text-center">
                  <Lottie animationData={orderConfirmed} loop={true} />

                  <div className="space-y-4 w-full">
                    <div className="relative">
                      <select
                        value={orderStatuses[order._id] || order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value as OrderStatus)}
                        className="w-full py-6 px-6 border-2 rounded-3xl text-2xl font-normal text-typography-heading focus:outline-none focus:ring-2 focus:border-transparent appearance-none bg-white pr-12"
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
                        <svg className="w-6 h-6 text-typography-light-grey" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleStatusUpdate(order._id)}
                      className="w-full py-6 px-8 rounded-2xl text-lg font-bold transition-colors duration-200 bg-background-primary text-typography-white hover:bg-background-primary/90"
                    >
                      Update Status
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
