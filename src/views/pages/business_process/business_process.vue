<script setup>
import { ref, watch, reactive } from "vue";
import { useTaskManager } from "./BpmManager";
import './style/style.css';
import PageWrapper from '@/components/PageWrapper.vue';
import { EditFilled, DeleteOutlined, CommentOutlined } from "@ant-design/icons-vue";
import { useRoute } from 'vue-router';
import {DeleteFilled} from '@element-plus/icons-vue' 
// import { useSortable } from '@vueuse/core';

// C:\Users\User\Desktop\docs\vue-task-manager\src\components\PageWrapper.vue
const {
    bpm_tasks,
        process_stages,
        processes,
        users,
        newProcessStage,
        newTask,
        department,
        updateTask,
        editTask,
        handleClick,
        handleClickTask,
        ondragstart,
        onDrop,
        formatDate,
        formatDateForBackend,
        submitColumn,
        submitTask,
        onColumnDrag,
        onColumnDrop,
        onColumnDragOver,

} = useTaskManager();
// const el = useTemplateRef<HTMLElement>('el')
// useSortable(el, list)
const showTaskForm = ref({});
const toggleTaskForm = (statusId) => {
    showTaskForm.value = { ...showTaskForm.value, [statusId]: !showTaskForm.value[statusId] };
    if (showTaskForm.value[statusId]) {
        newTask.status = statusId; // Автоматически устанавливаем статус
    }
};
const route = useRoute();
const selectedProjectId = ref(Number(route.params.process_id));
// watch(() => newTask, (val) => {
//     console.log('newtask изменился: ', JSON.stringify(val, null, 2));
// }, { deep: true });
</script>
<template>
    <PageWrapper>
        <h1 v-for="status in process_stages.filter(s => s.process_id === selectedProjectId)" :key="status.id">
    {{ status.status_name }}
</h1>
        <div class="flex flex-col gap-4 md:flex-row md:items-center">
            <div class="dashboard">
                <div class="center">
                    <div v-for="status in process_stages" :key="status.id" @drop="onDrop($event, status.id)" class="droppable"
    @dragover.prevent @dragenter.prevent>
                        <!-- Разрешение для перетаскивание -->
                        <div class="status">
                            <h1 class="status-name">{{ status.name }}</h1>
                            <!-- <a-button class="red-button" @click="handleClick(status.id)">Удалить колонку -->
                            <a class="red-button" @click="handleClick(status.id)">
                                <!-- <DeleteOutlined style="font-size: 15px; color: red; cursor: pointer;" /> -->
                                <el-icon style="font-size: 15px; color: red; cursor: pointer;"><DeleteFilled /></el-icon>
                            </a>
                        </div>
                        <transition-group name="fade">
                            <div v-for="task in bpm_tasks.filter(x => x.current_stage == status.id && new Date(x.due_date) > new Date())"
                                :key="task.id" @dragstart="ondragstart($event, task)" draggable="true"
                                class="draggable">
                                <div class="form1">
                                    <p style="margin: 0;">
                                        {{ task.title }}
                                        <!-- <span :style="{ color: priority[task.priority]?.color }">
                                            ({{ priority[task.priority]?.priority_name || 'Неизвестный' }})
                                        </span> -->
                                    </p>
                                    <div style="display: flex;">
                                        <a @click.prevent="handleClickTask(task.id)" class="delete-task">
                                            <DeleteOutlined style="font-size: 15px; color: red; cursor: pointer;" />
                                        </a>
                                        <EditFilled style="font-size: 15px; color: green;" @click="editTask(task)" />
                                    </div>
                                </div>
                                <div class="time-part">
                                    <p>от {{ formatDate(task.created_at) }}</p>
                                    <p>до {{ formatDate(task.due_date) }}</p>
                                </div>
                                <p>
                                    {{ task.description }}
                                <p>Создано с {{users.find(user => user.id === task.created_by)?.first_name ||
                                    'Неизвестно'}}</p>
                                </p>
                                <CommentOutlined style="color: green; cursor: pointer;" />
                            </div>
                        </transition-group>
                        <!-- Здсь форма для добавление задач с вводимым данными -->
                        <div class="add-task-container">
                            <a @click="toggleTaskForm(status.id)" href="#" class="add-task">Добавить Задачу</a>
                            <!-- порма открывается только выбранного колонки с помошью id -->
                            <div v-if="showTaskForm[status.id]">
                                <!-- <a @click="showTaskForm = !showTaskForm" href="#" class="add-task">Скрыть</a> -->
                                <h2>Форма</h2>
                                <form @submit.prevent="newTask.id ? updateTask() : submitTask();">

                                    <label class="label-name">Название:</label>
                                    <input v-model="newTask.title" placeholder="Название задачи" required>>
                                    <!-- <input v-model="newTask.task_name" placeholder="Название задачи" required> -->
                                    <br><br>
                                    <label class="label-name">Описание:</label>
                                    <input v-model="newTask.description" placeholder="Описание задачи">
                                    <br><br>
                                    <label class="label-name">Прикрепить Файл: </label>
                                    <input type="file" @input="console.log('файл изменилось:')">
                                    <br>
                                    <br>
                                    <label class="label-name">Начало:</label>
                                    <input type="date" v-model="newTask.created_at">
                                    <br><br>
                                    <label class="label-name">Конец:</label>
                                    <input type="date" v-model="newTask.due_date">
                                    <!-- @input="newTask.end_date = $event.target.value || null"> -->
                                    <!-- <br><br> -->
                                    <!-- <label>Отдел</label>
                                    <select v-model="newTask.department"
                                        @change="console.log('отдел: ', newTask.department)">
                                        <option v-for="dep in department" :key="dep.id" :value="dep.id">
                                            {{ dep.department_name }}
                                        </option>
                                    </select> -->
                                    <!-- <label class="label-name">Согласовано с руководством:</label>
                                    <input type="checkbox" v-model="newTask.agreed_with_managers"> -->
                                    <br><br>
                                    <label class="label-name">Подписан с :</label>
                                    <!-- <label class="label-name">Название проекта:</label> -->
                                    <select id="users" v-model="newTask.created_by">
                                        <option v-for="user in users" :key="user.id" :value="Number(user.id)">
                                            {{ user.first_name }}
                                        </option>
                                    </select>
                                    <br><br>
                                    <label class="label-name">Название проекта:</label>
                                    <select v-model="newTask.process">
                                        <option v-for="processes in process" :key="processes.id" :value="processes.id">{{
                                            processes.name }}</option>
                                    </select>
                                    <br><br>
                                    <label for="">Приоритет</label>
                                    <!-- <select v-model="newTask.priority">
                                        <option v-for="(priority_value, priority_key) in priority" :key="priority_key"
                                            :value="priority_key">{{ priority_value.priority_name }}</option>
                                    </select> -->
                                    <br><br>
                                    <!-- <select v-model="newTask.status">
                                        <option v-for="status in statuses" :key="status.id" :value="status.id">
                                            {{ status.status_name }}</option>
                                    </select> -->

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
                            <input v-model="newProcessStage.name" placeholder="Название колонки" required />
                            <div><label for="users">Сотрудник:</label><br>
                                <select id="users" v-model="newProcessStage.owner">
                                    <option v-for="owners in newProcessStage.owner" :key="owners.id" :value="Number(owners.id)">
                                        {{ owners.first_name }} 
                                        <!-- {{ user.last_name }} -->
                                        <!-- {{ user.department.department_name }} -->
                                        <!-- {{ user.department ? user.department.department_name : 'No department' }} -->
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
