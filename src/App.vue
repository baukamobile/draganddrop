<script setup>
import { onMounted } from 'vue'

onMounted(() => {
    // document.getElementById('loading')?.remove() // Сразу убираем элемент
})
</script>

<template>
    <router-view />
</template>
