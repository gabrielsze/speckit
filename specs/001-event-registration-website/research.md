# Research: Event Registration Website

**Feature**: Event Registration Website POC  
**Date**: 2025-11-21  
**Phase**: 0 - Research & Decision Documentation

## Overview

This document consolidates research findings and technical decisions for building a modern event registration website using Next.js with static site generation.

## Technical Decisions

### 1. Framework: Next.js 14+ with Static Export

**Decision**: Use Next.js App Router with static export configuration

**Rationale**:
- Next.js provides excellent static site generation (SSG) capabilities
- App Router offers modern React patterns with Server Components
- Built-in Image optimization component
- Automatic code splitting and performance optimization
- Easy deployment to static hosting (Vercel, Netlify, GitHub Pages)
- TypeScript support out of the box
- Great developer experience with hot reload

**Alternatives Considered**:
- **Plain HTML/CSS/JS**: Rejected - less maintainable for component reuse, no built-in optimization
- **Gatsby**: Rejected - more complex for simple POC, heavier build process
- **Astro**: Rejected - less familiar tooling, Next.js better suited for potential future enhancements
- **Vite + React**: Rejected - requires more manual configuration for static export and routing

**Configuration Required**:
```javascript
// next.config.js
module.exports = {
  output: 'export',
  images: {
    unoptimized: true // Required for static export
  }
}
```

### 2. Styling: Tailwind CSS

**Decision**: Use Tailwind CSS for styling

**Rationale**:
- Rapid development with utility-first classes
- Built-in responsive design system
- Small production bundle (unused classes purged)
- Consistent design tokens (colors, spacing, breakpoints)
- Works seamlessly with Next.js
- Easy to create custom design system

**Alternatives Considered**:
- **Plain CSS**: Rejected - slower development, harder to maintain consistency
- **CSS Modules**: Rejected - more verbose, less rapid prototyping
- **Styled Components**: Rejected - runtime overhead, not needed for static site
- **Bootstrap**: Rejected - heavier, less customizable, dated aesthetic

**Configuration**:
- Mobile-first breakpoints: sm (640px), md (768px), lg (1024px)
- Custom color palette for brand gradient
- Typography scale for hierarchy

### 3. Mock Data Structure

**Decision**: TypeScript data file with exported array of events

**Rationale**:
- Simple and maintainable for POC
- Type safety with TypeScript interfaces
- Easy to import and use throughout components
- No build-time data fetching needed
- Can be easily migrated to API later

**Data Structure**:
```typescript
interface Event {
  id: number;
  title: string;
  description: string;
  category: 'Conference' | 'Workshop' | 'Networking' | 'Tech Talk';
  date: string; // ISO format
  location: string;
  price: number; // 0 for free
  image: string;
  featured: boolean;
}
```

**Alternatives Considered**:
- **JSON file**: Rejected - no type safety
- **CMS (Contentful, Sanity)**: Rejected - overkill for POC, adds complexity
- **Markdown files**: Rejected - unnecessary parsing overhead

### 4. Image Handling

**Decision**: Use Unsplash API for placeholder images + Next.js Image component

**Rationale**:
- High-quality, free event-themed images
- Next.js Image component provides automatic optimization
- Lazy loading built-in
- Responsive image sizing

**Implementation**:
```typescript
// Use Unsplash source URLs
image: 'https://images.unsplash.com/photo-[id]?w=800&h=600&fit=crop'
```

**Alternatives Considered**:
- **Local images**: Rejected - requires sourcing/creating 20 images
- **Placeholder.com**: Rejected - generic, not realistic
- **Lorem Picsum**: Rejected - random images, less relevant

### 5. State Management for Filters

**Decision**: React useState hooks with URL params (optional)

**Rationale**:
- Simple client-side state for POC
- No global state library needed
- URL params allow shareable filtered views (nice-to-have)
- Aligns with Next.js patterns

**Alternatives Considered**:
- **Redux/Zustand**: Rejected - overkill for simple filtering
- **Context API**: Rejected - unnecessary for component-local state
- **URL-only state**: Rejected - more complex for POC

### 6. Search Implementation

**Decision**: Client-side string matching with debouncing

**Rationale**:
- Fast for 20 events
- No backend needed
- Simple implementation with filter()
- Debounce (300ms) prevents excessive re-renders

**Implementation**:
```typescript
const filteredEvents = events.filter(event =>
  event.title.toLowerCase().includes(query.toLowerCase()) ||
  event.description.toLowerCase().includes(query.toLowerCase())
);
```

**Alternatives Considered**:
- **Full-text search library (Fuse.js)**: Rejected - overkill for 20 items
- **Server-side search**: Rejected - no backend in POC

## Best Practices Research

