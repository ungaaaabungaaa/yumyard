"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { Id } from "../../../convex/_generated/dataModel";

export default function AdminMenu() {
  const router = useRouter();
  const menuItems = useQuery(api.menu.getAllMenuItems);
  const deleteMenuItem = useMutation(api.menu.deleteMenuItem);
  const toggleAvailability = useMutation(api.menu.toggleMenuItemAvailability);
  
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const handleEdit = (itemId: Id<"menu">) => {
    router.push(`/admin/addmenu?edit=${itemId}`);
  };

  const handleDelete = async (itemId: Id<"menu">) => {
    try {
      await deleteMenuItem({ id: itemId });
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Error deleting menu item:', error);
      alert('Failed to delete menu item. Please try again.');
    }
  };

  const handleToggleAvailability = async (itemId: Id<"menu">) => {
    try {
      await toggleAvailability({ id: itemId });
    } catch (error) {
      console.error('Error toggling availability:', error);
      alert('Failed to toggle availability. Please try again.');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatTime = (minutes?: number) => {
    if (!minutes) return 'N/A';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  if (!menuItems) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
    

      {/* Menu Items List */}
      <div className="space-y-4">
        {menuItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No menu items yet</h3>
            <p className="text-gray-500 mb-6">Get started by adding your first menu item</p>
          </div>
        ) : (
          menuItems.map((item) => (
            <div
              key={item._id}
              className=" rounded-lg  overflow-hidden"
            >
              {/* Main Card Content */}
              <div className="p-4">
                <div className="flex items-start space-x-4">
                  {/* Image */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-food.jpg';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {item.name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <span className="font-medium text-green-600">
                            {formatPrice(item.price)}
                          </span>
                          {item.category && (
                            <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                              {item.category}
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.isAvailable 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.isAvailable ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleToggleAvailability(item._id)}
                          className={`p-2 rounded-full transition-colors ${
                            item.isAvailable
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={item.isAvailable ? 'Mark as unavailable' : 'Mark as available'}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        
                        <button
                          onClick={() => handleEdit(item._id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          title="Edit item"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(item._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete item"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>

                        <button
                          onClick={() => toggleExpanded(item._id)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                          title="View details"
                        >
                          <svg 
                            className={`w-5 h-5 transition-transform ${
                              expandedItems.has(item._id) ? 'rotate-180' : ''
                            }`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedItems.has(item._id) && (
                <div className="border-t border-gray-200 bg-gray-50 px-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Details</h4>
                      <div className="space-y-1 text-gray-600">
                        {item.preparationTime && (
                          <p><span className="font-medium">Prep Time:</span> {formatTime(item.preparationTime)}</p>
                        )}
                        {item.servingSize && (
                          <p><span className="font-medium">Serving:</span> {item.servingSize}</p>
                        )}
                        {item.calories && (
                          <p><span className="font-medium">Calories:</span> {item.calories}</p>
                        )}
                        {item.spiceLevel && (
                          <p><span className="font-medium">Spice Level:</span> 
                            <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                              item.spiceLevel === 'mild' ? 'bg-green-100 text-green-800' :
                              item.spiceLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              item.spiceLevel === 'hot' ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {item.spiceLevel}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Dietary Info</h4>
                      <div className="flex flex-wrap gap-2">
                        {item.isVegetarian && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            Vegetarian
                          </span>
                        )}
                        {item.isVegan && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            Vegan
                          </span>
                        )}
                        {item.isGlutenFree && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            Gluten Free
                          </span>
                        )}
                      </div>
                    </div>

                    {item.ingredients && item.ingredients.length > 0 && (
                      <div className="md:col-span-2">
                        <h4 className="font-medium text-gray-900 mb-2">Ingredients</h4>
                        <div className="flex flex-wrap gap-1">
                          {item.ingredients.map((ingredient, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                              {ingredient}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.allergens && item.allergens.length > 0 && (
                      <div className="md:col-span-2">
                        <h4 className="font-medium text-gray-900 mb-2">Allergens</h4>
                        <div className="flex flex-wrap gap-1">
                          {item.allergens.map((allergen, index) => (
                            <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                              {allergen}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.tags && item.tags.length > 0 && (
                      <div className="md:col-span-2">
                        <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Floating Add Button */}
      {/* <button
        onClick={() => router.push('/admin/addmenu')}
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-colors duration-200 flex items-center space-x-2"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span className="hidden sm:inline font-medium">Add Menu</span>
      </button> */}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Menu Item</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this menu item? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId as Id<"menu">)}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
