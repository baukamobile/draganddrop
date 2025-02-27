<script setup>
import { onMounted, ref } from "vue";
import PageWrapper from "@/components/PageWrapper.vue";
import { getTask,getStatusTask,updateTaskStatus } from "@/api/tasks";
import StatisticsSection from "@/components/pages/dashboard/StatisticsSection.vue";
import SalesSection from "@/components/pages/dashboard/SalesSection.vue";
import LatestSection from "@/components/pages/dashboard/LatestSection.vue";
import Button from "@/components/Button.vue";

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


async function onDrop(e, statusId) {
    e.preventDefault();
    const taskID = parseInt(e.dataTransfer.getData("taskID"));

    try {
        await updateTaskStatus(taskID, statusId);  // 👈 Теперь передаем `statusId`, а не `statuses.id`

        const task = tasks.value.find(t => t.id === taskID);
        if (task) {
            task.status = statusId; // 🔥 Меняем именно `status`
        }
    } catch (error) {
        console.error("Ошибка при обновлении задачи:", error);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString("ru-RU", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
// функция переопределяющий время от django RestAPI на день месяц год и час
console.log(formatDate('2025-02-26T11:43:48.202212Z'))
// console.log(formatDate('2025-02-29T11:43:48.202212Z'))
</script>

<template>
    <PageWrapper>
        <h2 class="text-center">Dashboard</h2>

        <div class="flex flex-col gap-4 md:flex-row md:items-center">
            <div class="dashboard">
                <!-- <h1>Hello World</h1> -->
                <div class="center">
                    <div v-for="status in statuses" :key="status.id"
                     @drop="onDrop($event, status.id)"
                        class="droppable" @dragover.prevent @dragenter.prevent>
                        <h1>{{ status.status_name }}</h1>
                        <!-- status id -->
                        <div v-for="task in tasks.filter(x => x.status == status.id)" 
                            
                             :key="task.id"
                            @dragstart="ondragstart($event, task)" 
                            draggable="true" class="draggable">
                            <h5>{{ task.task_name }}</h5>
                            <!-- <p>{{ task.start_date | formatTime }}</p> -->
                            <p>{{formatDate(task.end_date) }}</p> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </PageWrapper>
</template>

<style scoped>
.dashboard {
    max-width: 165vh;
    height: 80vh;
    background-color:rgb(8, 133, 222);
    overflow-x: scroll; /* Горизонтальный скролл */
    display: flex; /* Растянет внутренние элементы в строку */
    white-space: nowrap; /* Запретит перенос элементов */
    /* padding: 10px; Чтоб контент не прилипал к краям */
}
.center {
    display: flex;
    gap: 20px; /* 🔥 Добавляет отступы между колонками */
    justify-content: center; /* Центрирует колонки */
    /* align-items: flex-start; Выравнивает сверху */
    padding: 20px;
}
.droppable {
    padding: 15px;
    border-radius: 10px;
    background-color: rgb(233, 229, 229);
    width: 300px; /* 🔥 Задаем фиксированную ширину */
    /* max-height: 300px; */
    height: auto;
    /* overflow-y: scroll; */
    /* overflow-x: scroll; */
    text-align: center;
    cursor: grab;
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
}
.droppable h1, p {
    color: black;
    padding-bottom: 5px;
}
.draggable {
    background-color: rgb(255, 255, 255);
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
</style>



