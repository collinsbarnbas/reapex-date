import { useState, useMemo, useCallback, useRef } from 'react';
import { useFloating, offset, flip, shift, autoUpdate, FloatingPortal } from '@floating-ui/react';

export interface UseDatePickerPopoverReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  referenceRef: (node: HTMLElement | null) => void;
  floatingRef: (node: HTMLElement | null) => void;
  floatingStyles: React.CSSProperties;
}

/**
 * Manages popover positioning and open/close state for the DatePicker input.
 * Wraps @floating-ui/react with sensible defaults.
 */
export function useDatePickerPopover(): UseDatePickerPopoverReturn {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom-start',
    middleware: [
      offset(4),
      flip({ fallbackPlacements: ['top-start', 'bottom-end', 'top-end'] }),
      shift({ padding: 8 })
    ],
    whileElementsMounted: autoUpdate
  });

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  return useMemo(() => ({
    isOpen,
    open,
    close,
    toggle,
    referenceRef: refs.setReference,
    floatingRef: refs.setFloating,
    floatingStyles
  }), [isOpen, open, close, toggle, refs.setReference, refs.setFloating, floatingStyles]);
}
