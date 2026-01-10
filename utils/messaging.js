/**
 * Messaging Utilities
 * Handles communication between popup and background service worker
 */

/**
 * Send a message to the background service worker
 * @param {string} action - The action to perform
 * @param {Object} payload - Additional data for the action
 * @returns {Promise<Object>} Response from background
 */
export async function sendMessage(action, payload = {}) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action, ...payload }, response => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else if (response && response.success === false) {
        reject(new Error(response.error || 'Unknown error'));
      } else {
        resolve(response);
      }
    });
  });
}

/**
 * Search history entries
 * @param {Object} params - Search parameters
 * @returns {Promise<Array>} History entries
 */
export async function searchHistory(params = {}) {
  const response = await sendMessage('searchHistory', { params });
  return response.data || [];
}

/**
 * Delete specific URLs from history
 * @param {string[]} urls - URLs to delete
 * @returns {Promise<Object>} Deletion result
 */
export async function deleteUrls(urls) {
  return sendMessage('deleteUrls', { urls });
}

/**
 * Delete history by time range
 * @param {number} startTime - Start timestamp
 * @param {number} endTime - End timestamp
 * @returns {Promise<Object>} Deletion result
 */
export async function deleteByTimeRange(startTime, endTime) {
  return sendMessage('deleteByTimeRange', { startTime, endTime });
}

/**
 * Get all bookmarked URLs
 * @returns {Promise<string[]>} Bookmarked URLs
 */
export async function getBookmarkedUrls() {
  const response = await sendMessage('getBookmarks');
  return response.data || [];
}

/**
 * Get extension settings
 * @returns {Promise<Object>} Settings object
 */
export async function getSettings() {
  const response = await sendMessage('getSettings');
  return response.data || {};
}

/**
 * Save extension settings
 * @param {Object} settings - Settings to save
 * @returns {Promise<Object>} Save result
 */
export async function saveSettings(settings) {
  return sendMessage('saveSettings', { settings });
}
