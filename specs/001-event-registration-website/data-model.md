# Data Model: Event Registration Website

**Feature**: Event Registration Website POC  
**Date**: 2025-11-21  
**Phase**: 1 - Data Model Design

## Overview

This document defines the data structures, entities, and relationships for the event registration website. Since this is a static site with embedded mock data, the model focuses on TypeScript interfaces and data validation rules.

## Core Entities

### Event

The primary entity representing an event that users can browse and register for.

**TypeScript Interface**:
```typescript
interface Event {
  id: number;
  title: string;
  description: string;
  category: EventCategory;
  date: string; // ISO 8601 format: "2025-12-15"
  time: string; // 24-hour format: "14:00"
  location: string; // City or "Virtual"
  price: number; // In USD, 0 for free events
  image: string; // URL to image
  featured: boolean; // True if displayed on landing page
}

type EventCategory = 'Conference' | 'Workshop' | 'Networking' | 'Tech Talk';
```

**Field Specifications**:

| Field | Type | Required | Constraints | Example |
|-------|------|----------|-------------|---------|
| id | number | Yes | Unique, positive integer | 1 |
| title | string | Yes | 5-100 characters | "Web Development Summit 2025" |
| description | string | Yes | 20-500 characters | "Join us for a day of talks..." |
| category | EventCategory | Yes | Must be one of 4 defined types | "Conference" |
| date | string | Yes | ISO 8601, future date | "2025-12-15" |
| time | string | Yes | 24-hour format HH:MM | "14:00" |
| location | string | Yes | 3-100 characters | "San Francisco, CA" |
| price | number | Yes | >= 0, <= 1000 | 49.99 |
| image | string | Yes | Valid URL | "https://images.unsplash.com/..." |
| featured | boolean | Yes | true or false | true |

**Validation Rules**:
1. `id` must be unique across all events
2. `date` must be a valid future date (> current date)
3. `price` must be non-negative
4. `category` must match one of the four defined categories
5. `featured` events: maximum 6 recommended for landing page
6. `description` should be concise for card display (truncate at ~150 chars)

**Business Rules**:
- Free events have `price: 0`
- Virtual events should have `location: "Virtual"` or `location: "Online"`
- Featured events should be diverse in category and date range

### Category

Categories for event classification and filtering.

**TypeScript Type**:
```typescript
type EventCategory = 'Conference' | 'Workshop' | 'Networking' | 'Tech Talk';

interface CategoryMeta {
  name: EventCategory;
  displayName: string;
  color: string; // Tailwind color class
  icon: string; // Icon identifier (can be emoji or icon library ref)
}
```

**Category Metadata**:
```typescript
const categories: CategoryMeta[] = [
  {
    name: 'Conference',
    displayName: 'Conference',
    color: 'bg-blue-500',
    icon: '🎤'
  },
  {
    name: 'Workshop',
    displayName: 'Workshop',
    color: 'bg-green-500',
    icon: '🛠️'
  },
  {
    name: 'Networking',
    displayName: 'Networking',
    color: 'bg-purple-500',
    icon: '🤝'
  },
  {
    name: 'Tech Talk',
    displayName: 'Tech Talk',
    color: 'bg-orange-500',
    icon: '💻'
  }
];
```

### FilterState

Client-side state for filtering and searching events.

**TypeScript Interface**:
```typescript
interface FilterState {
  categories: EventCategory[]; // Selected categories (empty = all)
  priceFilter: 'all' | 'free' | 'paid';
  searchQuery: string;
}
```

**Default State**:
```typescript
const defaultFilterState: FilterState = {
  categories: [],
  priceFilter: 'all',
  searchQuery: ''
};
```

### FAQItem

FAQ content structure for the FAQ page.

**TypeScript Interface**:
```typescript
interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: FAQCategory;
}

type FAQCategory = 'Registration' | 'Payment' | 'Access' | 'Support';
```

**Example**:
```typescript
{
  id: 1,
  question: "How do I register for an event?",
  answer: "Click the 'Register' button on any event card...",
  category: "Registration"
}
```

## Data Relationships

