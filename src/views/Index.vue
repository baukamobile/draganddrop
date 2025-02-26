<script setup>
import PageWrapper from '@/components/PageWrapper.vue'
import StatisticsSection from '@/components/pages/dashboard/StatisticsSection.vue'
import SalesSection from '@/components/pages/dashboard/SalesSection.vue'
import LatestSection from '@/components/pages/dashboard/LatestSection.vue'
import Button from '@/components/Button.vue'
</script>

<template>
    <PageWrapper>
        <template #header>
            <h2 class="text-center">Dashboard</h2>
            <div class="flex flex-col gap-4 md:flex-row md:items-center">
                <div class="dashboard"></div> <!-- Тут закрываю нормально -->
            </div>
        </template>
    </PageWrapper>
</template>

<style scoped> /* scoped, если нужно применить стили только внутри этого компонента */
.dashboard {
    width: 100%;
    height: 90vh;
    background-color: rgb(139, 159, 250);
}
</style>
