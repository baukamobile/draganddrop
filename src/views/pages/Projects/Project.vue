<script setup>
import PageWrapper from '@/components/PageWrapper.vue'
import './styles/style.css'
import { ProjectsManager } from './Report_manager'
import { useRouter } from 'vue-router'


const { projects } = ProjectsManager();
const router = useRouter();

const goToProject = (projectId) => {
    router.push({ name: 'ProjectTasks', params: { projectId } });
};
</script>

<template>
    <PageWrapper>
        <div class="ag-format-container">
<a href="#"><h1>Добавить проект + </h1></a>
            <div v-for="(item, index) in projects" :key="index">
                <div class="ag-courses_item" @click="goToProject(item.id)">
                    <div class="ag-courses-item_link">
                        <div class="ag-courses-item_bg"></div>
                        <div class="ag-courses-item_title">
                            Проект: {{ item.project_name }}
                        </div>
                        <p style="color: aliceblue; z-index: 5;">{{ item.description }}</p>
                        <div class="ag-courses-item_date-box">
                            Начало: <span class="ag-courses-item_date">{{ item.start_date }}</span>
                            Конец: <span class="ag-courses-item_date">{{ item.end_date }}</span>
                            <el-icon><Search /></el-icon>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </PageWrapper>
</template>