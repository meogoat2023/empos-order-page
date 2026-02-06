'use client';

import { AppIcon } from '@/components/common/AppIcon';
import EmptyImgFood from '@/components/icons/empty-img-food';
import TopHeader from '@/components/layout/TopHeader';
import { useCategoryContext } from '@/contexts/CategoryContext';
import { useOrderContext } from '@/contexts/OrderContext';
import styles from '@/styles/pos/ProductGrid.module.css';
import Image from 'next/image';
import { useMemo } from 'react';

export default function ProductGrid() {
  const { addToOrder } = useOrderContext();
  const { activeCategoryId, activeSubCategoryId } = useCategoryContext();

  // Products with category and subcategory (matching menu.ts subcategories)
  const productData = {
    drink: {
      beverage: [
        'Cà phê sữa đá',
        'Cà phê đen đá',
        'Trà sữa trân châu đường đen',
        'Trà xanh matcha',
      ],
      juice: ['Nước ép cam', 'Sinh tố bơ', 'Sinh tố dâu', 'Nước mía'],
      water: ['Soda chanh', 'Trà đào cam sả'],
    },
    food: {
      beef: ['Phở bò tái nạm', 'Bún bò huế đặc biệt'],
      chicken: ['Cơm gà xối mỡ', 'Bún chả Hà Nội'],
      pork: ['Cơm tấm sườn bì chả', 'Bánh mì thịt nướng', 'Bánh cuốn nóng'],
      seafood: ['Hủ tiếu Nam Vang', 'Mì xào hải sản', 'Cơm chiên dương châu'],
    },
    'fast-food': {
      burger: ['Burger bò phô mai', 'Burger gà', 'Hotdog xúc xích'],
      pizza: ['Pizza hải sản', 'Pizza pepperoni'],
      sandwich: [
        'Sandwich gà',
        'Sandwich trứng',
        'Khoai tây chiên',
        'Gà rán giòn',
        'Onion rings',
      ],
    },
  };

  // Generate all products with subcategory
  const allProducts = useMemo(() => {
    const categories = ['drink', 'food', 'fast-food'] as const;
    let productId = 1;

    return categories.flatMap((type) =>
      Object.entries(productData[type]).flatMap(([subCategory, names]) =>
        names.map((name) => ({
          id: productId++,
          name,
          price: Math.floor(Math.random() * 50 + 10) * 1000, // 10k - 60k
          stock: Math.floor(Math.random() * 200),
          type,
          subCategory,
        })),
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only generate once

  // Filter products based on selected category and subcategory
  const products = useMemo(() => {
    let filtered = allProducts;

    // Filter by category
    if (activeCategoryId !== 'all') {
      filtered = filtered.filter(
        (product) => product.type === activeCategoryId,
      );
    }

    // Filter by subcategory
    if (activeSubCategoryId !== 'all') {
      filtered = filtered.filter(
        (product) => product.subCategory === activeSubCategoryId,
      );
    }

    return filtered;
  }, [activeCategoryId, activeSubCategoryId, allProducts]);

  const handleProductClick = (product: (typeof products)[0]) => {
    addToOrder({
      id: product.id,
      name: product.name,
      price: product.price,
      type: product.type,
    });
  };

  return (
    <div className="d-flex flex-column h-100">
      {/* Header: Tìm kiếm & Filter */}
      <TopHeader />

      {/* Body: Lưới sản phẩm */}
      <div className={styles.productCard}>
        {products.map((item) => (
          <div
            key={item.id}
            onClick={() => handleProductClick(item)}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.card}>
              {/* Card Header (Image or Icon) */}
              <div className={styles.cardHeader}>
                {item.type === 'drink' && (
                  <AppIcon icon={EmptyImgFood} size={32} />
                )}
                {item.type === 'food' && (
                  <Image src="" alt={item.name} className={styles.cardImg} />
                )}
              </div>

              {/* Card Body */}
              <div className={styles.cardBody}>
                {/* Title */}
                <span className="line-clamp">{item.name}</span>

                {/* Footer: Price & Stock */}
                <div className={styles.cardBodyPriceStock}>
                  <span>{item.price.toLocaleString()}</span>
                  <span className="rounded-circle">{item.stock}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
