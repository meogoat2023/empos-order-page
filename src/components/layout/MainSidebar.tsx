'use client';

import { AppIcon } from '@/components/common/AppIcon';
import { menuItems } from '@/constants/menu';
import { useCategoryStore } from '@/stores/useCategoryStore';

export default function MainSidebar() {
  const activeCategoryId = useCategoryStore((state) => state.activeCategoryId);
  const setActiveCategoryId = useCategoryStore(
    (state) => state.setActiveCategoryId,
  );

  return (
    <div
      className="min-w-(--sidebar-width) flex flex-col bg-white border-r h-full pt-2 px-2 items-center"
    >
      {menuItems.map((item) => (
        <div
          key={item.id}
          onClick={() => setActiveCategoryId(item.id)}
          className={`
            rounded-lg mb-(--margin-b-lg) cursor-pointer transition-all duration-200 w-[85px] h-[80px] min-h-[80px]
            flex flex-col items-center justify-center gap-2
            ${
              activeCategoryId === item.id
                ? 'bg-(--bg-primary) text-white'
                : 'hover:bg-(--bg-primary) hover:text-white'
            }
          `}
        >
          <div className="flex justify-center items-center">
            <AppIcon icon={item.icon} size={32} />
          </div>
          <small className="text-center text-sm-regular">{item.label}</small>
        </div>
      ))}
    </div>
  );
}
