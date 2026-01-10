<template>
  <div class="flex-1 flex flex-col overflow-hidden">
    <!-- List Header -->
    <div class="px-4 py-2 bg-white border-b border-gray-200 flex items-center justify-between flex-shrink-0">
      <span class="text-sm text-gray-600">
        {{ entries.length }} {{ entries.length === 1 ? 'result' : 'results' }}
      </span>
      <div class="flex gap-2">
        <button
          @click="$emit('select-all')"
          class="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors"
        >
          Select All
        </button>
        <button
          v-if="selected.size > 0"
          @click="$emit('deselect-all')"
          class="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded transition-colors"
        >
          Clear
        </button>
      </div>
    </div>

    <!-- Scrollable List -->
    <div class="flex-1 overflow-y-auto">
      <div class="divide-y divide-gray-100">
        <div
          v-for="entry in entries"
          :key="entry.url"
          @click="$emit('select', entry.url)"
          :class="[
            'px-4 py-3 cursor-pointer transition-colors',
            selected.has(entry.url) ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'
          ]"
        >
          <div class="flex items-start gap-3">
            <!-- Checkbox -->
            <div class="flex-shrink-0 pt-0.5">
              <div
                :class="[
                  'w-4 h-4 rounded border-2 flex items-center justify-center transition-colors',
                  selected.has(entry.url)
                    ? 'bg-blue-600 border-blue-600'
                    : 'border-gray-300'
                ]"
              >
                <svg
                  v-if="selected.has(entry.url)"
                  class="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <!-- Title -->
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ entry.title || 'Untitled' }}
              </p>

              <!-- URL -->
              <p class="text-xs text-gray-500 truncate mt-0.5" :title="entry.url">
                {{ entry.url }}
              </p>

              <!-- Metadata -->
              <div class="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                <span class="flex items-center gap-1" :title="formatFullDate(entry.lastVisitTime)">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ formatDate(entry.lastVisitTime) }}
                </span>
                <span v-if="entry.visitCount > 1" class="flex items-center gap-1" title="Visit count">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {{ entry.visitCount }} visits
                </span>
              </div>
            </div>

            <!-- External Link -->
            <a
              :href="entry.url"
              target="_blank"
              rel="noopener noreferrer"
              @click.stop
              class="flex-shrink-0 p-1 text-gray-400 hover:text-blue-600 rounded transition-colors"
              title="Open in new tab"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <!-- Load More Indicator (for very long lists) -->
      <div v-if="entries.length >= 1000" class="px-4 py-3 text-center text-xs text-gray-500 border-t border-gray-100">
        Showing {{ entries.length }} results. Refine your search for more specific results.
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  entries: {
    type: Array,
    required: true
  },
  selected: {
    type: Set,
    required: true
  }
})

defineEmits(['select', 'select-all', 'deselect-all'])

// Format date for display
function formatDate(timestamp) {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date

  // Less than 1 hour ago
  if (diff < 60 * 60 * 1000) {
    const minutes = Math.floor(diff / (60 * 1000))
    return minutes <= 1 ? 'Just now' : `${minutes}m ago`
  }

  // Less than 24 hours ago
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000))
    return `${hours}h ago`
  }

  // Less than 7 days ago
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    const days = Math.floor(diff / (24 * 60 * 60 * 1000))
    return days === 1 ? 'Yesterday' : `${days}d ago`
  }

  // Format as date
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}

// Format full date for tooltip
function formatFullDate(timestamp) {
  return new Date(timestamp).toLocaleString()
}
</script>
