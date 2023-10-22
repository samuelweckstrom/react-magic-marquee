import React, {
  useState,
  useRef,
  useMemo,
  useEffect,
  useCallback,
} from 'react';
import { useResizeObserver } from './useResizeObserver';
import { useMarqueContent } from './useMarqueeContent';
import './styles.css';
import type { ContentItem, MarqueeItem } from './useMarqueeContent';

type MarqueeProps = {
  animationDelay?: number;
  animationDuration?: number;
  animationIterationCount?: number;
  className?: string;
  content: ContentItem[];
  direction?: 'left' | 'right' | 'up' | 'down';
  imageContent?: string[];
  onAnimationEnd?: () => void;
  onAnimationIteration?: () => void;
  onAnimationStart?: () => void;
  onMount?: () => void;
  pauseOnClick?: boolean;
  pauseOnHover?: boolean;
  play?: boolean;
  renderItem?: (item: MarqueeItem) => React.ReactNode;
  textContent?: string[];
  textElementType?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  transitionClassName?: string;
  transitionDuration?: number;
};

function Marquee({
  animationDelay = 0,
  animationDuration = 10,
  animationIterationCount = 0,
  className = '',
  content = [],
  direction = 'left',
  imageContent = [],
  onAnimationEnd,
  onAnimationIteration,
  onAnimationStart,
  pauseOnClick = false,
  pauseOnHover = false,
  renderItem,
  textContent = [],
  textElementType = 'p',
  transitionDuration = 0,
}: MarqueeProps) {
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const itemsRef2 = useRef<HTMLDivElement>(null);

  const {
    visible,
    updateVisibleItems,
    deleteItemFor,
    setPropertyFor,
    removePropertyFor,
    itemsInTransition,
  } = useMarqueContent(content, transitionDuration);

  const { itemsWidth, parentDimensions } = useResizeObserver(
    containerRef,
    itemsRef
  );

  const duration = useMemo(() => {
    return parseInt((itemsWidth / (100 / animationDuration) / 100).toString());
  }, [itemsWidth, animationDuration]);

  useEffect(() => {
    updateVisibleItems();
  }, [direction]);

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const isVertical = direction === 'up' || direction === 'down';

  const styles = {
    '--animationDirection':
      direction === 'up' || direction === 'left' ? 'normal' : 'reverse',
    '--width': isVertical ? `${parentDimensions.height}px` : '100%',
    '--height': isVertical ? `${parentDimensions.width}px` : '100%',
    '--transformContainer': isVertical ? 'rotate(90deg)' : 'none',
    '--transformItems': isVertical ? 'rotate(-90deg)' : 'none',
    '--transformOrigin': isVertical ? 'left bottom' : 'none',
    '--transform': isVertical
      ? 'translate3d(0, -100%, 0) var(--transformContainer)'
      : 'none',
    '--animationDelay': animationDelay,
    '--animationIterationCount': animationIterationCount || 'infinite',
  };

  const itemStyles = {
    '--animationPlayState': isPaused ? 'paused' : 'running',
    '--animationDuration': duration + 's',
  };

  const renderItems = useCallback(() => {
    if (renderItem) {
      return visible.map((item, index) => {
        return renderItem({
          ...item,
          deleteItem: deleteItemFor(item.id),
          setProperty: setPropertyFor(item.id),
          removeProperty: removePropertyFor(item.id),
          isTransitioning: itemsInTransition.includes(item.id),
        });
      });
    }
    if (imageContent.length) {
      return imageContent.map((imageUrl) => <img src={imageUrl} alt="" />);
    }
    if (textContent.length) {
      const ElementType = textElementType || 'p';
      return textContent.map((text) => <ElementType>{text}</ElementType>);
    }
    return undefined;
  }, [
    renderItem,
    visible,
    deleteItemFor,
    setPropertyFor,
    removePropertyFor,
    imageContent,
    textContent,
    textElementType,
  ]);

  return (
    <div
      ref={containerRef}
      className={'marquee__container ' + className}
      onClick={pauseOnClick ? togglePause : undefined}
      style={styles}
      onAnimationStart={onAnimationStart}
      onAnimationEnd={onAnimationEnd}
      onAnimationIteration={onAnimationIteration}
      onMouseLeave={pauseOnHover ? togglePause : undefined}
      onMouseEnter={pauseOnHover ? togglePause : undefined}
    >
      <div className="marquee__items" ref={itemsRef} style={itemStyles}>
        {renderItems()}
      </div>
      <div className="marquee__items" ref={itemsRef2} style={itemStyles}>
        {renderItems()}
      </div>
    </div>
  );
}

const MemoizedMarquee = React.memo(Marquee);

export default MemoizedMarquee;
export { MemoizedMarquee as Marquee };
