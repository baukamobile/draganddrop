<script setup>
import PageWrapper from '@/components/PageWrapper.vue'
import './style/style.css'
import { ProjectsManager } from './Report_manager';

const {
  projects,
} = ProjectsManager();
</script>

<template>
    <PageWrapper>
       
        <div class="ag-format-container" v-for="(project, index) in projects" :key="index" >
  <div class="ag-courses_box">
   

    <div class="ag-courses_item">
      <a href="#" class="ag-courses-item_link">
        <div class="ag-courses-item_bg"></div>

        <div class="ag-courses-item_title">
          Проект&#160; {{ project.project_name }}
        </div>

        <div class="ag-courses-item_date-box">
          Start:
          <span class="ag-courses-item_date">
            04.11.2022
          </span>
        </div>
      </a>
    </div>

  </div>
</div>

   
    </PageWrapper>
</template>
