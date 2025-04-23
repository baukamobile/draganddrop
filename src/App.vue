<script setup>
import { computed, watchEffect, ref } from 'vue';
import { useRoute } from 'vue-router';
import Sidebar from './components/sidebar/Sidebar.vue';



const route = useRoute();
const routeName = ref(route.name); // Создаём реактивное значение

// Обновляем routeName при изменении маршрута
watchEffect(() => {
    routeName.value = route.name;
});

const showSidebar = computed(() => !['auth', 'login'].includes(routeName.value));
</script>

<template>
    <div v-if="showSidebar">
        <Sidebar />
    </div>
    <router-view />
</template>

