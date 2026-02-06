import { useRef } from 'react';

export default function useScrollIntoView<T extends HTMLElement>() {
  const itemRefs = useRef<(T | null)[]>([]);

  const scrollToView = (index: number) => {
    const ref = itemRefs.current?.[index];
    if (ref) {
      ref.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    }
  };

  return { itemRefs, scrollToView };
}
