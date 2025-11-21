# Event Registration Website Specification - POC

## Project Overview
**Scope**: Proof of Concept for a modern event registration website  
**Goal**: Demonstrate core functionality with sleek design  
**Timeline**: Fast iteration for validation

## Key Entities

### Event
**Attributes**: id, title, description, category, date, location, price, image, featured  
**Categories**: Conference, Workshop, Networking, Tech Talk

## Functional Requirements (POC Scope)

### Must Have
- **Landing Page**: Hero + 4-6 featured events
- **Events Page**: Display all 20 events with image, title, date, location, price
- **Basic Filtering**: By category and price (Free/Paid)
- **Search**: Match event title and description
- **FAQ Page**: 8-10 accordion items
- **Responsive**: Mobile and desktop layouts

### Should Have (if time permits)
- Sort by date/name
- Event capacity indicators
- Smooth animations

### Out of Scope for POC
- Advanced date range filtering
- User authentication
- Actual registration backend
- Event details modal
- Local storage persistence

## Pages

### 1. Landing Page (index.html)
**Purpose**: Showcase top/featured events and provide quick navigation

**Components**:
- Hero section with compelling headline and CTA
- Featured/Top Events section (4-6 highlighted events)
- Quick stats or benefits section
- Call-to-action for browsing all events
- Footer with navigation links

**Design Requirements**:
- Bold, modern typography
- High-quality hero image or gradient background
- Card-based event display with hover effects
- Smooth scrolling and animations
- Prominent CTAs with gradient or bold colors

### 2. Events Page (events.html)
**Purpose**: Complete event discovery and browsing experience

**Components**:
- Page header with search/filter functionality
- Filter options:
  - Category (Conference, Workshop, Networking, Seminar, Festival, Tech Talk, Art Exhibition, Sports)
  - Date range
  - Location (Virtual, In-Person, Hybrid)
  - Price (Free, Paid)
- Event grid/list display (20 events total)
- Event cards showing:
  - Event image
  - Title
  - Date and time
  - Location
  - Category badge
  - Brief description
  - Price
  - "Register" button
  - Capacity/spots remaining indicator

**Interactions**:
- Filter updates display in real-time
- Search functionality
- Sort options (Date, Name, Popular)
- Smooth transitions when filtering

### 3. FAQ Page (faq.html)
**Purpose**: Answer common questions about event registration and platform usage

**Content Sections**:
- Registration Process
- Payment & Refunds
- Event Access (Virtual/In-Person)
- Account Management
- Technical Support
- Organizer Information

**Components**:
- Accordion-style FAQ items (expandable/collapsible)
- Search functionality for FAQs
- Contact form or support email link
- 10-15 common questions with detailed answers

## Mock Data (Simplified)

**Event Object**:
```javascript
{
  id, title, description, category, date, location, price, image, featured
}
```

**20 Events**: 5 Conference, 5 Workshop, 5 Networking, 5 Tech Talk  
**Price Range**: $0-200  
**Dates**: Next 3 months  
**Images**: Placeholder service (Unsplash API)

## Design System (POC)