```
EventCategory (1) ────── (many) Event
                           │
                           └─ featured: boolean
                           
FilterState ─(filters)─> Event[] ─(displays)─> EventCard

FAQCategory (1) ────── (many) FAQItem
```

**Notes**:
- No database relationships (static data)
- Relationships are logical/conceptual only
- Filtering happens in-memory on client side

## Data Distribution

### Mock Data Distribution (20 Events)

**By Category**:
- Conference: 5 events (25%)
- Workshop: 5 events (25%)
- Networking: 5 events (25%)
- Tech Talk: 5 events (25%)

**By Price**:
- Free (price = 0): 8 events (40%)
- Paid (price > 0): 12 events (60%)
- Price range: $0 - $200

**By Featured**:
- Featured (featured = true): 6 events
- Non-featured: 14 events

**By Date Range**:
- Next 3 months from 2025-11-21
- Even distribution across weeks

**By Location**:
- Virtual: ~6 events (30%)
- In-person (various cities): ~14 events (70%)

## Data Validation Functions

```typescript
// Validate event date is in the future
function isValidEventDate(dateString: string): boolean {
  const eventDate = new Date(dateString);
  const now = new Date();
  return eventDate > now;
}

// Validate price is non-negative
function isValidPrice(price: number): boolean {
  return price >= 0 && price <= 1000;
}

// Validate category is one of allowed values
function isValidCategory(category: string): category is EventCategory {
  return ['Conference', 'Workshop', 'Networking', 'Tech Talk'].includes(category);
}

// Check if event matches search query
function matchesSearch(event: Event, query: string): boolean {
  const searchLower = query.toLowerCase();
  return (
    event.title.toLowerCase().includes(searchLower) ||
    event.description.toLowerCase().includes(searchLower) ||
    event.location.toLowerCase().includes(searchLower)
  );
}

// Check if event matches filter criteria
function matchesFilters(event: Event, filters: FilterState): boolean {
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
```

## Data File Structure

```typescript
// data/events.ts
import { Event } from '@/types';

export const events: Event[] = [
  {
    id: 1,
    title: "Web Development Summit 2025",
    description: "Join industry leaders for a day of cutting-edge web development talks...",
    category: "Conference",
    date: "2025-12-15",
    time: "09:00",
    location: "San Francisco, CA",
    price: 199,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
    featured: true
  },
  // ... 19 more events
];

// data/faqs.ts
import { FAQItem } from '@/types';

export const faqs: FAQItem[] = [
  {
    id: 1,
    question: "How do I register for an event?",
    answer: "To register for an event, simply click the 'Register' button...",
    category: "Registration"
  },
  // ... 9 more FAQs
];

// types/index.ts
export interface Event {
  id: number;
  title: string;
  description: string;
  category: EventCategory;
  date: string;
  time: string;
  location: string;
  price: number;
  image: string;
  featured: boolean;
}

export type EventCategory = 'Conference' | 'Workshop' | 'Networking' | 'Tech Talk';
export type FAQCategory = 'Registration' | 'Payment' | 'Access' | 'Support';

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: FAQCategory;
}

export interface FilterState {
  categories: EventCategory[];
  priceFilter: 'all' | 'free' | 'paid';
  searchQuery: string;
}
```

## State Management

For POC, state management is component-local using React hooks:

```typescript
// In events page component
const [filters, setFilters] = useState<FilterState>({
  categories: [],
  priceFilter: 'all',
  searchQuery: ''
});

// Filter events in real-time
const filteredEvents = events.filter(event => matchesFilters(event, filters));
```

## Data Formatting Helpers

```typescript
// Format date for display
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

// Format price for display
export function formatPrice(price: number): string {
  return price === 0 ? 'Free' : `$${price.toFixed(2)}`;
}

// Format time for display
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

// Truncate description for card display
export function truncateText(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}
```

## Summary

The data model is intentionally simple for the POC:
- Single primary entity (Event) with clear validation rules
- Supporting entities (Category, FAQ) with minimal complexity
- No database or persistence layer
- Client-side filtering and search
- Type-safe with TypeScript interfaces
- Easy to extend for future backend integration

---

**Data Model Complete**: 2025-11-21  
**Next**: Generate API contracts (minimal for static site)
