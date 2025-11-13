import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // 🍽️ MENU TABLE
  menu: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.string(), // mandatory main image
    imageUrls: v.optional(v.array(v.string())), // optional array of additional images (max 5)
    price: v.number(),
    category: v.optional(v.string()), // e.g., "Pizza", "Drinks" (kept for backward compatibility)
    categoryId: v.id("categories"), // mandatory link to categories table
    isAvailable: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),

    preparationTime: v.optional(v.number()), // in minutes
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
    packingCost: v.optional(v.number()),
  })
    .index("by_category", ["category"])
    .index("by_categoryId", ["categoryId"])
    .index("by_availability", ["isAvailable"])
    .index("by_created_at", ["createdAt"]),

  // 👤 USERS TABLE
  users: defineTable({
    userId: v.optional(v.string()), // Convex Auth user id
    name: v.string(),
    phoneNumber: v.string(),
    apartment: v.optional(v.string()),
    flatNumber: v.optional(v.string()),
    otherAddress: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),

    savedAddresses: v.optional(
      v.array(
        v.object({
          label: v.string(),
          apartment: v.optional(v.string()),
          flatNumber: v.optional(v.string()),
          otherAddress: v.optional(v.string()),
        })
      )
    ),
  })
    .index("by_userId", ["userId"])
    .index("by_phoneNumber", ["phoneNumber"])
    .index("by_created_at", ["createdAt"]),

  // 🧾 ORDERS TABLE
  orders: defineTable({
    userId: v.optional(v.id("users")),
    username: v.string(),
    userType: v.union(v.literal("authenticated"), v.literal("guest")),

    // Contact information
    phoneNumber: v.optional(v.string()),

    apartment: v.optional(v.string()),
    flatNumber: v.optional(v.string()),
    otherAddress: v.optional(v.string()),

    orderType: v.union(
      v.literal("dine-in"),
      v.literal("walk-up"),
      v.literal("delivery")
    ),
    tableNumber: v.optional(v.string()),
    deliveryNote: v.optional(v.string()),

    items: v.array(
      v.object({
        menuId: v.id("menu"),
        name: v.string(),
        quantity: v.number(),
        price: v.number(),
        specialRequest: v.optional(v.string()),
      })
    ),

    paymentStatus: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("failed")
    ),
    paymentMethod: v.optional(
      v.union(v.literal("cash"), v.literal("card"), v.literal("upi"), v.literal("online"))
    ),
    totalAmount: v.number(),

    status: v.union(
      v.literal("order-received"),
      v.literal("cooking"),
      v.literal("out-for-delivery"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),

    // ⭐ Order-level review (optional)
    review: v.optional(
      v.object({
        rating: v.number(), // 1–5
        comment: v.optional(v.string()),
        createdAt: v.number(),
      })
    ),

    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    estimatedReadyTime: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_created_at", ["createdAt"]),

  // ❤️ FAVORITES TABLE
  favorites: defineTable({
    userId: v.id("users"),
    menuId: v.id("menu"),
    addedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_menu", ["menuId"])
    .index("by_user_menu", ["userId", "menuId"]),

  // 🔔 NOTIFICATIONS TABLE
  notifications: defineTable({
    userId: v.id("users"),
    title: v.string(),
    message: v.string(),
    type: v.optional(
      v.union(
        v.literal("order"),
        v.literal("promotion"),
        v.literal("system"),
        v.literal("kitchen-update")
      )
    ),
    isRead: v.boolean(),
    createdAt: v.number(),
    relatedOrderId: v.optional(v.id("orders")),
  })
    .index("by_user", ["userId"])
    .index("by_created_at", ["createdAt"])
    .index("by_isRead", ["isRead"]),

  // ⭐ MENU REVIEWS TABLE
  menuReviews: defineTable({
    userId: v.id("users"),
    menuId: v.id("menu"),
    orderId: v.optional(v.id("orders")),
    rating: v.number(), // 1–5
    comment: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_menu", ["menuId"])
    .index("by_user", ["userId"])
    .index("by_created_at", ["createdAt"]),

  // 👨‍🍳 KITCHEN ACTIVITY LOGS
  kitchenLogs: defineTable({
    orderId: v.id("orders"),
    staffName: v.string(), // who performed the action
    action: v.union(
      v.literal("received"),
      v.literal("started-cooking"),
      v.literal("paused"),
      v.literal("completed"),
      v.literal("handed-over"),
      v.literal("cancelled"),
      v.literal("payment-updated")
    ),
    note: v.optional(v.string()), // optional reason or update
    createdAt: v.number(),
  })
    .index("by_order", ["orderId"])
    .index("by_staff", ["staffName"])
    .index("by_created_at", ["createdAt"]),

  // 📁 CATEGORIES TABLE
  categories: defineTable({
    name: v.string(),
    imageUrl: v.string(), // mandatory image for category
    type: v.union(v.literal("veg"), v.literal("nonveg")), // mandatory: veg or nonveg
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_name", ["name"])
    .index("by_created_at", ["createdAt"]),
});
