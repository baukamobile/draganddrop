<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import PageWrapper from '@/components/PageWrapper.vue';

const status_name = ref("");
const statuses = ref([]);


const handleClick = async()=>
{
  try{
    let response = await axios.delete("http://127.0.0.1:8000/tasks/status/{$status_id}");
    console.log(response.data);
  }catch(error){
    console.error('invalid delete');
  }
}


const fetchStatuses = async () => {
  try {
    let response = await axios.get("http://127.0.0.1:8000/tasks/status/");
    statuses.value = response.data;
  } catch (error) {
    console.error("Ошибка загрузки статусов", error);
  }
};


const submitStatus = async () => {
  try {
    await axios.post("http://127.0.0.1:8000/tasks/status/", {
      status_name: status_name.value,
      user: 1  // Подставь ID текущего пользователя
    });
    fetchStatuses();
    status_name.value = ""; // Очистка инпута
  } catch (error) {
    console.error("Ошибка добавления статуса", error);
  }
};

onMounted(() => {
  fetchStatuses();
});
</script>

<template>
  <PageWrapper>
    <template #header>
      <h2 class="text-center"><b><strong> Календарь</strong></b></h2>
      <div class="flex flex-col gap-4 md:flex-row md:items-center">
        <div class="dashboard">
          <div>
            <h2>Добавить статус</h2>
            <input v-model="status_name" placeholder="Введите статус" />
            <button @click="submitStatus">Отправить</button>
          </div>
        </div>
      </div>
    </template>
  </PageWrapper>
</template>

<style scoped>
.dashboard {
  width: 100%;
  height: 90vh;
  background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,86,121,1) 48%, rgba(0,212,255,1) 100%);
}
button,h2,h3{
	color: white;
}
</style>
