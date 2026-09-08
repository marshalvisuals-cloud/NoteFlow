# NoteFlow PWA - iOS Installation Guide

NoteFlow is now a Progressive Web App (PWA) that can be installed on iOS devices and used like a native app!

## 📱 Installing on iOS (iPhone/iPad)

### Method 1: Safari (Recommended)

1. **Open Safari** on your iPhone or iPad
2. Navigate to your NoteFlow URL (e.g., `https://your-domain.com`)
3. Tap the **Share button** (square with arrow pointing up) at the bottom of the screen
4. Scroll down and tap **"Add to Home Screen"**
5. Tap **"Add"** in the top right corner
6. The NoteFlow icon will appear on your home screen
7. Tap the icon to launch the app in full-screen mode!

### Method 2: Chrome on iOS

1. Open **Chrome** on your iPhone or iPad
2. Navigate to your NoteFlow URL
3. Tap the **Share button** at the bottom
4. Tap **"Add to Home Screen"**
5. Confirm by tapping **"Add"**

## 🤖 Installing on Android

### Method 1: Chrome (Recommended)

1. Open **Chrome** on your Android device
2. Navigate to your NoteFlow URL
3. You'll see an **"Install NoteFlow"** prompt at the bottom
4. Tap **"Install"**
5. Or tap the **three dots menu** → **"Install app"**

### Method 2: Samsung Internet

1. Open **Samsung Internet**
2. Navigate to your NoteFlow URL
3. Tap the **menu button** (three lines)
4. Tap **"Add page to"** → **"Home screen"**

## 💻 Installing on Desktop

### Chrome/Edge

1. Navigate to your NoteFlow URL
2. Look for the **install icon** in the address bar (monitor with download arrow)
3. Click it and select **"Install"**
4. Or go to **Menu** → **"Install NoteFlow"**

### Safari on macOS

1. Navigate to your NoteFlow URL
2. Go to **File** → **"Add to Dock"**
3. Click **"Add"**

## ✨ Features After Installation

Once installed, NoteFlow works like a native app:

- ✅ **Offline Support** - Works without internet connection
- ✅ **Full Screen** - No browser UI, just the app
- ✅ **Home Screen Icon** - Quick access from your home screen
- ✅ **Fast Loading** - Cached resources for instant startup
- ✅ **Push Notifications** - (Future feature ready)
- ✅ **Auto Updates** - Always has the latest version

## 🔧 For Developers

### Generating Icons

To generate all required icon sizes from the SVG:

```bash
cd public/icons
npm install sharp
node generate-icons.js
```

### Testing PWA Features

1. Open Chrome DevTools
2. Go to **Application** tab
3. Check **Manifest** section
4. Check **Service Workers** section
5. Use **Lighthouse** to audit PWA compliance

### Building for Production

```bash
npm run build
```

The build output in `dist/` is ready to deploy to any static hosting service.

## 🌐 Deployment

NoteFlow can be deployed to any static hosting service:

- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy`
- **GitHub Pages**: Push to `gh-pages` branch
- **Firebase**: `firebase deploy`

**Important**: PWA requires HTTPS! Make sure your hosting supports HTTPS.

## 📋 PWA Checklist

- ✅ Web App Manifest (`manifest.json`)
- ✅ Service Worker (`sw.js`)
- ✅ HTTPS (required for PWA)
- ✅ Icons (multiple sizes)
- ✅ Offline support
- ✅ Responsive design
- ✅ iOS meta tags
- ✅ Theme color
- ✅ Standalone display mode

## 🐛 Troubleshooting

### Icon not showing on iOS?
- Make sure you're using Safari (not Chrome)
- Clear Safari cache and try again
- Ensure icons are in the correct location (`/icons/`)

### App not working offline?
- Check that service worker is registered
- Open DevTools → Application → Service Workers
- Check for errors in console

### Can't install on desktop?
- Make sure you're using HTTPS
- Check that manifest.json is accessible
- Verify service worker is registered

## 📞 Support

For issues or questions, please open an issue on the project repository.

---

**NoteFlow** - Beautiful note-taking with RTL support, voice recording, and rich text editing.
