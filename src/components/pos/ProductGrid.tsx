'use client';

import { AppIcon } from '@/components/common/AppIcon';
import EmptyImgFood from '@/components/icons/empty-img-food';
import TopHeader from '@/components/layout/TopHeader';
import { useCategoryContext } from '@/contexts/CategoryContext';
import { useOrderContext } from '@/contexts/OrderContext';
import styles from '@/styles/pos/ProductGrid.module.css';
import { Button } from 'antd';
import Image from 'next/image';
import { useMemo } from 'react';

export default function ProductGrid() {
  const { addToOrder } = useOrderContext();
  const { activeCategoryId, activeSubCategoryId } = useCategoryContext();

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
          note: 'Ít cơm, sườn nướng cháy cạnh vừa phải, không ngọt, không mặn; bì ít thính; chả trứng cắt mỏng; ',
        })),
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const products = useMemo(() => {
    let filtered = allProducts;

    if (activeCategoryId !== 'all') {
      filtered = filtered.filter(
        (product) => product.type === activeCategoryId,
      );
    }

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
      note: product.note,
    });
  };

  return (
    <div className="d-flex flex-column h-100">
      {/* Header */}
      <TopHeader />

      {/* Body */}
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
                  <Image
                    src="/default.avif"
                    fill
                    alt={item.name}
                    className={styles.cardImg}
                  />
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
      {/* Footer */}
      <div className={styles.footer}>
        <Button shape="round" className="flex-grow-1">
          Tách bàn
        </Button>
        <Button shape="round" className="flex-grow-1">
          Chuyển bàn
        </Button>
      </div>
    </div>
  );
}
