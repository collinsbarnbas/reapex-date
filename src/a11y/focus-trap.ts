import { useEffect, RefObject } from 'react';

const FOCUSABLE_ELEMENTS_SELECTOR = 
  'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])';

/**
 * A React hook utility to securely trap keyboard Tab focus within a targeted container overlay.
 * Ideal for modal or popover interactions to meet WAI-ARIA isolation guidelines.
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement>,
  isActive: boolean
) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = container.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS_SELECTOR);
      
      // If there's nothing to focus, lock it down
      if (focusableElements.length === 0) {
        e.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) return;


      // Shift + Tab: Wrap from first back to last
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Normal Tab: Wrap from last back to first
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive, containerRef]);
}
