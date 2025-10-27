"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Image from "next/image";
import Lottie from "lottie-react";
import orderConfirmed from "@/public/lottie/Cooking egg.json";
import money from "@/public/lottie/Fake 3D vector coin.json";

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

  if (!orderWithUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const order = orderWithUser;
  const userDetails = orderWithUser.userDetails;

  return (
    <div className="h-auto  py-8">
      <div className="w-full mx-auto px-4">
       
        <div className="flex flex-col gap-2">
          {/* Main Order Details */}

          {/* Order Status */}
          <div className="flex flex-col items-center justify-center text-center">
          
          <span className={`text-xl font-medium text-center capitalize ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
          </span>
          <h2 className="w-full text-center text-4xl font-black text-typography-heading mb-2">Order Number - {order._id.slice(-6)} </h2>
          <h3 className="w-full text-center text-3xl font-bold text-typography-inactive mb-1">{formatOrderType(order.orderType)}</h3>
          <span className={`text-lg font-medium text-center capitalize ${getPaymentStatusColor(order.paymentStatus)}`}>
                  {getPaymentStatusText(order.paymentStatus)}
          </span>
          </div>
          
          {/* User Details Card */}
          <div className="p-6 mt-2">
            <div className="flex items-center gap-4">
              {/* Profile Picture */}
              <div className="w-16 h-16 bg-background-primary rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white capitalize">
                  {order.username.charAt(0).toUpperCase()}
                </span>
              </div>
              
              {/* User Information */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {order.username}
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  {order.apartment && (
                    <p>{order.apartment}</p>
                  )}
                  {order.flatNumber && (
                    <p>Flat {order.flatNumber}</p>
                  )}
                  {order.otherAddress && (
                    <p>{order.otherAddress}</p>
                  )}
                  {userDetails?.phoneNumber && (
                    <p className="text-blue-600 font-medium">+91 {userDetails.phoneNumber}</p>
                  )}
                </div>
              </div>
              
              {/* Call Button - Only show if phone number exists */}
              {userDetails?.phoneNumber && (
                <button
                  onClick={() => {
                    const phoneNumber = `+91${userDetails.phoneNumber}`;
                    window.open(`tel:${phoneNumber}`, '_self');
                  }}
                  className="w-12 h-12 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
                  title={`Call +91 ${userDetails.phoneNumber}`}
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
          </div>
          {/* Order Details Card */}
           <div className="space-y-3">
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
          <div className="my-4 border-t border-b pb-4  pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-typography-heading capitalize">Total Amount</span>
                  <span className="text-2xl font-bold text-typography-heading capitalize">₹{order.totalAmount.toFixed(2)}</span>
                </div>
          </div>

          {/* Status Update Form */}
          <div className="border my-4 p-4 rounded-4xl flex flex-col items-center justify-center text-center">
          <Lottie animationData={orderConfirmed} loop={true} />

          <form onSubmit={handleStatusUpdate} className="space-y-4 w-full">
                <div className="relative">
                  <select
                    value={newStatus || order.status}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full py-6 px-6 border-2 rounded-3xl text-2xl font-normal text-typography-heading focus:outline-none focus:ring-2 focus:border-transparent appearance-none bg-white pr-12"
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
                    <svg className="w-6 h-6 text-typography-light-grey" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

          <div className="border my-4 p-4 rounded-4xl flex flex-col items-center justify-center text-center">
          <Lottie animationData={money} loop={true} />

          <form onSubmit={handlePaymentUpdate} className="space-y-4 w-full">
                <div className="relative">
                  <select
                    value={newPaymentStatus || order.paymentStatus}
                    onChange={(e) => setNewPaymentStatus(e.target.value)}
                    className="w-full py-6 px-6 border-2 rounded-3xl text-2xl font-normal text-typography-heading focus:outline-none focus:ring-2 focus:border-transparent appearance-none bg-white pr-12"
                    required
                  >
                      <option value="">Update Payment Status</option>
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
                    <svg className="w-6 h-6 text-typography-light-grey" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
