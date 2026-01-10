<template>
  <div class="flex-1 overflow-y-auto bg-white">
    <!-- Header -->
    <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
      <h2 class="font-semibold text-gray-800">Settings</h2>
      <button
        @click="$emit('close')"
        class="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Settings Content -->
    <div class="p-4 space-y-6">
      <!-- Search Settings -->
      <section>
        <h3 class="text-sm font-medium text-gray-900 mb-3">Search Settings</h3>
        <div class="space-y-4">
          <!-- Max Results -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1.5">
              Maximum Search Results
            </label>
            <select
              :value="settings.maxResults || 10000"
              @change="updateSetting('maxResults', parseInt($event.target.value))"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option :value="1000">1,000</option>
              <option :value="5000">5,000</option>
              <option :value="10000">10,000</option>
              <option :value="25000">25,000</option>
              <option :value="50000">50,000</option>
            </select>
            <p class="text-xs text-gray-500 mt-1">
              Higher values may slow down search on large history
            </p>
          </div>
        </div>
      </section>

      <!-- Default Filter Settings -->
      <section>
        <h3 class="text-sm font-medium text-gray-900 mb-3">Default Preferences</h3>
        <div class="space-y-3">
          <label class="flex items-center gap-3">
            <input
              type="checkbox"
              :checked="settings.caseSensitive"
              @change="updateSetting('caseSensitive', $event.target.checked)"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="text-sm text-gray-700">Case sensitive search by default</span>
          </label>

          <label class="flex items-center gap-3">
            <input
              type="checkbox"
              :checked="settings.includeSubdomains ?? true"
              @change="updateSetting('includeSubdomains', $event.target.checked)"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="text-sm text-gray-700">Include subdomains by default</span>
          </label>

          <label class="flex items-center gap-3">
            <input
              type="checkbox"
              :checked="settings.excludeBookmarked"
              @change="updateSetting('excludeBookmarked', $event.target.checked)"
              class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span class="text-sm text-gray-700">Exclude bookmarked pages by default</span>
          </label>
        </div>
      </section>

      <!-- Default Time Range -->
      <section>
        <h3 class="text-sm font-medium text-gray-900 mb-3">Default Time Range</h3>
        <select
          :value="settings.defaultTimeRange || 'all'"
          @change="updateSetting('defaultTimeRange', $event.target.value)"
          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Time</option>
          <option value="lastHour">Last Hour</option>
          <option value="last24Hours">Last 24 Hours</option>
          <option value="last7Days">Last 7 Days</option>
          <option value="last30Days">Last 30 Days</option>
          <option value="today">Today</option>
        </select>
      </section>

      <!-- About Section -->
      <section class="pt-4 border-t border-gray-200">
        <h3 class="text-sm font-medium text-gray-900 mb-2">About</h3>
        <p class="text-xs text-gray-500">
          History Remover Pro v1.0.0
        </p>
        <p class="text-xs text-gray-500 mt-1">
          Selectively delete browsing history with advanced filtering options.
          Your data stays local and is never shared.
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  settings: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update', 'close'])

function updateSetting(key, value) {
  emit('update', { [key]: value })
}
</script>
