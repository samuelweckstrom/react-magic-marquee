import { useEffect, useState } from 'react';

export function useResizeObserver(
  containerRef: React.RefObject<HTMLDivElement>,
  itemsRef: React.RefObject<HTMLDivElement>
) {
  const [parentDimensions, setParentDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [itemsWidth, setItemsWidth] = useState(0);

  useEffect(() => {
    let resizeObserver: ResizeObserver;
    if (containerRef.current) {
      resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          if (entry.target === containerRef.current?.parentNode) {
            const width = (containerRef.current.parentNode as HTMLElement)
              ?.offsetWidth;
            const height = (containerRef.current.parentNode as HTMLElement)
              ?.offsetHeight;
            setParentDimensions({ width, height });
          } else if (entry.target === itemsRef.current) {
            setItemsWidth(entry.contentRect.width);
          }
        }
      });
      if (containerRef.current && resizeObserver) {
        resizeObserver.observe(containerRef.current.parentNode as HTMLElement);
      }

      if (itemsRef.current) resizeObserver.observe(itemsRef.current);
    }
    return () => {
      if (resizeObserver) {
        if (containerRef.current) {
          resizeObserver.unobserve(containerRef.current);
        }
        if (itemsRef.current) {
          resizeObserver.unobserve(itemsRef.current);
        }
        resizeObserver.disconnect();
      }
    };
  }, []);

  return { parentDimensions, itemsWidth };
}
