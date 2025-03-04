import { ref, onMounted } from "vue";
import { getTask, getStatusTask, updateTaskStatus, addColumn, getUsers,addTask } from "@/api/tasks";
import axios from "axios";
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
    const statuses = ref([]);
    const projects = ref({});
    const users = ref([]);
    const newStatus = ref({ status_name: "", user: null });
    const newTask = ref({
        task_name: "",projects:"",description:"",documents:null,end_date:"",
        agreed_with_managers: false,assigned:null,status:1,priority: 3,projects: null,department: 1
    })
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
            statuses.value = statuses.value.filter(status => status.id !== statusId);
        } catch (error) {
            console.error("Ошибка удаления колонки", error);
        }
    };
//Удаление Задач
    const handleClickTask = async (taskID) => {
        try {
            await axios.delete(`${API_URL_TASK}/${taskID}/`);
            tasks.value = tasks.value.filter(task => task.id !== taskID);
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
        e.dataTransfer.dropEffect = "move"; //Визуальный эффект перетаскивании
        e.dataTransfer.effectAllowed = "move"; // разрешено только перемещение
        e.dataTransfer.setData("taskID", task.id.toString()); // Передаем ID задачи.
        console.log("Начало перетаскивания:", task);
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
//Формат дата именено от django формат даты на день месяц и время
    function formatDate(dateString) {
        const date = new Date(dateString);
        if (!dateString) return "Нет даты"; 
        return date.toLocaleString("ru-RU", { day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" });
    }

 // логика создание колонок.  
const submitColumn = async () => {
        try {
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
            console.log("Данные перед отправкой:", newTask.value); // <-- Лог перед валидацией
            if (!newTask.value.task_name.trim()) {
                console.error("Задание должно быть заполненным");
                return;
            }
            await addTask(newTask.value);
            projects.value = await getProject();
            newTask.value = {
                task_name: "",
                description: "",
                documents: null,
                end_date: "",
                agreed_with_managers: false,
                projects: null,
                assigned: null,
                status: null
            };
            tasks.value = await getTask();
        } catch (error) {
            console.error("Ошибка при добавлении задания", error);
        }
    };
    
// onmounted грузит три запроса подряд  завернули в Promise.all(), чтобы грузилось параллельно:
onMounted(async () => {
    const [taskData, statusData, userData, projectData] = await Promise.all([
        getTask(),
        getStatusTask(),
        getUsers(),
        getProject(),
    ]);

    tasks.value = taskData;
    statuses.value = statusData;
    users.value = userData;
    projects.value = projectData; // Тут теперь правильно

    console.log("Статусы загружены", statuses.value);
    console.log("Проекты загружены", projects.value);

    if (!projects.value || projects.value.length === 0) {
        console.error("Ошибка: проекты не загружены! Проверь API.");
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
        handleClick,
        handleClickTask,
        ondragstart,
        onDrop,
        formatDate,
        submitColumn,
        submitTask,
    };
}


