# Component Contracts

**Feature**: Event Registration Website POC  
**Date**: 2025-11-21  
**Phase**: 1 - Component Interface Definitions

## Overview

This document defines the props interfaces and behavior contracts for all React components in the application. Since this is a static site (no API), contracts focus on component interfaces rather than API endpoints.

## Page Components

### Landing Page (`app/page.tsx`)

**Purpose**: Display hero section and featured events

**Props**: None (Server Component)

**Data Requirements**:
- Import `events` from `@/data/events`
- Filter for `featured === true`
- Limit to 6 events

**Rendered Components**:
- `<Hero />` - once
- `<EventCard />` - for each featured event

---

### Events Page (`app/events/page.tsx`)

**Purpose**: Display all events with filtering and search

**Props**: None (Server Component)

**Data Requirements**:
- Import all `events` from `@/data/events`
- Pass to client-side filter components

**Rendered Components**:
- `<EventsPageClient />` - wraps filtering logic (Client Component)

---

### FAQ Page (`app/faq/page.tsx`)

**Purpose**: Display FAQ accordion

**Props**: None (Server Component)

**Data Requirements**:
- Import `faqs` from `@/data/faqs`
- Pass to FAQ components

**Rendered Components**:
- `<FAQItem />` - for each FAQ

---

## Display Components (Server Components)

### EventCard

**Purpose**: Display a single event with image, details, and CTA

**Props Interface**:
```typescript
interface EventCardProps {
  event: Event;
  priority?: boolean; // For image loading priority (above fold)
}
```

**Behavior**:
- Display event image (use Next.js Image component)
- Show title, date, time, location
- Display category badge with color
- Show price (formatted: "Free" or "$XX")
- Include "Register" button
- Apply hover effects (scale, shadow)

**Layout**:
- Card with rounded corners (rounded-xl)
- Image at top, content below
- Category badge overlays image (top-right)
- Responsive: full width mobile, grid item desktop

**Example Usage**:
```typescript
<EventCard event={event} priority={index < 3} />
```

---

### Hero

**Purpose**: Landing page hero section with headline and CTA

**Props Interface**:
```typescript
interface HeroProps {
  // No props - content is static
}
```

**Content**:
- Headline: "Discover Amazing Events"
- Subheadline: "Browse conferences, workshops, and networking opportunities"
- CTA Button: "Browse All Events" → links to /events
- Background: Gradient or large background image

**Layout**:
- Full-width section
- Centered content
- Min height: 60vh mobile, 70vh desktop
- Responsive typography

---

## Interactive Components (Client Components)

### FilterBar

**Purpose**: Category and price filtering controls

**Props Interface**:
```typescript
interface FilterBarProps {
  categories: EventCategory[];
  priceFilter: 'all' | 'free' | 'paid';
  onCategoryChange: (categories: EventCategory[]) => void;
  onPriceChange: (filter: 'all' | 'free' | 'paid') => void;
}
```

**Behavior**:
- Render category toggle buttons (multi-select)
- Render price radio buttons (single-select)
- Call callbacks on user interaction
- Highlight active selections

**State**: Managed by parent component

**Example Usage**:
```typescript
<FilterBar
  categories={selectedCategories}
  priceFilter={priceFilter}
  onCategoryChange={setSelectedCategories}
  onPriceChange={setPriceFilter}
/>
```

---

### SearchBar

**Purpose**: Search input with debouncing

**Props Interface**:
```typescript
interface SearchBarProps {
  value: string;
  onChange: (query: string) => void;
  placeholder?: string;
}
```

**Behavior**:
- Render text input field
- Debounce input changes (300ms)
- Call onChange with debounced value
- Show search icon
- Clear button when value is not empty

**State**: Controlled by parent

**Example Usage**:
```typescript
<SearchBar
  value={searchQuery}
  onChange={setSearchQuery}
  placeholder="Search events..."
/>
```

---

### FAQItem

**Purpose**: Single FAQ item with accordion behavior

**Props Interface**:
```typescript
interface FAQItemProps {
  faq: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}
```

**Behavior**:
- Display question as clickable header
- Show/hide answer based on `isOpen`
- Animate expand/collapse transition
- Call `onToggle` when header is clicked
- Accessible (proper ARIA attributes)

**State**: Managed by parent (only one FAQ open at a time)

