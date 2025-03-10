import { ref, onMounted } from "vue";
import { getTask, getStatusTask, updateTaskStatus, addColumn,addTask } from "@/api/tasks";
import {getUsers} from "@/api/users";
import axios from "axios";
import { reactive } from "vue";
const API_URL = "http://127.0.0.1:8000/tasks/tasks";
const API_URL_USERS = "http://127.0.0.1:8000/users/users";
const API_URL_STATUS = "http://127.0.0.1:8000/tasks/status";
const API_URL_PROJECTS = "http://127.0.0.1:8000/tasks/projects";
export const getProject = async () => {
    try {
        const response = await axios.get(`${API_URL_PROJECTS}/`);
        console.log('Загрука проектов')
        return response.data;
    } catch (error) {
        console.error(`Ошибка при получении проекта:`, error);
        return null;
    }
};


export function useTaskManager() {
    const tasks = ref([]);
    // const statuses = ref([
    //     { id: 1, status_name: "Список задач", user: 1 },
    // ]);
    const projects = ref({});
    const users = ref([]);
    const newStatus = ref({ status_name: "", user: null });
    // const showTaskForm = ref({}); // Храним состояние формы для каждой колонки (статуса)
const statuses = ref([
    { id: 1, status_name: "Список задач", user: 1 },
    { id: 2, status_name: "В процессе", user: 2 },
    { id: 3, status_name: "Готово", user: 3 }
]);

// const toggleTaskForm = (statusId) => {
//     showTaskForm.value = { ...showTaskForm.value, [statusId]: !showTaskForm.value[statusId] };
// };
    const newTask = reactive({
        task_name: "",
        description: "",
        documents: null,
        end_date: "",
        agreed_with_managers: false,
        assigned: 14,
        status: 1,
        priority: 1,
        projects: 2,
        department: 1 });
//Приорите  задач
    const priority = {
        1: { priority_name: "НИЗКИЙ", color: "green" },
        2: { priority_name: "СРЕДНИЙ", color: "blue" },
        3: { priority_name: "ВЫСОКИЙ", color: "orange" },
        4: { priority_name: "КРИТИЧЕСКИЙ", color: "red" },
    };
//Удаление Колонок
    const handleClick = async (statusId) => {
        try {
            await axios.delete(`${API_URL_STATUS}/${statusId}/`);
            console.log('Удаление колонок')
            statuses.value = statuses.value.filter(status => status.id !== statusId);
        } catch (error) {
            console.error("Ошибка удаления колонки", error);
        }
    };
//Удаление Задач
    const handleClickTask = async (taskID) => {
        try {
            await axios.delete(`${API_URL}/${taskID}/`);
            tasks.value = tasks.value.filter(task => task.id !== taskID);
            console.log('Удаление задач')
        } catch (error) {
            console.error("Ошибка удаления задачи", error);
        }
    };

/**
 * 
 * Обработчик начала перетаскивание задачи
 * Устанавливает данные для передачи в собитии drag and drop
 * 
 * @param {DragEvent} e обьект событии перетаскивания 
 * @param {object} task Задача которую перетаскивает
 */

    function ondragstart(e, task) {
        console.log('Перетаскивание задач')
        e.dataTransfer.dropEffect = "move"; //Визуальный эффект перетаскивании
        e.dataTransfer.effectAllowed = "move"; // разрешено только перемещение
        e.dataTransfer.setData("taskID", task.id.toString()); // Передаем ID задачи.
        // console.log("Начало перетаскивания:", task);
    }
    /**
 * Обработчик события "drop" — обновляет статус задачи при перетаскивании.
 *
 * @param {DragEvent} e - Объект события перетаскивания.
 * @param {number} statusId - ID нового статуса, в который перетащили задачу.
 */
    async function onDrop(e, statusId) {
        e.preventDefault(); // Отменяем стандартное поведение браузера.
        const taskID = parseInt(e.dataTransfer.getData("taskID")); // Получаем ID задачи.
        try {
            await updateTaskStatus(taskID, statusId); // Обновляем статус задачи на сервере.
            const task = tasks.value.find(t => t.id === taskID); // Находим задачу в локальном списке.
            if (task) {
                task.status = statusId; // Обновляем статус у клиента.
            }
        } catch (error) {
            console.error("Ошибка при обновлении задачи:", error);
        }
    }
//Формат дата от django формат даты на день месяц и время
    function formatDate(dateString) {
        const date = new Date(dateString);
        if (!dateString) return "Нет даты"; 
        return date.toLocaleString("ru-RU", { day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" });
    }
    function formatDateForBackend(dateString) {
        if (!dateString) return null;  // Проверяем, что не null/undefined
        
        const date = new Date(dateString);
        if (isNaN(date)) {
            console.error("Неправильная дата:", dateString);
            return null;
        }
    
        return date.toISOString().split("T")[0]; // Дата без времени
    }
    
 // логика создание колонок.  
const submitColumn = async () => {
        try {
            
console.log(" Тип end_date:", typeof newTask.end_date);
            if (!newStatus.value.user) {

                console.error("Ошибка: user не выбран!");
                return;
            }
            await addColumn(newStatus.value);
            newStatus.value.status_name = "";
            newStatus.value.user = null;
            statuses.value = await getStatusTask();
        } catch (error) {
            console.error("Ошибка при добавлении колонки", error);
        }
    };

    const submitTask = async () => {
        try {
            console.log("Перед отправкой:", JSON.stringify(newTask, null, 2));
            newTask.end_date = formatDateForBackend(newTask.end_date);
    
            if (!newTask || !newTask.task_name?.trim()) {
                console.error("Ошибка: Задание должно быть заполненным");
                return;
            }
    
            if (!newTask.projects) {
                alert("Выберите проект");
                return;
            }
    
            console.log("Попытка отправки запроса...", JSON.stringify(newTask, null, 2));
    
            // Отправляем данные
            const response = await axios.post(`${API_URL}/`, newTask);
            console.log("Ответ сервера:", response.data);
    
            // Обновляем список задач
            tasks.value.length = 0; 
            tasks.value.push(...await getTask());
    
            console.log("НОВАЯ ЗАДАЧА", tasks.value);
    
            // Очищаем форму после успешной отправки
            Object.assign(newTask, {
                task_name: "",
                description: "",
                documents: null,
                end_date: "",
                agreed_with_managers: false,
                projects: null,
                assigned: null,
                status: 1,
                priority: 1
            });
    
        } catch (error) {
            console.error("Ошибка при добавлении задания", error);
        }
    };
    const updateTask = async() => {
        try {
            if (!newTask.id) {
                console.error("Нет ID задачи для обновления");
                return;
            }
    
            console.log("Отправка обновления задачи:", JSON.stringify(newTask, null, 2));
    
            const response = await axios.patch(`${API_URL}/${newTask.id}/`, newTask);
            console.log("Ответ сервера:", response.data);
    
            // Обновляем список задач после обновления
            tasks.value.length = 0;
            tasks.value.push(...await getTask());
    
        } catch (error) {
            console.error("Ошибка при обновлении задачи", error);
        }
    }
    
    
    
    
// onmounted грузит три запроса подряд  завернули в Promise.all(), чтобы грузилось параллельно:
onMounted(async () => { //Код внутри выполняется, когда компонент уже вставлен в DOM.
    try {
        const [taskData, statusData, userData, projectData] = await Promise.allSettled([ //Мы используем Promise.allSettled() вместо Promise.all().
            //Разница: Promise.allSettled() не прерывает выполнение при ошибке, а возвращает массив с объектами-результатами каждого запроса.
            getTask(),
            getStatusTask(),
            getUsers(),
            getProject(),
        ]);

        if (taskData.status === "fulfilled") tasks.value = taskData.value;
        if (statusData.status === "fulfilled") statuses.value = statusData.value;
        if (userData.status === "fulfilled") users.value = userData.value;
        if (projectData.status === "fulfilled") projects.value = projectData.value;
        
        console.log("Данные загружены:", { tasks: tasks.value, statuses: statuses.value, users: users.value, projects: projects.value });

    } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
    }
});


    return {
        tasks,
        statuses,
        projects,
        users,
        newStatus,
        newTask,
        priority,
        updateTask,
        handleClick,
        handleClickTask,
        ondragstart,
        onDrop,
        formatDate,
        formatDateForBackend,
        submitColumn,
        submitTask,
    };
}


