<template>
    <div class="center">
      <!-- <div> -->
        <div  v-for="status in statuses" 
        :key="status.id"
        @drop="onDrop($event, status.id)"
         class="droppable"
         @dragover.prevent @dragenter.prevent
         >
            <h1>{{ status.title }}</h1>
            <div 
                v-for="task in tasks.filter(x => x.statusesId==status.id)" 
                :key="task.id" 
                @dragstart="ondragstart($event, task)" 
                draggable="true" 
                class="draggable"
            >
                <h5>{{ task.title }}</h5>
            </div>
        </div>
    <!-- </div> -->
    </div>
</template>

<script lang="ts">
import { ref } from "vue";

export default {
    name: "App",
    setup() {
        const tasks = ref([
            { id: 0, title: "Django rest api conf", statusesId: 0 },
            { id: 1, title: "Vuejs component", statusesId: 1 },
            { id: 2, title: "Figma design", statusesId: 2 },
            { id: 3, title: "Figma design", statusesId: 2 },
            { id: 4, title: "Figma design", statusesId: 2 },
            { id: 5, title: "Vuejs component", statusesId: 1 },
            { id: 6, title: "Figma design", statusesId: 2 },
            { id: 7, title: "Figma design", statusesId: 2 },
            { id: 8, title: "Figma design", statusesId: 2 },
        ]);

        const statuses = ref([
            { id: 0, title: "Todo" },
            { id: 1, title: "In progress" },
            { id: 2, title: "Finished" },
        ]);

        function ondragstart(e: DragEvent, task) {
            e.dataTransfer.dropEffect='move';
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('taskID',task.id.toString());
            // event.dataTransfer.setData("taskId", taskId);
        }

        function onDrop(e: DragEvent, statusId) {
            e.preventDefault();
            const taskID = parseInt(e.dataTransfer.getData('taskID'));
            tasks.value = tasks.value.map(x =>{
                if(x.id == taskID)
                    x.statusesId = statusId
                return x
            })
        }

        return {
            tasks,
            statuses,
            ondragstart,
            onDrop,
        };
    },
};
</script>

<style scoped>
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
    background-color: coral;
    width: 300px; /* 🔥 Задаем фиксированную ширину */
    max-height: 300px;
    overflow-y: scroll;
    overflow-x: scroll;
    text-align: center;
}

.droppable h1 {
    color: white;
}

.draggable {
    background-color: white;
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 10px;
    cursor: grab;
}

</style>

<!-- <script setup>
import { onMounted } from 'vue'

onMounted(() => {
    // document.getElementById('loading')?.remove() // Сразу убираем элемент
})
</script>

<template>
    <router-view />
    <h1>Some thing</h1>
</template> -->
