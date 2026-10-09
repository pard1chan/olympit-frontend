/**
 * Formats date to day.month.year format (e.g. 07.12.2025)
 * @param {Date|string|number} date - Date to format
 * @param {string} separator - Separator between parts (default: '.')
 * @returns {string} Formatted date string
 */
export function formatDate(date, separator = '.') {
  if (!date) return '';
  
  const d = new Date(date);
  
  // Validate date
  if (isNaN(d.getTime())) {
    console.warn('Invalid date provided to formatDate:', date);
    return '';
  }
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = d.getFullYear();
  
  return `${day}${separator}${month}${separator}${year}`;
}

/**
 * Formats date with time: day.month.year hours:minutes
 * @param {Date|string|number} date - Date to format
 * @returns {string} Formatted date with time
 */
export function formatDateTime(date) {
  if (!date) return '';
  
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    console.warn('Invalid date provided to formatDateTime:', date);
    return '';
  }
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

/**
 * Formats date relative to now (e.g., "2 дня назад", "сегодня")
 * @param {Date|string|number} date - Date to format
 * @returns {string} Relative date string
 */
export function formatDateRelative(date) {
  if (!date) return '';
  
  const d = new Date(date);
  
  if (isNaN(d.getTime())) {
    console.warn('Invalid date provided to formatDateRelative:', date);
    return '';
  }
  
  const now = new Date();
  const diffMs = now - d;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'сегодня';
  } else if (diffDays === 1) {
    return 'вчера';
  } else if (diffDays < 7) {
    return `${diffDays} ${getRussianDays(diffDays)} назад`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${getRussianWeeks(weeks)} назад`;
  } else {
    return formatDate(d);
  }
}

// Helper function for Russian plural forms
function getRussianDays(count) {
  if (count % 10 === 1 && count % 100 !== 11) return 'день';
  if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) return 'дня';
  return 'дней';
}

function getRussianWeeks(count) {
  if (count % 10 === 1 && count % 100 !== 11) return 'неделю';
  if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) return 'недели';
  return 'недель';
}