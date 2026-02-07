'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';

export const MAX_ITEMS_PER_ORDER = 10;

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  type: string;
  note?: string;
}

interface OrderContextType {
  activeTabId: number;
  orderItems: OrderItem[];
  allOrdersMap: Map<number, OrderItem[]>;
  addToOrder: (product: Omit<OrderItem, 'qty'>) => void;
  updateQty: (id: number, qty: number) => void;
  removeItem: (id: number) => void;
  clearOrder: () => void;
  setActiveTabId: (tabId: number) => void;
  getOrderItemCount: () => number;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [activeTabId, setActiveTabIdState] = useState<number>(0);
  const [allOrdersMap, setAllOrdersMap] = useState<Map<number, OrderItem[]>>(
    () => new Map([[0, []]]),
  );

  const orderItems = allOrdersMap.get(activeTabId) || [];

  const setActiveTabId = useCallback((tabId: number) => {
    setActiveTabIdState(tabId);
    setAllOrdersMap((prev) => {
      if (!prev.has(tabId)) {
        const newMap = new Map(prev);
        newMap.set(tabId, []);
        return newMap;
      }
      return prev;
    });
  }, []);

  const addToOrder = useCallback(
    (product: Omit<OrderItem, 'qty'>) => {
      setAllOrdersMap((prev) => {
        const currentItems = prev.get(activeTabId) || [];
        const existing = currentItems.find((item) => item.id === product.id);

        let newItems: OrderItem[];
        if (existing) {
          newItems = currentItems.map((item) =>
            item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
          );
        } else {
          newItems = [...currentItems, { ...product, qty: 1 }];
        }

        const newMap = new Map(prev);
        newMap.set(activeTabId, newItems);
        return newMap;
      });
    },
    [activeTabId],
  );

  const updateQty = useCallback(
    (id: number, qty: number) => {
      setAllOrdersMap((prev) => {
        const currentItems = prev.get(activeTabId) || [];
        let newItems: OrderItem[];

        if (qty <= 0) {
          newItems = currentItems.filter((item) => item.id !== id);
        } else {
          newItems = currentItems.map((item) =>
            item.id === id ? { ...item, qty } : item,
          );
        }

        const newMap = new Map(prev);
        newMap.set(activeTabId, newItems);
        return newMap;
      });
    },
    [activeTabId],
  );

  const removeItem = useCallback(
    (id: number) => {
      setAllOrdersMap((prev) => {
        const currentItems = prev.get(activeTabId) || [];
        const newItems = currentItems.filter((item) => item.id !== id);

        const newMap = new Map(prev);
        newMap.set(activeTabId, newItems);
        return newMap;
      });
    },
    [activeTabId],
  );

  const clearOrder = useCallback(() => {
    setAllOrdersMap((prev) => {
      const newMap = new Map(prev);
      newMap.set(activeTabId, []);
      return newMap;
    });
  }, [activeTabId]);

  const getOrderItemCount = useCallback(() => {
    const currentItems = allOrdersMap.get(activeTabId) || [];
    return currentItems.reduce((sum, item) => sum + item.qty, 0);
  }, [allOrdersMap, activeTabId]);

  return (
    <OrderContext.Provider
      value={{
        activeTabId,
        orderItems,
        allOrdersMap,
        addToOrder,
        updateQty,
        removeItem,
        clearOrder,
        setActiveTabId,
        getOrderItemCount,
      }}
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
