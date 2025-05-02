<script setup>
import PageWrapper from '@/components/PageWrapper.vue'
import './styles/styles.css'
import { ProjectsManager } from './Report_manager'
import { useRouter } from 'vue-router'
import { useTaskManager } from '@/components/dashboard/useTaskManger';
import { ref, reactive } from 'vue';
import { addProject } from '@/api/tasks';
//PROJECT
const { projects } = ProjectsManager();

const router = useRouter();
const showProjectForm = ref(false);

const newProject = reactive({
    project_name: "",
    description: "",
    department: 1,
    assigned: 1,
    start_date: new Date().toISOString(),
    end_date: ""
});

const goToProject = (projectId) => {
    router.push({ name: 'ProjectTasks', params: { projectId } });
};

const {
    formatDate,
} = useTaskManager();


const toggleProjectForm = () => {
  showProjectForm.value = !showProjectForm.value;
};

const saveProject = () => {
  if (!newProject.project_name) {
    alert("Введите название проекта");
    return;
  }
  
  if (!newProject.end_date) {
    alert("Выберите дату окончания проекта");
    return;
  }
  
  addProject({...newProject});
  
  // Сброс формы
  newProject.project_name = "";
  newProject.description = "";
  newProject.end_date = "";
  
  // Закрыть форму
  showProjectForm.value = false;
};
</script>

<template>
    <PageWrapper>
        <div class="ag-format-container">
            <a href="#" @click.prevent="toggleProjectForm">
                <h1 class="text-xl font-semibold leading-tight" style="display: flex; justify-content: right; padding: 10px;">Добавить Проект + </h1>
            </a>
            
            <!-- Форма добавления проекта -->
            <div v-if="showProjectForm" class="project-form-container">
                <div class="project-form">
                    <h2 class="form-title">Новый проект</h2>
                    <div class="form-group">
                        <label>Название проекта</label>
                        <input v-model="newProject.project_name" type="text" placeholder="Введите название проекта">
                    </div>
                    <div class="form-group">
                        <label>Описание</label>
                        <textarea v-model="newProject.description" placeholder="Введите описание проекта"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Дата окончания</label>
                        <input v-model="newProject.end_date" type="date">
                    </div>
                    <div class="form-actions">
                        <button @click="saveProject" class="save-btn">Сохранить</button>
                        <button @click="toggleProjectForm" class="cancel-btn">Отмена</button>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="projects-container">
            <div v-for="(item, index) in projects" :key="index">
                <div class="ag-courses_item" @click="goToProject(item.id)">
                    <div class="ag-courses-item_link">
                        <div class="ag-courses-item_bg"></div>
                        <div class="ag-courses-item_title">
                            Проект: {{ item.project_name }}
                        </div>
                        <p style="color: aliceblue; z-index: 5;">{{ item.description }}</p>
                        <div class="ag-courses-item_date-box">
                            Начало: <span class="ag-courses-item_date">{{ formatDate(item.start_date) }}</span>
                            Конец: <span class="ag-courses-item_date">{{ formatDate(item.end_date) }}</span>
                            <el-icon><Search /></el-icon>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </PageWrapper>
</template>

<style scoped>
select,option,form,input,textarea{
    color: black;
}
.project-form-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
}

.project-form {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
}

.form-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 20px;
    color: #333;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
    color: #333;
}

.form-group input, .form-group textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.form-group textarea {
    height: 100px;
}

.form-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.save-btn, .cancel-btn {
    padding: 8px 20px;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
}

.save-btn {
    background-color: #4CAF50;
    color: white;
    border: none;
}

.cancel-btn {
    background-color: #f44336;
    color: white;
    border: none;
}

.projects-container {
    margin-top: 20px;
}
</style>