**Colors**: 
- Primary gradient: `bg-gradient-to-r from-indigo-600 to-purple-600` (#6366f1 → #8b5cf6)
- Light mode: White background (#ffffff), Dark text (#1a1a1a)
- Dark mode: Dark background (#0a0a0a), Light text (#ededed)
- Category badges: 600-weight colors for proper contrast (bg-blue-600, bg-green-600, bg-purple-600, bg-orange-600)

**Typography**: Modern sans-serif (Inter or System UI)

**Dark Mode**:
- Enabled via `darkMode: 'class'` in Tailwind config
- Toggle button in navigation (☀️/🌙 icon)
- Automatic system preference detection on first load
- User preference persisted in localStorage
- All components support light/dark variants with proper text contrast

**Components**: 
- Rounded cards (12px)
- Hover shadows
- Pill-shaped badges
- Full-width page backgrounds for consistent theming
- Navigation with sticky positioning and dark mode support

**Layout**: Max 1200px width, Grid (1/2/3 columns), Mobile-first

**Accessibility**:
- Text contrast meets WCAG standards in both light and dark modes
- Dark mode toggle with aria-label
- Semantic HTML structure
- suppressHydrationWarning on html element for dark mode

## Technical Stack (POC)

**Framework**: Next.js 14 with App Router, TypeScript, React  
**Styling**: Tailwind CSS with dark mode (`darkMode: 'class'`)  
**State Management**: React useState/useEffect for client components  
**Images**: Next.js Image component with Unsplash placeholders  
**Dark Mode**: Client-side toggle with localStorage persistence and system preference detection  
**TypeScript**: Strict typing for events, FAQs, and component props  
**Breakpoints**: Mobile < 768px, Tablet < 1024px, Desktop > 1024px

**Key Configuration**:
- Tailwind dark mode enabled via class strategy
- CSS custom properties for background/foreground colors
- suppressHydrationWarning on html element
- Client components for interactive features (search, filters, dark mode toggle)

## User Scenarios (POC)

### US-1: Visitor Discovers and Filters Events
**Actor**: Sarah, professional looking for events  
**Flow**: Homepage → Browse all events → Filter by "Workshop" → Find event → Click register (alert)  
**Success**: Completes flow in under 2 minutes

### US-2: Mobile User Searches Events
**Actor**: James, student on mobile  
**Flow**: Events page → Search "tech" → View results → Check free events  
**Success**: Mobile interface is touch-friendly and functional

## Core User Flow
Homepage → Featured Events → Browse All → Filter/Search → View Event → Register (Alert)

## Out of Scope (Post-POC)
- User authentication, payment processing, backend integration
- Advanced date filtering, sorting options
- Event details modal, capacity indicators
- Local storage, calendar integration
- Performance optimization (minification, lazy loading)
- Full accessibility audit (basic support only for POC)

## File Structure
```
devsite/
├── app/
│   ├── layout.tsx (Root layout with Navigation & Footer)
│   ├── page.tsx (Homepage with Hero & Featured Events)
│   ├── globals.css (Tailwind + dark mode CSS variables)
│   ├── events/
│   │   └── page.tsx (Events listing page)
│   └── faq/
│       └── page.tsx (FAQ accordion page)
├── components/
│   ├── Navigation.tsx (Header with dark mode toggle)
│   ├── Hero.tsx (Homepage hero section)
│   ├── Footer.tsx (Site footer)
│   ├── EventCard.tsx (Event display card)
│   ├── EventsClient.tsx (Client component for filtering/search)
│   ├── FilterBar.tsx (Category and price filters)
│   ├── SearchBar.tsx (Debounced search input)
│   └── FAQItem.tsx (Accordion item)
├── data/
│   ├── events.ts (Mock event data - 20 events)
│   ├── categories.ts (Category metadata and icons)
│   └── faqs.ts (FAQ questions and answers)
├── types/
│   └── index.ts (TypeScript type definitions)
├── lib/
│   └── utils.ts (Utility functions for filtering, sorting, formatting)
├── public/
│   └── images/ (Event placeholder images)
├── tailwind.config.ts (Tailwind configuration with dark mode)
├── tsconfig.json
├── next.config.js
└── package.json
```

## Implementation Phases
1. Next.js project setup with TypeScript and Tailwind CSS
2. Component structure and layout (Navigation, Footer, pages)
3. Mock data creation (events, categories, FAQs)
4. Styling with Tailwind (light mode first)
5. Dark mode implementation (toggle, persistence, styling)
6. Interactive features (filtering, search, FAQ accordion)
7. Responsive polish and accessibility improvements
8. Text contrast fixes for dark backgrounds

## Acceptance Criteria (POC)

### AC-1: Pages Load and Display Correctly
- Landing page shows hero + 4-6 featured events
- Events page shows all 20 events in grid
- FAQ page displays 8-10 accordion items
- Mobile responsive (1 column) and desktop (3 columns)

### AC-2: Filtering Works
- Category filter (Conference, Workshop, Networking, Tech Talk)
- Price filter (Free/Paid)
- Results update in real-time
- "No events found" message when no matches

### AC-3: Search Works
- Search matches event title and description
- Case-insensitive
- Shows results as user types

### AC-4: FAQ Accordion
- Click to expand/collapse
- Only one open at a time
- Smooth transition

### AC-5: Basic Interactions
- Register button shows alert with event name
- Links navigate correctly
- Hover effects on event cards

## Edge Cases (POC)
- No filter matches → Show "No events found"
- Image fails to load → Use placeholder
- Mobile landscape → Maintain usability

## POC Success Criteria
- [x] 3 pages functional (Landing, Events, FAQ)
- [x] 20 mock events with realistic data
- [x] Category and price filtering works
- [x] Search functionality works with debouncing
- [x] Mobile and desktop responsive
- [x] Modern, clean design aesthetic
- [x] Dark mode toggle with localStorage persistence
- [x] Proper text contrast in both light and dark modes
- [x] Full-width page backgrounds for consistent theming
- [x] Navigation gradient logo using Tailwind native utilities
- [x] TypeScript strict typing throughout
- [x] No console errors
- [x] Works on Chrome and Safari

## Dark Mode Features Implemented
- **Toggle Button**: Sun/moon icon in navigation bar
- **Persistence**: User preference saved in localStorage
- **Auto-detection**: Respects system preference on first visit
- **Full Coverage**: All components support dark mode variants
- **Text Contrast**: All text meets WCAG standards in both modes
- **Backgrounds**: Full-width page backgrounds (white/dark gray)
- **Interactive Elements**: Buttons, inputs, cards all styled for both modes
- **Gradients**: Primary gradient maintained in both themes

---

**Specification Version**: 2.0.0-POC  
**Created**: 2025-11-21  
**Last Updated**: 2025-11-21  
**Scope**: Proof of Concept - Complete with Dark Mode  
**Status**: Implemented  
**Technology**: Next.js 14, TypeScript, Tailwind CSS
