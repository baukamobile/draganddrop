<script setup>

    import { ref, watch, reactive } from "vue";
    import { useTaskManager } from "./useTaskManger";
    import './styles/dashboard.css';
import { onMounted, computed } from 'vue';

import PageWrapper from '@/components/PageWrapper.vue';
import { DeleteFilled, EditPen } from '@element-plus/icons-vue';
import { useRoute } from 'vue-router';

const {
  tasks,
  statuses,
  projects,
  users,
  newStatus,
  newTask,
  priority,
  department,
  handleClick,
  updateTask,
  editTask,
  handleClickTask,
  ondragstart,
  onDrop,
  formatDate,
  submitColumn,
  submitTask,
  onColumnDrag,
  onColumnDrop,
  onColumnDragOver,
} = useTaskManager();

const showTaskForm = ref({});
const route = useRoute();
const selectedProjectId = ref(Number(route.params.projectId));

// Отладка
onMounted(() => {
  console.log('Project ID:', selectedProjectId.value);
  console.log('Statuses:', statuses.value); // Убедись, что statuses — ref
  console.log('Filtered Statuses:', filteredStatuses.value);
});

// Безопасная фильтрация статусов
const filteredStatuses = computed(() => {
  if (!Array.isArray(statuses.value)) {
    console.warn('Statuses is not an array:', statuses.value);
    return [];
  }
  return statuses.value.filter(s => s.project === selectedProjectId.value); // project вместо project_id
});

const toggleTaskForm = (statusId) => {
  showTaskForm.value = { ...showTaskForm.value, [statusId]: !showTaskForm.value[statusId] };
  if (showTaskForm.value[statusId]) {
    newTask.status = statusId;
  }
};
</script>

<template>
  <PageWrapper>
    <!-- Для отладки: выведем, что рендерится -->
    <div v-if="filteredStatuses.length === 0">
      <p>Нет статусов для проекта {{ projects.project_name }}</p>
    </div>
    <!-- Заголовок с отфильтрованными статусами -->
    <!-- <h1 v-for="status in filteredStatuses" :key="status.id">
      {{ status.status_name }}
    </h1> -->
    <div class="flex flex-col gap-4 md:flex-row md:items-center">
      <div class="dashboard">
        <div class="center">
          <div v-for="status in filteredStatuses" :key="status.id" @drop="onDrop($event, status.id)" class="droppable"
            @dragover.prevent @dragenter.prevent>
            <div class="status">
              <h1 class="status-name">{{ status.status_name }}</h1>
              <a class="red-button" @click="handleClick(status.id)">
                <el-icon style="font-size: 15px; color: red; cursor: pointer;"><DeleteFilled /></el-icon>
              </a>
            </div>
            <transition-group name="fade">
              <div v-for="task in tasks.filter(x => x.status === status.id && new Date(x.end_date) > new Date())"
                :key="task.id" @dragstart="ondragstart($event, task)" draggable="true" class="draggable">
                <div class="form1">
                  <p style="margin: 0;">
                    {{ task.task_name }}
                    <span :style="{ color: priority[task.priority]?.color }">
                      ({{ priority[task.priority]?.priority_name || 'Неизвестный' }})
                    </span>
                  </p>
                  <div style="display: flex;">
                    <a @click.prevent="handleClickTask(task.id)" class="delete-task">
                      <el-icon style="font-size: 15px; color: red; cursor: pointer;"><DeleteFilled /></el-icon>
                    </a>
                    <el-icon style="font-size: 15px; color: green;" @click="editTask(task)"><EditPen /></el-icon>
                  </div>
                </div>
                <div class="time-part">
                  <p>от {{ formatDate(task.start_date) }}</p>
                  <p>до {{ formatDate(task.end_date) }}</p>
                </div>
                <p>{{ task.description }}</p>
                <p>Создано с {{ users.find(user => user.id === task.assigned)?.first_name || 'Неизвестно' }}</p>
              </div>
            </transition-group>
            <div class="add-task-container">
              <a @click="toggleTaskForm(status.id)" href="#" class="add-task">Добавить Задачу</a>
              <div v-if="showTaskForm[status.id]">
                <h2>Форма</h2>
                <form @submit.prevent="newTask.id ? updateTask() : submitTask()">
                  <label class="label-name">Название:</label>
                  <input v-model="newTask.task_name" placeholder="Название задачи" required />
                  <br /><br />
                  <label class="label-name">Описание:</label>
                  <input v-model="newTask.description" placeholder="Описание задачи" />
                  <br /><br />
                  <label class="label-name">Прикрепить Файл:</label>
                  <input type="file" @input="console.log('файл изменилось:')" />
                  <br /><br />
                  <label class="label-name">Начало:</label>
                  <input type="date" v-model="newTask.start_date" />
                  <br /><br />
                  <label class="label-name">Конец:</label>
                  <input type="date" v-model="newTask.end_date" />
                  <br /><br />
                  <label>Отдел</label>
                  <select v-model="newTask.department">
                    <option v-for="dep in department" :key="dep.id" :value="dep.id">
                      {{ dep.department_name }}
                    </option>
                  </select>
                  <br /><br />
                  <label class="label-name">Подписан с:</label>
                  <select id="users" v-model="newTask.assigned">
                    <option v-for="user in users" :key="user.id" :value="Number(user.id)">
                      {{ user.first_name }}
                    </option>
                  </select>
                  <br /><br />
                  <label class="label-name">Название проекта:</label>
                  <select v-model="newTask.projects">
                    <option v-for="project in projects" :key="project.id" :value="project.id">
                      {{ project.project_name }}
                    </option>
                  </select>
                  <br /><br />
                  <label for="">Приоритет</label>
                  <select v-model="newTask.priority">
                    <option v-for="(priority_value, priority_key) in priority" :key="priority_key" :value="priority_key">
                      {{ priority_value.priority_name }}
                    </option>
                  </select>
                  <br /><br />
                  <button type="submit">Добавить</button>
                </form>
              </div>
            </div>
          </div>
          <div class="add-list">
            <h2>Добавить колонку</h2>
            <form @submit.prevent="submitColumn">
              <input v-model="newStatus.status_name" placeholder="Название колонки" required />
              <div>
                <label for="users">Сотрудник:</label><br />
                <select id="projects" v-model="newStatus.project">
                  <option v-for="project in projects" :key="project.id" :value="Number(project.id)" default=selectedProjectID>
                    {{ project.project_name }}
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
  </PageWrapper>
</template>