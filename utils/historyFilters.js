/**
 * History Filtering Utilities
 * Provides various filtering functions for history entries
 */

/**
 * Extract domain from URL
 * @param {string} url - The URL to parse
 * @returns {string|null} The domain or null if invalid
 */
export function extractDomain(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch {
    return null;
  }
}

/**
 * Extract protocol from URL
 * @param {string} url - The URL to parse
 * @returns {string|null} The protocol (http/https) or null
 */
export function extractProtocol(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol.replace(':', '');
  } catch {
    return null;
  }
}

/**
 * Extract path from URL
 * @param {string} url - The URL to parse
 * @returns {string|null} The path or null
 */
export function extractPath(url) {
  try {
    const parsed = new URL(url);
    return parsed.pathname;
  } catch {
    return null;
  }
}

/**
 * Filter history by domain
 * @param {Array} entries - History entries
 * @param {string} domain - Domain to match
 * @param {Object} options - Filter options
 * @returns {Array} Filtered entries
 */
export function filterByDomain(entries, domain, options = {}) {
  const { includeSubdomains = true, exactMatch = false } = options;
  const normalizedDomain = domain.toLowerCase().replace(/^www\./, '');

  return entries.filter(entry => {
    const entryDomain = extractDomain(entry.url);
    if (!entryDomain) return false;

    const normalizedEntryDomain = entryDomain.toLowerCase().replace(/^www\./, '');

    if (exactMatch) {
      return normalizedEntryDomain === normalizedDomain;
    }

    if (includeSubdomains) {
      return normalizedEntryDomain === normalizedDomain ||
             normalizedEntryDomain.endsWith('.' + normalizedDomain);
    }

    return normalizedEntryDomain === normalizedDomain;
  });
}

/**
 * Filter history by keyword search
 * @param {Array} entries - History entries
 * @param {string} keyword - Search keyword
 * @param {Object} options - Filter options
 * @returns {Array} Filtered entries
 */
export function filterByKeyword(entries, keyword, options = {}) {
  const { caseSensitive = false, searchIn = 'both' } = options;

  const searchTerm = caseSensitive ? keyword : keyword.toLowerCase();

  return entries.filter(entry => {
    const url = caseSensitive ? entry.url : entry.url.toLowerCase();
    const title = caseSensitive ? (entry.title || '') : (entry.title || '').toLowerCase();

    switch (searchIn) {
      case 'url':
        return url.includes(searchTerm);
      case 'title':
        return title.includes(searchTerm);
      case 'both':
      default:
        return url.includes(searchTerm) || title.includes(searchTerm);
    }
  });
}

/**
 * Filter history by regex pattern
 * @param {Array} entries - History entries
 * @param {string} pattern - Regex pattern
 * @param {Object} options - Filter options
 * @returns {Object} Result with filtered entries or error
 */
export function filterByRegex(entries, pattern, options = {}) {
  const { caseSensitive = false, searchIn = 'url' } = options;

  try {
    const flags = caseSensitive ? '' : 'i';
    const regex = new RegExp(pattern, flags);

    const filtered = entries.filter(entry => {
      switch (searchIn) {
        case 'url':
          return regex.test(entry.url);
        case 'title':
          return regex.test(entry.title || '');
        case 'both':
          return regex.test(entry.url) || regex.test(entry.title || '');
        default:
          return regex.test(entry.url);
      }
    });

    return { success: true, data: filtered };
  } catch (error) {
    return { success: false, error: `Invalid regex: ${error.message}` };
  }
}

/**
 * Validate a regex pattern
 * @param {string} pattern - The regex pattern to validate
 * @returns {Object} Validation result
 */
