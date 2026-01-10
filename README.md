# History Remover Pro

A powerful Chrome extension for selectively deleting browsing history with advanced filtering options.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green?logo=googlechrome)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue)
![Vue 3](https://img.shields.io/badge/Vue-3-brightgreen?logo=vuedotjs)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%20v4-06B6D4?logo=tailwindcss)

## Features

- **Delete by Domain** - Exact domain matching with optional subdomain inclusion
- **Delete by Keyword** - Search URLs and page titles with case-sensitive option
- **Delete by Regex** - Advanced pattern matching using regular expressions
- **Delete by Date/Time** - Single date, date range, or relative presets (last hour, 24 hours, 7 days, etc.)
- **Protocol Filtering** - Filter by HTTP or HTTPS
- **Path Matching** - Filter URLs by path patterns
- **Bookmark Protection** - Optionally exclude bookmarked pages from deletion
- **Preview Before Delete** - See exactly what will be deleted before confirming
- **Individual & Bulk Selection** - Select specific entries or delete all matches

## Installation

### From Release (Recommended)

1. Download the latest `history-remover-pro-v*.zip` from [Releases](https://github.com/Al-Waleed-IT/history-remover-pro/releases)
2. Extract the ZIP to a folder
3. Open Chrome and go to `chrome://extensions/`
4. Enable **Developer mode** (toggle in top right)
5. Click **Load unpacked**
6. Select the extracted folder

### Build from Source

```bash
# Clone the repository
git clone https://github.com/Al-Waleed-IT/history-remover-pro.git
cd history-remover-pro

# Install dependencies
npm install

# Build the extension
npm run build

# Load the 'dist' folder as an unpacked extension in Chrome
```

## Usage

1. Click the extension icon in Chrome toolbar
2. Click **"Open History Manager"** to open the full interface
3. Select a filter type (Keyword, Domain, or Regex)
4. Enter your search term
5. Optionally expand **Advanced Filters** to refine your search:
   - Time range (All time, Last hour, Last 24 hours, etc.)
   - Protocol (HTTP/HTTPS)
   - Path pattern
   - Case sensitivity
   - Subdomain inclusion
   - Bookmark exclusion
6. Click **Search** to preview matching entries
7. Select entries to delete (individually or "Select All")
8. Click **Delete Selected** and confirm

## Project Structure

```
history-remover-pro/
├── manifest.json           # Extension manifest (MV3)
├── package.json            # NPM dependencies
├── vite.config.js          # Vite build configuration
├── background/
│   └── service-worker.js   # Background service worker
├── popup/                  # Popup launcher
│   ├── index.html
│   ├── main.js
│   ├── styles.css
│   └── App.vue
├── page/                   # Full-page interface
│   ├── index.html
│   ├── main.js
│   ├── styles.css
│   ├── App.vue
│   └── components/
│       ├── SearchBar.vue
│       ├── AdvancedFilters.vue
│       ├── HistoryList.vue
│       ├── ConfirmDialog.vue
│       ├── SettingsPanel.vue
│       └── Toast.vue
├── utils/
│   ├── historyFilters.js   # Filter logic utilities
│   └── messaging.js        # Background communication
└── icons/
    └── icon*.png           # Extension icons
```

## Permissions

| Permission | Purpose |
|------------|---------|
| `history` | Search and delete browsing history |
| `bookmarks` | Enable "exclude bookmarked pages" feature |
| `storage` | Persist user preferences |

## Privacy

- All data processing happens locally in your browser
- No external APIs, tracking, or analytics
- Your browsing data never leaves your device
- Open source - audit the code yourself

## Development

```bash
# Install dependencies
npm install

# Build popup only
npm run build:popup

# Build page only
npm run build:page

# Build everything
npm run build
```

## Tech Stack

- **Manifest Version**: 3 (latest Chrome extension standard)
- **UI Framework**: Vue 3 (Composition API)
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - Free for personal and commercial use.
