<script setup>
import { onMounted, ref } from "vue";
import PageWrapper from "@/components/PageWrapper.vue";
import { getUsersbyDepartment } from "./department";
</script>

<template>
    <PageWrapper>
        <h2 class="text-center">Мой отдел</h2>

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

<div class="card">
  <img src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D" alt="John" style="width:100%">
  <h1>John Doe</h1>
  <p class="title">CEO & Founder, Example</p>
  <p>Harvard University</p>
  <div style="display: flex; justify-content: center;">
    <a style="padding: 10px;" href="#"><i class="fa fa-telegram"></i></a>
    <br>
    <a style="padding: 10px;"href="#"><i class="fa fa-whatsapp"></i></a>
  </div>
  
  <p><button>Contact</button></p>
</div>
<div class="card">
  <img src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D" alt="John" style="width:100%">
  <h1>John Doe</h1>
  <p class="title">CEO & Founder, Example</p>
  <p>Harvard University</p>
  <div style="display: flex; justify-content: center;">
    <a style="padding: 10px;" href="#"><i class="fa fa-telegram"></i></a>
    <br>
    <a style="padding: 10px;"href="#"><i class="fa fa-whatsapp"></i></a>
  </div>
  
  <p><button>Contact</button></p>
</div>
    </PageWrapper>
</template>


<style scoped>
.card {
  box-shadow: 0 4px 8px 0 rgba(255, 255, 255, 0.2);
  max-width: 300px;
  margin: auto;
  background-color: white;
  color: black;
  text-align: center;
}

.title {
  color: grey;
  font-size: 18px;
}

button {
  border: none;
  outline: 0;
  display: inline-block;
  padding: 8px;
  color: white;
  background-color: #bababa;
  text-align: center;
  cursor: pointer;
  width: 100%;
  font-size: 18px;
}

a {
  text-decoration: none;
  font-size: 22px;
  color: rgb(187, 183, 183);
}

button:hover, a:hover {
  opacity: 0.7;
}
</style>