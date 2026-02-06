'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  type: string;
}

interface OrderContextType {
  orderItems: OrderItem[];
  addToOrder: (product: Omit<OrderItem, 'qty'>) => void;
  updateQty: (id: number, qty: number) => void;
  removeItem: (id: number) => void;
  clearOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const addToOrder = useCallback((product: Omit<OrderItem, 'qty'>) => {
    setOrderItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  }, []);

  const updateQty = useCallback((id: number, qty: number) => {
    if (qty <= 0) {
      setOrderItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      setOrderItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, qty } : item)),
      );
    }
  }, []);

  const removeItem = useCallback((id: number) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearOrder = useCallback(() => {
    setOrderItems([]);
  }, []);

  return (
    <OrderContext.Provider
      value={{ orderItems, addToOrder, updateQty, removeItem, clearOrder }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrderContext() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrderContext must be used within an OrderProvider');
  }
  return context;
}
