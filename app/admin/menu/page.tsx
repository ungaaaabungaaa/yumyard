"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Search,
  Filter,
  X,
  Save,
  DollarSign,
  Clock,
  Tag,
  ChefHat,
  ImageIcon,
  Users,
  Flame,
  Leaf,
  Wheat,
  AlertTriangle,
  Star,
  ArrowUpDown
} from "lucide-react";

interface MenuItemFormData {
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  category: string;
  isAvailable: boolean;
  preparationTime: number;
  ingredients: string[];
  allergens: string[];
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  spiceLevel: "mild" | "medium" | "hot" | "extra-hot" | "";
  calories: number;
  servingSize: string;
  tags: string[];
  displayOrder: number;
}

export default function AdminMenu() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Id<"menu"> | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [formData, setFormData] = useState<MenuItemFormData>({
    name: "",
    description: "",
    imageUrl: "",
    price: 0,
    category: "",
    isAvailable: true,
    preparationTime: 0,
    ingredients: [],
    allergens: [],
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    spiceLevel: "",
    calories: 0,
    servingSize: "",
    tags: [],
    displayOrder: 0,
  });

  const menuItems = useQuery(api.menu.getAllMenuItems) || [];
  const categories = useQuery(api.menu.getMenuCategories) || [];
  
  const createMenuItem = useMutation(api.menu.createMenuItem);
  const updateMenuItem = useMutation(api.menu.updateMenuItem);
  const deleteMenuItem = useMutation(api.menu.deleteMenuItem);
  const toggleAvailability = useMutation(api.menu.toggleMenuItemAvailability);

  // Filter menu items based on search and category
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      imageUrl: "",
      price: 0,
      category: "",
      isAvailable: true,
      preparationTime: 0,
      ingredients: [],
      allergens: [],
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      spiceLevel: "",
      calories: 0,
      servingSize: "",
      tags: [],
      displayOrder: 0,
    });
    setShowAddForm(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      price: Number(formData.price),
      preparationTime: formData.preparationTime || undefined,
      calories: formData.calories || undefined,
      displayOrder: formData.displayOrder || undefined,
      spiceLevel: formData.spiceLevel || undefined,
      ingredients: formData.ingredients.length > 0 ? formData.ingredients : undefined,
      allergens: formData.allergens.length > 0 ? formData.allergens : undefined,
      tags: formData.tags.length > 0 ? formData.tags : undefined,
      description: formData.description || undefined,
      imageUrl: formData.imageUrl || undefined,
      category: formData.category || undefined,
      servingSize: formData.servingSize || undefined,
    };

    try {
      if (editingItem) {
        await updateMenuItem({ id: editingItem, ...submitData });
      } else {
        await createMenuItem(submitData);
      }
      resetForm();
    } catch (error) {
      console.error("Error saving menu item:", error);
    }
  };

  const handleEdit = (item: any) => {
    setFormData({
      name: item.name,
      description: item.description || "",
      imageUrl: item.imageUrl || "",
      price: item.price,
      category: item.category || "",
      isAvailable: item.isAvailable,
      preparationTime: item.preparationTime || 0,
      ingredients: item.ingredients || [],
      allergens: item.allergens || [],
      isVegetarian: item.isVegetarian || false,
      isVegan: item.isVegan || false,
      isGlutenFree: item.isGlutenFree || false,
      spiceLevel: item.spiceLevel || "",
      calories: item.calories || 0,
      servingSize: item.servingSize || "",
      tags: item.tags || [],
      displayOrder: item.displayOrder || 0,
    });
    setEditingItem(item._id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: Id<"menu">) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
      try {
        await deleteMenuItem({ id });
      } catch (error) {
        console.error("Error deleting menu item:", error);
      }
    }
  };

  const handleToggleAvailability = async (id: Id<"menu">) => {
    try {
      await toggleAvailability({ id });
    } catch (error) {
      console.error("Error toggling availability:", error);
    }
  };

  const handleArrayInput = (field: keyof MenuItemFormData, value: string) => {
    const array = value.split(",").map(item => item.trim()).filter(item => item);
    setFormData(prev => ({ ...prev, [field]: array }));
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      <div className="max-w-7xl bg-white mx-auto space-y-6">
        {/* Header */}
        <div className="  rounded-2xl p-6 ">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <ChefHat className="text-orange-500" size={32} />
                Menu Management
              </h1>
              <p className="text-gray-600 mt-1">Manage your restaurant's menu items and categories</p>
            </div>
            <button 
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <Plus size={18} />
              Add New Item
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search menu items by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors duration-200"
              />
            </div>
            <div className="relative min-w-[200px]">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full pl-12 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors duration-200 appearance-none"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Menu Items Grid */}
          {filteredItems.length === 0 ? (
            <div className=" p-12 text-center">
              <ChefHat className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || categoryFilter ? "No items match your filters" : "No menu items yet"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || categoryFilter 
                  ? "Try adjusting your search or filter criteria." 
                  : "Get started by adding your first menu item."}
              </p>
              {!searchTerm && !categoryFilter && (
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus size={18} />
                  Add Your First Item
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div key={item._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100">
                  {/* Item Image */}
                  <div className="relative h-48 bg-gradient-to-br from-orange-100 to-red-100">
                    {item.imageUrl ? (
                      <img 
                        src={item.imageUrl} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-16 w-16 text-gray-300" />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${
                        item.isAvailable 
                          ? "bg-green-500 text-white" 
                          : "bg-red-500 text-white"
                      }`}>
                        {item.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </div>

                    {/* Dietary Icons */}
                    <div className="absolute top-3 left-3 flex gap-1">
                      {item.isVegan && (
                        <div className="bg-green-500 text-white p-1.5 rounded-full shadow-lg" title="Vegan">
                          <Leaf size={12} />
                        </div>
                      )}
                      {item.isVegetarian && !item.isVegan && (
                        <div className="bg-green-400 text-white p-1.5 rounded-full shadow-lg" title="Vegetarian">
                          <Leaf size={12} />
                        </div>
                      )}
                      {item.isGlutenFree && (
                        <div className="bg-yellow-500 text-white p-1.5 rounded-full shadow-lg" title="Gluten Free">
                          <Wheat size={12} />
                        </div>
                      )}
                      {item.spiceLevel && (
                        <div className="bg-red-500 text-white p-1.5 rounded-full shadow-lg" title={`Spice Level: ${item.spiceLevel}`}>
                          <Flame size={12} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Item Details */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                        {item.category && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            {item.category}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">${item.price.toFixed(2)}</div>
                        {item.preparationTime && (
                          <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <Clock size={12} />
                            {item.preparationTime}min
                          </div>
                        )}
                      </div>
                    </div>

                    {item.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                    )}

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {item.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                            <Star size={10} className="mr-1" />
                            {tag}
                          </span>
                        ))}
                        {item.tags.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                            +{item.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-xs text-gray-500">
                        Added {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleAvailability(item._id)}
                          className={`p-2 rounded-lg transition-colors duration-200 ${
                            item.isAvailable 
                              ? "text-green-600 hover:bg-green-50" 
                              : "text-red-600 hover:bg-red-50"
                          }`}
                          title={item.isAvailable ? "Mark as unavailable" : "Mark as available"}
                        >
                          {item.isAvailable ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                          title="Edit item"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200"
                          title="Delete item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 px-8 py-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    {editingItem ? <Edit size={24} /> : <Plus size={24} />}
                    {editingItem ? "Edit Menu Item" : "Create New Menu Item"}
                  </h3>
                  <p className="text-orange-100 mt-1">
                    {editingItem ? "Update your menu item details" : "Add a delicious new item to your menu"}
                  </p>
                </div>
                <button
                  onClick={resetForm}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors duration-200"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className="max-h-[calc(95vh-120px)] overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-8 space-y-8">
                {/* Basic Information Section */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Tag className="text-orange-500" size={20} />
                    Basic Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Item Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm transition-all duration-200 text-lg"
                        placeholder="Enter a delicious name for your item"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Price *
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          required
                          value={formData.price}
                          onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm transition-all duration-200 text-lg font-semibold"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Category
                      </label>
                      <div className="relative">
                        <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="text"
                          value={formData.category}
                          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm transition-all duration-200"
                          placeholder="e.g., Pizza, Burgers, Drinks"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Preparation Time (minutes)
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="number"
                          min="0"
                          value={formData.preparationTime}
                          onChange={(e) => setFormData(prev => ({ ...prev, preparationTime: parseInt(e.target.value) || 0 }))}
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm transition-all duration-200"
                          placeholder="15"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Display Order
                      </label>
                      <div className="relative">
                        <ArrowUpDown className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="number"
                          min="0"
                          value={formData.displayOrder}
                          onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm transition-all duration-200"
                          placeholder="0"
                        />
                        <p className="text-xs text-gray-500 mt-1">Lower numbers appear first in the menu</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description & Image Section */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <ImageIcon className="text-orange-500" size={20} />
                    Description & Image
                  </h4>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Description
                      </label>
                      <textarea
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm transition-all duration-200 resize-none"
                        placeholder="Describe your menu item in detail. What makes it special? What ingredients does it contain?"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Image URL
                      </label>
                      <div className="relative">
                        <ImageIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="url"
                          value={formData.imageUrl}
                          onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm transition-all duration-200"
                          placeholder="https://example.com/delicious-food-image.jpg"
                        />
                      </div>
                      {formData.imageUrl && (
                        <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-500 mb-2">Preview:</p>
                          <img 
                            src={formData.imageUrl} 
                            alt="Preview" 
                            className="w-full h-32 object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Nutritional & Additional Details */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Users className="text-orange-500" size={20} />
                    Nutritional & Additional Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Serving Size
                      </label>
                      <input
                        type="text"
                        value={formData.servingSize}
                        onChange={(e) => setFormData(prev => ({ ...prev, servingSize: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm transition-all duration-200"
                        placeholder="e.g., 1 piece, 250ml, 2 slices"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Calories
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.calories}
                        onChange={(e) => setFormData(prev => ({ ...prev, calories: parseInt(e.target.value) || 0 }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm transition-all duration-200"
                        placeholder="350"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Spice Level
                      </label>
                      <div className="relative">
                        <Flame className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <select
                          value={formData.spiceLevel}
                          onChange={(e) => setFormData(prev => ({ ...prev, spiceLevel: e.target.value as any }))}
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm transition-all duration-200 appearance-none"
                        >
                          <option value="">Not Applicable</option>
                          <option value="mild">🌶️ Mild</option>
                          <option value="medium">🌶️🌶️ Medium</option>
                          <option value="hot">🌶️🌶️🌶️ Hot</option>
                          <option value="extra-hot">🌶️🌶️🌶️🌶️ Extra Hot</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ingredients & Allergens */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <ChefHat className="text-orange-500" size={20} />
                    Ingredients & Allergens
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Ingredients (comma-separated)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.ingredients.join(", ")}
                        onChange={(e) => handleArrayInput("ingredients", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm transition-all duration-200 resize-none"
                        placeholder="tomato, mozzarella cheese, fresh basil, olive oil, garlic"
                      />
                      <p className="text-xs text-gray-500 mt-1">Separate each ingredient with a comma</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Allergens (comma-separated)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.allergens.join(", ")}
                        onChange={(e) => handleArrayInput("allergens", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm transition-all duration-200 resize-none"
                        placeholder="dairy, gluten, nuts, eggs"
                      />
                      <p className="text-xs text-gray-500 mt-1">List potential allergens for customer safety</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Tags (comma-separated)
                    </label>
                    <div className="relative">
                      <Star className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        value={formData.tags.join(", ")}
                        onChange={(e) => handleArrayInput("tags", e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm transition-all duration-200"
                        placeholder="popular, chef-special, new, bestseller, seasonal"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Add tags to help customers find this item</p>
                  </div>
                </div>

                {/* Dietary Options & Availability */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Leaf className="text-orange-500" size={20} />
                    Dietary Options & Availability
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <label className="flex items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-orange-300 transition-colors duration-200 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.isAvailable}
                        onChange={(e) => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 focus:ring-2"
                      />
                      <div className="ml-3">
                        <span className="text-sm font-medium text-gray-900">Available</span>
                        <p className="text-xs text-gray-500">Ready to order</p>
                      </div>
                    </label>

                    <label className="flex items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-green-300 transition-colors duration-200 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.isVegetarian}
                        onChange={(e) => setFormData(prev => ({ ...prev, isVegetarian: e.target.checked }))}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500 focus:ring-2"
                      />
                      <div className="ml-3">
                        <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                          🥬 Vegetarian
                        </span>
                        <p className="text-xs text-gray-500">No meat</p>
                      </div>
                    </label>

                    <label className="flex items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-green-300 transition-colors duration-200 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.isVegan}
                        onChange={(e) => setFormData(prev => ({ ...prev, isVegan: e.target.checked }))}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500 focus:ring-2"
                      />
                      <div className="ml-3">
                        <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                          🌱 Vegan
                        </span>
                        <p className="text-xs text-gray-500">Plant-based</p>
                      </div>
                    </label>

                    <label className="flex items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-yellow-300 transition-colors duration-200 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.isGlutenFree}
                        onChange={(e) => setFormData(prev => ({ ...prev, isGlutenFree: e.target.checked }))}
                        className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500 focus:ring-2"
                      />
                      <div className="ml-3">
                        <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                          🌾 Gluten Free
                        </span>
                        <p className="text-xs text-gray-500">No gluten</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 -mx-8 -mb-8 rounded-b-3xl">
                  <div className="flex flex-col sm:flex-row justify-end gap-3">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    >
                      <Save size={18} />
                      {editingItem ? "Update Menu Item" : "Create Menu Item"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
