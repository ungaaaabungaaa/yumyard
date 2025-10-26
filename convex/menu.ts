import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Mutation to create a new menu item
export const createMenuItem = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.string(), // mandatory main image
    imageUrls: v.optional(v.array(v.string())), // optional array of additional images (max 5)
    price: v.number(),
    category: v.optional(v.string()),
    isAvailable: v.optional(v.boolean()),
    preparationTime: v.optional(v.number()),
    ingredients: v.optional(v.array(v.string())),
    allergens: v.optional(v.array(v.string())),
    isVegetarian: v.optional(v.boolean()),
    isVegan: v.optional(v.boolean()),
    isGlutenFree: v.optional(v.boolean()),
    spiceLevel: v.optional(v.union(v.literal("mild"), v.literal("medium"), v.literal("hot"), v.literal("extra-hot"))),
    calories: v.optional(v.number()),
    servingSize: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    displayOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Validate imageUrls array length (max 5 images)
    if (args.imageUrls && args.imageUrls.length > 5) {
      throw new Error("Maximum 5 additional images allowed");
    }
    
    const menuItem = {
      ...args,
      isAvailable: args.isAvailable ?? true, // default to available
      createdAt: now,
      updatedAt: now,
    };

    const id = await ctx.db.insert("menu", menuItem);
    return await ctx.db.get(id);
  },
});

// Mutation to update an existing menu item
export const updateMenuItem = mutation({
  args: {
    id: v.id("menu"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    imageUrls: v.optional(v.array(v.string())), // optional array of additional images (max 5)
    price: v.optional(v.number()),
    category: v.optional(v.string()),
    isAvailable: v.optional(v.boolean()),
    preparationTime: v.optional(v.number()),
    ingredients: v.optional(v.array(v.string())),
    allergens: v.optional(v.array(v.string())),
    isVegetarian: v.optional(v.boolean()),
    isVegan: v.optional(v.boolean()),
    isGlutenFree: v.optional(v.boolean()),
    spiceLevel: v.optional(v.union(v.literal("mild"), v.literal("medium"), v.literal("hot"), v.literal("extra-hot"))),
    calories: v.optional(v.number()),
    servingSize: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    displayOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    // Validate imageUrls array length (max 5 images)
    if (updates.imageUrls && updates.imageUrls.length > 5) {
      throw new Error("Maximum 5 additional images allowed");
    }
    
    const updatedItem = {
      ...updates,
      updatedAt: Date.now(),
    };

    await ctx.db.patch(id, updatedItem);
    return await ctx.db.get(id);
  },
});

// Mutation to delete a menu item
export const deleteMenuItem = mutation({
  args: { id: v.id("menu") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// Mutation to toggle availability of a menu item
export const toggleMenuItemAvailability = mutation({
  args: { id: v.id("menu") },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item) {
      throw new Error("Menu item not found");
    }

    await ctx.db.patch(args.id, {
      isAvailable: !item.isAvailable,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(args.id);
  },
});

// Query to get all menu items
export const getAllMenuItems = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("menu")
      .withIndex("by_created_at")
      .order("desc")
      .collect();
  },
});

// Query to get menu items by category
export const getMenuItemsByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("menu")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  },
});

// Query to get available menu items only
export const getAvailableMenuItems = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("menu")
      .withIndex("by_availability", (q) => q.eq("isAvailable", true))
      .collect();
  },
});

// Query to get menu items ordered by display order
export const getMenuItemsByDisplayOrder = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db
      .query("menu")
      .withIndex("by_display_order")
      .collect();
    
    // Sort by displayOrder (nulls last), then by createdAt
    return items.sort((a, b) => {
      if (a.displayOrder === undefined && b.displayOrder === undefined) {
        return b.createdAt - a.createdAt;
      }
      if (a.displayOrder === undefined) return 1;
      if (b.displayOrder === undefined) return -1;
      return a.displayOrder - b.displayOrder;
    });
  },
});

// Query to get a single menu item by ID
export const getMenuItemById = query({
  args: { id: v.id("menu") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Query to search menu items by name
export const searchMenuItems = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const allItems = await ctx.db.query("menu").collect();
    const searchTerm = args.searchTerm.toLowerCase();
    
    return allItems.filter((item) =>
      item.name.toLowerCase().includes(searchTerm) ||
      (item.description && item.description.toLowerCase().includes(searchTerm)) ||
      (item.category && item.category.toLowerCase().includes(searchTerm))
    );
  },
});

// Query to get menu categories
export const getMenuCategories = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db.query("menu").collect();
    const categories = new Set<string>();
    
    items.forEach((item) => {
      if (item.category) {
        categories.add(item.category);
      }
    });
    
    return Array.from(categories).sort();
  },
});
