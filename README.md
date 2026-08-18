# ReApex**Date**

> **A headless, accessible, and highly customizable React Date & Time Picker for modern applications.**

[![npm](https://img.shields.io/badge/npm-reapex--date-red)](https://www.npmjs.com/package/reapex-date)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Bundle Size](https://img.shields.io/badge/gzip-~15KB-brightgreen)]()

<!-- Replace with your screen recording GIF -->
<!-- ![ReApexDate Demo](./demo.gif) -->

[**Live Playground**](#) · [**npm**](https://www.npmjs.com/package/reapex-date) · [**GitHub**](https://github.com/collinsbarnbas/reapex-date)

---

## Why ReApexDate?

Most datepickers force their design on your app. **ReApexDate doesn't.**

It handles the hard parts — you control the look and feel.

### ReApexDate handles:
✅ Date calculations & calendar math  
✅ Single / Range / Multi-select logic  
✅ Date + Time with seconds precision  
✅ Keyboard navigation (arrow keys, Enter, Escape)  
✅ WAI-ARIA accessibility & focus trapping  
✅ 8 built-in locales with auto-RTL  
✅ Min/max dates, disabled dates  

### YOU control:
🎨 Design & colors  
🎨 CSS framework (Tailwind, vanilla, anything)  
🎨 Layout & spacing  
🎨 Typography & branding  
🎨 Component structure  

Style everything through **`data-*` attributes** — no CSS imports, no style overrides, no `!important` hacks.

---

## 📦 Install

```bash
npm install reapex-date
```

**Peer deps:** `react >= 18.0.0`, `react-dom >= 18.0.0`

---

## ⚡ 30-Second Quick Start

```tsx
import { useState } from 'react';
import { DatePickerInput } from 'reapex-date';

function App() {
  const [date, setDate] = useState<Date | null>(null);

  return (
    <DatePickerInput
      config={{ mode: 'single', value: date, onChange: setDate }}
      placeholder="Pick a date..."
      allowClear
    />
  );
}
```

That's it. No CSS import. No theme provider. Just works.

---

## 🎯 What Can You Build?

### Single Date Picker
```tsx
<DatePickerInput
  config={{ mode: 'single', value, onChange: setValue }}
  locale={en}
  placeholder="Select date..."
/>
```

### Date Range Picker
```tsx
<DatePickerInput
  config={{ mode: 'range', value: range, onChange: setRange }}
  format="DD/MM/YYYY"
  placeholder="Start → End"
/>
```

### DateTime Picker (with Input + Popover)
```tsx
<DateTimePickerInput
  value={dateTime}
  onChange={setDateTime}
  use12Hour            // 12h with AM/PM
  showSeconds          // HH:MM:SS precision
  minuteStep={5}       // 5-min intervals
  okText="Confirm"
/>
```

### Multi-Select Calendar
```tsx
<CalendarRoot
  config={{ mode: 'multiple', value: dates, onChange: setDates }}
  renderFooter={() => <span>{dates.length} selected</span>}
/>
```

### Localized (RTL Arabic)
```tsx
import { ar } from 'reapex-date';

<DatePickerInput config={config} locale={ar} />
// Automatically sets dir="rtl", Arabic month/day names, Saturday start
```

---

## 🌍 Built-in Locales

| Locale | Code | Direction | Week Start |
|--------|------|-----------|------------|
| English | `en` | LTR | Sunday |
| Hindi | `hi` | LTR | Sunday |
| French | `fr` | LTR | Monday |
| German | `de` | LTR | Monday |
| Spanish | `es` | LTR | Monday |
| Japanese | `ja` | LTR | Sunday |
| Chinese | `zh` | LTR | Monday |
| Arabic | `ar` | **RTL** | Saturday |

---

## 🎨 Styling with Data Attributes

ReApexDate renders **unstyled semantic HTML**. Style it with any CSS framework:

```css
/* Selected date */
[data-calendar-grid] td button[data-selected="true"] {
  background: #2563eb;
  color: white;
  border-radius: 50%;
}

/* Today */
[data-calendar-grid] td button[data-today="true"] {
  outline: 2px solid #3b82f6;
  font-weight: bold;
}

/* Range highlight */
[data-calendar-grid] td button[data-in-range="true"] {
  background: #dbeafe;
}

/* Disabled */
[data-calendar-grid] td button[data-disabled="true"] {
  opacity: 0.3;
  cursor: not-allowed;
}
```

### All Data Attributes

| Attribute | Element | Description |
|-----------|---------|-------------|
| `data-selected` | Day button | Currently selected |
| `data-today` | Day button | Today's date |
| `data-in-range` | Day button | Between range start/end |
| `data-range-start` | Day button | First date of range |
| `data-range-end` | Day button | Last date of range |
| `data-outside-month` | Day button | Prev/next month dates |
| `data-disabled` | Day button | Cannot be selected |
| `data-focused` | Day button | Keyboard focus |
| `data-time-cell` | Time button | Hour/minute/second cells |
| `data-calendar-root` | Container | Root element |
| `data-view` | Container | `day` / `month` / `year` |

---

## 🏗️ Architecture

```
src/
├── engine/              # Pure date math (zero React imports)
├── hooks/               # Stateful React layer
├── a11y/                # Keyboard nav, focus trap, click-outside
├── locales/             # 8 i18n configurations
├── components/
│   ├── Calendar/        # CalendarRoot, Header, Grid, MonthView, YearView
│   ├── DatePickerInput/ # Input + popover for dates
│   ├── TimePicker/      # Scrollable hour/min/sec columns
│   ├── DateTimePicker/  # Inline calendar + time
│   └── DateTimePickerInput/ # Input + popover for date+time
└── utils/               # formatDate, dateAdapter
```

**Engine layer** is framework-agnostic — pure functions with zero React imports. Can be ported to Vue, Svelte, or vanilla JS.

---

## 📊 Bundle Size

| Export | Gzip |
|--------|------|
| `DatePickerInput` | ~8 KB |
| `DateTimePickerInput` | ~14 KB |
| `CalendarRoot` | ~6 KB |
| Full library | ~15 KB |

Tree-shakeable. Only pay for what you import.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## 📄 License

[MIT](./LICENSE) — Use it freely in personal and commercial projects.
