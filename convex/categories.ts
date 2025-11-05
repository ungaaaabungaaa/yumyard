import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Mutation to create a new category
export const createCategory = mutation({
  args: {
    name: v.string(),
    imageUrl: v.string(), // mandatory
    type: v.union(v.literal("veg"), v.literal("nonveg")), // mandatory: veg or nonveg
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Check if category with same name already exists
    const existing = await ctx.db
      .query("categories")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();
    
    if (existing) {
      throw new Error("Category with this name already exists");
    }
    
    const category = {
      name: args.name,
      imageUrl: args.imageUrl,
      type: args.type,
      createdAt: now,
      updatedAt: now,
    };

    const id = await ctx.db.insert("categories", category);
    return await ctx.db.get(id);
  },
});

// Mutation to update an existing category
export const updateCategory = mutation({
  args: {
    id: v.id("categories"),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()), // optional on update, but will be validated if provided
    type: v.optional(v.union(v.literal("veg"), v.literal("nonveg"))), // optional on update
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    // If name is being updated, check if another category with that name exists
    if (updates.name) {
      const nameToCheck = updates.name;
      const existing = await ctx.db
        .query("categories")
        .withIndex("by_name", (q) => q.eq("name", nameToCheck))
        .first();
      
      if (existing && existing._id !== id) {
        throw new Error("Category with this name already exists");
      }
    }
    
    const updatedCategory = {
      ...updates,
      updatedAt: Date.now(),
    };

    await ctx.db.patch(id, updatedCategory);
    return await ctx.db.get(id);
  },
});

// Mutation to delete a category
export const deleteCategory = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// Query to get all categories
export const getAllCategories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_created_at")
      .order("desc")
      .collect();
  },
});

// Query to get a single category by ID
export const getCategoryById = query({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Query to get a category by name
export const getCategoryByName = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();
  },
});

