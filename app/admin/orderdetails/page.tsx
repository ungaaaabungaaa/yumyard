"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Spinner } from "@/components/ui/spinner";

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

  // Fetch order details with user information
  const orderWithUser = useQuery(
    api.order.getOrderWithUserDetails,
    orderId ? { orderId: orderId as Id<"orders"> } : "skip"
  );
  
  // Fetch kitchen logs for this order
  const kitchenLogs = useQuery(
    api.order.getKitchenLogsForOrder, 
    orderId ? { orderId: orderId as Id<"orders"> } : "skip"
  );

  // Update order status mutation
  const updateOrderStatus = useMutation(api.order.updateOrderStatus);
  
  // Update payment info mutation
  const updatePaymentInfo = useMutation(api.order.updatePaymentInfo);


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

 

  if (!orderWithUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center flex-col gap-4">
        <Spinner className="size-8 text-typography-primary" />
        <p className="text-typography-disabled text-lg font-medium">Loading order details...</p>
      </div>
    );
  }

  const order = orderWithUser;
  const userDetails = orderWithUser.userDetails;

  return (
    <div className="min-h-screen bg-white py-4">
      <div className="w-full mx-auto px-4">
        <div className="flex flex-col gap-4">
          {/* Order Number Header */}
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Order Number</span>
            <span className="text-gray-900 text-sm">#{order._id.slice(-6)}</span>
          </div>

          {/* Profile Section */}
          <div className="flex items-center gap-4">
            {/* Profile Picture */}
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-600 capitalize">
                {order.username.charAt(0).toUpperCase()}
              </span>
            </div>
            
            {/* User Information */}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">
                {order.username}
              </h3>
              <p className="text-sm text-gray-600">
                YumYard Cafe
              </p>
            </div>
            
            {/* Call Button */}
            {(userDetails?.phoneNumber || order.phoneNumber) && (
              <button
                onClick={() => {
                  const phoneNumber = userDetails?.phoneNumber || order.phoneNumber;
                  const formattedNumber = phoneNumber?.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`;
                  window.open(`tel:${formattedNumber}`, '_self');
                }}
                className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
                title={`Call +91 ${userDetails?.phoneNumber || order.phoneNumber}`}
              >
                <svg 
                  className="w-6 h-6 text-gray-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Order Summary Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Order Type</span>
              <span className="text-gray-900 text-sm font-bold">{formatOrderType(order.orderType)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Order Status</span>
              <span className="text-gray-900 text-sm font-bold">{getStatusText(order.status)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm">Payment Status</span>
              <span className="text-gray-900 text-sm font-bold">{getPaymentStatusText(order.paymentStatus)}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-300"></div>

          {/* Items Ordered Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Item's Ordered</h2>
            {order.items.map((item, index) => (
              <div key={index} className="overflow-hidden">
                {/* Main Card Content */}
                <div className="p-2 border-1 rounded-4xl">
                  <div className="flex items-start justify-center space-x-4">
                    {/* Image */}
                    <div className="flex-shrink-0">
                      <div className="w-32 h-32 rounded-tl-3xl rounded-bl-3xl rounded-tr-lg rounded-br-lg overflow-hidden flex items-center justify-center">
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
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-2xl font-semibold text-gray-900 my-2">
                            {item.name}
                          </h3>
                          <h4 className="text-xl font-semibold text-gray-900 my-2">
                            ₹{item.price}
                          </h4>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg font-medium text-gray-600">
                              Quantity: {item.quantity}
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
          <div className="my-4 border-t border-b py-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total Amount</span>
              <span className="text-lg font-bold text-gray-900">₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Status Update Form */}
          <div className=" my-4 rounded-4xl flex flex-col items-center justify-center text-center">
         

          <form onSubmit={handleStatusUpdate} className="space-y-4 w-full">
                <div className="relative">
                  <select
                    value={newStatus || order.status}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full py-6 px-6 border-2 rounded-3xl text-2xl font-normal text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent appearance-none bg-white pr-12"
                    required
                  >
                    <option value="">Update Order Status</option>
                    <option value="order-received">Order Received</option>
                    <option value="cooking">Cooking</option>
                    <option value="out-for-delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isUpdating || !newStatus}
                  className={`w-full py-6 px-8 rounded-2xl text-lg font-bold transition-colors duration-200 ${
                    isUpdating || !newStatus
                      ? 'bg-background-disabled text-typography-disabled cursor-not-allowed'
                      : 'bg-background-primary text-typography-white hover:bg-background-primary/90'
                  }`}
                >
                  {isUpdating ? "Updating..." : "Update Status"}
                </button>
          </form>

          </div>

          {/* Update Payment Form */}

          <div className="my-4 rounded-4xl flex flex-col items-center justify-center text-center">
         

          <form onSubmit={handlePaymentUpdate} className="space-y-4 w-full">
                <div className="relative">
                  <select
                    value={newPaymentStatus || order.paymentStatus}
                    onChange={(e) => setNewPaymentStatus(e.target.value)}
                    className="w-full py-6 px-6 border-2 rounded-3xl text-2xl font-normal text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent appearance-none bg-white pr-12"
                    required
                  >
                      <option value="">Update Payment Status</option>
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isUpdatingPayment || !newPaymentStatus}
                  className={`w-full py-6 px-8 rounded-2xl text-lg font-bold transition-colors duration-200 ${
                    isUpdatingPayment || !newPaymentStatus
                      ? 'bg-background-disabled text-typography-disabled cursor-not-allowed'
                      : 'bg-background-primary text-typography-white hover:bg-background-primary/90'
                  }`}
                >
                  {isUpdatingPayment ? "Updating..." : "Update Payment"}
                </button>
          </form>

          </div>
        </div>

        {/* Extras Order Details */}
        
        <Accordion type="single" collapsible  className="w-full my-4 hidden">
          {/* Order Metadata */}
          <AccordionItem value="metadata">
            <AccordionTrigger className="text-xl font-bold text-typography-heading">📋 Order Metadata</AccordionTrigger>
            <AccordionContent className="space-y-3 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-lg font-semibold text-typography-heading">Order ID:</span>
                  <p className="text-lg text-typography-inactive font-mono">{order._id.slice(-6)}</p>
                </div>
                <div>
                  <span className="text-lg font-semibold text-typography-heading">User Type:</span>
                  <p className="text-lg text-typography-inactive capitalize">{order.userType}</p>
                </div>
                <div>
                  <span className="text-lg font-semibold text-typography-heading">Created At:</span>
                  <p className="text-lg text-typography-inactive">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-lg font-semibold text-typography-heading">Last Updated:</span>
                  <p className="text-lg text-typography-inactive">
                    {order.updatedAt ? new Date(order.updatedAt).toLocaleString() : 'Never'}
                  </p>
                </div>
                {order.estimatedReadyTime && (
                  <div>
                    <span className="text-lg font-semibold text-typography-heading">Estimated Ready Time:</span>
                    <p className="text-lg text-typography-inactive">{new Date(order.estimatedReadyTime).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Delivery & Table Details */}
          <AccordionItem value="delivery">
            <AccordionTrigger className="text-xl font-bold text-typography-heading">🚚 Delivery & Table Details</AccordionTrigger>
            <AccordionContent className="space-y-3 mt-4">
              {order.tableNumber && (
                <div>
                  <span className="text-lg font-semibold text-typography-heading">Table Number:</span>
                  <p className="text-lg text-typography-inactive">{order.tableNumber}</p>
                </div>
              )}
              {order.deliveryNote && (
                <div>
                  <span className="text-lg font-semibold text-typography-heading">Delivery Note:</span>
                  <p className="text-lg text-typography-inactive">{order.deliveryNote}</p>
                </div>
              )}
              {order.orderType === 'dine-in' && !order.tableNumber && (
                <p className="text-lg text-typography-inactive italic">No table number specified for dine-in order</p>
              )}
              {order.orderType === 'delivery' && !order.deliveryNote && (
                <p className="text-lg text-typography-inactive italic">No delivery notes provided</p>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Detailed Payment Information */}
          <AccordionItem value="payment">
            <AccordionTrigger className="text-xl font-bold text-typography-heading">💳 Payment Details</AccordionTrigger>
            <AccordionContent className="space-y-3 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-lg font-semibold text-typography-heading">Payment Status:</span>
                  <p className="text-lg font-semibold text-gray-900">
                    {getPaymentStatusText(order.paymentStatus)}
                  </p>
                </div>
                {order.paymentMethod && (
                  <div>
                    <span className="text-lg font-semibold text-typography-heading">Payment Method:</span>
                    <p className="text-lg text-typography-inactive capitalize">{order.paymentMethod}</p>
                  </div>
                )}
              </div>
              <div>
                <span className="text-lg font-semibold text-typography-heading">Total Amount:</span>
                <p className="text-2xl font-bold text-typography-heading">₹{order.totalAmount.toFixed(2)}</p>
              </div>
              {!order.paymentMethod && (
                <p className="text-lg text-typography-inactive italic">Payment method not specified</p>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Item Special Requests & Details */}
          <AccordionItem value="items">
            <AccordionTrigger className="text-xl font-bold text-typography-heading">🍽️ Item Details & Special Requests</AccordionTrigger>
            <AccordionContent className="space-y-4 mt-4">
              {order.items.map((item, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-xl font-semibold text-typography-heading">{item.name}</h4>
                    <span className="text-lg text-typography-inactive">Qty: {item.quantity}</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-lg font-semibold text-typography-heading">Price per item:</span>
                      <span className="text-lg text-typography-inactive ml-2">₹{item.price}</span>
                    </div>
                    <div>
                      <span className="text-lg font-semibold text-typography-heading">Total for this item:</span>
                      <span className="text-lg text-typography-inactive ml-2">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    {item.specialRequest && (
                      <div>
                        <span className="text-lg font-semibold text-typography-heading">Special Request:</span>
                        <p className="text-lg text-typography-inactive mt-1 p-2 border border-yellow-300 rounded">
                          {item.specialRequest}
                        </p>
                      </div>
                    )}
                    {item.menuDetails?.description && (
                      <div>
                        <span className="text-lg font-semibold text-typography-heading">Description:</span>
                        <p className="text-lg text-typography-inactive mt-1">{item.menuDetails.description}</p>
                      </div>
                    )}
                    {item.menuDetails?.category && (
                      <div>
                        <span className="text-lg font-semibold text-typography-heading">Category:</span>
                        <span className="text-lg text-typography-inactive ml-2">{item.menuDetails.category}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>

          {/* Kitchen Activity Logs */}
          <AccordionItem value="kitchen-logs">
            <AccordionTrigger className="text-xl font-bold text-typography-heading">👨‍🍳 Kitchen Activity Logs</AccordionTrigger>
            <AccordionContent className="space-y-3 mt-4">
              {kitchenLogs && kitchenLogs.length > 0 ? (
                kitchenLogs.map((log, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-lg font-semibold text-typography-heading capitalize">
                        {log.action.replace('-', ' ')}
                      </span>
                      <span className="text-lg text-typography-inactive">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg text-typography-inactive">
                        <span className="font-semibold">Staff:</span> {log.staffName}
                      </p>
                      {log.note && (
                        <p className="text-lg text-typography-inactive">
                          <span className="font-semibold">Note:</span> {log.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-lg text-typography-inactive italic">
                  No kitchen activity logs available for this order
                </p>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Order Review */}
          {order.review && (
            <AccordionItem value="review">
              <AccordionTrigger className="text-xl font-bold text-typography-heading">⭐ Order Review</AccordionTrigger>
              <AccordionContent className="space-y-3 mt-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg font-semibold text-typography-heading">Rating:</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-xl ${
                          i < order.review!.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-lg text-typography-inactive">({order.review!.rating}/5)</span>
                </div>
                {order.review!.comment && (
                  <div>
                    <span className="text-lg font-semibold text-typography-heading">Comment:</span>
                    <p className="text-lg text-typography-inactive mt-1 p-2 border rounded">
                      {order.review!.comment}
                    </p>
                  </div>
                )}
                <div>
                  <span className="text-lg font-semibold text-typography-heading">Reviewed on:</span>
                  <span className="text-lg text-typography-inactive ml-2">
                    {new Date(order.review!.createdAt).toLocaleString()}
                  </span>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* User Account Details */}
          {userDetails && (
            <AccordionItem value="user-account">
              <AccordionTrigger className="text-xl font-bold text-typography-heading">👤 User Account Details</AccordionTrigger>
              <AccordionContent className="space-y-3 mt-4">
                <div>
                  <span className="text-lg font-semibold text-typography-heading">Full Name:</span>
                  <p className="text-lg text-typography-inactive">{userDetails.name}</p>
                </div>
                <div>
                  <span className="text-lg font-semibold text-typography-heading">Phone Number:</span>
                  <p className="text-lg text-typography-inactive">+91 {userDetails.phoneNumber}</p>
                </div>
                <div>
                  <span className="text-lg font-semibold text-typography-heading">Account Created:</span>
                  <p className="text-lg text-typography-inactive">{new Date(userDetails.createdAt).toLocaleString()}</p>
                </div>
                {userDetails.savedAddresses && userDetails.savedAddresses.length > 0 && (
                  <div>
                    <span className="text-lg font-semibold text-typography-heading">Saved Addresses:</span>
                    <div className="mt-2 space-y-2">
                      {userDetails.savedAddresses.map((address, index) => (
                        <div key={index} className="p-2 border rounded">
                          <p className="text-lg font-semibold text-typography-heading">{address.label}</p>
                          {address.apartment && <p className="text-lg text-typography-inactive">{address.apartment}</p>}
                          {address.flatNumber && <p className="text-lg text-typography-inactive">Flat {address.flatNumber}</p>}
                          {address.otherAddress && <p className="text-lg text-typography-inactive">{address.otherAddress}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>

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
