# ReApexDate — Testing Guide

## How to Test

Your senior (or any tester) can test in two ways:

### Option A: Use the Live Playground
Open the GitHub Pages URL and interact with every section.

### Option B: Install in a Project
```bash
npm install reapex-date
```
Then use the components as shown in the playground code examples.

---

## Test Scenarios

### 1. Single Date Picker

| # | Scenario | Steps | Expected |
|---|----------|-------|----------|
| 1.1 | Open/close popover | Click input → calendar opens. Click outside → closes | Popover toggles correctly |
| 1.2 | Select a date | Click any date | Input shows formatted date, popover closes |
| 1.3 | Clear selection | Click ✕ button | Input clears to placeholder, value = null |
| 1.4 | Min date | Set `minDate={new Date()}` | Past dates are grayed out & unclickable |
| 1.5 | Max date | Set `maxDate` | Future dates beyond max are disabled |
| 1.6 | Disabled dates | Pass `disabledDates` array | Specific dates are unclickable |
| 1.7 | Keyboard nav | Open popover → use ← → ↑ ↓ keys | Focus moves between dates correctly |
| 1.8 | Enter to select | Focus a date → press Enter | Date is selected |
| 1.9 | Escape to close | Open popover → press Escape | Popover closes |
| 1.10 | Month navigation | Click ‹ / › arrows | Month changes forward/backward |
| 1.11 | Month/Year view | Click "August 2026" title | Switches to month grid → year grid → back to day |

---

### 2. Date Range Picker

| # | Scenario | Steps | Expected |
|---|----------|-------|----------|
| 2.1 | Select start date | Click first date | Date highlights as range start |
| 2.2 | Hover preview | After selecting start, hover over dates | Range preview highlights between start and hover |
| 2.3 | Select end date | Click second date | Range completes, both dates shown in input, popover closes |
| 2.4 | Reverse range | Click end date first, then earlier date | Should auto-correct the range order |
| 2.5 | Clear range | Click ✕ | Both dates clear |
| 2.6 | Re-select | After range is set, click input again → pick new start | Previous range clears, new selection begins |

---

### 3. Multi-Select

| # | Scenario | Steps | Expected |
|---|----------|-------|----------|
| 3.1 | Select multiple dates | Click 3 different dates | All 3 highlight, input shows count |
| 3.2 | Deselect | Click an already-selected date | That date deselects |
| 3.3 | Clear all | Click ✕ | All dates clear |
| 3.4 | Popover stays open | Select dates | Popover should NOT auto-close (unlike single mode) |

---

### 4. DateTime Picker

| # | Scenario | Steps | Expected |
|---|----------|-------|----------|
| 4.1 | Date + Time | Open picker → select date → scroll to set time | Both date and time update |
| 4.2 | 24h format | Default mode | Hour column shows 00–23 |
| 4.3 | 12h AM/PM | Set `use12Hour` | Hour shows 12, 1–11 + AM/PM toggle |
| 4.4 | Seconds column | Set `showSeconds` | Third column appears (00–59 seconds) |
| 4.5 | Minute step | Set `minuteStep={5}` | Minutes show 00, 05, 10, 15, ... |
| 4.6 | OK button | Click OK | Popover closes, input shows selected date+time |
| 4.7 | Format display | Check input after selection | Shows correct format (e.g., "08/18/2026 14:30") |

---

### 5. Internationalization (i18n)

| # | Scenario | Steps | Expected |
|---|----------|-------|----------|
| 5.1 | Hindi locale | Pass `locale={hi}` | Month names in Hindi, day headers in Hindi |
| 5.2 | Arabic locale | Pass `locale={ar}` | Calendar is RTL, Arabic month/day names, Saturday start |
| 5.3 | French locale | Pass `locale={fr}` | French month names, Monday start |
| 5.4 | Japanese locale | Pass `locale={ja}` | Japanese names |
| 5.5 | Month grid locale | Click month title in Hindi | Month grid shows Hindi month names |
| 5.6 | Date format | Each locale has default format | FR shows DD/MM/YYYY, EN shows MM/DD/YYYY |

---

### 6. Accessibility (a11y)

| # | Scenario | Steps | Expected |
|---|----------|-------|----------|
| 6.1 | Tab into input | Press Tab to reach input | Input receives focus |
| 6.2 | Enter to open | Focus input → press Enter/Space | Popover opens |
| 6.3 | Arrow key nav | Inside popover, use arrow keys | Focus moves between dates logically |
| 6.4 | Screen reader | Use NVDA/VoiceOver | Dates announced with "selected", "today", "disabled" |
| 6.5 | Focus trap | Tab inside popover | Focus stays within popover, doesn't leak |
| 6.6 | ARIA attributes | Inspect DOM | `role="application"`, `aria-selected`, `aria-disabled` present |

---

### 7. Styling (Data Attributes)

| # | Scenario | Steps | Expected |
|---|----------|-------|----------|
| 7.1 | Selected state | Select a date, inspect DOM | `data-selected="true"` on the button |
| 7.2 | Today state | Check today's date | `data-today="true"` present |
| 7.3 | Range state | In range mode, select range | `data-in-range`, `data-range-start`, `data-range-end` |
| 7.4 | Disabled state | Check disabled dates | `data-disabled="true"` present |
| 7.5 | Outside month | Check grayed-out dates | `data-outside-month="true"` present |
| 7.6 | Custom CSS | Write CSS targeting `[data-selected="true"]` | Styles apply correctly |

---

### 8. Edge Cases

| # | Scenario | Steps | Expected |
|---|----------|-------|----------|
| 8.1 | Null initial value | Don't pass value | Shows placeholder, no errors |
| 8.2 | Pre-selected date | Pass `value={new Date()}` | Calendar opens on that month, date highlighted |
| 8.3 | Year boundary | Navigate from Jan 2026 → prev month | Goes to Dec 2025 correctly |
| 8.4 | Leap year | Navigate to Feb 2028 | Shows 29 days |
| 8.5 | Multiple calendars | Render 2+ DatePickerInputs on same page | Each works independently |
| 8.6 | Rapid clicking | Click dates very fast | No double-selection or state corruption |
| 8.7 | Window resize | Resize browser while popover open | Popover repositions correctly |
| 8.8 | Scroll | Scroll page while popover open | Popover follows input position |

---

## Priority for Senior Testing

> **Start with these 10 tests** — they cover the most critical paths:

1. ✅ 1.1 — Open/close popover
2. ✅ 1.2 — Select a date
3. ✅ 2.1 + 2.3 — Range selection (start + end)
4. ✅ 4.1 — DateTime selection
5. ✅ 4.6 — OK button closes popover
6. ✅ 5.2 — Arabic RTL
7. ✅ 5.5 — Month grid in locale
8. ✅ 6.3 — Keyboard navigation
9. ✅ 8.1 — Null initial value
10. ✅ 8.3 — Year boundary navigation
