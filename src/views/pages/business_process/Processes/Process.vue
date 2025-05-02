<script setup>
import PageWrapper from '@/components/PageWrapper.vue';
import './style/style.css';
import { ProcessManager } from '@/views/pages/business_process/Processes/getProcess';
import { useRouter } from 'vue-router';
import { useTaskManager } from '@/components/dashboard/useTaskManger';
import { addProcess } from '@/api/tasks';
import { reactive, ref, onMounted } from 'vue';
import axios from 'axios';
const API_URL_USERS = import.meta.env.VITE_API_URL_USERS;
const API_URL_DEPARTMENT = import.meta.env.VITE_API_DEPARTMENT;
const { processes } = ProcessManager();
const router = useRouter();
const showProcessForm = ref(false);
const departments = ref([]);
const owners = ref([]);

const goToProcess = (processId) => {
    router.push({ name: 'Processtasks', params: { processId } });
};

const newProcess = reactive({
    template: null,
    name: "",
    description: "",
    owner: null,
    department: null,
    bpmn_xml: null,
    is_complete: false,
    is_recurring: false,
    recurring_interval: null
});

const { formatDate } = useTaskManager();

const toggleProcessForm = () => {
    showProcessForm.value = !showProcessForm.value;
    if (showProcessForm.value) {
        fetchDepartments();
        fetchOwners();
    }
};

const fetchDepartments = async () => {
    try {
        const response = await axios.get(`${API_URL_DEPARTMENT}/`);
        departments.value = response.data;
    } catch (error) {
        console.error('Ошибка при загрузке отделов:', error);
    }
};

const fetchOwners = async () => {
    try {
        const response = await axios.get(`${API_URL_USERS}/`)
        owners.value = response.data;
    } catch (error) {
        console.error('Ошибка при загрузке пользователей:', error);
    }
};

const saveProcess = async () => {
    console.log('newProcess:', newProcess); // Отладка
    if (!newProcess.name) {
        alert('Введите название процесса');
        return;
    }
    if (!newProcess.department) {
        alert('Выберите отдел');
        return;
    }

    const processData = {
        ...newProcess,
        department: newProcess.department?.id || newProcess.department,
        owner: newProcess.owner?.id || newProcess.owner,
    };

    try {
        await addProcess(processData);
        newProcess.name = "";
        newProcess.description = "";
        newProcess.department = null;
        newProcess.owner = null;
        showProcessForm.value = false;
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при сохранении процесса: ' + (error.message || 'Неизвестная ошибка'));
    }
};

onMounted(() => {
    fetchDepartments();
    fetchOwners();
});
</script>

<template>
    <PageWrapper>
        <div class="ag-format-container">
            <a href="#" @click.prevent="toggleProcessForm">
                <h1 class="text-xl font-semibold leading-tight" style="padding: 10px; background-color: green;">Добавить Процесс + </h1>
            </a>
            
            <!-- Форма добавления процесса -->
            <div v-if="showProcessForm" class="project-form-container">
                <div class="project-form">
                    <h2 class="form-title">Новый процесс</h2>
                    <div class="form-group">
                        <label>Название процесса</label>
                        <input v-model="newProcess.name" type="text" placeholder="Введите название процесса">
                    </div>
                    <div class="form-group">
                        <label>Описание</label>
                        <textarea v-model="newProcess.description" placeholder="Введите описание процесса"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Отдел</label>
                        <select v-model="newProcess.department">
                            <option value="" disabled selected>Выберите отдел</option>
                            <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                                {{ dept.department_name }}
                            </option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Владелец процесса</label>
                        <select v-model="newProcess.owner">
                            <option value="" disabled selected>Выберите владельца</option>
                            <option v-for="user in owners" :key="user.id" :value="user.id">
                                {{ user.first_name }} {{ user.last_name || user.username }}
                            </option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button @click="saveProcess" class="save-btn">Сохранить</button>
                        <button @click="toggleProcessForm" class="cancel-btn">Отмена</button>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="process-container">
            <div v-for="(item, index) in processes" :key="index">
                <div class="ag-courses_item" @click="goToProcess(item.id)">
                    <div class="ag-courses-item_link">
                        <div class="ag-courses-item_bg"></div>
                        <div class="ag-courses-item_title">
                            Процесс: {{ item.name }}
                        </div>
                        <div class="ag-courses-item_title2">
                            <p style="color: aliceblue; z-index: 5;">{{ item.description }}</p>
                        </div>
                        <div class="ag-courses-item_date-box">
                            Начало: <span class="ag-courses-item_date">{{ formatDate(item.created_at) }}</span>
                            Конец: <span class="ag-courses-item_date">{{ formatDate(item.updated_at) }}</span> 
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

.form-group input, .form-group textarea, .form-group select {
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

.process-container {
    margin-top: 20px;
}
</style>