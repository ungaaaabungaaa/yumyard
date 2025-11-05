"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export default function AdminCategory() {
  const createCategory = useMutation(api.categories.createCategory);
  const updateCategory = useMutation(api.categories.updateCategory);
  const categories = useQuery(api.categories.getAllCategories);
  
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const selectedCategory = categories?.find(
    (cat: { _id: string }) => cat._id === selectedCategoryId
  );

  // Load selected category data when selection changes
  useEffect(() => {
    if (selectedCategory && !isCreatingNew) {
      setImageUrl(selectedCategory.imageUrl || "");
    } else if (isCreatingNew) {
      setImageUrl("");
    }
  }, [selectedCategory, isCreatingNew]);

  // Reset form when switching between edit and create mode
  useEffect(() => {
    if (!isCreatingNew && selectedCategoryId) {
      setNewCategoryName("");
    } else if (isCreatingNew) {
      setSelectedCategoryId("");
    }
  }, [isCreatingNew, selectedCategoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isCreatingNew) {
        // Create new category
        if (!newCategoryName.trim()) {
          alert("Please enter a category name");
          return;
        }
        if (!imageUrl.trim()) {
          alert("Please enter an image URL");
          return;
        }
        await createCategory({
          name: newCategoryName.trim(),
          imageUrl: imageUrl.trim(),
        });
        alert("Category created successfully!");
        setNewCategoryName("");
        setImageUrl("");
      } else {
        // Update existing category
        if (!selectedCategoryId) {
          alert("Please select a category");
          return;
        }
        if (!imageUrl.trim()) {
          alert("Please enter an image URL");
          return;
        }
        await updateCategory({
          id: selectedCategoryId as Id<"categories">,
          imageUrl: imageUrl.trim(),
        });
        alert("Category updated successfully!");
      }
    } catch (error: unknown) {
      console.error(`Error ${isCreatingNew ? 'creating' : 'updating'} category:`, error);
      const errorMessage = error instanceof Error ? error.message : `Failed to ${isCreatingNew ? 'create' : 'update'} category. Please try again.`;
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Preview */}
        <div className="flex justify-center">
          <div className="w-full  min-h-57 max-h-76 rounded-2xl overflow-hidden bg-gray-100 border-2 border-gray-200">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt="Category preview"
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
          {/* Toggle between edit and create */}
          <div>
            <select
              value={isCreatingNew ? "create" : "edit"}
              onChange={(e) => setIsCreatingNew(e.target.value === "create")}
              className="w-full py-6 px-6 border-2 rounded-3xl text-2xl font-normal text-typography-heading placeholder-typography-light-grey focus:outline-none focus:ring-2 focus:border-transparent appearance-none"
            >
              <option value="edit">Edit Existing</option>
              <option value="create">Create New</option>
            </select>
          </div>

          {isCreatingNew ? (
            <div>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                required
                className="w-full py-6 px-6 border-2 rounded-3xl text-2xl font-normal text-typography-heading placeholder-typography-light-grey focus:outline-none focus:ring-2 focus:border-transparent"
                placeholder="Category Name"
              />
            </div>
          ) : (
            <div>
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                required={!isCreatingNew}
                className="w-full py-6 px-6 border-2 rounded-3xl text-2xl font-normal text-typography-heading placeholder-typography-light-grey focus:outline-none focus:ring-2 focus:border-transparent appearance-none"
              >
                <option value="">Select Category</option>
                {categories?.map((category: { _id: string; name: string }) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
              className="w-full py-6 px-6 border-2 rounded-3xl text-2xl font-normal text-typography-heading placeholder-typography-light-grey focus:outline-none focus:ring-2 focus:border-transparent"
              placeholder="Image URL *"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-background-primary disabled:bg-background-disabled text-typography-white py-6 px-8 rounded-2xl text-lg font-bold transition-colors duration-200"
          >
            {isSubmitting 
              ? (isCreatingNew ? "Creating..." : "Updating...") 
              : (isCreatingNew ? "Create Category" : "Update Category")}
          </button>
        </div>
      </form>
    </div>
  );
}

