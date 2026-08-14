# ReApexDate

> **High-performance, headless-first, WAI-ARIA compliant React Date Picker library.**

[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

---

## ✨ Features

- **Headless-First Architecture** — Pure date-math hooks decoupled from presentation
- **Zero `any` TypeScript** — Strict, precise typing throughout
- **WAI-ARIA Native** — Full keyboard navigation (Arrows, Page, Home/End, Enter/Space)
- **Tree-Shakable** — Named function exports, barrel files, `sideEffects: false`
- **3 Selection Modes** — Single, Range, and Multiple date picking
- **Framework-Agnostic Engine** — Pure math layer with zero React dependency
- **Data-Attribute Styling** — Style via CSS selectors, Tailwind, or any framework

---

## 📦 Installation

```bash
npm install reapex-date
```

**Peer Dependencies:** `react >= 18.0.0`, `react-dom >= 18.0.0`

---

## 🚀 Quick Start

### Single Date Picker

```tsx
import { useState } from 'react';
import { CalendarRoot } from 'reapex-date';
import type { UseSingleCalendarConfig } from 'reapex-date';

function MyDatePicker() {
  const [value, setValue] = useState<Date | null>(null);

  const config: UseSingleCalendarConfig = {
    mode: 'single',
    value,
    onChange: setValue,
  };

  return <CalendarRoot config={config} />;
}
```

### Range Picker

```tsx
import { CalendarRoot } from 'reapex-date';
import type { UseRangeCalendarConfig } from 'reapex-date';

const config: UseRangeCalendarConfig = {
  mode: 'range',
  value: [startDate, endDate],
  onChange: setRange,
};
```

### Multiple Picker

```tsx
import { CalendarRoot } from 'reapex-date';
import type { UseMultipleCalendarConfig } from 'reapex-date';

const config: UseMultipleCalendarConfig = {
  mode: 'multiple',
  value: selectedDates,
  onChange: setDates,
};
```

---

## 🎨 Styling

ReApexDate renders **unstyled semantic HTML** with rich `data-*` attributes. Style it however you want:

```css
/* Tailwind example */
[data-calendar-grid] td button[data-selected="true"] {
  @apply bg-blue-600 text-white rounded-full font-bold;
}

[data-calendar-grid] td button[data-in-range="true"] {
  @apply bg-blue-100 text-blue-900;
}

[data-calendar-grid] td button[data-disabled="true"] {
  @apply opacity-30 cursor-not-allowed;
}
```

### Available Data Attributes

| Attribute | Description |
|-----------|-------------|
| `data-today` | Current date |
| `data-selected` | Selected date(s) |
| `data-in-range` | Dates between range start/end |
| `data-range-start` | First date in range |
| `data-range-end` | Last date in range |
| `data-hover-range` | Hover preview in range mode |
| `data-focused` | Keyboard-focused date |
| `data-disabled` | Disabled date |
| `data-outside-month` | Trailing/leading month days |
| `data-date` | ISO date string (YYYY-MM-DD) |

---

## 🏗️ Architecture

```
src/
├── engine/          # Pure math (zero React imports)
│   ├── types.ts     # Canonical type definitions
│   └── calendar.ts  # 42-day matrix generation
├── hooks/           # Stateful React layer
│   ├── useCalendar.ts
│   └── useDatePickerKeyboard.ts
├── a11y/            # Accessibility utilities
│   ├── keyboard.ts  # WAI-ARIA key event router
│   └── focus-trap.ts
├── components/      # Presentational components
│   └── Calendar/
│       ├── CalendarRoot.tsx
│       ├── CalendarHeader.tsx
│       └── CalendarGrid.tsx
└── utils/
    └── dateAdapter.ts  # dayjs wrapper (named exports)
```

---

## 📄 License

MIT
