<template>
  <div
    :class="[
      'fixed bottom-4 left-4 right-4 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in z-50',
      type === 'success' ? 'bg-green-600 text-white' : '',
      type === 'error' ? 'bg-red-600 text-white' : '',
      type === 'warning' ? 'bg-yellow-500 text-white' : '',
      type === 'info' ? 'bg-blue-600 text-white' : ''
    ]"
  >
    <!-- Icon -->
    <div class="flex-shrink-0">
      <!-- Success Icon -->
      <svg v-if="type === 'success'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>

      <!-- Error Icon -->
      <svg v-else-if="type === 'error'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>

      <!-- Warning Icon -->
      <svg v-else-if="type === 'warning'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>

      <!-- Info Icon -->
      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>

    <!-- Message -->
    <p class="flex-1 text-sm font-medium">{{ message }}</p>

    <!-- Close Button -->
    <button
      @click="$emit('close')"
      class="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'success',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  }
})

defineEmits(['close'])
</script>
