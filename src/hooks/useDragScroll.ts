import { useEffect, useRef } from 'react';

export function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let isDown = false;
    let hasMoved = false;
    let startX = 0;
    let scrollLeft = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDown = true;
      hasMoved = false;
      startX = e.clientX;
      scrollLeft = el.scrollLeft;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDown) return;

      const deltaX = e.clientX - startX;

      if (!hasMoved && Math.abs(deltaX) > 5) {
        hasMoved = true;
        el.setPointerCapture(e.pointerId);
      }

      if (hasMoved) {
        el.scrollLeft = scrollLeft - deltaX;
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (hasMoved) {
        el.releasePointerCapture(e.pointerId);
      }
      isDown = false;
      hasMoved = false;
    };

    const onClick = (e: MouseEvent) => {
      if (hasMoved) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', onPointerUp);
    el.addEventListener('pointercancel', onPointerUp);
    el.addEventListener('click', onClick, true);

    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('pointercancel', onPointerUp);
      el.removeEventListener('click', onClick, true);
    };
  }, []);

  return ref;
}
