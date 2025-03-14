<script setup>
import PageWrapper from '@/components/PageWrapper.vue'
import './style/style.css'
import { ProjectsManager } from './Report_manager';
import { useTaskManager } from "@/views/pages/dashboard/useTaskManger";
const {
	formatDate,
} = useTaskManager();
const {
  projects,
} = ProjectsManager();
</script>

<template>
    <PageWrapper>
       
        <div class="ag-format-container" v-for="(item, index) in projects" :key="index" >
  <div class="ag-courses_box">
   

    <div class="ag-courses_item">
      <a href="#" class="ag-courses-item_link">
        <div class="ag-courses-item_bg"></div>

        <div class="ag-courses-item_title">
          Проект:&#160; {{ item.project_name}}
        </div>
        <!-- person.position ? person.position.position_name : "Не указано" -->
        <p>{{ item.description }}</p>
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

  </div>
</div>

   
    </PageWrapper>
</template>
