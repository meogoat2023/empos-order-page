import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  type: string;
  note?: string;
}

interface OrderState {
  activeTabId: number;
  allOrdersMap: Map<number, OrderItem[]>;
  setActiveTabId: (tabId: number) => void;
  addToOrder: (product: Omit<OrderItem, 'qty'>) => void;
  updateQty: (id: number, qty: number) => void;
  removeItem: (id: number) => void;
  clearOrder: () => void;
  getOrderItemCount: () => number;
  getOrderItems: () => OrderItem[];
}

export const useOrderStore = create<OrderState>()(
  devtools((set, get) => ({
    activeTabId: 0,
    allOrdersMap: new Map([[0, []]]),

    setActiveTabId: (tabId) =>
      set((state) => {
        const newMap = new Map(state.allOrdersMap);
        if (!newMap.has(tabId)) {
          newMap.set(tabId, []);
        }
        return { activeTabId: tabId, allOrdersMap: newMap };
      }),

    addToOrder: (product) =>
      set((state) => {
        const currentItems = state.allOrdersMap.get(state.activeTabId) || [];
        const existing = currentItems.find((item) => item.id === product.id);

        let newItems: OrderItem[];
        if (existing) {
          newItems = currentItems.map((item) =>
            item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
          );
        } else {
          newItems = [...currentItems, { ...product, qty: 1 }];
        }

        const newMap = new Map(state.allOrdersMap);
        newMap.set(state.activeTabId, newItems);
        return { allOrdersMap: newMap };
      }),

    updateQty: (id, qty) =>
      set((state) => {
        const currentItems = state.allOrdersMap.get(state.activeTabId) || [];
        let newItems: OrderItem[];

        if (qty <= 0) {
          newItems = currentItems.filter((item) => item.id !== id);
        } else {
          newItems = currentItems.map((item) =>
            item.id === id ? { ...item, qty } : item,
          );
        }

        const newMap = new Map(state.allOrdersMap);
        newMap.set(state.activeTabId, newItems);
        return { allOrdersMap: newMap };
      }),

    removeItem: (id) =>
      set((state) => {
        const currentItems = state.allOrdersMap.get(state.activeTabId) || [];
        const newItems = currentItems.filter((item) => item.id !== id);

        const newMap = new Map(state.allOrdersMap);
        newMap.set(state.activeTabId, newItems);
        return { allOrdersMap: newMap };
      }),

    clearOrder: () =>
      set((state) => {
        const newMap = new Map(state.allOrdersMap);
        newMap.set(state.activeTabId, []);
        return { allOrdersMap: newMap };
      }),

    getOrderItemCount: () => {
      const { activeTabId, allOrdersMap } = get();
      const currentItems = allOrdersMap.get(activeTabId) || [];
      return currentItems.reduce((sum, item) => sum + item.qty, 0);
    },

    getOrderItems: () => {
      const { activeTabId, allOrdersMap } = get();
      return allOrdersMap.get(activeTabId) || [];
    },
  })),
);
