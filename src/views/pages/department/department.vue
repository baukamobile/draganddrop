<script setup>
import PageWrapper from "@/components/PageWrapper.vue";
import { DepartmentManager } from '@/views/pages/department/Department_Manager.js';
import './style/style.css';
import { onMounted } from "vue";

const {
  department,
} = DepartmentManager();

</script>
<template>
  <PageWrapper>
    <h2 class="text-center">Мой отдел</h2>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <div class="grid-card">
      <div v-for="(person, index) in department" :key="index" class="card">
        <img :src="person.image" alt="" class="img-department">
        <h1>{{ person.first_name }} {{ person.last_name }}</h1>
        <!-- <pre>{{ JSON.stringify(person, null, 2) }}</pre> -->
        <p >Должность: {{ person.position ? person.position.position_name : "Не указано" }}</p>
        <p >Отдел: {{ person.department ? person.department.department_name :"Не указано" }}</p> 
        <p>{{ person.status }}</p>
        <!-- <p class="title" v-for="(item_pos,index) in department" :key="index">Должность: {{ item_pos.position_name }}</p> -->
        <!-- <p v-for="(item_dep, index) in department" :key="index">Отдел: {{ item_dep.department_name }}</p> -->
        <div style="display: flex; justify-content: center;">
          <a v-if="person.telegram_id" style="padding: 10px;" :href="`https://t.me/${person.telegram_id}`"><i class="fa fa-telegram"></i></a>
          <a v-if="person.phone_number" style="padding: 10px;" :href="`https://wa.me/${person.phone_number}`"><i class="fa fa-whatsapp"></i></a>
        </div>
        <p><button>Contact</button></p>
      </div>
    </div>
  </PageWrapper>
</template>

<!-- <div class="projcard-tagbox">
			<a v-for="(tag, index) in newss.tags" :key="index" href="#" class="projcard-tag">{{ tag.name }}</a>
			</div>
<template>
    <PageWrapper>
        <h2 class="text-center">Мой отдел</h2>

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<div class="grid-card" >
<div class="card">
  <img src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D" alt="John" style="width:100%">
  <h1>John Doe </h1>
  <p class="title">Специалист технический поддержки ПО</p>
  <p>Development department</p>
  <div style="display: flex; justify-content: center;">
    <a style="padding: 10px;" href="#"><i class="fa fa-telegram"></i></a>
    
    <a style="padding: 10px;"href="#"><i class="fa fa-whatsapp"></i></a>
  </div>
  
  <p><button>Contact</button></p>
</div>
<div class="card">
  <img src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D" alt="John" style="width:100%">
  <h1>James Alison</h1>
  <p class="title">Руководитель сервисно-тех. отдела</p>
  <p>Development department</p>
  <div style="display: flex; justify-content: center;">
    <a style="padding: 10px;" href="#"><i class="fa fa-telegram"></i></a>
    
    <a style="padding: 10px;"href="#"><i class="fa fa-whatsapp"></i></a>
  </div>
  
  <p><button>Contact</button></p>
</div>
 -->