import { useCallback, useRef, useEffect } from 'react';

type LongPressOptions = {
  threshold?: number;
  onStart?: () => void;
  onCancel?: () => void;
};

export function useLongPress(
  callback: () => void,
  { threshold = 300, onStart, onCancel }: LongPressOptions = {}
) {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const isLongPressActive = useRef(false);
  const isCancelled = useRef(false);

  const start = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    isLongPressActive.current = false;
    isCancelled.current = false;
    
    timeoutRef.current = setTimeout(() => {
      if (!isCancelled.current) {
        isLongPressActive.current = true;
        onStart?.();
      }
    }, threshold);
  }, [threshold, onStart]);

  const clear = useCallback((shouldTriggerCallback = false) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (isLongPressActive.current && shouldTriggerCallback) {
      callback();
    } else if (!isLongPressActive.current) {
      onCancel?.();
    }
    
    isLongPressActive.current = false;
  }, [callback, onCancel]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    onMouseDown: start,
    onMouseUp: () => clear(true),
    onMouseLeave: () => clear(false),
    onTouchStart: start,
    onTouchEnd: () => clear(true),
    onTouchCancel: () => clear(false),
  };
}
