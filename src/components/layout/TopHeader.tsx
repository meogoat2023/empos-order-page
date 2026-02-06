'use client';

import { useCategoryContext } from '@/contexts/CategoryContext';
import useScrollIntoView from '@/hooks/useScrollIntoView';
import styles from '@/styles/layout/TopHeader.module.css';
import { SearchOutlined } from '@ant-design/icons';
import { Divider } from 'antd';
import React from 'react';

export default function TopHeader() {
  const {
    subCategories,
    activeSubCategoryId,
    setActiveSubCategoryId,
    activeCategoryId,
  } = useCategoryContext();
  const { itemRefs, scrollToView } = useScrollIntoView<HTMLSpanElement>();

  React.useEffect(() => {
    setActiveSubCategoryId('all');
    scrollToView(0);
  }, [activeCategoryId, scrollToView, setActiveSubCategoryId]);

  return (
    <div
      className={`${styles.topHeader} bg-white border-bottom d-flex align-items-center gap-2`}
    >
      {/* Search */}
      <div className={`d-flex w-50 px-3 gap-2`}>
        <SearchOutlined style={{ fontSize: '16px', padding: '4px' }} />
        <input placeholder="Tìm kiếm món" className="title-sm-medium" />
      </div>

      <Divider orientation="vertical" className="absolute h-100" />

      {/* Sub category */}
      <div
        className={`${styles.disableScroll} d-flex gap-2 overflow-auto w-50 pe-3`}
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
            className={`${styles.subItem} ${item.id.toString() === activeSubCategoryId ? styles.active : styles.inactive} d-flex align-items-center justify-content-center text-md-semibold`}
          >
            {item.name}
          </span>
        ))}
      </div>
    </div>
  );
}
