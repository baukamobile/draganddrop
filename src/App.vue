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

<!-- <style>
.dashboard {
    max-width: 165vh;
    height: 80vh;
    background: linear-gradient(90deg, rgb(58, 240, 33) 0%, rgb(50, 233, 33) 48%, rgb(136, 249, 31) 100%);
    overflow-x: scroll;
    display: flex;
    white-space: nowrap;
}
</style> -->