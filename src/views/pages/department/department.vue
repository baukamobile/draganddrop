<script setup>
import { onMounted, ref } from "vue";
import PageWrapper from "@/components/PageWrapper.vue";
import { getTask,getStatusTask,updateTaskStatus } from "@/api/tasks";

import Button from "@/components/Button.vue";


const priority = {
    1: {priority_name:"НИЗКИЙ",color:'green'},
    2: {priority_name:"СРЕДНИЙ",color:'blue'},
    3: {priority_name:"ВЫСОКИЙ",color:'orange'},
    4: {priority_name:"КРИТИЧЕСКИЙ", color: "red"},
};
const tasks = ref([

]);
const statuses = ref([]);
onMounted(async () => {
    tasks.value = await getTask();
    statuses.value = await getStatusTask();
    // statuses
    console.log('Loading data',statuses.value);
});
function ondragstart(e, task) {
    e.dataTransfer.dropEffect = "move";
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("taskID", task.id.toString());
}
// написан логика функции еретаскивании
async function onDrop(e, statusId) {
    e.preventDefault();
    const taskID = parseInt(e.dataTransfer.getData("taskID"));

    try {
        await updateTaskStatus(taskID, statusId);  // Теперь передаем `statusId`, а не `statuses.id`

        const task = tasks.value.find(t => t.id === taskID);
        if (task) {
            task.status = statusId; // Меняем именно `status`
        }
    } catch (error) {
        console.error("Ошибка при обновлении задачи:", error);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString("ru-RU", { day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" });
}

</script>

<template>
    <PageWrapper>
        <!-- <h2 class="text-center">Dashboard</h2> -->

        <div class="flex flex-col gap-4 md:flex-row md:items-center">
            <div class="dashboard">
                
                <!-- <h1>Hello World</h1> -->
                <div class="center">
                    <div v-for="status in statuses" :key="status.id"
                     @drop="onDrop($event, status.id)"
                        class="droppable" @dragover.prevent @dragenter.prevent>
                      <div class="status">
                          <div class="status-name"><h1 class="status-name" style="">{{ status.status_name }}</h1></div>
                          <a-button type="primary" style="color: white; background-color: red; " @click="handleClick">Удалит колонку</a-button>
                      </div>
                        <!-- status id -->
                        <div v-for="task in tasks.filter(x => x.status == status.id)" 
                             :key="task.task_name"
                            @dragstart="ondragstart($event, task)" 
                            draggable="true" class="draggable">
                            <p>{{ task.task_name }} 
                                <span :style="{ color: priority[task.priority]?.color} ">
                                    
                                    ({{ priority[task.priority]?.priority_name || 'Неизвестный' }})
    </span>
                            </p>
                            <div class="time-part">
                                <p>от {{ formatDate(task.start_date) }}</p>
                                <p>до {{ formatDate(task.end_date) }}</p>
                        </div> 
                        
                        </div>
                    <div class="add-task-container">
                        <a href="#" class="add-task">Добавить Задачу</a>
                        <PlusOutlined style="font-size: 24px; color: black;" />
                    </div> 
                    </div>
                    <div class="add-list">
                        <DeleteOutlined style="font-size: 24px; color: red;" />

                         <a href="#" style="color: black;">Добавить Колонку</a>

                      <a-button type="primary" danger>
    <DeleteOutlined />
    Удалить
  </a-button>
                </div>
                </div>
                
            </div>
        </div>
    </PageWrapper>
</template>

<style scoped>

.add-task{
    color: rgb(0, 0, 0);
    padding: 5px;
    border-radius: 8px;
    margin: 10px;
    /* border: solid; */
    /* border-color: white; */
    background-color: white;
}.add-task:hover{
    color: rgb(0, 0, 0);
    padding: 5px;
    border-radius: 8px;
    margin: 10px;
    background-color: #d0d4db;
}

.dashboard {
    max-width: 165vh;
    height: 80vh;
    background: rgb(2,0,36);
    background: linear-gradient(90deg, rgb(65, 38, 171) 0%, rgb(132, 52, 150) 48%, rgb(196, 68, 157) 100%);
    overflow-y: scroll; /* Горизонтальный скролл */
    display: flex; /* Растянет внутренние элементы в строку */
    white-space: nowrap; /* Запретит перенос элементов */
 
}
.time-part p{

    line-height: 1;
    font-size: 10px;
    color: rgb(194, 16, 16);

}
.center {
    display: flex;
    gap: 20px; 
    /* justify-content: center;  */
    /* align-items: flex-start; Выравнивает сверху */
    padding: 20px;
}
.droppable {
    padding: 5px;
    border-radius: 10px;
    background-color: #f1f2f4;
    max-width: 130px; 
    height: fit-content;
    text-align: center;
    cursor: grabbing;
    /* overflow-x: hidden; */
    user-select: none;
    overflow-wrap: break-word;
}
.droppable h1, p {
    color: black;
    padding-bottom: 5px;
    font-size: 15px;
}
.draggable {
    background-color: white;
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 10px;
    cursor: grab;
    height: auto;
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
}
.draggable h5{
    color: black;
}
.priority-critical{
    color: red;
    font-weight: bold;
}
.priority-high {
  color: orange;
  font-weight: bold;
}
.priority-medium {
  color: rgb(51, 51, 143);
}
.priority-low {
  color: green;
}
.status{
    padding: 8px;
    display: flex;
    justify-content: space-between;
}
.add-list{
    padding: 10px;
    border-radius: 10px;
    background-color: rgb(233, 229, 229);
    width: 300px; 
    height: fit-content;
    opacity: 90%;
    /* margin: 10px; */
    text-align: center;
    display: flex;
    justify-content: space-between;
    /* cursor: grabbing; */
    /* overflow-x: hidden; */
    user-select: none;
    
    /* overflow-wrap: break-word; */
}

.status-name {
    max-width: 150px;
    display: inline-block;
    white-space: normal; /* Позволяет переносить слова */
    word-break: break-word;
    overflow-wrap: break-word;
    text-align: center;
}

</style>



