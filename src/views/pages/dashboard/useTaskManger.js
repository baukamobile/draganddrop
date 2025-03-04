import { ref, onMounted } from "vue";
import { getTask, getStatusTask, updateTaskStatus, addColumn, getUsers,addTask } from "@/api/tasks";
import axios from "axios";
const API_URL = "http://127.0.0.1:8000/tasks/tasks";
const API_URL_USERS = "http://127.0.0.1:8000/users/users";
const API_URL_STATUS = "http://127.0.0.1:8000/tasks/status";

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

const submitTask = async () =>{
    try{
        if (!newTask.value.task_name.trim()){
            console.error('Задание должно быть заполненным');
            return;
        }
        await addTask(newTask.value);
        newTask.value.task_name = "";
        newTask.value.description = "";
        newTask.value.documents = null;
        newTask.value.end_date = "";
        newTask.value.agreed_with_managers = false;
        newTask.value.projects = null;
        newTask.value.assigned =null;
        newTask.value.status;
        newTask.value.projects =null;
        tasks.value = await getTask();
    }catch (error){
        console.error('Ошибка при добавлении задании',error);
    }
}
// onmounted грузит три запроса подряд  завернули в Promise.all(), чтобы грузилось параллельно:
onMounted(async () => {
    const [taskData, statusData, userData] = await Promise.all([
        getTask(),
        getStatusTask(),
        getUsers()
    ]);
    tasks.value = taskData;
    statuses.value = statusData;
    users.value = userData;
    console.log("Данные загружены", statuses.value);
});

    return {
        tasks,
        statuses,
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


