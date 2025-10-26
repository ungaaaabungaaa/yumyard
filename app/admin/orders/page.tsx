"use client";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { useRouter } from 'next/navigation'
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

export default function AdminOrders() {
  const adminSegments = [
    { label: 'Menu', path: '/admin/menu' },
    { label: 'Orders', path: '/admin/orders' }
  ];
  const router = useRouter()
  
  // Fetch all orders with menu details
  const orders = useQuery(api.order.getAllOrdersWithMenuDetails);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "order-received":
        return "bg-blue-100 text-blue-800";
      case "cooking":
        return "bg-orange-100 text-orange-800";
      case "out-for-delivery":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  if (!orders) {
    return (
      <div className="pb-20">
        <div className="mb-6">
          <SegmentedControl segments={adminSegments} />
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
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
      
      {/* Add Order Button */}
      <div className="pt-6 mb-6">
        <button
          onClick={() => router.push('/admin/addorder')}
          type="submit"
          className="w-full bg-background-primary text-typography-white py-6 px-8 rounded-2xl text-lg font-bold"
        >
          Add Order
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No orders found</p>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              {/* Order Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Order #{order._id.slice(-6)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {order.username} • {formatOrderType(order.orderType)}
                    {order.tableNumber && ` • Table ${order.tableNumber}`}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={item.menuDetails?.imageUrl || "/Burger.png"}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity} • ₹{item.price}
                        {item.specialRequest && (
                          <span className="ml-2 text-orange-600">
                            • Special: {item.specialRequest}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  <p>Total: <span className="font-semibold text-lg">₹{order.totalAmount.toFixed(2)}</span></p>
                  {order.paymentMethod && (
                    <p className="text-xs">Payment: {order.paymentMethod}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => router.push(`/admin/orderdetails?id=${order._id}`)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    View Details
                  </button>
                  {order.status === "order-received" && (
                    <button
                      onClick={() => router.push(`/admin/orderdetails?id=${order._id}`)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Update Status
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

