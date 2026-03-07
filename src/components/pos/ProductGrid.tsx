'use client';

import { AppIcon } from '@/components/common/AppIcon';
import EmptyImgFood from '@/components/icons/empty-img-food';
import TopHeader from '@/components/layout/TopHeader';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { useOrderStore } from '@/stores/useOrderStore';
import { Button } from 'antd';
import Image from 'next/image';
import { useMemo } from 'react';

export default function ProductGrid() {
  const addToOrder = useOrderStore((state) => state.addToOrder);
  const activeCategoryId = useCategoryStore((state) => state.activeCategoryId);
  const activeSubCategoryId = useCategoryStore(
    (state) => state.activeSubCategoryId,
  );

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
    <div className="flex flex-col h-full">
      {/* Header */}
      <TopHeader />

      {/* Body */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-y-4 gap-x-2 p-4 pb-[90px] max-h-dvh overflow-y-auto scrollbar-width-none xl:p-[8px_8px_76px]">
        {products.map((item) => (
          <div
            key={item.id}
            onClick={() => handleProductClick(item)}
            style={{ cursor: 'pointer' }}
          >
            <div className="rounded-[16px] overflow-hidden h-[176px] relative shadow-[0px_6px_16px_-4px_#0000001a] cursor-pointer">
              {/* Card Header (Image or Icon) */}
              <div className="flex items-center justify-center h-[80px] pb-6 bg-[#119c72] rounded-b-[16px]">
                {item.type === 'drink' && (
                  <AppIcon icon={EmptyImgFood} size={32} />
                )}
                {item.type === 'food' && (
                  <Image
                    src="/default.avif"
                    fill
                    alt={item.name}
                    className="object-cover"
                  />
                )}
              </div>

              {/* Card Body */}
              <div className="rounded-t-[16px] h-[120px] absolute bottom-0 left-1/2 -translate-x-1/2 w-full bg-white flex flex-col justify-between p-[12px_12px_16px] z-10">
                {/* Title */}
                <span className="line-clamp text-[17px] font-medium leading-[22px]">
                  {item.name}
                </span>

                {/* Footer: Price & Stock */}
                <div className="flex justify-between items-center w-full h-[34px]">
                  <span className="text-[18px] font-semibold leading-[26px] text-[#005695]">
                    {item.price.toLocaleString()}
                  </span>
                  <span className="flex items-center justify-center text-[13px] leading-[18px] h-full w-[36px] rounded-full bg-[#fff7e8] text-[#624200]">
                    {item.stock}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Footer */}
      <div className="flex justify-center items-center gap-2 absolute bottom-0 left-0 w-full h-[76px] z-10 bg-white px-4 xl:h-[52px]">
        <Button
          shape="round"
          className="grow h-[44px] xl:h-[40px] border-[#119c72]! text-[#119c72]!"
        >
          Tách bàn
        </Button>
        <Button
          shape="round"
          className="grow h-[44px] xl:h-[40px] border-[#119c72]! text-[#119c72]!"
        >
          Chuyển bàn
        </Button>
      </div>
    </div>
  );
}
