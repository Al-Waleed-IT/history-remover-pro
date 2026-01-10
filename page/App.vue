<template>
  <div class="flex flex-col h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0 shadow-sm">
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-800">History Remover Pro</h1>
            <p class="text-sm text-gray-500">Selectively delete your browsing history</p>
          </div>
        </div>
        <button
          @click="showSettings = !showSettings"
          :class="[
            'p-2 rounded-lg transition-colors',
            showSettings ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          ]"
          title="Settings"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </header>

    <!-- Settings Panel -->
    <SettingsPanel
      v-if="showSettings"
      :settings="settings"
      @update="updateSettings"
      @close="showSettings = false"
    />

    <!-- Main Content -->
    <main v-else class="flex-1 min-h-0 overflow-hidden flex flex-col">
      <div class="max-w-4xl mx-auto w-full flex-1 min-h-0 flex flex-col px-6 py-4">
        <!-- Search and Filter Bar -->
        <SearchBar
          :filter-type="filterType"
          :search-value="searchValue"
          @update:filter-type="filterType = $event"
          @update:search-value="searchValue = $event"
          @search="performSearch"
        />

        <!-- Advanced Filters -->
        <AdvancedFilters
          :filters="advancedFilters"
          :expanded="showAdvanced"
          @toggle="showAdvanced = !showAdvanced"
          @update="updateAdvancedFilters"
        />

        <!-- Loading State -->
        <div v-if="loading" class="flex-1 flex items-center justify-center">
          <div class="flex flex-col items-center gap-3 text-gray-500">
            <svg class="w-10 h-10 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Searching history...</span>
          </div>
        </div>

        <!-- History List -->
        <HistoryList
          v-else-if="historyEntries.length > 0"
          :entries="historyEntries"
          :selected="selectedUrls"
          @select="toggleSelection"
          @select-all="selectAll"
          @deselect-all="deselectAll"
        />

        <!-- Empty State -->
        <div v-else-if="searched" class="flex-1 flex items-center justify-center">
          <div class="text-center text-gray-500 px-4">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-lg font-medium">No matching history found</p>
            <p class="mt-1">Try adjusting your search or filters</p>
          </div>
        </div>

        <!-- Initial State -->
        <div v-else class="flex-1 flex items-center justify-center">
          <div class="text-center text-gray-500 px-4">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p class="text-lg font-medium">Search your browsing history</p>
            <p class="mt-1">Enter a domain, keyword, or regex pattern to get started</p>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer Actions -->
    <footer v-if="selectedUrls.size > 0" class="bg-white border-t border-gray-200 px-6 py-4 flex-shrink-0 shadow-lg animate-fade-in">
      <div class="max-w-4xl mx-auto flex items-center justify-between">
        <span class="text-gray-600">
          <span class="font-semibold text-gray-900">{{ selectedUrls.size }}</span>
          {{ selectedUrls.size === 1 ? 'item' : 'items' }} selected
        </span>
        <div class="flex gap-3">
          <button
            @click="deselectAll"
            class="px-4 py-2 text-gray-700 bg-gray-100 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Clear Selection
          </button>
          <button
            @click="showConfirmDialog = true"
            class="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Selected
          </button>
        </div>
      </div>
    </footer>

    <!-- Confirmation Dialog -->
    <ConfirmDialog
      v-if="showConfirmDialog"
      :count="selectedUrls.size"
      :loading="deleting"
      @confirm="deleteSelected"
      @cancel="showConfirmDialog = false"
    />

    <!-- Toast Notifications -->
    <Toast
      v-if="toast.show"
      :message="toast.message"
      :type="toast.type"
      @close="toast.show = false"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import SearchBar from './components/SearchBar.vue'
import AdvancedFilters from './components/AdvancedFilters.vue'
import HistoryList from './components/HistoryList.vue'
import ConfirmDialog from './components/ConfirmDialog.vue'
import SettingsPanel from './components/SettingsPanel.vue'
import Toast from './components/Toast.vue'
import { searchHistory, deleteUrls, getBookmarkedUrls, getSettings, saveSettings } from '../utils/messaging.js'
import { applyFilters, getTimeRangeFromPreset } from '../utils/historyFilters.js'

// UI State
const loading = ref(false)
const searched = ref(false)
const deleting = ref(false)
const showAdvanced = ref(false)
const showSettings = ref(false)
const showConfirmDialog = ref(false)

// Search State
const filterType = ref('keyword')
const searchValue = ref('')

// Advanced Filters
const advancedFilters = reactive({
  timeRange: 'all',
  customStartDate: '',
  customEndDate: '',
  protocols: ['http', 'https'],
  pathPattern: '',
  caseSensitive: false,
  includeSubdomains: true,
  exactDomainMatch: false,
  excludeBookmarked: false,
  searchIn: 'both'
})

// Data State
const historyEntries = ref([])
const selectedUrls = ref(new Set())
const bookmarkedUrls = ref([])
const settings = ref({})

// Toast State
const toast = reactive({
  show: false,
  message: '',
  type: 'success'
})

