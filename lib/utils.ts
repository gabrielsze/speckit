import { Event, FilterState } from '@/types';
import { format, parseISO } from 'date-fns';

// Format date for display
export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM d, yyyy');
  } catch {
    return 'Date TBA';
  }
}

// Format price for display
export function formatPrice(price: number): string {
  return price === 0 ? 'Free' : `$${price.toFixed(2)}`;
}

// Format time for display (convert 24h to 12h format)
export function formatTime(time: string): string {
  try {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  } catch {
    return time;
  }
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

// Check if event matches search query
export function matchesSearch(event: Event, query: string): boolean {
  if (!query) return true;
  
  const searchLower = query.toLowerCase();
  return (
    event.title.toLowerCase().includes(searchLower) ||
    event.description.toLowerCase().includes(searchLower) ||
    event.location.toLowerCase().includes(searchLower)
  );
}

// Check if event matches all filter criteria
export function matchesFilters(event: Event, filters: FilterState): boolean {
  // Category filter
  if (filters.categories.length > 0 && !filters.categories.includes(event.category)) {
    return false;
  }
  
  // Price filter
  if (filters.priceFilter === 'free' && event.price > 0) {
    return false;
  }
  if (filters.priceFilter === 'paid' && event.price === 0) {
    return false;
  }
  
  // Search query
  if (filters.searchQuery && !matchesSearch(event, filters.searchQuery)) {
    return false;
  }
  
  return true;
}

// Filter events based on FilterState
export function filterEvents(events: Event[], filters: FilterState): Event[] {
  return events.filter(event => matchesFilters(event, filters));
}

// Sort events
export function sortEvents(events: Event[], sortBy: 'date-asc' | 'date-desc' | 'name-asc' | 'name-desc'): Event[] {
  const sorted = [...events];
  
  switch (sortBy) {
    case 'date-asc':
      sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      break;
    case 'date-desc':
      sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      break;
    case 'name-asc':
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'name-desc':
      sorted.sort((a, b) => b.title.localeCompare(a.title));
      break;
  }
  
  return sorted;
}
