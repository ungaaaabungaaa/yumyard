import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Mutation to create a new order
export const createOrder = mutation({
  args: {
    // User details
    userId: v.optional(v.id("users")),
    username: v.string(),
    userType: v.union(v.literal("authenticated"), v.literal("guest")),
    
    // Address details
    apartment: v.optional(v.string()),
    flatNumber: v.optional(v.string()),
    otherAddress: v.optional(v.string()),
    
    // Order details
    orderType: v.union(
      v.literal("dine-in"),
      v.literal("walk-up"),
      v.literal("delivery")
    ),
    tableNumber: v.optional(v.string()),
    deliveryNote: v.optional(v.string()),
    
    // Order items
    items: v.array(
      v.object({
        menuId: v.id("menu"),
        name: v.string(),
        quantity: v.number(),
        price: v.number(),
        specialRequest: v.optional(v.string()),
      })
    ),
    totalAmount: v.number(),
    
    // Payment details
    paymentStatus: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("failed")
    ),
    paymentMethod: v.optional(
      v.union(v.literal("cash"), v.literal("card"), v.literal("upi"), v.literal("online"))
    ),
    
    // Kitchen staff details
    staffName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const order = {
      userId: args.userId,
      username: args.username,
      userType: args.userType,
      
      apartment: args.apartment,
      flatNumber: args.flatNumber,
      otherAddress: args.otherAddress,
      
      orderType: args.orderType,
      tableNumber: args.tableNumber,
      deliveryNote: args.deliveryNote,
      
      items: args.items,
      totalAmount: args.totalAmount,
      
      paymentStatus: args.paymentStatus,
      paymentMethod: args.paymentMethod,
      
      status: "order-received" as const,
      
      createdAt: now,
      updatedAt: now,
      estimatedReadyTime: now + (30 * 60 * 1000), // 30 minutes from now
    };

    const orderId = await ctx.db.insert("orders", order);
    
    // Create a kitchen log entry for the order
    await ctx.db.insert("kitchenLogs", {
      orderId,
      staffName: args.staffName || "System",
      action: "received",
      note: "Order created",
      createdAt: now,
    });

    return await ctx.db.get(orderId);
  },
});

// Query to get all orders
export const getAllOrders = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_created_at")
      .order("desc")
      .collect();
  },
});

// Query to get orders by status
export const getOrdersByStatus = query({
  args: { 
    status: v.union(
      v.literal("order-received"),
      v.literal("cooking"),
      v.literal("out-for-delivery"),
      v.literal("delivered"),
      v.literal("cancelled")
    )
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
  },
});

// Query to get a single order by ID
export const getOrderById = query({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Mutation to update order status
export const updateOrderStatus = mutation({
  args: {
    id: v.id("orders"),
    status: v.union(
      v.literal("order-received"),
      v.literal("cooking"),
      v.literal("out-for-delivery"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
    staffName: v.optional(v.string()),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, status, staffName, note } = args;
    
    await ctx.db.patch(id, {
      status,
      updatedAt: Date.now(),
    });

    // Create a kitchen log entry
    if (staffName) {
      await ctx.db.insert("kitchenLogs", {
        orderId: id,
        staffName,
        action: status === "cooking" ? "started-cooking" : 
                status === "delivered" ? "completed" : 
                status === "cancelled" ? "cancelled" : "received",
        note,
        createdAt: Date.now(),
      });
    }

    return await ctx.db.get(id);
  },
});

// Query to get kitchen logs for an order
export const getKitchenLogsForOrder = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("kitchenLogs")
      .withIndex("by_order", (q) => q.eq("orderId", args.orderId))
      .order("desc")
      .collect();
  },
});

// Query to get recent orders (last 24 hours)
export const getRecentOrders = query({
  args: {},
  handler: async (ctx) => {
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    return await ctx.db
      .query("orders")
      .withIndex("by_created_at")
      .filter((q) => q.gte(q.field("createdAt"), oneDayAgo))
      .order("desc")
      .collect();
  },
});

// Query to get all orders with menu item details
export const getAllOrdersWithMenuDetails = query({
  args: {},
  handler: async (ctx) => {
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_created_at")
      .order("desc")
      .collect();

    // For each order, fetch menu item details for each item
    const ordersWithMenuDetails = await Promise.all(
      orders.map(async (order) => {
        const itemsWithMenuDetails = await Promise.all(
          order.items.map(async (item) => {
            const menuItem = await ctx.db.get(item.menuId);
            return {
              ...item,
              menuDetails: menuItem ? {
                imageUrl: menuItem.imageUrl,
                description: menuItem.description,
                category: menuItem.category,
              } : null,
            };
          })
        );

        return {
          ...order,
          items: itemsWithMenuDetails,
        };
      })
    );

    return ordersWithMenuDetails;
  },
});

// Mutation to update payment information
export const updatePaymentInfo = mutation({
  args: {
    id: v.id("orders"),
    paymentStatus: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("failed")
    ),
    paymentMethod: v.optional(
      v.union(v.literal("cash"), v.literal("card"), v.literal("upi"), v.literal("online"))
    ),
    staffName: v.optional(v.string()),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, paymentStatus, paymentMethod, staffName, note } = args;
    
    await ctx.db.patch(id, {
      paymentStatus,
      paymentMethod,
      updatedAt: Date.now(),
    });

    // Create a kitchen log entry for payment update
    if (staffName) {
      await ctx.db.insert("kitchenLogs", {
        orderId: id,
        staffName,
        action: "payment-updated",
        note: note || `Payment status updated to ${paymentStatus}`,
        createdAt: Date.now(),
      });
    }

    return await ctx.db.get(id);
  },
});