export function validateRegex(pattern) {
  try {
    new RegExp(pattern);
    return { valid: true };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

/**
 * Filter history by date range
 * @param {Array} entries - History entries
 * @param {number} startTime - Start timestamp (ms)
 * @param {number} endTime - End timestamp (ms)
 * @returns {Array} Filtered entries
 */
export function filterByDateRange(entries, startTime, endTime) {
  return entries.filter(entry => {
    const visitTime = entry.lastVisitTime;
    return visitTime >= startTime && visitTime <= endTime;
  });
}

/**
 * Filter history by protocol
 * @param {Array} entries - History entries
 * @param {string[]} protocols - Allowed protocols (e.g., ['http', 'https'])
 * @returns {Array} Filtered entries
 */
export function filterByProtocol(entries, protocols) {
  const normalizedProtocols = protocols.map(p => p.toLowerCase());

  return entries.filter(entry => {
    const protocol = extractProtocol(entry.url);
    return protocol && normalizedProtocols.includes(protocol);
  });
}

/**
 * Filter history by path pattern
 * @param {Array} entries - History entries
 * @param {string} pathPattern - Path pattern to match
 * @param {Object} options - Filter options
 * @returns {Array} Filtered entries
 */
export function filterByPath(entries, pathPattern, options = {}) {
  const { caseSensitive = false, useRegex = false } = options;

  if (useRegex) {
    try {
      const flags = caseSensitive ? '' : 'i';
      const regex = new RegExp(pathPattern, flags);

      return entries.filter(entry => {
        const path = extractPath(entry.url);
        return path && regex.test(path);
      });
    } catch {
      return [];
    }
  }

  const pattern = caseSensitive ? pathPattern : pathPattern.toLowerCase();

  return entries.filter(entry => {
    const path = extractPath(entry.url);
    if (!path) return false;
    const comparePath = caseSensitive ? path : path.toLowerCase();
    return comparePath.includes(pattern);
  });
}

/**
 * Exclude bookmarked URLs from history entries
 * @param {Array} entries - History entries
 * @param {string[]} bookmarkedUrls - URLs that are bookmarked
 * @returns {Array} Filtered entries without bookmarked URLs
 */
export function excludeBookmarked(entries, bookmarkedUrls) {
  const bookmarkSet = new Set(bookmarkedUrls);
  return entries.filter(entry => !bookmarkSet.has(entry.url));
}

/**
 * Get time range based on preset
 * @param {string} preset - Time preset name
 * @returns {Object} Start and end timestamps
 */
export function getTimeRangeFromPreset(preset) {
  const now = Date.now();
  const hour = 60 * 60 * 1000;
  const day = 24 * hour;

  switch (preset) {
    case 'lastHour':
      return { startTime: now - hour, endTime: now };
    case 'last24Hours':
      return { startTime: now - day, endTime: now };
    case 'last7Days':
      return { startTime: now - (7 * day), endTime: now };
    case 'last30Days':
      return { startTime: now - (30 * day), endTime: now };
    case 'today':
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      return { startTime: todayStart.getTime(), endTime: now };
    case 'all':
    default:
      return { startTime: 0, endTime: now };
  }
}

/**
 * Apply multiple filters to history entries
 * @param {Array} entries - History entries
 * @param {Object} filters - Filter configuration
 * @returns {Object} Result with filtered entries or error
 */
export function applyFilters(entries, filters) {
  let result = [...entries];

  // Apply domain filter
  if (filters.domain && filters.domain.value) {
    result = filterByDomain(result, filters.domain.value, {
      includeSubdomains: filters.domain.includeSubdomains,
      exactMatch: filters.domain.exactMatch
    });
  }

  // Apply keyword filter
  if (filters.keyword && filters.keyword.value) {
    result = filterByKeyword(result, filters.keyword.value, {
      caseSensitive: filters.keyword.caseSensitive,
      searchIn: filters.keyword.searchIn
    });
  }

  // Apply regex filter
  if (filters.regex && filters.regex.value) {
    const regexResult = filterByRegex(result, filters.regex.value, {
      caseSensitive: filters.regex.caseSensitive,
      searchIn: filters.regex.searchIn
    });

    if (!regexResult.success) {
      return regexResult;
    }
    result = regexResult.data;
  }

  // Apply date range filter
  if (filters.dateRange) {
    const { startTime, endTime } = filters.dateRange;
    if (startTime !== undefined && endTime !== undefined) {
      result = filterByDateRange(result, startTime, endTime);
    }
  }

  // Apply protocol filter
  if (filters.protocols && filters.protocols.length > 0) {
    result = filterByProtocol(result, filters.protocols);
  }

  // Apply path filter
  if (filters.path && filters.path.value) {
    result = filterByPath(result, filters.path.value, {
      caseSensitive: filters.path.caseSensitive,
      useRegex: filters.path.useRegex
    });
  }

  // Exclude bookmarked URLs
  if (filters.excludeBookmarked && filters.bookmarkedUrls) {
    result = excludeBookmarked(result, filters.bookmarkedUrls);
  }

  return { success: true, data: result };
}
