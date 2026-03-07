'use client';

import { useDragScroll } from '@/hooks/useDragScroll';
import useScrollIntoView from '@/hooks/useScrollIntoView';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { SearchOutlined } from '@ant-design/icons';
import { Divider } from 'antd';
import React from 'react';
import { useShallow } from 'zustand/react/shallow';

export default function TopHeader() {
  const scrollRef = useDragScroll<HTMLDivElement>();
  const {
    subCategories,
    activeSubCategoryId,
    setActiveSubCategoryId,
    activeCategoryId,
  } = useCategoryStore(
    useShallow((state) => ({
      subCategories: state.subCategories,
      activeSubCategoryId: state.activeSubCategoryId,
      setActiveSubCategoryId: state.setActiveSubCategoryId,
      activeCategoryId: state.activeCategoryId,
    })),
  );
  const { itemRefs, scrollToView } = useScrollIntoView<HTMLSpanElement>();

  React.useEffect(() => {
    setActiveSubCategoryId('all');
    scrollToView(0);
  }, [activeCategoryId, scrollToView, setActiveSubCategoryId]);

  return (
    <div className="h-[56px] xl:h-[48px] flex-none bg-white border-b flex items-center gap-2">
      {/* Search */}
      <div className={`flex w-1/2 px-3 gap-2`}>
        <SearchOutlined style={{ fontSize: '16px', padding: '4px' }} />
        <input placeholder="Tìm kiếm món" className="title-sm-medium" />
      </div>

      <Divider orientation="vertical" className="absolute h-full" />

      {/* Sub category */}
      <div
        className="flex gap-[8px] overflow-x-auto scrollbar-width-none touch-pan-x cursor-grab w-1/2 pr-3"
        ref={scrollRef}
      >
        {subCategories.map((item, index) => (
          <span
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            key={item.id}
            onClick={() => {
              setActiveSubCategoryId(item.id.toString());
              scrollToView(index);
            }}
            className={`
              w-fit cursor-pointer pointer-events-auto transition-all duration-200 rounded-md whitespace-nowrap h-[36px] px-[14px] py-[4px]
              flex items-center justify-center text-md-semibold border
              ${
                item.id.toString() === activeSubCategoryId
                  ? 'text-(--color-primary) border-(--color-primary) bg-(--bg-sematic-success-subtle)'
                  : 'text-(--neutral-secondary) border-(--neutral-inverse-tertiary) hover:bg-(--bg-sematic-success-subtle) hover:border-(--color-primary)'
              }
            `}
          >
            {item.name}
          </span>
        ))}
      </div>
    </div>
  );
}
