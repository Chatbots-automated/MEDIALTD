import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DaySelectorProps {
  onSelectDay: (date: string) => void;
  selectedDate: string;
}

const DaySelector: React.FC<DaySelectorProps> = ({ onSelectDay, selectedDate }) => {
  const [days, setDays] = useState<Array<{ date: Date; formatted: string; dayName: string; dayNumber: string }>>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const visibleDays = 7;

  useEffect(() => {
    const today = new Date();
    setSelectedMonth((today.getMonth() + 1).toString().padStart(2, '0'));
    setSelectedYear(today.getFullYear().toString());
    generateDays(today.getFullYear(), today.getMonth());
  }, []);

  const generateDays = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const nextDays = [];
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      
      // Skip dates before today
      if (date < new Date(new Date().setHours(0, 0, 0, 0))) {
        continue;
      }
      
      const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
      const dayName = dayNames[date.getDay()];
      const dayNumber = date.getDate().toString();
      
      const formatted = date.toISOString().split('T')[0];
      
      nextDays.push({
        date,
        formatted,
        dayName,
        dayNumber
      });
    }
    
    setDays(nextDays);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
    generateDays(parseInt(selectedYear), parseInt(e.target.value) - 1);
    setStartIndex(0);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
    generateDays(parseInt(e.target.value), parseInt(selectedMonth) - 1);
    setStartIndex(0);
  };

  const handlePrevious = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const handleNext = () => {
    if (startIndex + visibleDays < days.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const years = Array.from({ length: 2 }, (_, i) => (new Date().getFullYear() + i).toString());

  const visibleDaysArray = days.slice(startIndex, startIndex + visibleDays);

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium">Select Date</h3>
        <div className="flex gap-2">
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white transition-colors"
          >
            {months.map(month => (
              <option 
                key={month.value} 
                value={month.value}
                className="bg-gray-900"
              >
                {month.label}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white transition-colors"
          >
            {years.map(year => (
              <option 
                key={year} 
                value={year}
                className="bg-gray-900"
              >
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex items-center">
        <button 
          onClick={handlePrevious}
          disabled={startIndex === 0}
          className={`p-2 rounded-full ${startIndex === 0 ? 'text-gray-600 cursor-not-allowed' : 'text-white hover:bg-gray-800'}`}
          aria-label="Previous days"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-7 gap-2">
            {visibleDaysArray.map((day) => (
              <button
                key={day.formatted}
                onClick={() => onSelectDay(day.formatted)}
                className={`
                  flex flex-col items-center justify-center p-3 rounded-lg transition-colors
                  ${selectedDate === day.formatted 
                    ? 'bg-white text-black' 
                    : isToday(day.date)
                      ? 'bg-gray-800 text-white border border-white/50'
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  }
                `}
              >
                <span className="text-xs font-medium">{day.dayName}</span>
                <span className="text-lg font-bold">{day.dayNumber}</span>
                {isToday(day.date) && <span className="text-xs mt-1">Today</span>}
              </button>
            ))}
          </div>
        </div>
        
        <button 
          onClick={handleNext}
          disabled={startIndex + visibleDays >= days.length}
          className={`p-2 rounded-full ${startIndex + visibleDays >= days.length ? 'text-gray-600 cursor-not-allowed' : 'text-white hover:bg-gray-800'}`}
          aria-label="Next days"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default DaySelector;