<template>
  <div class="w-72 bg-white p-4">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <h1 class="text-base font-bold text-gray-800">History Remover</h1>
        <p class="text-xs text-gray-500">Pro</p>
      </div>
    </div>

    <button
      @click="openFullPage"
      class="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
      Open History Manager
    </button>

    <p class="mt-3 text-xs text-gray-500 text-center">
      Opens in a new window for better experience
    </p>
  </div>
</template>

<script setup>
function openFullPage() {
  // Open the dedicated page in a new window
  chrome.windows.create({
    url: chrome.runtime.getURL('page/index.html'),
    type: 'popup',
    width: 900,
    height: 700
  })
  // Close the popup
  window.close()
}
</script>
