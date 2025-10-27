"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { Id } from "../../../convex/_generated/dataModel";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Spinner } from "@/components/ui/spinner"

export default function AdminMenu() {
  const router = useRouter();
  const menuItems = useQuery(api.menu.getAllMenuItems);
  const deleteMenuItem = useMutation(api.menu.deleteMenuItem);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const adminSegments = [
    { label: 'Menu', path: '/admin/menu' },
    { label: 'Orders', path: '/admin/orders' }
  ];

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  if (!menuItems) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center flex flex-col items-center justify-center gap-4">
          <Spinner className="size-8 text-typography-primary" />
          <p className="text-typography-disabled text-lg font-medium">Loading menu items...</p>
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
              className="overflow-hidden"
            >
              {/* Main Card Content */}
              <div className="p-2 border-1 rounded-4xl">
                <div className="flex items-start justify-center space-x-4">
                  {/* Image */}
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 rounded-tl-3xl rounded-bl-3xl rounded-tr-lg rounded-br-lg overflow-hidden flex items-center justify-center">
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
                        <h3 className="text-2xl font-semibold text-typography-heading my-2">
                          {item.name}
                        </h3>
                          <h4 className="text-xl font-semibold text-typography-heading my-2">
                            {formatPrice(item.price)} 
                          </h4>
                          <div className="flex flex-row gap-2 mb-2">
                           <button
                             onClick={() => handleEdit(item._id)}
                             className="p-3 text-typography-inactive bg-background-layer-2-background rounded-full transition-colors"
                             title="Edit item"
                           >
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                             </svg>
                           </button>

                           <button
                             onClick={() => setDeleteConfirmId(item._id)}
                             className="p-3 text-typography-inactive bg-background-layer-2-background rounded-full transition-colors"
                             title="Delete item"
                           >
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                             </svg>
                           </button>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

        {/* Sticky Bottom Button */}
        <div className="fixed bottom-0 left-0 right-0 py-4 z-40">
          <button
            onClick={() => router.push('/admin/addmenu')}
            type="submit"
            className="w-full bg-background-primary text-typography-white py-6 px-8 rounded-2xl text-lg font-bold"
          >
            Add Menu
          </button>
        </div>

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
