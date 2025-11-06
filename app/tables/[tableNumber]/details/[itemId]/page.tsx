"use client";

import { useParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Spinner } from '@/components/ui/spinner';
import Image from 'next/image';

export default function MenuItemDetails() {
  const params = useParams();
  const itemId = params?.itemId as Id<"menu">;
  
  const menuItem = useQuery(api.menu.getMenuItemById, itemId ? { id: itemId } : "skip");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  if (!itemId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-typography-heading mb-2">Invalid Menu Item</h2>
          <p className="text-typography-paragraph">Please select a valid menu item.</p>
        </div>
      </div>
    );
  }

  if (menuItem === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center flex flex-col items-center justify-center gap-4">
          <Spinner className="size-8 text-typography-primary" />
          <p className="text-typography-disabled text-lg font-medium">Loading menu item...</p>
        </div>
      </div>
    );
  }

  if (menuItem === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-typography-heading mb-2">Menu Item Not Found</h2>
          <p className="text-typography-paragraph">The requested menu item could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Image */}
      <div className="w-full aspect-square rounded-2xl overflow-hidden bg-background-element-background relative">
        {menuItem.imageUrl ? (
          <Image
            src={menuItem.imageUrl}
            alt={menuItem.name}
            fill
            className="object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-food.jpg';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-typography-disabled">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Additional Images */}
      {menuItem.imageUrls && menuItem.imageUrls.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {menuItem.imageUrls.map((url, index) => (
            <div key={index} className="aspect-square rounded-xl overflow-hidden bg-background-element-background relative">
              <Image
                src={url}
                alt={`${menuItem.name} ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Name and Price */}
      <div>
        <h1 className="text-3xl font-bold text-typography-heading mb-2">
          {menuItem.name}
        </h1>
        <p className="text-2xl font-semibold text-typography-primary">
          {formatPrice(menuItem.price)}
        </p>
      </div>

      {/* Availability Badge */}
      <div>
        {menuItem.isAvailable ? (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-background-primary text-typography-white">
            Available
          </span>
        ) : (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-background-danger text-typography-white">
            Not Available
          </span>
        )}
      </div>

      {/* Description */}
      {menuItem.description && (
        <div>
          <h2 className="text-xl font-semibold text-typography-heading mb-2">Description</h2>
          <p className="text-typography-paragraph leading-relaxed">
            {menuItem.description}
          </p>
        </div>
      )}

      {/* Category */}
      {menuItem.category && (
        <div>
          <h2 className="text-xl font-semibold text-typography-heading mb-2">Category</h2>
          <p className="text-typography-paragraph">{menuItem.category}</p>
        </div>
      )}

      {/* Spice Level */}
      {menuItem.spiceLevel && (
        <div>
          <h2 className="text-xl font-semibold text-typography-heading mb-2">Spice Level</h2>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 capitalize">
            {menuItem.spiceLevel}
          </span>
        </div>
      )}

      {/* Nutritional Information */}
      {(menuItem.calories || menuItem.servingSize) && (
        <div>
          <h2 className="text-xl font-semibold text-typography-heading mb-2">Nutritional Information</h2>
          <div className="space-y-2 text-typography-paragraph">
            {menuItem.calories && (
              <p><span className="font-semibold">Calories:</span> {menuItem.calories} kcal</p>
            )}
            {menuItem.servingSize && (
              <p><span className="font-semibold">Serving Size:</span> {menuItem.servingSize}</p>
            )}
          </div>
        </div>
      )}

      {/* Preparation Time */}
      {menuItem.preparationTime && (
        <div>
          <h2 className="text-xl font-semibold text-typography-heading mb-2">Preparation Time</h2>
          <p className="text-typography-paragraph">{menuItem.preparationTime} minutes</p>
        </div>
      )}
    </div>
  );
}

