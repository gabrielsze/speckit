# Deployment Guide - Eventure

## Prerequisites

✅ Node.js 20.9.0 or higher installed  
✅ All dependencies installed (`npm install`)  
✅ Project builds successfully (`npm run build`)

---

## Quick Deployment Options

### Option 1: Vercel (Recommended) ⭐

Vercel is the creators of Next.js and offers the best integration.

#### Method A: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
cd /Users/gabrielsze/Desktop/devsite
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? [Your account]
# - Link to existing project? No
# - Project name: eventure
# - Directory: ./
# - Override settings? No

# Production deployment
vercel --prod
```

#### Method B: GitHub Integration
1. Push code to GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure build settings (Vercel auto-detects Next.js)
6. Click "Deploy"

**Vercel Configuration** (auto-detected):
- Build Command: `npm run build`
- Output Directory: `out`
- Install Command: `npm install`
- Framework: Next.js

---

### Option 2: Netlify

Netlify offers great static hosting with easy setup.

#### Method A: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build the site
npm run build

# Deploy
netlify deploy --dir=out

# Production deployment
netlify deploy --prod --dir=out
```

#### Method B: Drag & Drop
1. Build the site: `npm run build`
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag the `out` folder to the upload area
4. Done!

#### Method C: GitHub Integration
1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Connect to GitHub and select repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `out`
6. Click "Deploy site"

**Netlify Configuration** (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = "out"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### Option 3: GitHub Pages

Free hosting for static sites directly from your GitHub repository.

#### Setup Steps
1. **Prepare Repository**
   ```bash
   # Ensure .nojekyll file exists for Next.js
   touch public/.nojekyll
   ```

2. **Update next.config.js**
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',
     basePath: '/repository-name',  // Add this
     images: {
       unoptimized: true,
     },
   };

   module.exports = nextConfig;
   ```

3. **Build and Deploy**
   ```bash
   # Build the site
   npm run build

   # Deploy to gh-pages branch
   npx gh-pages -d out
   ```

4. **Configure GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from branch
   - Branch: `gh-pages` / `/ (root)`
   - Save

5. **Access Your Site**
   - URL: `https://yourusername.github.io/repository-name`

---

### Option 4: AWS S3 + CloudFront

For AWS users, this provides a robust CDN solution.

#### Setup Steps
```bash
# 1. Build the site
npm run build

# 2. Install AWS CLI
# https://aws.amazon.com/cli/

# 3. Configure AWS credentials
aws configure

# 4. Create S3 bucket
aws s3 mb s3://eventure-static-site

# 5. Upload files
aws s3 sync out/ s3://eventure-static-site --delete

# 6. Configure bucket for static hosting
aws s3 website s3://eventure-static-site \
  --index-document index.html \
  --error-document 404.html

# 7. Make bucket public
aws s3api put-bucket-policy \
  --bucket eventure-static-site \
  --policy file://bucket-policy.json

# 8. Create CloudFront distribution (optional)
# Use AWS Console or CLI
```

**Bucket Policy** (`bucket-policy.json`):
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::eventure-static-site/*"
  }]
}
```

---

### Option 5: DigitalOcean App Platform

Simple deployment with GitHub integration.

#### Setup Steps
1. Push code to GitHub
2. Go to [DigitalOcean Control Panel](https://cloud.digitalocean.com)
3. Create → Apps → GitHub
4. Select repository
5. Configure:
   - Type: Static Site
   - Build command: `npm run build`
   - Output directory: `out`
6. Click "Next" and "Create Resources"

---

## Environment Configuration

### Production Environment Variables
Create `.env.production.local` if needed:
```bash
# Example environment variables
NEXT_PUBLIC_SITE_URL=https://eventure.com
NEXT_PUBLIC_GA_ID=UA-XXXXX-X
```

### Build Configuration
Verify `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Add basePath if deploying to subdirectory
  // basePath: '/subdirectory',
};

module.exports = nextConfig;
```

---

## Pre-Deployment Checklist

### Before First Deployment
- [ ] Node.js 20.9.0+ installed
- [ ] All dependencies installed (`npm install`)
- [ ] TypeScript passes (`npm run type-check`)
- [ ] Build succeeds (`npm run build`)
- [ ] Check `out/` directory contains files
- [ ] Test build locally (`npm run start` or serve `out/`)
- [ ] Update metadata in `app/layout.tsx`
- [ ] Add favicon to `public/`
- [ ] Configure SEO meta tags
- [ ] Add Google Analytics (if needed)

### Post-Deployment Verification
- [ ] Homepage loads correctly
- [ ] Featured events display
- [ ] Events page shows all 20 events
- [ ] Filtering works (category + price)
- [ ] Search works (with debounce)
- [ ] Sorting works (date + name)
- [ ] FAQ page loads with accordion
- [ ] Mobile responsive layout works
- [ ] All navigation links work
- [ ] Images load properly
- [ ] No console errors
- [ ] Lighthouse score ≥85

---

## Custom Domain Setup

### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS:
   - Type: `A` Record → `76.76.21.21`
   - Type: `CNAME` → `cname.vercel-dns.com`
4. Wait for DNS propagation (up to 48 hours)

### Netlify
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS:
   - Type: `CNAME` → `yoursitename.netlify.app`
4. Enable HTTPS (automatic)

### GitHub Pages
1. Add `CNAME` file to `public/` directory:
   ```
   yourdomain.com
   ```
2. Configure DNS at your registrar:
   - Type: `A` Records (4 required):
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - Type: `CNAME` → `yourusername.github.io`

---

## Continuous Deployment (CI/CD)

### GitHub Actions (Example)
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## Performance Optimization

### Before Deployment
1. **Optimize Images**: Use proper image formats (WebP, AVIF)
2. **Minify CSS/JS**: Next.js does this automatically
3. **Enable Compression**: Hosting providers handle this
4. **Add Caching Headers**: Configure in hosting settings
5. **Use CDN**: Most hosts provide this automatically

### Post-Deployment
1. Run Lighthouse audit
2. Check Core Web Vitals
3. Test loading speed on 3G/4G
4. Verify mobile performance
5. Check bundle size

---

## Monitoring & Analytics

### Google Analytics
Add to `app/layout.tsx`:
```typescript
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_ID}');
  `}
</Script>
```

### Vercel Analytics
```bash
npm install @vercel/analytics
```

Add to `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next out node_modules
npm install
npm run build
```

### Images Not Loading
- Check `next.config.js` has `unoptimized: true`
- Verify images are in `public/` directory
- Check console for 404 errors

### 404 Errors on Refresh
- Ensure `trailingSlash: true` in `next.config.js` (if needed)
- Configure hosting redirects (see platform docs)

### Slow Loading
- Run Lighthouse audit
- Check bundle size with `npm run build -- --profile`
- Optimize images
- Enable CDN

---

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Next.js Docs**: https://nextjs.org/docs
- **GitHub Pages**: https://pages.github.com

---

**Ready to Deploy?** Start with Vercel for the easiest experience! 🚀
