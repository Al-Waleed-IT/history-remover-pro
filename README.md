# History Remover Pro

A powerful Chrome extension for selectively deleting browsing history with advanced filtering options.

## Features

- **Delete by Domain**: Exact domain matching with optional subdomain inclusion
- **Delete by Keyword**: Search URLs and page titles with case-sensitive option
- **Delete by Regex**: Advanced pattern matching using regular expressions
- **Delete by Date/Time**: Single date, date range, or relative presets (last hour, 24 hours, 7 days, etc.)
- **Protocol Filtering**: Filter by HTTP or HTTPS
- **Path Matching**: Filter URLs by path patterns
- **Bookmark Protection**: Optionally exclude bookmarked pages from deletion
- **Preview Before Delete**: See exactly what will be deleted before confirming
- **Individual & Bulk Selection**: Select specific entries or delete all matches

## Installation

### Development Build

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the extension:
   ```bash
   npm run build
   ```

3. Load in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `dist` folder

### Development Mode

For development with hot reload:

```bash
npm run dev
```

Then load the extension from the project root (not `dist`) for development.

## Usage

1. Click the extension icon in Chrome toolbar
2. Select a filter type (Keyword, Domain, or Regex)
3. Enter your search term
4. Optionally expand "Advanced Filters" to refine your search:
   - Time range (All time, Last hour, Last 24 hours, etc.)
   - Protocol (HTTP/HTTPS)
   - Path pattern
   - Case sensitivity
   - Subdomain inclusion
   - Bookmark exclusion
5. Click "Search" to preview matching entries
6. Select entries to delete (individually or "Select All")
7. Click "Delete Selected" and confirm

## Project Structure

```
History Remover/
├── manifest.json           # Extension manifest (MV3)
├── package.json            # NPM dependencies
├── vite.config.js          # Vite build configuration
├── background/
│   └── service-worker.js   # Background service worker
├── popup/
│   ├── index.html          # Popup entry point
│   ├── main.js             # Vue app initialization
│   ├── styles.css          # Tailwind CSS imports
│   ├── App.vue             # Main Vue component
│   └── components/
│       ├── SearchBar.vue       # Search input and filter type
│       ├── AdvancedFilters.vue # Advanced filter options
│       ├── HistoryList.vue     # History entries list
│       ├── ConfirmDialog.vue   # Delete confirmation
│       ├── SettingsPanel.vue   # Extension settings
│       └── Toast.vue           # Notifications
├── utils/
│   ├── historyFilters.js   # Filter logic utilities
│   └── messaging.js        # Background communication
├── icons/
│   ├── icon.svg            # Source icon
│   └── icon*.png           # Generated icons
└── scripts/
    └── generate-icons.js   # Icon generation script
```

## Permissions

- `history`: Required to search and delete browsing history
- `bookmarks`: Required for the "exclude bookmarked pages" feature
- `storage`: Required to persist user preferences

## Privacy

- All data processing happens locally in your browser
- No external APIs, tracking, or analytics
- Your browsing data never leaves your device

## Technical Details

- **Manifest Version**: 3 (latest Chrome extension standard)
- **UI Framework**: Vue 3 (Composition API)
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite

## Generating Proper Icons

The extension includes placeholder icons. To generate proper icons from the SVG:

1. Install sharp (optional):
   ```bash
   npm install sharp
   ```

2. Run the icon generator:
   ```bash
   node scripts/generate-icons.js
   ```

Or manually convert `icons/icon.svg` to 16x16, 32x32, 48x48, and 128x128 PNG files using any image editor.

## License

MIT License - Free for personal and commercial use.
