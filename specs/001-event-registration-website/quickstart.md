# Quickstart Guide: Event Registration Website

**Feature**: Event Registration Website POC  
**Date**: 2025-11-21  
**Estimated Setup Time**: 30 minutes

## Overview

This guide walks you through setting up and running the event registration website locally. The site is built with Next.js, TypeScript, and Tailwind CSS as a static site.

## Prerequisites

- **Node.js**: Version 18.17 or higher
- **npm** or **yarn**: Package manager
- **Git**: Version control
- **Code Editor**: VS Code recommended

Check versions:
```bash
node --version  # Should be v18.17+
npm --version   # Should be 9.0+
```

## Quick Start (TL;DR)

```bash
# From repository root
cd /Users/gabrielsze/Desktop/devsite

# Install dependencies
npm install

# Run development server
npm run dev

# Open browser to http://localhost:3000
```

## Detailed Setup

### Step 1: Create Next.js Project

```bash
# Navigate to project directory
cd /Users/gabrielsze/Desktop/devsite

# Create Next.js app with TypeScript and Tailwind
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir

# Answer prompts:
# ✔ Would you like to use ESLint? Yes
# ✔ Would you like to use Turbopack? No
# ✔ Would you like to customize the default import alias? No
```

This creates the basic structure:
- `app/` - Next.js App Router pages
- `public/` - Static assets
- `tailwind.config.ts` - Tailwind configuration
- `next.config.js` - Next.js configuration
- `package.json` - Dependencies

### Step 2: Configure for Static Export

Edit `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
```

### Step 3: Install Additional Dependencies

```bash
npm install date-fns
```

**Why date-fns**: Lightweight date formatting utility

### Step 4: Create Directory Structure

```bash
# Create directories
mkdir -p data
mkdir -p components
mkdir -p lib
mkdir -p types
mkdir -p public/images
```

Your structure should now look like:
```
devsite/
├── app/
├── components/
├── data/
├── lib/
├── types/
├── public/
│   └── images/
└── [config files]
```

### Step 5: Create Type Definitions

Create `types/index.ts`:

```typescript
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

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: FAQCategory;
}

export type FAQCategory = 'Registration' | 'Payment' | 'Access' | 'Support';

export interface FilterState {
  categories: EventCategory[];
  priceFilter: 'all' | 'free' | 'paid';
  searchQuery: string;
}
```

### Step 6: Create Mock Data

Create `data/events.ts` - see [data-model.md](./data-model.md) for full event list.

Quick starter (expand to 20):

```typescript
import { Event } from '@/types';

export const events: Event[] = [
  {
    id: 1,
    title: "Web Development Summit 2025",
    description: "Join industry leaders for a day of cutting-edge web development talks and workshops.",
    category: "Conference",
    date: "2025-12-15",
    time: "09:00",
    location: "San Francisco, CA",
    price: 199,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
    featured: true
  },
  // Add 19 more events...
];
```

Create `data/faqs.ts`:

```typescript
import { FAQItem } from '@/types';

export const faqs: FAQItem[] = [
  {
    id: 1,
    question: "How do I register for an event?",
    answer: "Click the 'Register' button on any event card. This will take you to the registration page where you can complete your booking.",
    category: "Registration"
  },
  // Add 9 more FAQs...
];
```

### Step 7: Run Development Server

```bash
npm run dev
```

Open browser: http://localhost:3000

You should see the default Next.js page. Now we'll build the actual pages.

## Development Workflow

### Creating Components

All components go in `components/` directory:

```typescript
// components/EventCard.tsx
import Image from 'next/image';
import { Event } from '@/types';

interface EventCardProps {
  event: Event;
  priority?: boolean;
}

export default function EventCard({ event, priority = false }: EventCardProps) {
  // Component implementation
}
```

### Creating Pages

Pages go in `app/` directory using App Router convention:

