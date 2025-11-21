# DevSite Constitution

## Core Principles

### I. Static-First
All content must be deliverable as static files; No server-side processing required for core functionality; Assets must be optimized for web delivery (compressed images, minified CSS/JS)

### II. Responsive Design
Mobile-first approach required; Support viewport sizes from 320px to 4K; Touch-friendly UI elements with minimum 44px tap targets

### III. Performance Standards
Initial page load under 3 seconds on 3G; Lighthouse performance score above 90; Images lazy-loaded below the fold; Critical CSS inlined

### IV. Accessibility (WCAG 2.1 AA)
Semantic HTML required; Keyboard navigation support; Alt text for all images; Color contrast ratio minimum 4.5:1; ARIA labels where needed

### V. Browser Compatibility
Support latest 2 versions of Chrome, Firefox, Safari, Edge; Graceful degradation for older browsers; No breaking JavaScript errors

## Technical Requirements

### File Structure
Organized directory structure (html/, css/, js/, assets/); Clear naming conventions; Version control with Git

### Asset Management
Optimized images (WebP with fallbacks); SVG for icons and logos; Fonts subset and self-hosted or CDN; CSS and JS bundled and minified for production

### SEO Basics
Valid HTML5 markup; Meta tags (title, description) on all pages; Semantic heading hierarchy; Sitemap.xml and robots.txt

## Development Workflow

### Code Quality
HTML/CSS/JS validated before deployment; Consistent code formatting; Comments for complex logic; No console errors in production

### Testing
Manual cross-browser testing; Lighthouse audit before release; Link validation; Form testing (if applicable)

### Deployment
Static hosting (GitHub Pages, Netlify, Vercel, etc.); HTTPS enabled; Deploy from version control

## Governance

This constitution defines minimum standards for the static web app; All changes must maintain or improve performance and accessibility scores; Updates to constitution require documentation of rationale

**Version**: 1.0.0 | **Ratified**: 2025-11-21 | **Last Amended**: 2025-11-21
