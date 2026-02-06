export interface SubCategory {
  id: string | number;
  name: string;
  productId?: string | number;
}

export interface MenuItem {
  id: string;
  categoryId?: number;
  label: string;
  icon?: any; // Component or Object
  subCategories?: SubCategory[];
}
