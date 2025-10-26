"use client";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { useRouter } from 'next/navigation'
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
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
     

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No orders found</p>
          </div>
        ) : (
          orders.map((order) => {
            // Determine image layout based on number of items
            const hasMultipleItems = order.items.length > 1;
            const displayItems = order.items.slice(0, 3); // Show max 3 items

            return (
              <div
                key={order._id}
                className=" p-6"
              >
                <div className="flex gap-6">
                  {/* Left Section - Images (25% width) */}
                  <div className="w-1/4">
                    {hasMultipleItems ? (
                      <div className="space-y-3">
                        {/* Large image for first item */}
                        <div className="w-full aspect-square rounded-2xl overflow-hidden bg-gray-100">
                          <Image
                            src={displayItems[0]?.menuDetails?.imageUrl || "/Burger.png"}
                            alt={displayItems[0]?.name || "Food item"}
                            width={200}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Two smaller images for remaining items */}
                        {displayItems.length > 1 && (
                          <div className="flex gap-2">
                            {displayItems.slice(1, 3).map((item, index) => (
                              <div key={index} className="w-1/2 aspect-square rounded-2xl overflow-hidden bg-gray-100">
                                <Image
                                  src={item.menuDetails?.imageUrl || "/Burger.png"}
                                  alt={item.name}
                                  width={100}
                                  height={100}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Single large image for single item */
                      <div className="w-full aspect-square rounded-2xl overflow-hidden bg-gray-100">
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
                      <h3 className="text-2xl font-bold text-gray-900">
                        {getStatusText(order.status)  }
                      </h3>
                    </div>

                    {/* Order Summary */}
                    <div>
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-900">
                              Delivered on
                            </span>
                            <span className="text-lg font-semibold text-gray-900">
                              {new Date(order.createdAt).toLocaleDateString('en-US', { 
                                day: 'numeric', 
                                month: 'long' 
                              })}
                            </span>
                          </div>

                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <span className="text-lg font-semibold text-gray-900">
                                {item.name} x{item.quantity}
                              </span>
                              <span className="text-lg font-semibold text-gray-900">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}

                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-900">
                              Total price paid
                            </span>
                            <span className="text-lg font-semibold text-gray-900">
                              ₹{order.totalAmount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                    </div>

                    {/* Additional Order Info */}
                    <div className="text-sm text-gray-500 space-y-1">
                      <p>Order #{order._id.slice(-6)}</p>
                      <p>{formatOrderType(order.orderType)} • {order.username}</p>
                      {order.tableNumber && <p>Table {order.tableNumber}</p>}
                    </div>
                  </div>
                </div>

                {/* View Details Button */}
                <div className="mt-6">
                  <button
                    onClick={() => router.push(`/admin/orderdetails?id=${order._id}`)}
                    className="w-full bg-transparent text-typography-heading border-2 rounded-3xl py-6 px-8  text-lg font-black"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

       
      {/* Add Order Button */}
      <div className="pt-6 mb-6">
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

