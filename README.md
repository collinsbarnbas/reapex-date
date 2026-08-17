# ReApexDate

> **High-performance, headless-first, WAI-ARIA compliant React Date Picker library.**

[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

---

## ✨ Features

- **Headless-First Architecture** — Pure date-math hooks decoupled from presentation
- **Zero `any` TypeScript** — Strict, precise typing throughout
- **WAI-ARIA Native** — Full keyboard navigation, Focus Trapping, and screen reader labels
- **3 Selection Modes** — Single, Range, and Multiple date picking
- **Time & DateTime** — Includes `TimePicker` and combined `DateTimePicker`
- **Internationalization (i18n)** — 8 built-in locales with auto-RTL support
- **Month & Year Views** — Quick navigation via decade/year grids
- **Custom Rendering** — `renderDay` and `renderFooter` injection
- **Data-Attribute Styling** — Style via CSS selectors, Tailwind, or any framework

---

## 📦 Installation

```bash
npm install reapex-date
```

**Peer Dependencies:** `react >= 18.0.0`, `react-dom >= 18.0.0`

---

## 🚀 Quick Start

### 1. DatePicker with Popover (Input Box)

```tsx
import { useState } from 'react';
import { DatePickerInput, en } from 'reapex-date';

function MyDatePicker() {
  const [value, setValue] = useState<Date | null>(null);

  return (
    <DatePickerInput 
      config={{ mode: 'single', value, onChange: setValue }} 
      locale={en}
      placeholder="Select date..." 
    />
  );
}
```

### 2. DateTime Picker with Input

```tsx
import { useState } from 'react';
import { DateTimePickerInput } from 'reapex-date';

function MyDateTimePicker() {
  const [value, setValue] = useState<Date | null>(null);

  return (
    <DateTimePickerInput 
      value={value} 
      onChange={setValue} 
      use12Hour={true}      // 12h with AM/PM
      showSeconds={true}    // Include seconds column
      minuteStep={5}        // 5-minute intervals
      okText="Confirm"      // Custom OK button text
      placeholder="Pick date & time..."
    />
  );
}
```

### 3. Range Picker

```tsx
import { useState } from 'react';
import { DatePickerInput } from 'reapex-date';

function MyRangePicker() {
  const [value, setValue] = useState<[Date | null, Date | null]>([null, null]);

  return (
    <DatePickerInput 
      config={{ mode: 'range', value, onChange: setValue }} 
      format="DD/MM/YYYY"
    />
  );
}
```

### 4. Inline Calendar with Multi-Select

```tsx
import { useState } from 'react';
import { CalendarRoot } from 'reapex-date';

function MyCalendar() {
  const [value, setValue] = useState<Date[]>([]);

  return (
    <CalendarRoot 
      config={{ mode: 'multiple', value, onChange: setValue }} 
    />
  );
}
```

---

## 🌍 Locales & i18n

ReApexDate comes with 8 built-in locales: `en`, `es`, `fr`, `de`, `ja`, `zh`, `ar` (RTL), `hi`.

```tsx
import { DatePickerInput, ar } from 'reapex-date';

// The arabic locale automatically sets `dir="rtl"` and weekStartsOn=6 (Saturday)
<DatePickerInput config={config} locale={ar} />
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

### Core Data Attributes

| Attribute | Description |
|-----------|-------------|
| `data-today` | Current date |
| `data-selected` | Selected date(s) |
| `data-in-range` | Dates between range start/end |
| `data-range-start` | First date in range |
| `data-range-end` | Last date in range |
| `data-view="day\|month\|year"` | Current calendar view |
| `data-time-cell` | Target time picker cells |

---

## 🏗️ Architecture

```
src/
├── engine/              # Pure math (zero React imports)
├── hooks/               # Stateful React layer
├── a11y/                # Accessibility utilities
├── locales/             # i18n configurations
├── components/          # Presentational components
│   ├── Calendar/        # CalendarRoot, Header, Grid, MonthView, YearView
│   ├── DatePickerInput/ # Input + popover for date selection
│   ├── TimePicker/      # Scrollable hour/min/sec columns
│   ├── DateTimePicker/  # Inline calendar + time picker
│   └── DateTimePickerInput/ # Input + popover for date+time
└── utils/
```

---

## 📄 License

MIT
