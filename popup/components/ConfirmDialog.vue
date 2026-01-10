<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-black/50"
      @click="$emit('cancel')"
    ></div>

    <!-- Dialog -->
    <div class="relative bg-white rounded-lg shadow-xl w-80 max-w-[calc(100%-2rem)] animate-fade-in">
      <!-- Header -->
      <div class="px-4 py-3 border-b border-gray-200">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 class="text-base font-semibold text-gray-900">Confirm Deletion</h3>
            <p class="text-sm text-gray-500">This action cannot be undone</p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="px-4 py-4">
        <p class="text-sm text-gray-700">
          Are you sure you want to permanently delete
          <span class="font-semibold">{{ count }}</span>
          {{ count === 1 ? 'history entry' : 'history entries' }}?
        </p>
        <p class="text-xs text-gray-500 mt-2">
          These entries will be removed from your browser's history.
        </p>
      </div>

      <!-- Actions -->
      <div class="px-4 py-3 bg-gray-50 rounded-b-lg flex justify-end gap-2">
        <button
          @click="$emit('cancel')"
          :disabled="loading"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          @click="$emit('confirm')"
          :disabled="loading"
          class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <svg v-if="loading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ loading ? 'Deleting...' : 'Delete' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  count: {
    type: Number,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['confirm', 'cancel'])
</script>
