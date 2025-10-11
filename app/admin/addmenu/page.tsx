"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";

export default function AdminAddMenu() {
  const router = useRouter();
  const createMenuItem = useMutation(api.menu.createMenuItem);
  
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    preparationTime: "",
    displayOrder: "",
    description: "",
    imageUrl: "",
    servingSize: "",
    calories: "",
    spiceLevel: "mild",
    ingredients: "",
    allergens: "",
    tags: "",
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      // Validate numeric fields
      if (name === "price") {
        // Allow numbers and decimal point only
        const numericValue = value.replace(/[^0-9.]/g, '');
        // Prevent multiple decimal points
        const parts = numericValue.split('.');
        const validValue = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : numericValue;
        setFormData(prev => ({ ...prev, [name]: validValue }));
      } else if (name === "preparationTime" || name === "displayOrder" || name === "calories") {
        // Allow only whole numbers
        const numericValue = value.replace(/[^0-9]/g, '');
        setFormData(prev => ({ ...prev, [name]: numericValue }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const menuItemData = {
        name: formData.name,
        price: parseFloat(formData.price),
        category: formData.category || undefined,
        preparationTime: formData.preparationTime ? parseInt(formData.preparationTime) : undefined,
        displayOrder: formData.displayOrder ? parseInt(formData.displayOrder) : undefined,
        description: formData.description || undefined,
        imageUrl: formData.imageUrl || undefined,
        servingSize: formData.servingSize || undefined,
        calories: formData.calories ? parseInt(formData.calories) : undefined,
        spiceLevel: formData.spiceLevel as "mild" | "medium" | "hot" | "extra-hot",
        ingredients: formData.ingredients ? formData.ingredients.split(',').map(item => item.trim()) : undefined,
        allergens: formData.allergens ? formData.allergens.split(',').map(item => item.trim()) : undefined,
        tags: formData.tags ? formData.tags.split(',').map(item => item.trim()) : undefined,
        isVegetarian: formData.isVegetarian,
        isVegan: formData.isVegan,
        isGlutenFree: formData.isGlutenFree,
      };

      await createMenuItem(menuItemData);
      router.push('/admin/menu');
    } catch (error) {
      console.error('Error creating menu item:', error);
      alert('Failed to create menu item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
  

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Image Preview */}
        <div className="flex justify-center">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
            {formData.imageUrl ? (
              <img 
                src={formData.imageUrl} 
                alt="Menu item preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-food.jpg';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Input Fields */}
        <div className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg "
              placeholder="Item Name"
            />
          </div>

          <div>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              pattern="[0-9]+(\.[0-9]+)?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg "
              placeholder="Price"
            />
          </div>

          <div>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg "
              placeholder="Category"
            />
          </div>

          <div>
            <input
              type="text"
              name="preparationTime"
              value={formData.preparationTime}
              onChange={handleInputChange}
              pattern="[0-9]+"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg "
              placeholder="Preparation Time"
            />
          </div>

          <div>
            <input
              type="text"
              name="displayOrder"
              value={formData.displayOrder}
              onChange={handleInputChange}
              pattern="[0-9]+"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg "
              placeholder="Display Order"
            />
          </div>

          <div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg "
              placeholder="Description"
            />
          </div>

          <div>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg "
              placeholder="Image URL"
            />
          </div>

          <div>
            <input
              type="text"
              name="servingSize"
              value={formData.servingSize}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg "
              placeholder="Serving Size"
            />
          </div>

          <div>
            <input
              type="text"
              name="calories"
              value={formData.calories}
              onChange={handleInputChange}
              pattern="[0-9]+"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg "
              placeholder="Calories"
            />
          </div>

          <div>
            <select
              name="spiceLevel"
              value={formData.spiceLevel}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg "
            >
              <option value="mild">Mild</option>
              <option value="medium">Medium</option>
              <option value="hot">Hot</option>
              <option value="extra-hot">Extra Hot</option>
            </select>
          </div>

          <div>
            <textarea
              name="ingredients"
              value={formData.ingredients}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg "
              placeholder="Ingredients"
            />
          </div>

          <div>
            <textarea
              name="allergens"
              value={formData.allergens}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg "
              placeholder="Allergens"
            />
          </div>

          <div>
            <textarea
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg "
              placeholder="Tags"
            />
          </div>

          {/* Dietary Options */}
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isVegetarian"
                checked={formData.isVegetarian}
                onChange={handleInputChange}
                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded "
              />
              <span className="ml-2 text-sm text-gray-700">Vegetarian</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="isVegan"
                checked={formData.isVegan}
                onChange={handleInputChange}
                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded "
              />
              <span className="ml-2 text-sm text-gray-700">Vegan</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="isGlutenFree"
                checked={formData.isGlutenFree}
                onChange={handleInputChange}
                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded "
              />
              <span className="ml-2 text-sm text-gray-700">Gluten Free</span>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-medium py-4 px-6 rounded-lg transition-colors duration-200"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}