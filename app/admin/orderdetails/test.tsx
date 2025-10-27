"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

function OrderDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [staffName, setStaffName] = useState("");
  const [note, setNote] = useState("");
  
  // Payment update states
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
  const [newPaymentStatus, setNewPaymentStatus] = useState("");
  const [newPaymentMethod, setNewPaymentMethod] = useState("");
  const [paymentStaffName, setPaymentStaffName] = useState("");
  const [paymentNote, setPaymentNote] = useState("");

  // Fetch order details with menu information
  const orders = useQuery(api.order.getAllOrdersWithMenuDetails);
  const order = orders?.find(o => o._id === orderId);
  
  // Fetch kitchen logs for this order
  const kitchenLogs = useQuery(
    api.order.getKitchenLogsForOrder, 
    orderId ? { orderId: orderId as Id<"orders"> } : "skip"
  );

  // Update order status mutation
  const updateOrderStatus = useMutation(api.order.updateOrderStatus);
  
  // Update payment info mutation
  const updatePaymentInfo = useMutation(api.order.updatePaymentInfo);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "order-received":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cooking":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "out-for-delivery":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !newStatus) return;

    setIsUpdating(true);
    try {
      await updateOrderStatus({
        id: orderId as Id<"orders">,
        status: newStatus as "order-received" | "cooking" | "out-for-delivery" | "delivered" | "cancelled",
        staffName: staffName || undefined,
        note: note || undefined,
      });
      setNewStatus("");
      setStaffName("");
      setNote("");
    } catch (error) {
      console.error("Failed to update order status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePaymentUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !newPaymentStatus) return;

    setIsUpdatingPayment(true);
    try {
      await updatePaymentInfo({
        id: orderId as Id<"orders">,
        paymentStatus: newPaymentStatus as "pending" | "paid" | "failed",
        paymentMethod: newPaymentMethod ? newPaymentMethod as "cash" | "card" | "upi" | "online" : undefined,
        staffName: paymentStaffName || undefined,
        note: paymentNote || undefined,
      });
      setNewPaymentStatus("");
      setNewPaymentMethod("");
      setPaymentStaffName("");
      setPaymentNote("");
    } catch (error) {
      console.error("Failed to update payment info:", error);
    } finally {
      setIsUpdatingPayment(false);
    }
  };

  if (!orderId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">No order ID provided</p>
          <button
            onClick={() => router.push("/admin/orders")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="h-auto  py-8">
      <div className="w-full mx-auto px-4">
       
        <div className="flex flex-col gap-4">
          {/* Main Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Status</h2>
              <div className="flex items-center justify-between">
                <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
                <div className="text-sm text-gray-500">
                  Last updated: {order.updatedAt ? formatDistanceToNow(new Date(order.updatedAt), { addSuffix: true }) : "Never"}
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Customer Name</label>
                  <p className="text-gray-900">{order.username}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">User Type</label>
                  <p className="text-gray-900 capitalize">{order.userType}</p>
                </div>
                {order.apartment && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Apartment</label>
                    <p className="text-gray-900">{order.apartment}</p>
                  </div>
                )}
                {order.flatNumber && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Flat Number</label>
                    <p className="text-gray-900">{order.flatNumber}</p>
                  </div>
                )}
                {order.otherAddress && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">Additional Address</label>
                    <p className="text-gray-900">{order.otherAddress}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Order Type</label>
                  <p className="text-gray-900">{formatOrderType(order.orderType)}</p>
                </div>
                {order.tableNumber && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Table Number</label>
                    <p className="text-gray-900">{order.tableNumber}</p>
                  </div>
                )}
                {order.deliveryNote && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">Delivery Note</label>
                    <p className="text-gray-900">{order.deliveryNote}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={item.menuDetails?.imageUrl || "/Burger.png"}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity} • Price: ₹{item.price}
                      </p>
                      {item.specialRequest && (
                        <p className="text-sm text-orange-600 mt-1">
                          Special Request: {item.specialRequest}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order Total */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-gray-900">₹{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>


          </div>

          {/* Sidebar - Status Update & Payment Info */}
          <div className="space-y-6">
            {/* Status Update Form */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Update Status</h2>
              <form onSubmit={handleStatusUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="order-received">Order Received</option>
                    <option value="cooking">Cooking</option>
                    <option value="out-for-delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Staff Name (Optional)</label>
                  <input
                    type="text"
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter staff name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Note (Optional)</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Add a note about this status change"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isUpdating || !newStatus}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isUpdating ? "Updating..." : "Update Status"}
                </button>
              </form>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Information</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Payment Status</span>
                  <span className={`text-sm font-medium ${
                    order.paymentStatus === "paid" ? "text-green-600" :
                    order.paymentStatus === "pending" ? "text-yellow-600" :
                    "text-red-600"
                  }`}>
                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </span>
                </div>
                {order.paymentMethod && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Payment Method</span>
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {order.paymentMethod}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Total Amount</span>
                  <span className="text-lg font-semibold text-gray-900">
                    ₹{order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
              
              {/* Payment Update Form */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Update Payment</h3>
                <form onSubmit={handlePaymentUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                    <select
                      value={newPaymentStatus}
                      onChange={(e) => setNewPaymentStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method (Optional)</label>
                    <select
                      value={newPaymentMethod}
                      onChange={(e) => setNewPaymentMethod(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Method</option>
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="upi">UPI</option>
                      <option value="online">Online</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Staff Name (Optional)</label>
                    <input
                      type="text"
                      value={paymentStaffName}
                      onChange={(e) => setPaymentStaffName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter staff name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Note (Optional)</label>
                    <textarea
                      value={paymentNote}
                      onChange={(e) => setPaymentNote(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={2}
                      placeholder="Add a note about this payment update"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isUpdatingPayment || !newPaymentStatus}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {isUpdatingPayment ? "Updating..." : "Update Payment"}
                  </button>
                </form>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetails() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    }>
      <OrderDetailsContent />
    </Suspense>
  );
}
