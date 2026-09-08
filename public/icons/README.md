# NoteFlow PWA Icons

This directory contains the app icons for the NoteFlow Progressive Web App.

## Icon Sizes

The following icon sizes are required for full PWA support:

- 72x72 - Android home screen
- 96x96 - Android notification
- 128x128 - Chrome Web Store
- 144x144 - Windows tiles
- 152x152 - iOS home screen
- 192x192 - Android home screen (standard)
- 384x384 - Android high DPI
- 512x512 - Play Store listing

## Generating Icons

To generate PNG icons from the SVG source:

1. Open `icon.svg` in a browser
2. Use an online SVG to PNG converter (like https://svgtopng.com/)
3. Generate all required sizes listed above
4. Save them as `icon-{size}x{size}.png`

Alternatively, use ImageMagick:
```bash
convert icon.svg -resize 72x72 icon-72x72.png
convert icon.svg -resize 96x96 icon-96x96.png
convert icon.svg -resize 128x128 icon-128x128.png
convert icon.svg -resize 144x144 icon-144x144.png
convert icon.svg -resize 152x152 icon-152x152.png
convert icon.svg -resize 192x192 icon-192x192.png
convert icon.svg -resize 384x384 icon-384x384.png
convert icon.svg -resize 512x512 icon-512x512.png
```

Or use a Node.js script with sharp:
```bash
npm install sharp
node generate-icons.js
```

## iOS Splash Screens

iOS splash screens should match the app's loading state. Create them with:
- White or theme-colored background (#8b5cf6)
- App icon centered
- App name below icon (optional)

Required sizes:
- 640x1136 - iPhone 5/SE
- 750x1334 - iPhone 6/7/8
- 1242x2208 - iPhone 6/7/8 Plus
- 1125x2436 - iPhone X/XS/11 Pro
- 1536x2048 - iPad
