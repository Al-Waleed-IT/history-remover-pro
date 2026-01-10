/**
 * Background Service Worker for History Remover Pro
 * Handles all chrome.history API operations and message passing
 */

// Default settings for the extension
const DEFAULT_SETTINGS = {
  maxResults: 10000,
  caseSensitive: false,
  includeSubdomains: true,
  excludeBookmarked: false,
  defaultTimeRange: 'all'
};

// Initialize extension on install
chrome.runtime.onInstalled.addListener(async () => {
  const stored = await chrome.storage.local.get('settings');
  if (!stored.settings) {
    await chrome.storage.local.set({ settings: DEFAULT_SETTINGS });
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  handleMessage(request).then(sendResponse).catch(error => {
    sendResponse({ success: false, error: error.message });
  });
  return true; // Keep message channel open for async response
});

/**
 * Route messages to appropriate handlers
 */
async function handleMessage(request) {
  switch (request.action) {
    case 'searchHistory':
      return await searchHistory(request.params);
    case 'deleteUrls':
      return await deleteUrls(request.urls);
    case 'deleteByTimeRange':
      return await deleteByTimeRange(request.startTime, request.endTime);
    case 'getBookmarks':
      return await getBookmarkedUrls();
    case 'getSettings':
      return await getSettings();
    case 'saveSettings':
      return await saveSettings(request.settings);
    default:
      throw new Error(`Unknown action: ${request.action}`);
  }
}

/**
 * Search history with various filter options
 * @param {Object} params - Search parameters
 * @returns {Promise<Object>} Search results
 */
async function searchHistory(params) {
  const settings = await getSettings();
  const {
    text = '',
    startTime = 0,
    endTime = Date.now(),
    maxResults = settings.maxResults || 10000
  } = params;

  try {
    const results = await chrome.history.search({
      text,
      startTime,
      endTime,
      maxResults
    });

    return {
      success: true,
      data: results.map(item => ({
        id: item.id,
        url: item.url,
        title: item.title || '',
        lastVisitTime: item.lastVisitTime,
        visitCount: item.visitCount,
        typedCount: item.typedCount
      }))
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Delete specific URLs from history
 * @param {string[]} urls - Array of URLs to delete
 * @returns {Promise<Object>} Deletion result
 */
async function deleteUrls(urls) {
  if (!urls || !Array.isArray(urls) || urls.length === 0) {
    return { success: false, error: 'No URLs provided' };
  }

  const results = {
    success: true,
    deleted: 0,
    failed: 0,
    errors: []
  };

  // Process deletions in batches to avoid overwhelming the API
  const BATCH_SIZE = 50;
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (url) => {
        try {
          await chrome.history.deleteUrl({ url });
          results.deleted++;
        } catch (error) {
          results.failed++;
          results.errors.push({ url, error: error.message });
        }
      })
    );
  }

  return results;
}

/**
 * Delete all history within a time range
 * @param {number} startTime - Start timestamp
 * @param {number} endTime - End timestamp
 * @returns {Promise<Object>} Deletion result
 */
async function deleteByTimeRange(startTime, endTime) {
  try {
    await chrome.history.deleteRange({
      startTime,
      endTime
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get all bookmarked URLs for exclusion filtering
 * @returns {Promise<Object>} Bookmarked URLs
 */
async function getBookmarkedUrls() {
  try {
    const bookmarkTree = await chrome.bookmarks.getTree();
    const urls = new Set();

    function extractUrls(nodes) {
      for (const node of nodes) {
        if (node.url) {
          urls.add(node.url);
        }
        if (node.children) {
          extractUrls(node.children);
        }
      }
    }

    extractUrls(bookmarkTree);
    return { success: true, data: Array.from(urls) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get extension settings from storage
 * @returns {Promise<Object>} Settings object
 */
async function getSettings() {
  const stored = await chrome.storage.local.get('settings');
  return { success: true, data: stored.settings || DEFAULT_SETTINGS };
}

/**
 * Save extension settings to storage
 * @param {Object} settings - Settings to save
 * @returns {Promise<Object>} Save result
 */
async function saveSettings(settings) {
  try {
    await chrome.storage.local.set({ settings });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
