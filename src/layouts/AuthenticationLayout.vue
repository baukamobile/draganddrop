<script setup>
// ничего не импортируем, если не нужно показывать навигацию
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-100 py-6 dark:bg-dark-eval-0">
    <!-- Только контент страницы -->
    <router-view />
  </div>
</template>
