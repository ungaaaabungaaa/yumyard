export default function AdminOrders() {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Order Management</h2>
          <div className="flex space-x-2">
            <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
              <option>All Orders</option>
              <option>Pending</option>
              <option>Preparing</option>
              <option>Ready</option>
              <option>Completed</option>
            </select>
          </div>
        </div>
        
        <div className="border rounded-lg">
          <div className="px-6 py-3 bg-gray-50 border-b">
            <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-900">
              <div>Order ID</div>
              <div>Customer</div>
              <div>Items</div>
              <div>Total</div>
              <div>Status</div>
            </div>
          </div>
          <div className="p-6 text-center text-gray-500">
            No orders found. Orders will appear here when customers place them.
          </div>
        </div>
      </div>
    </div>
  )
}
