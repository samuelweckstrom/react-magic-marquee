import { useEffect, useState, useCallback } from 'react';

export type ContentItem = {
  content: string;
  type?: 'text' | 'image' | 'video' | 'iframe' | string;
};

export type MarqueeItem = {
  id: string;
  content: string;
  deleteItem: () => void;
  removeProperty: (property: string) => void;
  setProperty: (property: string, value: unknown) => void;
  type: 'text' | 'image' | 'video' | 'iframe';
} & Record<string, unknown>;

const itemsMap = new Map();

const generateUniqueId = () => `${Math.random().toString(36).substring(7)}`;

export function useMarqueContent(
  content: ContentItem[],
  transitionDuration: number
) {
  const [visible, setVisible] = useState<MarqueeItem[]>([]);
  const [itemsInTransition, setItemsInTransition] = useState<string[]>([]);
  const updateVisibleItems = useCallback(() => {
    const visibleItems = Array.from(itemsMap.values());
    setVisible(visibleItems);
  }, []);

  const deleteItem = useCallback(
    (id: string) => {
      const removeAndUpdate = () => {
        itemsMap.delete(id);
        updateVisibleItems();
      };
      if (transitionDuration) {
        setItemsInTransition((prev) => [...prev, id]);
        setTimeout(removeAndUpdate, transitionDuration);
      } else {
        removeAndUpdate();
      }
    },
    [updateVisibleItems]
  );

  const setProperty = useCallback(
    (id: string, property: string, value: unknown) => {
      const item = itemsMap.get(id);
      itemsMap.set(id, {
        ...item,
        [property]: value,
      });
      updateVisibleItems();
    },
    [updateVisibleItems]
  );

  const removeProperty = useCallback(
    (id: string, property: string) => {
      const item = itemsMap.get(id);
      delete item[property];
      itemsMap.set(id, { ...item });
      updateVisibleItems();
    },
    [updateVisibleItems]
  );

  const deleteItemFor = useCallback(
    (id: string) => () => deleteItem(id),
    [deleteItem]
  );

  const setPropertyFor = useCallback(
    (id: string) => (property: string, value: unknown) =>
      setProperty(id, property, value),
    [setProperty]
  );

  const removePropertyFor = useCallback(
    (id: string) => (property: string) => removeProperty(id, property),
    [removeProperty]
  );

  useEffect(() => {
    if (!visible.length) {
      content.forEach((item: ContentItem) => {
        const id = generateUniqueId();
        itemsMap.set(id, {
          ...item,
          id,
        });
      });
      updateVisibleItems();
    }
  }, [content, updateVisibleItems]);

  return {
    deleteItemFor,
    removePropertyFor,
    setPropertyFor,
    updateVisibleItems,
    itemsInTransition,
    visible,
  };
}
