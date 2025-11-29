import moment from "moment-hijri";

/**
 * Converts a Gregorian date to Hijri date string
 * @param date - The Gregorian date to convert
 * @returns Formatted Hijri date string
 */
export function getHijriDate(date: Date): string {
  try {
    // Format Hijri date using moment-hijri
    return moment(date).locale('ar').format('dddd D MMMM iYYYY هـ');
  } catch (error) {
    console.error('Error converting to Hijri date:', error);
    return '';
  }
}

/**
 * Gets both Gregorian and Hijri dates
 * @param date - The date to convert (defaults to current date)
 * @returns Object containing both date formats
 */
export function getIslamicDates(date: Date = new Date()) {
  const gregorian = date.toLocaleDateString('ar-SA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const hijri = getHijriDate(date);
  
  return {
    gregorian,
    hijri
  };
}