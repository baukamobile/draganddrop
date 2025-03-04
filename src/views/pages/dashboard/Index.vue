<script setup>
import { ref } from "vue";
import { useTaskManager } from "@/views/pages/dashboard/useTaskManger";
import './styles/dashboard.css';
import PageWrapper from '@/components/PageWrapper.vue';
import SidebarContent from "@/components/sidebar/SidebarContent.vue";
// C:\Users\User\Desktop\docs\vue-task-manager\src\components\PageWrapper.vue
const {
    tasks,
    statuses,
    projects,
    users,
    newStatus,
    priority,
    handleClick,
    handleClickTask,
    ondragstart,
    onDrop,
    formatDate,
    submitColumn,
    submitTask,
    
} = useTaskManager();

const showTaskForm = ref(false);
const newTask = ref({
    task_name: "",
    description: "",
    documents: null,
    end_date: "",
    agreed_with_managers: false,
    projects: null,
    assigned: null,
    status: null
});

</script>

<template>
    <PageWrapper>
        <div class="flex flex-col gap-4 md:flex-row md:items-center">
            <div class="dashboard">
                <div class="center">
                    <div v-for="status in statuses" :key="status.id"
                         @drop="onDrop($event, status.id)"
                         class="droppable"
                         @dragover.prevent
                         @dragenter.prevent>
                        <div class="status">
                            <h1 class="status-name">{{ status.status_name }}</h1>
                            <a-button class="red-button" @click="handleClick(status.id)">Удалить колонку</a-button>
                        </div>

                        <transition-group name="fade">
                            <div v-for="task in tasks.filter(x => x.status == status.id)" :key="task.id"
                                @dragstart="ondragstart($event, task)"
                                draggable="true"
                                class="draggable">
                                <p>{{ task.task_name }} 
                                    <span :style="{ color: priority[task.priority]?.color }">
                                        ({{ priority[task.priority]?.priority_name || 'Неизвестный' }})
                                    </span>
                                </p>
                                <div class="time-part">
                                    <p>от {{ formatDate(task.start_date) }}</p>
                                    <p>до {{ formatDate(task.end_date) }}</p>
                                </div>
                                <a @click.prevent="handleClickTask(task.id)" class="delete-task">Удалить</a>
                            </div>
                        </transition-group>
<!-- Здсь форма для добавление задач с вводимым данными -->
                        <div class="add-task-container">
                            <a @click="showTaskForm = !showTaskForm" href="#" class="add-task">Добавить Задачу</a>
                            <div v-if="showTaskForm">
                                <h2>Форма</h2>
                                <form @submit.prevent="submitTask">
                                   
                                   <label class="label-name">Название:</label>
                                   <textarea v-model="newTask.task_name" placeholder="Название задачи" required></textarea>
                                   <!-- <input v-model="newTask.task_name" placeholder="Название задачи" required> -->
                                   <br><br>    
                                   <label class="label-name">Описание:</label>
                                   <input v-model="newTask.description" placeholder="Описание задачи" required>
                                   <br><br>
                                   <label class="label-name">Прикрепить Файл: </label>
                                   <input type="file">
                                   <br>
                                   <!-- <label class="label-name">Начало:</label> -->
                                   <!-- <input type="date" id="email1" name="email1"> -->
                                   <br>
                                   <label class="label-name">Конец:</label>
                                   <input type="date" v-model="newTask.end_date">
                                   <br><br>
                                   <label class="label-name">Согласовано с руководством:</label>
                                   <input type="checkbox" v-model="newTask.agreed_with_managers">
                                   <br><br>
                                   <label class="label-name">Подписан с :</label>
                                   <!-- <label class="label-name">Название проекта:</label> -->
                                   <select id="users" v-model="newTask.assigned">
                                   <option v-for="user in users" :key="user.id" :value="Number(user.id)">
                                       {{ user.first_name }}  
                                   </option>
                               </select> 
                                   <br><br>
                                   <label class="label-name">Название проекта:</label>
                                   <select id="users" v-model="newTask.projects">
                                   <option v-for="project in projects" :key="project.id" :value="Number(project.id)">
                                       {{ project.id }}  {{ project.project_name }}
                                   </option>
                               </select> 
                                   <br><br>
                                   <label for="">Приоритет</label>
                                   <select v-model="newTask.priority">
                                    <option v-for="(priority_value, priority_key) in priority" :key="priority_key" :value="priority_key">{{ priority_value.priority_name }}</option>
                               </select>
                               <br><br>
                               <select id="users" v-model="newTask.status">
                                <option v-for="status in statuses" :key="status.id" :value="status.id">
    {{ status.status_name }}
</option>

</select>

                               <br>
                               <br>
                               <!-- <a href="#">Добавить</a> -->
                                   <button type="submit ">Добавить</button>
                               </form>
                            </div>
                        </div>
                    </div>
                     <div class="add-list">
<!--  форма для доавление колонок -->
                        <h2>Добавить колонку</h2>
                        <form @submit.prevent="submitColumn">
                            <input v-model="newStatus.status_name" placeholder="Название колонки" required />
                            <div><label for="users">Сотрудник:</label>
                                <select id="users" v-model="newStatus.user">
                                    <option v-for="user in users" :key="user.id" :value="Number(user.id)">
                                        {{ user.first_name }}  {{ user.last_name }}
                                         <!-- {{ user.department.department_name }} -->
                                         {{ user.department ? user.department.department_name : 'No department' }}
                                    </option>
                                </select>
                            </div>
                            <button type="submit">Добавить</button>
                        </form>
                    </div> 

                    </div>

                </div>
            </div>
        <!-- </div> -->
    </PageWrapper>
</template>