**Example Usage**:
```typescript
<FAQItem
  faq={faq}
  isOpen={openFaqId === faq.id}
  onToggle={() => setOpenFaqId(faq.id === openFaqId ? null : faq.id)}
/>
```

---

## Layout Components

### RootLayout (`app/layout.tsx`)

**Purpose**: Root layout with navigation and footer

**Props Interface**:
```typescript
interface RootLayoutProps {
  children: React.ReactNode;
}
```

**Structure**:
```typescript
<html lang="en">
  <body>
    <Navigation />
    <main>{children}</main>
    <Footer />
  </body>
</html>
```

---

### Navigation

**Purpose**: Site navigation menu

**Props Interface**: None

**Content**:
- Logo/Brand name (links to home)
- Navigation links:
  - Home (/)
  - Events (/events)
  - FAQ (/faq)
- Responsive: Full menu desktop, mobile menu if needed

---

### Footer

**Purpose**: Site footer with copyright

**Props Interface**: None

**Content**:
- Copyright notice
- Social links (optional)
- Simple, minimal design

---

## Utility Functions Contract

### Filtering Function

**Function Signature**:
```typescript
function filterEvents(
  events: Event[],
  filters: FilterState
): Event[]
```

**Behavior**:
- Filter by categories (if any selected)
- Filter by price (free/paid/all)
- Filter by search query (title, description, location)
- Return filtered array

---

### Search Matching Function

**Function Signature**:
```typescript
function matchesSearch(
  event: Event,
  query: string
): boolean
```

**Behavior**:
- Case-insensitive matching
- Check title, description, location
- Return true if any field matches

---

### Formatting Functions

**Function Signatures**:
```typescript
function formatDate(dateString: string): string;
// Output: "Dec 15, 2025"

function formatPrice(price: number): string;
// Output: "Free" or "$49.99"

function formatTime(time: string): string;
// Output: "2:00 PM"

function truncateText(text: string, maxLength: number): string;
// Output: Text truncated with "..."
```

---

## Event Handling Contracts

### Register Button Click

**Handler**:
```typescript
function handleRegister(event: Event): void {
  // POC: Show alert with event name
  alert(`Registration for "${event.title}" - Coming soon!`);
}
```

**Future**: Will open modal or navigate to registration form

---

### FAQ Toggle

**Handler**:
```typescript
function handleFAQToggle(faqId: number): void {
  setOpenFaqId(openFaqId === faqId ? null : faqId);
}
```

**Behavior**: Only one FAQ open at a time

---

## Data Flow Contract

```
1. Data Layer (data/events.ts)
   ↓
2. Server Component (page.tsx)
   - Fetch/import data
   - Pass to client components
   ↓
3. Client Component (FilterBar, SearchBar)
   - Manage filter state
   - Filter events array
   ↓
4. Display Component (EventCard)
   - Render individual events
```

---

## Error Handling Contracts

### Missing Image

**Behavior**: 
- Show placeholder gradient with category icon
- Log warning to console (dev only)

### Invalid Date

**Behavior**:
- Display "Date TBA"
- Don't crash component

### Empty Search Results

**Behavior**:
- Display message: "No events found. Try different search terms."
- Show button to clear filters

---

## Accessibility Contracts

### Keyboard Navigation

- All interactive elements must be keyboard accessible
- Logical tab order
- Enter/Space activates buttons

### Screen Reader Support

- All images have alt text
- Buttons have descriptive labels
- ARIA labels on custom controls
- Semantic HTML structure

### Focus Management

- Visible focus indicators
- Focus trap in mobile menu (if implemented)
- Focus returns to trigger after modal close

---

## Performance Contracts

### Image Loading

- Use `priority` prop for above-fold images
- Lazy load below-fold images
- Use appropriate image sizes (width/height)

### Component Rendering

- Minimize re-renders with proper state structure
- Debounce search input (300ms)
- Use React.memo for expensive components (if needed)

---

## Testing Contracts (Post-POC)

### Component Tests

Each component should be testable for:
- Renders without crashing
- Props are properly typed
- Callbacks are called correctly
- Conditional rendering works

### Integration Tests

- Filtering works end-to-end
- Search returns correct results
- Navigation works across pages

---

**Contracts Complete**: 2025-11-21  
**Next**: Create quickstart.md for developers
