import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { DatePickerInput, CalendarRoot } from './index';

function App() {
  const [singleDate, setSingleDate] = useState<Date | null>(null);
  const [rangeDate, setRangeDate] = useState<[Date | null, Date | null]>([null, null]);

  return (
    <div className="container">
      <h1>ReApexDate Testing Playground</h1>
      
      <div className="section">
        <h2>1. Single Date Picker</h2>
        <DatePickerInput
          config={{
            mode: 'single',
            value: singleDate,
            onChange: setSingleDate,
          }}
          placeholder="Select a date..."
          allowClear
        />
        <div style={{ marginTop: '1rem' }}>
          Selected: {singleDate ? singleDate.toLocaleDateString() : 'None'}
        </div>
      </div>

      <div className="section">
        <h2>2. Range Date Picker</h2>
        <DatePickerInput
          config={{
            mode: 'range',
            value: rangeDate,
            onChange: setRangeDate,
          }}
          placeholder="Start date - End date"
          allowClear
        />
        <div style={{ marginTop: '1rem' }}>
          Selected Range: {rangeDate[0] ? rangeDate[0].toLocaleDateString() : 'None'} to {rangeDate[1] ? rangeDate[1].toLocaleDateString() : 'None'}
        </div>
      </div>

      <div className="section">
        <h2>3. Inline Calendar (Multi-Select Example)</h2>
        <CalendarRoot
          config={{
            mode: 'multiple',
            value: [],
            onChange: () => {},
          }}
        />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
