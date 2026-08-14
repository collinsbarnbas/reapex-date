// ─── Floating UI Placement Hook ──────────────────────────────────────────────
// Contextual alignment positioning engine for the Date Picker overlay.
// Mitigates layout breaking in deep scroll containers by projecting dynamically
// through a portal to the document body, using floating-ui primitives to
// calculate precise pixel placements, viewport flipping, and shifting.
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo, useState, useEffect } from 'react';
import {
  useFloating,
  autoUpdate,
  flip,
  shift,
  offset as floatingOffset,
} from '@floating-ui/react';
import type { Placement, UseFloatingReturn, ReferenceType } from '@floating-ui/react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface UseDatePickerPlacementOptions {
  /** Whether the popover overlay is currently visible */
  readonly isOpen: boolean;
  /** Preferred placement of the calendar overlay relative to the trigger */
  readonly placement?: Placement;
  /** Distance in pixels between the trigger and the overlay */
  readonly offset?: number;
  /** Custom portal target node (defaults to document.body) */
  readonly portalTarget?: HTMLElement | null;
}

export interface UseDatePickerPlacementReturn {
  /** Attach this ref to the trigger input/button element */
  readonly setReferenceNode: (node: ReferenceType | null) => void;
  /** Attach this ref to the calendar popover overlay container */
  readonly setFloatingNode: (node: HTMLElement | null) => void;
  /** Calculated absolute pixel coordinates (top, left, position) to apply to the overlay */
  readonly floatingStyles: React.CSSProperties;
  /** The actual placement after flipping/shifting is calculated */
  readonly activePlacement: Placement;
  /** The DOM node to portal the overlay into */
  readonly portalNode: HTMLElement | null;
}

// ─── Hook Implementation ─────────────────────────────────────────────────────

export function useDatePickerPlacement({
  isOpen,
  placement = 'bottom-start',
  offset = 8,
  portalTarget,
}: UseDatePickerPlacementOptions): UseDatePickerPlacementReturn {
  
  // 1. Resolve Portal Target
  // Use state to ensure SSR compatibility (document is not defined on server)
  const [portalNode, setPortalNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Only resolve the portal target when the overlay is open to avoid 
    // unnecessary DOM lookups or memory retention when idle.
    if (isOpen) {
      setPortalNode(portalTarget ?? document.body);
    }
  }, [isOpen, portalTarget]);

  // 2. Initialize Floating UI Engine
  const {
    refs,
    floatingStyles,
    placement: activePlacement,
  }: UseFloatingReturn = useFloating({
    // Only run expensive coordinate updates when the overlay is visible
    open: isOpen,
    // Start with the user's preferred placement
    placement,
    // Use floating-ui middlewares to ensure the overlay stays in the viewport
    middleware: [
      // 1. Push it away from the trigger by the offset amount
      floatingOffset(offset),
      // 2. Flip to the opposite side if there's not enough room
      flip({
        fallbackAxisSideDirection: 'start',
        padding: 16,
      }),
      // 3. Shift it along the cross-axis to keep it on screen
      shift({
        padding: 16,
      }),
    ],
    // Auto-update position on window resize, scroll, or layout changes
    // Only active when `isOpen` is true
    whileElementsMounted: autoUpdate,
  });

  // 3. Expose strictly typed references and styles
  return useMemo(
    () => ({
      setReferenceNode: refs.setReference,
      setFloatingNode: refs.setFloating,
      floatingStyles,
      activePlacement,
      portalNode,
    }),
    [refs.setReference, refs.setFloating, floatingStyles, activePlacement, portalNode]
  );
}
