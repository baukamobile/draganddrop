<script setup>
import PageWrapper from '@/components/PageWrapper.vue'
import './style/style.css'
import { ProcessManager } from '@/views/pages/business_process/Processes/getProcess'
import { useRouter } from 'vue-router'
import { useTaskManager } from '@/components/dashboard/useTaskManger';

// PROCESS
const { processes} = ProcessManager();
const router = useRouter();

const goToProcess = (processId) => {
    router.push({ name: 'Processtasks', params: { processId } });
};
const {
    formatDate,
} = useTaskManager();
</script>

<template>
    <PageWrapper>
        <div class="ag-format-container">
<a href="#"><h1>Добавить Процесс + </h1></a>
            <div v-for="(item, index) in processes" :key="index">
                <div class="ag-courses_item" @click="goToProcess(item.id)">
                    <div class="ag-courses-item_link">
                        <div class="ag-courses-item_bg"></div>
                        <div class="ag-courses-item_title">
                            Процесс: {{ item.name }}
                        </div>
                        <p style="color: aliceblue; z-index: 5;">{{ item.description }}</p>
                        <div class="ag-courses-item_date-box">
                      
                            Начало: <span class="ag-courses-item_date">{{ formatDate(item.created_at) }}</span>
                            Конец: <span class="ag-courses-item_date">{{ formatDate(item.updated_at) }}</span> 
                            <el-icon><Search /></el-icon>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </PageWrapper>
</template>