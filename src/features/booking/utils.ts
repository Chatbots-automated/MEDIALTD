import { BUSINESS_HOURS } from './constants';

/**
 * Formats selected services for webhook submission
 * @param selectedServices Array of selected service IDs
 * @param services Array of service objects
 * @returns Formatted services object
 */
export const formatSelectedServices = (
  selectedServices: string[],
  services: Array<{ id: string; name: string }>
): { selectedServices: string[]; serviceNames: string[] } => {
  const serviceNames = selectedServices.map(id => 
    services.find(s => s.id === id)?.name || ''
  ).filter(Boolean);

  return {
    selectedServices,
    serviceNames
  };
};

/**
 * Calculates end time and duration based on start time and selected duration
 * @param startTime ISO datetime string
 * @param durationString Duration string (e.g., "3 hours", "Full day (8 hours)")
 * @returns Object containing end time and formatted duration
 */
export const calculateEndTimeAndDuration = (startTime: string, durationString: string): { 
  endTime: string;
  duration: string;
} => {
  let hours = 0;

  if (durationString.includes('Full day')) {
    hours = 8;
  } else if (durationString.includes('Multiple days')) {
    hours = 24;
  } else {
    const match = durationString.match(/(\d+)\s*hours?/);
    if (match) {
      hours = parseInt(match[1], 10);
    }
  }
  
  const startDate = new Date(startTime);
  const endDate = new Date(startDate.getTime() + hours * 60 * 60 * 1000);
  
  return {
    endTime: endDate.toISOString().split('.')[0] + 'Z',
    duration: `${hours.toString().padStart(2, '0')}:00`
  };
};

/**
 * Formats a date for display
 * @param dateString ISO date string (YYYY-MM-DD)
 * @returns Formatted date string (e.g., "Monday, January 1, 2024")
 */
export const formatDateForDisplay = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Formats a date and time for webhook submission
 * @param date ISO date string (YYYY-MM-DD)
 * @param time Time string (e.g., "09:30" or "14:30")
 * @returns ISO datetime string for Google Calendar
 */
export const formatDateTimeForWebhook = (date: string, time: string): string => {
  try {
    const [hours, minutes] = time.split(':').map(num => num.padStart(2, '0'));
    return `${date}T${hours}:${minutes}:00Z`;
  } catch (error) {
    console.error('Error formatting date/time:', error);
    return `${date}T${time}:00.000Z`;
  }
};

/**
 * Generates default time slots in 30-minute intervals
 * @returns Array of time slots from 9:00 AM to 8:00 PM
 */
const isBeforeMinimumBuffer = (timeSlot: string, date: string): boolean => {
  const now = new Date();
  const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
  
  const selectedDate = new Date(date + 'T00:00:00Z');
  
  if (selectedDate.getUTCDate() > utcNow.getUTCDate() || 
      selectedDate.getUTCMonth() > utcNow.getUTCMonth() || 
      selectedDate.getUTCFullYear() > utcNow.getUTCFullYear()) {
    return false;
  }
  
  const [hours, minutes] = timeSlot.split(':').map(Number);
  const slotTime = new Date(selectedDate.getTime());
  slotTime.setUTCHours(hours, minutes, 0, 0);
  
  const bufferTime = new Date(utcNow.getTime());
  bufferTime.setUTCMinutes(bufferTime.getUTCMinutes() + 30);
  
  const remainder = bufferTime.getUTCMinutes() % 30;
  if (remainder > 0) {
    bufferTime.setUTCMinutes(bufferTime.getUTCMinutes() + (30 - remainder));
  }
  
  return slotTime < bufferTime;
};

export const generateDefaultTimeSlots = () => {
  const slots = [];
  
  const dayOfWeek = 1;
  const { start, end } = BUSINESS_HOURS[dayOfWeek as keyof typeof BUSINESS_HOURS];
  
  for (let hour = start; hour < end; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const isTooSoon = isBeforeMinimumBuffer(time, new Date().toISOString().split('T')[0]);
      
      slots.push({
        time,
        available: !isTooSoon
      });
    }
  }
  
  return slots;
};

/**
 * Ensures no overlapping times between categories and days
 * @param data Webhook response data
 * @param selectedDateISO Selected date
 * @param selectedServiceId Selected service
 */
export const parseWebhookTimeSlots = (
  data: any,
  selectedDateISO: string,
  selectedServiceId: string
): { time: string; available: boolean }[] => {
  try {
    const events = Array.isArray(data)
      ? data
      : data?.bookedTimes?.map((time: string) => ({
          start: { dateTime: time },
          serviceId: data.serviceId || "",
        })) || [];

    if (!events.length || !selectedDateISO) {
      return generateDefaultTimeSlots();
    }

    const bookedTimesByDate: Record<string, Record<string, Set<string>>> = {};

    events.forEach((event: any) => {
      if (!event.start || !event.start.dateTime || !event.serviceId) return;

      const eventStart = new Date(event.start.dateTime);
      const eventDateISO = eventStart.toISOString().split("T")[0];
      const eventServiceId = event.serviceId;

      if (!bookedTimesByDate[eventDateISO]) {
        bookedTimesByDate[eventDateISO] = {};
      }

      if (!bookedTimesByDate[eventDateISO][eventServiceId]) {
        bookedTimesByDate[eventDateISO][eventServiceId] = new Set();
      }

      const startTime = eventStart.toISOString().substring(11, 16);
      bookedTimesByDate[eventDateISO][eventServiceId].add(startTime);
    });

    const bookedTimes =
      bookedTimesByDate[selectedDateISO]?.[selectedServiceId] || new Set();

    const selectedDay = new Date(selectedDateISO).getDay();
    const { start, end } =
      BUSINESS_HOURS[selectedDay as keyof typeof BUSINESS_HOURS];

    const slots = [];
    for (let hour = start; hour < end; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;

        slots.push({
          time,
          available: !bookedTimes.has(time),
        });
      }
    }

    return slots;
  } catch (error) {
    console.error("Error parsing webhook response:", error);
    return generateDefaultTimeSlots();
  }
};

export const formatTimeForDisplay = (time: string): string => {
  if (!time) return '';
  
  const [hours, minutes] = time.split(':').map(Number);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

export const formatTimeForStorage = (time: string): string => {
  if (!time) return '';

  if (time.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
    return time;
  }

  const match = time.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (!match) return time;

  let [_, hours, minutes, period] = match;
  let hour = parseInt(hours, 10);

  if (period.toUpperCase() === 'PM' && hour < 12) hour += 12;
  if (period.toUpperCase() === 'AM' && hour === 12) hour = 0;

  return `${hour.toString().padStart(2, '0')}:${minutes.padStart(2, '0')}`;
};

export { formatDateTimeForWebhook, formatDateForDisplay, formatSelectedServices, calculateEndTimeAndDuration }