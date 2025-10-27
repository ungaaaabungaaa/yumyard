"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { format } from "date-fns";

type OrderStatus = "order-received" | "cooking" | "out-for-delivery" | "delivered" | "cancelled";

const statusConfig = {
  "order-received": { label: "Order Received", color: "bg-blue-100 text-blue-800" },
  "cooking": { label: "Cooking", color: "bg-yellow-100 text-yellow-800" },
  "out-for-delivery": { label: "Out for Delivery", color: "bg-purple-100 text-purple-800" },
  "delivered": { label: "Delivered", color: "bg-green-100 text-green-800" },
  "cancelled": { label: "Cancelled", color: "bg-red-100 text-red-800" },
};

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: "order-received", label: "Order Received" },
  { value: "cooking", label: "Cooking" },
  { value: "out-for-delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function KitchenOrders() {
  const [newStatus, setNewStatus] = useState<OrderStatus>("order-received");

  const todaysOrders = useQuery(api.order.getTodaysOrders);
  const updateOrderStatus = useMutation(api.order.updateOrderStatus);

  const handleStatusUpdate = async (orderId: Id<"orders">) => {
    try {
      await updateOrderStatus({
        id: orderId,
        status: newStatus,
      });
      
      alert("Order status updated successfully!");
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    }
  };

  const formatTime = (timestamp: number) => {
    return format(new Date(timestamp), "HH:mm");
  };

  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp), "MMM dd, yyyy");
  };

  if (todaysOrders === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Kitchen Orders</h1>
          <p className="text-gray-600 mt-2">Today's orders - {todaysOrders.length} total</p>
        </div>


        {/* Orders List */}
        <div className="space-y-4">
          {todaysOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">No orders for today yet</div>
            </div>
          ) : (
            todaysOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order._id.slice(-8)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {order.username} • {order.orderType}
                      {order.tableNumber && ` • Table ${order.tableNumber}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusConfig[order.status].color}`}>
                      {statusConfig[order.status].label}
                    </span>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      ₹{order.totalAmount}
                    </p>
                    <p className="text-sm text-gray-600">
                      Payment: {order.paymentStatus} {order.paymentMethod && `(${order.paymentMethod})`}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Items:</h4>
                  <div className="space-y-1">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {item.quantity}x {item.name}
                          {item.specialRequest && (
                            <span className="text-gray-500 ml-2">({item.specialRequest})</span>
                          )}
                        </span>
                        <span className="font-medium">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Address (for delivery orders) */}
                {order.orderType === "delivery" && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-1">Delivery Address:</h4>
                    <p className="text-sm text-gray-600">
                      {order.apartment && `${order.apartment}, `}
                      {order.flatNumber && `Flat ${order.flatNumber}, `}
                      {order.otherAddress}
                    </p>
                    {order.deliveryNote && (
                      <p className="text-sm text-gray-500 mt-1">
                        Note: {order.deliveryNote}
                      </p>
                    )}
                  </div>
                )}

                {/* Status Update Section */}
                <div className="border-t pt-4">
                  <div className="flex items-center space-x-4">
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <Button
                      onClick={() => handleStatusUpdate(order._id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                    >
                      Update Status
                    </Button>
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
