# NoteFlow - Progressive Web App (PWA)

A beautiful, feature-rich note-taking application with full RTL/Persian support, built as a Progressive Web App for iOS and other platforms.

![NoteFlow](https://img.shields.io/badge/version-1.0.0-purple)
![PWA](https://img.shields.io/badge/PWA-ready-brightgreen)
![iOS](https://img.shields.io/badge/iOS-compatible-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### Core Features
- 📝 **Rich Text Editor** - Bold, italic, underline, strikethrough, headers, alignment
- 🎨 **Customizable UI** - 8 beautiful color themes, 4 font sizes
- 🌐 **Bilingual Support** - Full English and Persian (Farsi) interface
- 📱 **RTL Support** - Complete right-to-left language support
- 🔤 **Multiple Fonts** - Vazirmatn, Nazanin, Calibri, and system fonts
- 🏷️ **Tag Management** - Create, edit, and delete custom tags with colors
- 📤 **Export Options** - Export notes as Image, PDF, Word, or Pages
- 🎤 **Voice Recording** - Record and playback voice memos inline
- 🖼️ **Image Support** - Insert and resize images inline
- 🎨 **Drawing Canvas** - Freehand drawing with pen, highlighter, and eraser
- ✅ **Checklists** - Interactive to-do lists
- 🔒 **Lock Notes** - Password-protected notes
- 📌 **Pin Notes** - Keep important notes at the top

### PWA Features
- 📱 **Installable** - Add to home screen on iOS and Android
- 🌐 **Offline Support** - Works without internet connection
- ⚡ **Fast Loading** - Cached resources for instant startup
- 🔄 **Auto Updates** - Always has the latest version
- 🎯 **Full Screen** - Native app-like experience
- 🔔 **Push Ready** - Infrastructure for push notifications

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/noteflow.git
cd noteflow

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Generating PWA Icons

To generate all required icon sizes from the SVG source:

```bash
cd public/icons
npm install sharp
node generate-icons.js
```

This will create all required icon sizes (72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512).

## 📱 Installing on iOS

### Method 1: Safari (Recommended)

1. Open **Safari** on your iPhone or iPad
2. Navigate to your NoteFlow URL
3. Tap the **Share button** (square with arrow)
4. Tap **"Add to Home Screen"**
5. Tap **"Add"**
6. NoteFlow icon appears on your home screen!

### Method 2: Chrome on iOS

1. Open **Chrome** on your iPhone or iPad
2. Navigate to your NoteFlow URL
3. Tap the **Share button**
4. Tap **"Add to Home Screen"**
5. Confirm by tapping **"Add"**

See [PWA_INSTALLATION.md](./PWA_INSTALLATION.md) for detailed installation instructions for all platforms.

## 🎨 Color Themes

NoteFlow includes 8 carefully crafted color themes:

1. **Violet** (بنفش) - Purple/violet tones (default)
2. **Ocean** (اقیانوس) - Cyan/teal blues
3. **Forest** (جنگل) - Emerald greens
4. **Sunset** (غروب) - Warm oranges
5. **Rose** (گل سرخ) - Pink/rose tones
6. **Midnight** (نیمه‌شب) - Deep indigo
7. **Emerald** (زمرد) - Teal greens
8. **Coral** (مرجانی) - Vibrant pinks

Change themes in **Settings** → **Color Theme**.

## 🔤 Font Options

Four font options available:

- **System** - Default system font
- **Vazirmatn** (وزیرمتن) - Modern Persian font
- **Nazanin** (نازنین) - Classic Persian font
- **Calibri** (کالیبری) - Popular Western font

Set font per-note in the editor toolbar.

## 📐 Font Sizes

Four UI size options:

- **Small** (کوچک) - 14px
- **Medium** (متوسط) - 16px (default)
- **Large** (بزرگ) - 18px
- **Extra Large** (خیلی بزرگ) - 20px

Adjust in **Settings** → **Font Size**.

## 🛠️ Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **html2canvas** - Image export
- **jsPDF** - PDF export
- **docx** - Word export
- **file-saver** - File downloads

## 📂 Project Structure

```
noteflow/
├── public/
│   ├── icons/              # PWA icons
│   │   ├── icon.svg        # Source SVG icon
│   │   ├── generate-icons.js
│   │   └── README.md
│   ├── manifest.json       # PWA manifest
│   ├── sw.js              # Service worker
│   └── splash-generator.html
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx   # Main dashboard
│   │   ├── Editor.tsx      # Rich text editor
│   │   ├── DrawingCanvas.tsx
│   │   ├── VoiceRecorder.tsx
│   │   ├── ImageBlock.tsx
│   │   ├── ExportMenu.tsx
│   │   ├── SettingsModal.tsx
│   │   ├── TagManager.tsx
│   │   └── InstallPrompt.tsx
│   ├── store.tsx          # State management
│   ├── types.ts           # TypeScript types
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🌐 Deployment

NoteFlow can be deployed to any static hosting service that supports HTTPS:

### Vercel
```bash
npm install -g vercel
vercel deploy
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### GitHub Pages
```bash
npm run build
# Push dist/ folder to gh-pages branch
```

### Firebase
```bash
npm install -g firebase-tools
firebase init
firebase deploy
```

**Important**: PWA requires HTTPS. All deployment targets must support HTTPS.

## 🐛 Troubleshooting

### Icons not showing on iOS?
- Use Safari (not Chrome) for installation
- Clear Safari cache and try again
- Ensure icons are in `/public/icons/` directory

### App not working offline?
- Check service worker registration in DevTools
- Verify HTTPS is enabled
- Check browser console for errors

### Can't install on desktop?
- Ensure HTTPS is enabled
- Check manifest.json is accessible
- Verify service worker is registered

### Build errors?
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📋 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ iOS Safari (iOS 11.3+)
- ✅ Samsung Internet

## 🔒 Privacy & Security

- All data stored locally in browser
- No server communication required
- No tracking or analytics
- Works completely offline
- Password-protected notes available

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Vazirmatn Font](https://github.com/rastikerdar/vazirmatn) - Beautiful Persian font
- [Font Awesome](https://fontawesome.com/) - Icons
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## 📞 Support

For issues, questions, or suggestions, please [open an issue](https://github.com/yourusername/noteflow/issues).

---

**Made with ❤️ for the Persian community and beyond**

**NoteFlow** - Beautiful note-taking with RTL support, voice recording, and rich text editing.
