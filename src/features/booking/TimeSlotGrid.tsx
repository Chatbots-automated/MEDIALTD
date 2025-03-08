import React from 'react';
import { Clock } from 'lucide-react';
import { formatTimeForDisplay } from './utils';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface TimeSlotGridProps {
  timeSlots: TimeSlot[];
  selectedTime: string;
  onSelectTime: (time: string) => void;
  isLoading: boolean;
}

const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({ 
  timeSlots, 
  selectedTime, 
  onSelectTime, 
  isLoading 
}) => {
  // Generate all possible times (00:00 to 23:30)
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute of [0, 30]) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const isAvailable = timeSlots.find(slot => slot.time === time)?.available ?? true;
        times.push({ time, available: isAvailable });
      }
    }
    return times;
  };

  const allTimeSlots = generateTimeOptions();

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-gray-400">Loading available time slots...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-4">
        <Clock size={18} className="mr-2 text-white" />
        <h3 className="text-xl font-medium">Select Time</h3>
      </div>
      
      <div className="mb-8">
        <select
          value={selectedTime}
          onChange={(e) => onSelectTime(e.target.value)}
          className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-white focus:outline-none focus:border-white transition-colors"
        >
          <option value="" className="bg-gray-900">Select a time</option>
          {allTimeSlots.map((slot) => (
            <option
              key={slot.time}
              value={slot.time}
              disabled={!slot.available}
              className={`bg-gray-900 ${!slot.available ? 'text-gray-500' : ''}`}
            >
              {slot.time}
            </option>
          ))}
        </select>
      </div>

      {selectedTime && (
        <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4">
          <h4 className="text-lg font-medium mb-2">Selected Time</h4>
          <div className="flex items-center">
            <Clock size={18} className="text-white mr-2" />
            <span className="text-gray-300">
              Time: <span className="text-white font-medium">{formatTimeForDisplay(selectedTime)}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSlotGrid;