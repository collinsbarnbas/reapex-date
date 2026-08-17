import { useEffect, useCallback, RefObject } from 'react';

/**
 * Hook to detect clicks outside a referenced container element.
 * Also handles Escape key to dismiss.
 * Framework-aware (React hook) but uses native DOM events internally.
 */
export function useClickOutside(
  containerRef: RefObject<HTMLElement>,
  isActive: boolean,
  onClose: () => void
) {
  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const target = e.target;
    if (!(target instanceof Node)) return;
    if (!containerRef.current.contains(target)) {
      onClose();
    }
  }, [containerRef, onClose]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (!isActive) return;

    // Use setTimeout to avoid closing on the same click that opened
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleMouseDown, true);
      document.addEventListener('keydown', handleKeyDown, true);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleMouseDown, true);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isActive, handleMouseDown, handleKeyDown]);
}
