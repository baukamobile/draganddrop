<script setup>
import { onMounted, ref } from "vue";
import PageWrapper from "@/components/PageWrapper.vue";
import { getTask,getStatusTask } from "@/api/tasks";
import StatisticsSection from "@/components/pages/dashboard/StatisticsSection.vue";
import SalesSection from "@/components/pages/dashboard/SalesSection.vue";
import LatestSection from "@/components/pages/dashboard/LatestSection.vue";
import Button from "@/components/Button.vue";
const tasks = ref([]);

onMounted(async () => {
    tasks.value = await getTask();
});
// const tasks = ref([
//     { id: 9, title: "Обучение по системе обработки заявок «Тазалык» и «Инватакси».",
// description: "", tags: "", documents: null, start_date: "2025-02-12T04:05:35Z", end_date: "2025-02-12T04:05:38Z", status: "АКТИВЕН",
// priority: "Низкий", agreed_with_managers: false, projects: 1, assigned: 3, department: 1,statusesId:1
//     },
// ]);

// const statuses = ref([
//     // { id: 0, title: "Список Задач" },
// ]);

function ondragstart(e, task) {
    e.dataTransfer.dropEffect = "move";
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("taskID", task.id.toString());
}

async function onDrop(e, statusId) {
    e.preventDefault();
    const taskID = parseInt(e.dataTransfer.getData("taskID"));

    try {
        await updateTaskStatus(taskID, statusId);
        tasks.value = tasks.value.map((task) =>
            task.id === taskID ? { ...task, statusesId: statusId } : task
        );
    } catch (error) {
        console.error("Ошибка при обновлении задачи:", error);
    }
}
</script>

<template>
    <PageWrapper>
        <h2 class="text-center">Dashboard</h2>
        <div v-for="task in tasks" :key="task.id">
            <h1>{{ task.task_name }} - {{ task.status_name }}</h1>
        </div>
        <div class="flex flex-col gap-4 md:flex-row md:items-center">
            <div class="dashboard">
                <!-- <h1>Hello World</h1> -->
                <div class="center">
                    <div v-for="status in statuses" :key="status.id" @drop="onDrop($event, status.id)"
                        class="droppable" @dragover.prevent @dragenter.prevent>
                        <h1>{{ status.status_name }}</h1>
                        <div v-for="task in tasks.filter(x => x.statusesId == status.id)" :key="task.id"
                            @dragstart="ondragstart($event, task)" draggable="true" class="draggable">
                            <h5>{{ task.task_name }}</h5>
                        </div>
                    </div>
                    <h1>getTask</h1>
                 <div v-for="task in tasks" :key="task.id">
                <h1>{{ task.task_name }}</h1> <!-- Используй task.title, если API возвращает поле title -->
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
    background-color: rgb(178, 118, 190);
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
.droppable h1 {
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