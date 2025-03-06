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
    const statuses = ref([]);
    const projects = ref({});
    const users = ref([]);
    const newStatus = ref({ status_name: "", user: null });
    const newTask = reactive({
        task_name: ref(""),
        description: ref(""),
        documents: ref(null),
        end_date: ref(""),
        agreed_with_managers: ref(false),
        assigned: ref(14),
        status: ref(1),
        priority: ref(1),
        projects: ref(2),
        department: ref(1) })
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
            // console.log('Newtasks',newTask);
            newTask.end_date = formatDateForBackend(newTask.end_date); // убедись, что дата правильно форматируется
            if (!newTask || typeof newTask.task_name === "undefined") {
                console.error("Ошибка: newTask не инициализирован!");
                return;
            }
            
            if (!newTask.task_name.trim()) {
                console.error("Задание должно быть заполненным");
                return;
            }
    
            if (!newTask.projects) {
                alert("Выберите проект");
                return;
            }
    
            console.log("Попытка отправки запроса...", JSON.stringify(newTask, null, 2));
            await addTask(newTask); // отправка данных без сброса
            // tasks.value = await getTask(); // обновление списка задач после отправки
            tasks.value = [...await getTask()];
            console.log('НОВАЯ ЗАДАЧА', tasks.value)
            console.log("Задание перед отправкой:", {
                task_name: newTask.task_name,
                description: newTask.description,
                end_date: newTask.end_date,
                assigned: newTask.assigned,
                projects: newTask.projects,
                status: newTask.status,
                priority: newTask.priority,
            });
            // Сбрасывай только после успешной отправки
            newTask.task_name = "";
            newTask.description = "";
            newTask.documents = null;
            newTask.end_date = "";
            newTask.agreed_with_managers = false;
            newTask.projects = null;
            newTask.assigned = null;
            newTask.status = 1;
        } catch (error) {
            console.error("Ошибка при добавлении задания", error);
        }
    };
    
    
    
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


