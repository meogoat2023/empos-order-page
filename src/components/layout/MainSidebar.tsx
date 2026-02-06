'use client';

import { AppIcon } from '@/components/common/AppIcon';
import { menuItems } from '@/constants/menu';
import { useCategoryContext } from '@/contexts/CategoryContext';
import styles from '@/styles/layout/MainSidebar.module.css';

export default function MainSidebar() {
  const { activeCategoryId, setActiveCategoryId } = useCategoryContext();

  return (
    <div
      className={`${styles.mainSidebar} d-flex flex-column bg-white border-end h-100 pt-2 px-2 align-items-center`}
    >
      {menuItems.map((item) => (
        <div
          key={item.id}
          onClick={() => setActiveCategoryId(item.id)}
          className={`${
            styles.item
          } d-flex flex-column align-items-center justify-content-center cursor-pointer gap-2 ${
            activeCategoryId === item.id ? styles.active : ''
          }`}
        >
          <div className="d-flex justify-content-center align-items-center">
            <AppIcon icon={item.icon} size={32} />
          </div>
          <small className="text-center text-sm-regular">{item.label}</small>
        </div>
      ))}
    </div>
  );
}
