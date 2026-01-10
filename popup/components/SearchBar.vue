<template>
  <div class="bg-white px-4 py-3 border-b border-gray-200">
    <!-- Filter Type Selector -->
    <div class="flex gap-1 mb-3">
      <button
        v-for="option in filterOptions"
        :key="option.value"
        @click="$emit('update:filter-type', option.value)"
        :class="[
          'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
          filterType === option.value
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-600 hover:bg-gray-100'
        ]"
      >
        {{ option.label }}
      </button>
    </div>

    <!-- Search Input -->
    <div class="flex gap-2">
      <div class="flex-1 relative">
        <input
          type="text"
          :value="searchValue"
          @input="$emit('update:search-value', $event.target.value)"
          @keyup.enter="$emit('search')"
          :placeholder="placeholder"
          class="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <button
        @click="$emit('search')"
        class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1.5"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Search
      </button>
    </div>

    <!-- Regex validation message -->
    <div v-if="filterType === 'regex' && regexError" class="mt-2 text-xs text-red-600 flex items-center gap-1">
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      {{ regexError }}
    </div>

    <!-- Filter type hint -->
    <p class="mt-2 text-xs text-gray-500">
      {{ filterHint }}
    </p>
  </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue'
import { validateRegex } from '../../utils/historyFilters.js'

const props = defineProps({
  filterType: {
    type: String,
    required: true
  },
  searchValue: {
    type: String,
    default: ''
  }
})

defineEmits(['update:filter-type', 'update:search-value', 'search'])

const filterOptions = [
  { value: 'keyword', label: 'Keyword' },
  { value: 'domain', label: 'Domain' },
  { value: 'regex', label: 'Regex' }
]

const regexError = ref('')

// Validate regex pattern when changed
watch(() => props.searchValue, (value) => {
  if (props.filterType === 'regex' && value) {
    const result = validateRegex(value)
    regexError.value = result.valid ? '' : result.error
  } else {
    regexError.value = ''
  }
})

// Clear regex error when filter type changes
watch(() => props.filterType, () => {
  regexError.value = ''
})

const placeholder = computed(() => {
  switch (props.filterType) {
    case 'domain':
      return 'Enter domain (e.g., example.com)'
    case 'regex':
      return 'Enter regex pattern (e.g., /search\\?q=.*)'
    case 'keyword':
    default:
      return 'Search URLs and titles...'
  }
})

const filterHint = computed(() => {
  switch (props.filterType) {
    case 'domain':
      return 'Match history entries by domain name'
    case 'regex':
      return 'Use regular expressions for advanced pattern matching'
    case 'keyword':
    default:
      return 'Search across page URLs and titles'
  }
})
</script>
