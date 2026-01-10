<template>
  <div class="bg-gray-50 border-b border-gray-200">
    <!-- Toggle Button -->
    <button
      @click="$emit('toggle')"
      class="w-full px-4 py-2 flex items-center justify-between text-sm text-gray-600 hover:bg-gray-100 transition-colors"
    >
      <span class="flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        Advanced Filters
        <span v-if="activeFilterCount > 0" class="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
          {{ activeFilterCount }}
        </span>
      </span>
      <svg
        :class="['w-4 h-4 transition-transform', expanded ? 'rotate-180' : '']"
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Expanded Panel -->
    <div v-if="expanded" class="px-4 py-3 space-y-4 animate-fade-in border-t border-gray-200">
      <!-- Time Range -->
      <div>
        <label class="block text-xs font-medium text-gray-700 mb-1.5">Time Range</label>
        <select
          :value="filters.timeRange"
          @change="update('timeRange', $event.target.value)"
          class="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Time</option>
          <option value="lastHour">Last Hour</option>
          <option value="last24Hours">Last 24 Hours</option>
          <option value="last7Days">Last 7 Days</option>
          <option value="last30Days">Last 30 Days</option>
          <option value="today">Today</option>
          <option value="custom">Custom Range</option>
        </select>

        <!-- Custom Date Range -->
        <div v-if="filters.timeRange === 'custom'" class="mt-2 flex gap-2">
          <div class="flex-1">
            <label class="block text-xs text-gray-500 mb-1">From</label>
            <input
              type="date"
              :value="filters.customStartDate"
              @change="update('customStartDate', $event.target.value)"
              class="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="flex-1">
            <label class="block text-xs text-gray-500 mb-1">To</label>
            <input
              type="date"
              :value="filters.customEndDate"
              @change="update('customEndDate', $event.target.value)"
              class="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <!-- Protocol Filter -->
      <div>
        <label class="block text-xs font-medium text-gray-700 mb-1.5">Protocol</label>
        <div class="flex gap-4">
          <label class="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              :checked="filters.protocols.includes('https')"
              @change="toggleProtocol('https')"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            HTTPS
          </label>
          <label class="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              :checked="filters.protocols.includes('http')"
              @change="toggleProtocol('http')"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            HTTP
          </label>
        </div>
      </div>

      <!-- Path Pattern -->
      <div>
        <label class="block text-xs font-medium text-gray-700 mb-1.5">Path Contains</label>
        <input
          type="text"
          :value="filters.pathPattern"
          @input="update('pathPattern', $event.target.value)"
          placeholder="e.g., /search or /api/"
          class="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Search Options -->
      <div>
        <label class="block text-xs font-medium text-gray-700 mb-1.5">Search In</label>
        <select
          :value="filters.searchIn"
          @change="update('searchIn', $event.target.value)"
          class="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="both">URL & Title</option>
          <option value="url">URL Only</option>
          <option value="title">Title Only</option>
        </select>
      </div>

      <!-- Toggle Options -->
      <div class="space-y-2">
        <label class="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            :checked="filters.caseSensitive"
            @change="update('caseSensitive', $event.target.checked)"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Case sensitive search
        </label>

        <label class="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            :checked="filters.includeSubdomains"
            @change="update('includeSubdomains', $event.target.checked)"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Include subdomains (for domain filter)
        </label>

        <label class="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            :checked="filters.exactDomainMatch"
            @change="update('exactDomainMatch', $event.target.checked)"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Exact domain match only
        </label>

        <label class="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            :checked="filters.excludeBookmarked"
            @change="update('excludeBookmarked', $event.target.checked)"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Exclude bookmarked pages
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  filters: {
    type: Object,
    required: true
  },
  expanded: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle', 'update'])

// Count active filters for badge
const activeFilterCount = computed(() => {
  let count = 0
  if (props.filters.timeRange !== 'all') count++
  if (props.filters.pathPattern) count++
  if (props.filters.caseSensitive) count++
  if (!props.filters.includeSubdomains) count++
  if (props.filters.exactDomainMatch) count++
  if (props.filters.excludeBookmarked) count++
  if (props.filters.protocols.length < 2) count++
  if (props.filters.searchIn !== 'both') count++
  return count
})

// Update single filter value
function update(key, value) {
  emit('update', { [key]: value })
}

// Toggle protocol in array
function toggleProtocol(protocol) {
  const protocols = [...props.filters.protocols]
  const index = protocols.indexOf(protocol)

  if (index > -1) {
    // Don't allow removing the last protocol
    if (protocols.length > 1) {
      protocols.splice(index, 1)
    }
  } else {
    protocols.push(protocol)
  }

  emit('update', { protocols })
}
</script>
