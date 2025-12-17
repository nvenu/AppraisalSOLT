# 🎨 Branding Guide - Source of Life Technologies

## Logo Placement

Your company logo and branding now appear in:

1. **Login Page** - Top of the authentication card
2. **Admin Login Page** - Top of the admin login card
3. **Footer** - Bottom of every page with company name

## Adding Your Logo

### Step 1: Prepare Your Logo

**Recommended Specifications:**
- **Format**: PNG with transparent background or SVG
- **Size**: 200x60 pixels (or similar 3:1 aspect ratio)
- **File size**: Under 100KB for fast loading
- **Background**: Transparent (PNG) or white/transparent (SVG)

### Step 2: Add Logo File

1. Save your logo file as one of these names:
   - `solt-logo.png` (PNG format)
   - `solt-logo.svg` (SVG format - recommended)

2. Place it in the `public/images/` folder:
   ```
   public/
     images/
       solt-logo.svg  ← Your logo here
   ```

3. The app will automatically use your logo!

### Step 3: Verify

1. Restart the development server:
   ```bash
   npm run dev
   ```

2. Visit http://localhost:3001
3. You should see your logo at:
   - Top of login page
   - Top of admin login page
   - Bottom footer on all pages

## Current Placeholder

A temporary placeholder logo is currently being used:
- Blue circle with tree/life symbol
- "Source of Life Technologies" text
- Located at: `public/images/solt-logo.svg`

**Replace this with your actual logo!**

## Customization Options

### Change Footer Text

Edit `components/Footer.tsx`:

```typescript
<p className="text-xs text-gray-400 mt-1">
  Empowering Growth Through Feedback  ← Change this tagline
</p>
```

### Change Company Name Display

Edit `components/Footer.tsx` and `app/page.tsx`:

```typescript
<p className="text-sm font-semibold text-gray-900">
  Source of Life Technologies  ← Change company name
</p>
```

### Change Logo Size

**Login Page** (`app/page.tsx`):
```typescript
<img
  src="/images/solt-logo.svg"
  className="h-16 w-auto"  ← Change h-16 to h-20, h-24, etc.
/>
```

**Footer** (`components/Footer.tsx`):
```typescript
<div className="relative w-12 h-12">  ← Change size here
```

## Color Scheme

Current brand colors:
- **Primary Blue**: `#2563EB` (Tailwind: `blue-600`)
- **Text Dark**: `#1F2937` (Tailwind: `gray-900`)
- **Text Light**: `#6B7280` (Tailwind: `gray-500`)

To change colors, edit `tailwind.config.js` or use different Tailwind classes.

## Footer Customization

### Add Social Media Links

Edit `components/Footer.tsx`:

```typescript
<div className="flex gap-4 mt-2">
  <a href="https://linkedin.com/company/your-company" className="text-gray-400 hover:text-gray-600">
    <LinkedinIcon className="h-5 w-5" />
  </a>
  <a href="https://twitter.com/your-company" className="text-gray-400 hover:text-gray-600">
    <TwitterIcon className="h-5 w-5" />
  </a>
</div>
```

### Add Contact Information

```typescript
<p className="text-xs text-gray-500 mt-1">
  contact@sourceoflife.com | +1 (555) 123-4567
</p>
```

### Add Privacy Policy Link

```typescript
<div className="flex gap-4 text-xs text-gray-500">
  <a href="/privacy" className="hover:text-gray-700">Privacy Policy</a>
  <a href="/terms" className="hover:text-gray-700">Terms of Service</a>
</div>
```

## Testing

After adding your logo:

1. **Check all pages**:
   - Login page: http://localhost:3001
   - Admin login: http://localhost:3001/admin
   - Employee dashboard (after login)
   - Manager dashboard (after admin login)

2. **Verify footer appears** on all pages

3. **Check mobile view**:
   - Open DevTools (F12)
   - Toggle device toolbar
   - Test on different screen sizes

## Troubleshooting

### Logo not showing?

1. **Check file path**: Must be `public/images/solt-logo.svg` or `.png`
2. **Check file name**: Must be exactly `solt-logo.svg` (lowercase)
3. **Restart server**: Stop and run `npm run dev` again
4. **Clear browser cache**: Hard refresh with Ctrl+Shift+R

### Logo too big/small?

Adjust the height class:
- `h-12` = 48px
- `h-16` = 64px
- `h-20` = 80px
- `h-24` = 96px

### Footer not showing?

Check that `app/layout.tsx` includes:
```typescript
import { Footer } from '@/components/Footer'
```

And renders it:
```typescript
<Footer />
```

## Production Deployment

When deploying to production:

1. **Optimize logo file**:
   - Compress PNG files
   - Minify SVG files
   - Keep file size under 100KB

2. **Use Next.js Image component** for better optimization:
   ```typescript
   import Image from 'next/image'
   
   <Image
     src="/images/solt-logo.svg"
     alt="Source of Life Technologies"
     width={200}
     height={60}
     priority
   />
   ```

3. **Test on production URL** after deployment

---

**Need help?** Check the files:
- `components/Footer.tsx` - Footer component
- `app/page.tsx` - Login page with logo
- `app/admin/page.tsx` - Admin login with logo
- `public/images/` - Logo files location
