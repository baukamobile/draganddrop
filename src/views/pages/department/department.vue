<script setup>
import PageWrapper from "@/components/PageWrapper.vue";
import { DepartmentManager } from '@/views/pages/department/Department_Manager.js';
import './style/style.css';

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
        <!-- <img src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D" alt="Profile" style="width:100%"> -->
        <img :src="person.image" alt="">
        <h1>{{ person.first_name }} {{ person.last_name }}</h1>
        <p class="title" v-for="(position_name,index) in department.position" :key="index">{{ position_name.position }}</p>
        <p v-for="(department_name, index) in department.department" :key="index">{{ department_name.department }}</p>
        <!-- <div class="projcard-tagbox">
			<a v-for="(tag, index) in newss.tags" :key="index" href="#" class="projcard-tag">{{ tag.name }}</a>
			</div> -->
        <div style="display: flex; justify-content: center;">
          <a v-if="person.telegram_id" style="padding: 10px;" :href="`https://t.me/${person.telegram_id}`"><i class="fa fa-telegram"></i></a>
          <a v-if="person.phone_number" style="padding: 10px;" :href="`https://wa.me/${person.phone_number}`"><i class="fa fa-whatsapp"></i></a>
        </div>
        <p><button>Contact</button></p>
      </div>
    </div>
  </PageWrapper>
</template>

<!-- 
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

<div class="card">
  <img src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D" alt="John" style="width:100%">
  <h1>John Doe</h1>
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
</div>
    </PageWrapper>
</template>

 -->
