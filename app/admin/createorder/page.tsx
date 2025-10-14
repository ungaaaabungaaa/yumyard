"use client";

import { useOrder } from "../context/OrderContext";
import { useRouter } from "next/navigation";
import { Id } from "../../../convex/_generated/dataModel";

export default function AdminCreateOrder() {
  const { selectedItems, removeItem, updateQuantity, getTotalAmount, clearOrder } = useOrder();
  const router = useRouter();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const handleCreateOrder = () => {
    if (selectedItems.length === 0) {
      alert("Please add items to your order first!");
      return;
    }

    console.log("Creating order with items:", selectedItems);
    console.log("Total amount:", formatPrice(getTotalAmount()));
    
    // For now, just log the items. In a real app, this would create the order in the database
    alert(`Order created successfully! Total: ${formatPrice(getTotalAmount())}`);
    
    // Clear the order after creation
    clearOrder();
    
    // Navigate back to add order page
    router.push('/admin/addorder');
  };

  const handleQuantityChange = (menuId: Id<"menu">, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(menuId);
    } else {
      updateQuantity(menuId, newQuantity);
    }
  };

  return (
    <div className="pb-20">
      {selectedItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gray-100">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items in order</h3>
          <p className="text-gray-500 mb-6">Add items from the menu to create an order</p>
          <button
            onClick={() => router.push('/admin/addorder')}
            className="bg-background-primary text-typography-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Add Items
          </button>
        </div>
      ) : (
        <>
          {/* Selected Items List */}
          <div className="space-y-4 mb-6">
            {selectedItems.map((item) => (
              <div
                key={item.menuId}
                className="p-4 border border-gray-200 rounded-2xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-typography-heading">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {formatPrice(item.price)} each
                    </p>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleQuantityChange(item.menuId, item.quantity - 1)}
                      className="w-8 h-8 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full flex items-center justify-center transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    
                    <span className="text-lg font-medium text-typography-heading min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    
                    <button
                      onClick={() => handleQuantityChange(item.menuId, item.quantity + 1)}
                      className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={() => removeItem(item.menuId)}
                      className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors ml-2"
                      title="Remove item"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Item Total */}
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Item Total:</span>
                    <span className="text-lg font-semibold text-typography-heading">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-2xl mb-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-typography-heading">Total Amount:</span>
              <span className="text-2xl font-bold text-typography-heading">
                {formatPrice(getTotalAmount())}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleCreateOrder}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-2xl text-lg font-bold transition-colors"
            >
              Create Order
            </button>
            
            <button
              onClick={clearOrder}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-2xl font-medium transition-colors"
            >
              Clear All Items
            </button>
          </div>
        </>
      )}
    </div>
  );
}