### Next.js Static Export Best Practices

1. **Use Server Components by default**: Reduces JavaScript bundle
2. **Mark interactive components with 'use client'**: Filters, search, accordion
3. **Optimize images**: Use next/image with appropriate sizes
4. **Generate static params**: Use generateStaticParams for dynamic routes (if needed later)
5. **Avoid dynamic features**: No API routes, middleware, ISR in static export

### Performance Optimization

1. **Code splitting**: Next.js automatic, keep components modular
2. **Image optimization**: 
   - Use WebP format
   - Lazy load below-the-fold images
   - Set proper width/height to prevent layout shift
3. **CSS optimization**: 
   - Tailwind purges unused styles
   - Critical CSS inlined automatically
4. **JavaScript optimization**:
   - Minimize client components
   - Use dynamic imports for heavy components

### Responsive Design Patterns

1. **Mobile-first**: Start with mobile layout, enhance for desktop
2. **Touch targets**: Minimum 44px (use p-3 or larger for interactive elements)
3. **Grid layouts**: 
   - Mobile: 1 column
   - Desktop: 3 columns (CSS Grid or Tailwind grid)
4. **Navigation**: Simple navigation bar, consider mobile menu if needed
5. **Typography**: Scale up for desktop (text-base → text-lg)

### Accessibility Considerations (POC Scope)

1. **Semantic HTML**: Use proper heading hierarchy (h1, h2, h3)
2. **ARIA labels**: Add to interactive elements (buttons, filters)
3. **Alt text**: All images need descriptive alt text
4. **Keyboard navigation**: Ensure tab order is logical
5. **Focus indicators**: Keep default or style visibly
6. **Color contrast**: Use Tailwind's default colors (generally WCAG AA compliant)

## Component Architecture

### Page Components (Server Components)
- `app/page.tsx` - Landing page with hero + featured events
- `app/events/page.tsx` - Events page with filter/search wrapper
- `app/faq/page.tsx` - FAQ page with accordion wrapper

### Client Components ('use client')
- `FilterBar` - Category and price filters (useState)
- `SearchBar` - Search input with debouncing (useState, useEffect)
- `FAQItem` - Individual accordion item with expand/collapse (useState)

### Server Components (no 'use client')
- `EventCard` - Display event data (reusable)
- `Hero` - Hero section with CTA
- `Layout` - Root layout with navigation

## Data Flow

```
events.ts (data source)
    ↓
Page Component (server) - passes data
    ↓
FilterBar + SearchBar (client) - user interactions
    ↓
Filtered event list
    ↓
EventCard (server) - renders each event
```

## Deployment Strategy

**Platform**: Vercel (recommended) or Netlify

**Rationale**:
- Free tier sufficient for POC
- Automatic deployments from Git
- CDN distribution globally
- HTTPS by default
- Zero configuration for Next.js

**Build Command**: `npm run build`  
**Output Directory**: `out/`

**Alternatives Considered**:
- **GitHub Pages**: Works, but requires more setup for custom domain
- **Netlify**: Equally good option
- **AWS S3/CloudFront**: Overkill for POC

## Development Workflow

1. **Setup**: `npx create-next-app@latest` with TypeScript + Tailwind
2. **Structure**: Create directories as per plan.md
3. **Data**: Create mock events data
4. **Components**: Build reusable components
5. **Pages**: Assemble pages from components
6. **Styling**: Apply Tailwind classes for responsive design
7. **Test**: Manual testing on mobile and desktop
8. **Audit**: Run Lighthouse for performance/accessibility
9. **Deploy**: Push to Git, auto-deploy via Vercel

## Timeline Estimate (POC)

- **Setup & Configuration**: 30 minutes
- **Mock Data Creation**: 45 minutes (20 events with realistic content)
- **Component Development**: 2-3 hours
- **Page Assembly**: 1-2 hours
- **Styling & Responsive**: 2-3 hours
- **Testing & Polish**: 1 hour
- **Total**: ~8-10 hours for full POC

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Image loading slow | Use optimized Unsplash URLs, lazy loading |
| Complex filtering logic | Keep simple AND logic, defer advanced features |
| Mobile performance | Minimize client JS, use Server Components |
| Accessibility gaps | Document for post-POC, implement basics |
| Browser compatibility | Test on Chrome/Safari, use stable Next.js features |

## Success Metrics

- ✅ All 3 pages functional
- ✅ Filtering and search work smoothly
- ✅ Mobile and desktop responsive
- ✅ Lighthouse score > 85 (POC baseline)
- ✅ No console errors
- ✅ Clean, maintainable code structure

---

**Research Complete**: 2025-11-21  
**Ready for Phase 1**: Data Model & Contracts