// Load settings on mount
onMounted(async () => {
  try {
    settings.value = await getSettings()
    if (settings.value.caseSensitive !== undefined) {
      advancedFilters.caseSensitive = settings.value.caseSensitive
    }
    if (settings.value.includeSubdomains !== undefined) {
      advancedFilters.includeSubdomains = settings.value.includeSubdomains
    }
    if (settings.value.excludeBookmarked !== undefined) {
      advancedFilters.excludeBookmarked = settings.value.excludeBookmarked
    }
  } catch (error) {
    console.error('Failed to load settings:', error)
  }
})

// Search history with current filters
async function performSearch() {
  if (!searchValue.value.trim() && filterType.value !== 'timeRange') {
    showToast('Please enter a search term', 'error')
    return
  }

  loading.value = true
  searched.value = true
  selectedUrls.value.clear()

  try {
    let timeRange
    if (advancedFilters.timeRange === 'custom') {
      const startTime = advancedFilters.customStartDate
        ? new Date(advancedFilters.customStartDate).getTime()
        : 0
      const endTime = advancedFilters.customEndDate
        ? new Date(advancedFilters.customEndDate).setHours(23, 59, 59, 999)
        : Date.now()
      timeRange = { startTime, endTime }
    } else {
      timeRange = getTimeRangeFromPreset(advancedFilters.timeRange)
    }

    const rawHistory = await searchHistory({
      text: filterType.value === 'keyword' ? searchValue.value : '',
      startTime: timeRange.startTime,
      endTime: timeRange.endTime,
      maxResults: settings.value.maxResults || 10000
    })

    if (advancedFilters.excludeBookmarked) {
      bookmarkedUrls.value = await getBookmarkedUrls()
    }

    const filterConfig = {
      dateRange: timeRange,
      protocols: advancedFilters.protocols.length > 0 ? advancedFilters.protocols : null,
      excludeBookmarked: advancedFilters.excludeBookmarked,
      bookmarkedUrls: bookmarkedUrls.value
    }

    if (filterType.value === 'domain') {
      filterConfig.domain = {
        value: searchValue.value,
        includeSubdomains: advancedFilters.includeSubdomains,
        exactMatch: advancedFilters.exactDomainMatch
      }
    } else if (filterType.value === 'keyword') {
      filterConfig.keyword = {
        value: searchValue.value,
        caseSensitive: advancedFilters.caseSensitive,
        searchIn: advancedFilters.searchIn
      }
    } else if (filterType.value === 'regex') {
      filterConfig.regex = {
        value: searchValue.value,
        caseSensitive: advancedFilters.caseSensitive,
        searchIn: advancedFilters.searchIn
      }
    }

    if (advancedFilters.pathPattern) {
      filterConfig.path = {
        value: advancedFilters.pathPattern,
        caseSensitive: advancedFilters.caseSensitive,
        useRegex: false
      }
    }

    const result = applyFilters(rawHistory, filterConfig)

    if (!result.success) {
      showToast(result.error, 'error')
      historyEntries.value = []
    } else {
      historyEntries.value = result.data.sort((a, b) => b.lastVisitTime - a.lastVisitTime)
    }
  } catch (error) {
    showToast(`Search failed: ${error.message}`, 'error')
    historyEntries.value = []
  } finally {
    loading.value = false
  }
}

function toggleSelection(url) {
  if (selectedUrls.value.has(url)) {
    selectedUrls.value.delete(url)
  } else {
    selectedUrls.value.add(url)
  }
  selectedUrls.value = new Set(selectedUrls.value)
}

function selectAll() {
  selectedUrls.value = new Set(historyEntries.value.map(e => e.url))
}

function deselectAll() {
  selectedUrls.value = new Set()
}

async function deleteSelected() {
  deleting.value = true

  try {
    const urls = Array.from(selectedUrls.value)
    const result = await deleteUrls(urls)

    if (result.success) {
      const deletedCount = result.deleted
      historyEntries.value = historyEntries.value.filter(
        entry => !selectedUrls.value.has(entry.url)
      )
      selectedUrls.value.clear()
      showToast(`Successfully deleted ${deletedCount} ${deletedCount === 1 ? 'entry' : 'entries'}`, 'success')
    } else {
      showToast('Failed to delete some entries', 'error')
    }
  } catch (error) {
    showToast(`Delete failed: ${error.message}`, 'error')
  } finally {
    deleting.value = false
    showConfirmDialog.value = false
  }
}

function updateAdvancedFilters(updates) {
  Object.assign(advancedFilters, updates)
}

async function updateSettings(newSettings) {
  settings.value = { ...settings.value, ...newSettings }
  try {
    await saveSettings(settings.value)
    showToast('Settings saved', 'success')
  } catch (error) {
    showToast('Failed to save settings', 'error')
  }
}

function showToast(message, type = 'success') {
  toast.message = message
  toast.type = type
  toast.show = true
  setTimeout(() => {
    toast.show = false
  }, 3000)
}
</script>
