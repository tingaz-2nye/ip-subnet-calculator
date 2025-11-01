# Progressive Web App (PWA) Setup

This IP Subnet Calculator is now a Progressive Web App! 🎉

## Features

✅ **Offline Access** - Works without internet connection after first load
✅ **Install to Home Screen** - Add to your device like a native app
✅ **Fast Loading** - Cached resources for instant startup
✅ **Auto Updates** - Automatically updates in the background
✅ **Cross-Platform** - Works on desktop, mobile, and tablet

## Installation Instructions

### Desktop (Chrome, Edge, Brave)
1. Visit the website
2. Look for the install prompt at the top or click the install icon in the address bar
3. Click "Install" 
4. The app will be added to your applications

### Mobile (Android)
1. Open the website in Chrome/Edge
2. Tap the menu (three dots)
3. Select "Install app" or "Add to Home Screen"
4. Follow the prompts

### Mobile (iOS)
1. Open the website in Safari
2. Tap the Share button
3. Scroll and tap "Add to Home Screen"
4. Tap "Add"

## PWA Files

- **`/public/manifest.json`** - App metadata and configuration
- **`/public/sw.js`** - Service worker for offline functionality
- **`/public/icon-192.svg`** - Small app icon
- **`/public/icon-512.svg`** - Large app icon
- **`/src/components/PWAInstaller.tsx`** - Install prompt component
- **`/src/app/layout.tsx`** - PWA metadata configuration

## Testing PWA

### Chrome DevTools
1. Open Chrome DevTools (F12)
2. Go to "Application" tab
3. Check "Manifest" to see app configuration
4. Check "Service Workers" to verify registration
5. Use "Lighthouse" to audit PWA score

### Test Offline
1. Open DevTools
2. Go to Network tab
3. Check "Offline" checkbox
4. Reload the page - it should still work!

## Customization

### Update Icons
Replace `/public/icon-192.svg` and `/public/icon-512.svg` with your custom PNG/SVG icons

### Change Theme Color
Edit `theme_color` in `/public/manifest.json` and `themeColor` in `/src/app/layout.tsx`

### Update App Name
Modify `name` and `short_name` in `/public/manifest.json`

## Browser Support

- ✅ Chrome (Desktop & Mobile)
- ✅ Edge (Desktop & Mobile)  
- ✅ Safari (iOS 11.3+)
- ✅ Firefox (Desktop & Mobile)
- ✅ Samsung Internet
- ✅ Opera

## Deployment

When deployed to production, ensure:
1. HTTPS is enabled (required for service workers)
2. All paths in manifest.json are correct
3. Icons are optimized and properly sized
4. Service worker is in the public directory

## Next Steps

Consider adding:
- Push notifications
- Background sync
- Periodic background sync
- Advanced caching strategies
- Offline data persistence

---

Built with Next.js 16 and modern PWA best practices! 🚀
