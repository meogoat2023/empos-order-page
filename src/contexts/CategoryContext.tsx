'use client';

import { menuItems } from '@/constants/menu';
import { SubCategory } from '@/types/menu';
import React, { createContext, useContext, useMemo, useState } from 'react';

interface CategoryContextType {
  activeCategoryId: string;
  setActiveCategoryId: (id: string) => void;
  activeSubCategoryId: string;
  setActiveSubCategoryId: (id: string) => void;
  subCategories: SubCategory[];
}

const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined,
);

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [activeCategoryId, setActiveCategoryId] = useState(menuItems[0].id);
  const [activeSubCategoryId, setActiveSubCategoryId] = useState('all');

  const subCategories = useMemo(() => {
    if (activeCategoryId === 'all') {
      const allSubs = menuItems
        .filter((item) => item.subCategories)
        .flatMap(
          (item) => item.subCategories?.filter((sub) => sub.id !== 'all') || [],
        );
      return [{ id: 'all', name: 'Tất cả' }, ...allSubs];
    }
    const selectedCategory = menuItems.find(
      (item) => item.id === activeCategoryId,
    );
    return selectedCategory?.subCategories || [];
  }, [activeCategoryId]);

  return (
    <CategoryContext.Provider
      value={{
        activeCategoryId,
        setActiveCategoryId,
        activeSubCategoryId,
        setActiveSubCategoryId,
        subCategories,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategoryContext() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error(
      'useCategoryContext must be used within a CategoryProvider',
    );
  }
  return context;
}
