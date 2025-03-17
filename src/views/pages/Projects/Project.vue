<script setup>
import PageWrapper from '@/components/PageWrapper.vue'
import './styles/style.css'
import { ProjectsManager } from './Report_manager';
import { TaskManager } from "@/views/pages/Projects/TaskManger";
import { useRouter } from 'vue-router';
import Dashboard from '@/components/dashboard/Index.vue';
const {
	formatDate,
  // projectId,
} = TaskManager();
const {
  projects,
} = ProjectsManager();
// console.log('projects id', projectId)
</script>

<template>
    <PageWrapper>
       
        <div class="ag-format-container" v-for="(item, index) in projects" :key="index" >
  <!-- <a href="#" @click.prevent=""><div class="ag-courses_box"> -->
    <router-link :to="{ name: 'Dashboardc', params: { projectId: item.id } }">
      
        <!-- Путь к доски и задач проекта -->
    <div class="ag-courses_item">
      <a href="#" class="ag-courses-item_link">
        <div class="ag-courses-item_bg"></div>

        <div class="ag-courses-item_title" >
          Проект:&#160; {{ item.project_name}}
        </div>
        <!-- person.position ? person.position.position_name : "Не указано" -->
        <p style="color: aliceblue; z-index: 5;">{{ item.description }}</p>
        <div class="ag-courses-item_date-box">
          Начало:
          <span class="ag-courses-item_date">
            <!-- 04.11.2022 -->
            {{formatDate(item.start_date) }} 
            <!-- <br> -->
        </span>
        Конец: 
        <span class="ag-courses-item_date">
            {{ formatDate(item.end_date) }}
        </span>
        </div>
      </a>
    </div>
    

</router-link>
  </div>
<!-- </a> -->
<!-- </div> -->

   
    </PageWrapper>
</template>

