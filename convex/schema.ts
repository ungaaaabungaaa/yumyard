import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  menu: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    price: v.number(),
    category: v.optional(v.string()), // e.g., "Pizza", "Burgers", "Drinks", "Desserts"
    isAvailable: v.boolean(), // toggle for sold out
    createdAt: v.number(), // Date.now()
    updatedAt: v.optional(v.number()),
    // Enhanced fields for better menu management
    preparationTime: v.optional(v.number()), // in minutes
    ingredients: v.optional(v.array(v.string())), // list of ingredients
    allergens: v.optional(v.array(v.string())), // list of allergens
    isVegetarian: v.optional(v.boolean()),
    isVegan: v.optional(v.boolean()),
    isGlutenFree: v.optional(v.boolean()),
    spiceLevel: v.optional(v.union(v.literal("mild"), v.literal("medium"), v.literal("hot"), v.literal("extra-hot"))),
    calories: v.optional(v.number()),
    servingSize: v.optional(v.string()), // e.g., "1 piece", "250ml", "serves 2-3"
    tags: v.optional(v.array(v.string())), // e.g., ["popular", "chef-special", "new"]
    displayOrder: v.optional(v.number()), // for custom ordering in menu display
  })
    .index("by_category", ["category"])
    .index("by_availability", ["isAvailable"])
    .index("by_created_at", ["createdAt"])
    .index("by_display_order", ["displayOrder"]),
});
