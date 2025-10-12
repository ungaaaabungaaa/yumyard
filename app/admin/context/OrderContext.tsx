"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Id } from "../../../convex/_generated/dataModel";

export interface OrderItem {
  menuId: Id<"menu">;
  name: string;
  price: number;
  quantity: number;
  specialRequest?: string;
}

interface OrderContextType {
  selectedItems: OrderItem[];
  addItem: (item: Omit<OrderItem, 'quantity'>) => void;
  removeItem: (menuId: Id<"menu">) => void;
  updateQuantity: (menuId: Id<"menu">, quantity: number) => void;
  clearOrder: () => void;
  getTotalAmount: () => number;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);

  const addItem = (item: Omit<OrderItem, 'quantity'>) => {
    setSelectedItems(prev => {
      const existingItem = prev.find(i => i.menuId === item.menuId);
      if (existingItem) {
        return prev.map(i => 
          i.menuId === item.menuId 
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const removeItem = (menuId: Id<"menu">) => {
    setSelectedItems(prev => prev.filter(item => item.menuId !== menuId));
  };

  const updateQuantity = (menuId: Id<"menu">, quantity: number) => {
    if (quantity <= 0) {
      removeItem(menuId);
      return;
    }
    
    setSelectedItems(prev => 
      prev.map(item => 
        item.menuId === menuId 
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearOrder = () => {
    setSelectedItems([]);
  };

  const getTotalAmount = () => {
    return selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <OrderContext.Provider value={{
      selectedItems,
      addItem,
      removeItem,
      updateQuantity,
      clearOrder,
      getTotalAmount
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}
