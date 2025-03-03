<script setup>
defineProps(["text"]);
</script>

<template>
  <button class="delete-button">
    {{ text }}
  </button>
</template>

<style scoped>
.delete-button {
  color: white;
  background-color: red;
  padding: 8px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}
</style>