```typescript
// app/page.tsx - Landing page
import { events } from '@/data/events';

export default function Home() {
  const featuredEvents = events.filter(e => e.featured).slice(0, 6);
  
  return (
    <main>
      {/* Hero section */}
      {/* Featured events */}
    </main>
  );
}
```

### Client vs Server Components

**Server Components** (default):
- No 'use client' directive
- Cannot use hooks (useState, useEffect)
- Good for: EventCard, Hero, static content

**Client Components**:
- Add 'use client' at top
- Can use hooks and interactivity
- Good for: FilterBar, SearchBar, FAQItem

```typescript
'use client';
import { useState } from 'react';

export default function FilterBar() {
  const [selected, setSelected] = useState([]);
  // ...
}
```

### Styling with Tailwind

Use Tailwind utility classes directly in JSX:

```typescript
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition">
    {/* Card content */}
  </div>
</div>
```

**Responsive breakpoints**:
- `sm:` - 640px+
- `md:` - 768px+
- `lg:` - 1024px+

## Building and Deploying

### Build for Production

```bash
npm run build
```

This generates static files in the `out/` directory.

### Test Production Build Locally

```bash
npx serve@latest out
```

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel auto-detects Next.js and deploys
5. Get a live URL like `your-site.vercel.app`

### Deploy to Netlify

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. New site from Git → Select repo
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `out`
5. Deploy!

### Deploy to GitHub Pages

Add to `package.json`:
```json
{
  "scripts": {
    "deploy": "next build && touch out/.nojekyll && gh-pages -d out -t true"
  }
}
```

Install gh-pages:
```bash
npm install --save-dev gh-pages
```

Deploy:
```bash
npm run deploy
```

## Development Commands

```bash
# Development server (hot reload)
npm run dev

# Production build
npm run build

# Type checking
npm run type-check  # Add to package.json if not present

# Linting
npm run lint

# Format code (if Prettier installed)
npm run format
```

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### Images Not Loading

- Check image URLs are accessible
- Verify `unoptimized: true` in next.config.js for static export
- Use absolute URLs for external images

### Type Errors

```bash
# Check TypeScript errors
npx tsc --noEmit
```

### Build Fails

- Check all imports use `@/` alias correctly
- Verify no server-side features (API routes) in static export
- Ensure all images have width/height or fill prop

### Styling Not Applied

- Check Tailwind is configured in `tailwind.config.ts`
- Verify `globals.css` imports Tailwind directives
- Clear Next.js cache: `rm -rf .next`

## File Structure Reference

```
devsite/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   ├── globals.css          # Global styles
│   ├── events/
│   │   └── page.tsx         # Events page
│   └── faq/
│       └── page.tsx         # FAQ page
├── components/
│   ├── EventCard.tsx
│   ├── FilterBar.tsx
│   ├── SearchBar.tsx
│   ├── FAQItem.tsx
│   ├── Hero.tsx
│   ├── Navigation.tsx
│   └── Footer.tsx
├── data/
│   ├── events.ts            # 20 mock events
│   └── faqs.ts              # 10 FAQ items
├── lib/
│   └── utils.ts             # Helper functions
├── types/
│   └── index.ts             # TypeScript interfaces
├── public/
│   └── images/              # Static images (if any)
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Next Steps

1. ✅ Setup complete
2. Create components (see [contracts/components.md](./contracts/components.md))
3. Build pages (landing, events, FAQ)
4. Implement filtering and search
5. Add responsive styling
6. Test on mobile and desktop
7. Run Lighthouse audit
8. Deploy!

## Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Unsplash API](https://unsplash.com/developers) for images

## Getting Help

- Check [research.md](./research.md) for technical decisions
- Review [data-model.md](./data-model.md) for data structures
- See [contracts/components.md](./contracts/components.md) for component APIs
- Next.js Discord: [discord.gg/nextjs](https://discord.gg/nextjs)

---

**Setup Time**: ~30 minutes  
**Development Time**: ~8-10 hours for full POC  
**Status**: Ready to start building!
