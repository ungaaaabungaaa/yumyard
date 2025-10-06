export default function AdminMenu() {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Menu Management</h2>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
            Add New Item
          </button>
        </div>
        
        <div className="border rounded-lg">
          <div className="px-6 py-3 bg-gray-50 border-b">
            <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-900">
              <div>Item Name</div>
              <div>Category</div>
              <div>Price</div>
              <div>Actions</div>
            </div>
          </div>
          <div className="p-6 text-center text-gray-500">
            No menu items found. Add your first item to get started.
          </div>
        </div>
      </div>
    </div>
  )
}
