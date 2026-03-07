import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { menuItems } from '@/constants/menu';
import { SubCategory } from '@/types/menu';

interface CategoryState {
  activeCategoryId: string;
  activeSubCategoryId: string;
  subCategories: SubCategory[];
  setActiveCategoryId: (id: string) => void;
  setActiveSubCategoryId: (id: string) => void;
}

const getSubCategories = (categoryId: string): SubCategory[] => {
  if (categoryId === 'all') {
    const allSubs = menuItems
      .filter((item) => item.subCategories)
      .flatMap(
        (item) => item.subCategories?.filter((sub) => sub.id !== 'all') || [],
      );
    return [{ id: 'all', name: 'Tất cả' }, ...allSubs];
  }
  const selectedCategory = menuItems.find((item) => item.id === categoryId);
  return selectedCategory?.subCategories || [];
};

export const useCategoryStore = create<CategoryState>()(
  devtools((set) => ({
    activeCategoryId: menuItems[0].id,
    activeSubCategoryId: 'all',
    subCategories: getSubCategories(menuItems[0].id),
    setActiveCategoryId: (id) =>
      set({
        activeCategoryId: id,
        subCategories: getSubCategories(id),
        activeSubCategoryId: 'all', // Reset sub category when category changes
      }),
    setActiveSubCategoryId: (id) => set({ activeSubCategoryId: id }),
  })),
);
