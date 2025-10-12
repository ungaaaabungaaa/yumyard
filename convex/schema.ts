import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  menu: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    price: v.number(),
    category: v.optional(v.string()), // e.g., "Pizza", "Burgers", "Drinks", "Desserts"
    isAvailable: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    preparationTime: v.optional(v.number()),
    ingredients: v.optional(v.array(v.string())),
    allergens: v.optional(v.array(v.string())),
    isVegetarian: v.optional(v.boolean()),
    isVegan: v.optional(v.boolean()),
    isGlutenFree: v.optional(v.boolean()),
    spiceLevel: v.optional(
      v.union(
        v.literal("mild"),
        v.literal("medium"),
        v.literal("hot"),
        v.literal("extra-hot")
      )
    ),
    calories: v.optional(v.number()),
    servingSize: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    displayOrder: v.optional(v.number()),
  })
    .index("by_category", ["category"])
    .index("by_availability", ["isAvailable"])
    .index("by_created_at", ["createdAt"])
    .index("by_display_order", ["displayOrder"]),

  // 🧾 ORDER TABLE
  orders: defineTable({
    // 👤 User Details
    userId: v.optional(v.string()), // null if guest
    username: v.string(),
    userType: v.union(v.literal("authenticated"), v.literal("guest")),

    // 🏠 Address Details (for delivery only)
    apartment: v.optional(v.string()),
    flatNumber: v.optional(v.string()),
    otherAddress: v.optional(v.string()), // traditional address or notes

    // 🍽️ Dine-in / Walk-up / Delivery
    orderType: v.union(
      v.literal("dine-in"),
      v.literal("walk-up"),
      v.literal("delivery")
    ),

    tableNumber: v.optional(v.string()), // for dine-in (QR-based)
    deliveryNote: v.optional(v.string()),

    // 🧂 Menu Items
    items: v.array(
      v.object({
        menuId: v.id("menu"),
        name: v.string(),
        quantity: v.number(),
        price: v.number(),
        specialRequest: v.optional(v.string()),
      })
    ),

    // 💵 Payment Details
    paymentStatus: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("failed")
    ),
    paymentMethod: v.optional(
      v.union(v.literal("cash"), v.literal("card"), v.literal("upi"), v.literal("online"))
    ),
    totalAmount: v.number(),

    // 🍳 Kitchen Status
    status: v.union(
      v.literal("order-received"),
      v.literal("cooking"),
      v.literal("out-for-delivery"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),

    // 🕒 Timestamps
    createdAt: v.number(), // Date.now()
    updatedAt: v.optional(v.number()),
    estimatedReadyTime: v.optional(v.number()), // optional for dine-in/pickup
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_created_at", ["createdAt"]),
});
