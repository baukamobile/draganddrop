<script setup>
import PageWrapper from '@/components/PageWrapper.vue'
import StatisticsSection from '@/components/pages/dashboard/StatisticsSection.vue'
import SalesSection from '@/components/pages/dashboard/SalesSection.vue'
import LatestSection from '@/components/pages/dashboard/LatestSection.vue'
import Button from '@/components/Button.vue'
import { ProcessManager } from '@/views/pages/business_process/Processes/getProcess'
import { useRouter } from 'vue-router'
import { useTaskManager } from '@/components/dashboard/useTaskManger';
import { ProjectsManager } from '../Projects/Report_manager'


// PROCESS
const { processes} = ProcessManager();
const router = useRouter();

const goToProcess = (processId) => {
    router.push({ name: 'Processtasks', params: { processId } });
};
const { projects } = ProjectsManager();

const goToProject = (projectId) => {
    router.push({ name: 'ProjectTasks', params: { projectId } });
};
const {
    formatDate,
} = useTaskManager();
</script>

<template>
    <PageWrapper>
        <div class="ag-format-container">


    <h1 class="text-xl font-semibold leading-tight" style="display: flex; justify-content: center;">Мои Задачи и процессы</h1  >
            <div v-for="(item, index) in processes.slice(0, 2)" :key="index"> 
                <!-- Это для тестов типа на странице мои процессы отображается именно те процессы где он указан -->
                <div class="ag-courses_item" @click="goToProcess(item.id)">
                    <div class="ag-courses-item_link">
                        <div class="ag-courses-item_bg"></div>
                        <div class="ag-courses-item_title">
                            Процесс: {{ item.name }}
                            
                        </div>
                        <div class="ag-courses-item_title2">

                            <p style="color: aliceblue; z-index: 5;">{{ item.description }}</p>
                        </div>
                        <div class="ag-courses-item_date-box">
                      
                            Начало: <span class="ag-courses-item_date">{{ formatDate(item.created_at) }}</span>
                            Конец: <span class="ag-courses-item_date">{{ formatDate(item.updated_at) }}</span> 
                            <el-icon><Search /></el-icon>
                        </div>
                    </div>
                </div>
            </div>
            <div v-for="(item, index) in projects.slice(0, 2)" :key="index">
                <div class="ag-courses_item" @click="goToProject(item.id)">
                    <div class="ag-courses-item_link">
                        <div class="ag-courses-item_bg"></div>
                        <div class="ag-courses-item_title">
                            Проект: {{ item.project_name }}
                        </div>
                        <p style="color: aliceblue; z-index: 5;">{{ item.description }}</p>
                        <div class="ag-courses-item_date-box">
                      
                            Начало: <span class="ag-courses-item_date">{{ formatDate(item.start_date) }}</span>
                            Конец: <span class="ag-courses-item_date">{{ formatDate(item.end_date) }}</span>
                            <el-icon><Search /></el-icon>
                        </div>
                    </div>
                </div>
            </div>
            <!-- <div class="ag-courses_item" @click="goToProcess(1)">
            <div class="ag-courses-item_title">
                            Процесс: {{ processes.name }}
                        </div>
                        <div class="ag-courses-item_title2">

<p style="color: aliceblue; z-index: 5;">{{ processes.description }}</p>
</div>
<div class="ag-courses-item_date-box">
                      
                      Начало: <span class="ag-courses-item_date">{{ formatDate(processes.created_at) }}</span>
                      Конец: <span class="ag-courses-item_date">{{ formatDate(processes.updated_at) }}</span> 
                      <el-icon><Search /></el-icon>
                  </div>
        </div> -->
    </div> 
   
    </PageWrapper>
</template>

