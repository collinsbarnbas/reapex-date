import React, { useCallback } from 'react';

export interface PresetItem {
  label: string;
  value: Date | [Date, Date];
}

export interface PresetsProps {
  presets: PresetItem[];
  onSelect: (value: Date | [Date, Date]) => void;
  className?: string;
}

/**
 * Clickable preset chip list for quick date/range selection.
 * Renders alongside the calendar for "Today", "Last 7 days", etc.
 */
export const Presets: React.FC<PresetsProps> = ({
  presets,
  onSelect,
  className
}) => {
  const handleClick = useCallback((preset: PresetItem) => {
    onSelect(preset.value);
  }, [onSelect]);

  if (presets.length === 0) return null;

  return (
    <div
      className={className}
      data-presets=""
      role="group"
      aria-label="Quick selections"
    >
      {presets.map((preset, index) => (
        <button
          key={index}
          type="button"
          onClick={() => handleClick(preset)}
          data-preset=""
          data-preset-index={index}
          aria-label={preset.label}
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
};

Presets.displayName = 'Presets';
