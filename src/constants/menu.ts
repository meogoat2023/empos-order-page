import AllIcon from '@/components/icons/all';
import DrinkIcon from '@/components/icons/drink';
import FastFood from '@/components/icons/fast-food';
import FoodIcon from '@/components/icons/food';
import { MenuItem } from '@/types/menu';

export const menuItems: MenuItem[] = [
  { id: 'all', label: 'Tất cả', icon: AllIcon },
  {
    id: 'food',
    categoryId: 1,
    label: 'Đồ ăn',
    icon: FoodIcon,
    subCategories: [
      { id: 'all', name: 'Tất cả' },
      { id: 'beef', name: 'Bò' },
      { id: 'chicken', name: 'Gà' },
      { id: 'pork', name: 'Lợn' },
      { id: 'seafood', name: 'Hải sản' },
    ],
  },
  {
    id: 'drink',
    categoryId: 2,
    label: 'Đồ uống',
    icon: DrinkIcon,
    subCategories: [
      { id: 'all', name: 'Tất cả' },
      { id: 'beverage', name: 'Đồ uống' },
      { id: 'juice', name: 'Nước ép' },
      { id: 'water', name: 'Nước' },
    ],
  },
  {
    id: 'fast-food',
    categoryId: 3,
    label: 'Đồ ăn nhanh',
    icon: FastFood,
    subCategories: [
      { id: 'all', name: 'Tất cả' },
      { id: 'burger', name: 'Burger' },
      { id: 'pizza', name: 'Pizza' },
      { id: 'sandwich', name: 'Sandwich' },
    ],
  },
];
