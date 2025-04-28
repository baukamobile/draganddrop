<script setup>
import PageWrapper from "@/components/PageWrapper.vue";
import { DepartmentManager } from '@/views/pages/department/Department_Manager.js';
import './style/style.css';
import { useTaskManager } from "@/components/dashboard/useTaskManger";

const {
  department,
} = DepartmentManager();
const{
  newTask
} = useTaskManager();

</script>
<template>
  <PageWrapper>
    <h2 class="text-center">Мой отдел</h2>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <div class="grid-card">
  <div v-for="(person, index) in department" :key="index" class="card">
    <img :src="person.image" alt="" class="img-department">
    <h1>{{ person.first_name }} {{ person.last_name }}</h1>
    <p>Должность: {{ person.position ? person.position.position_name : "Не указано" }}</p>
    <p>Отдел: {{ person.department ? person.department.department_name : "Не указано" }}</p> 
    <p>{{ person.status }}</p>
        <div style="display: flex; justify-content: center;">
          <a v-if="person.telegram_id" style="padding: 10px;" :href="`https://t.me/${person.telegram_id}`"><i class="fa fa-telegram"></i></a>
          <a v-if="person.phone_number" style="padding: 10px;" :href="`https://wa.me/${person.phone_number}`"><i class="fa fa-whatsapp"></i></a>
        </div>
        <p><button>Contact</button></p>
      </div>
    </div>
  </PageWrapper>
</template>
