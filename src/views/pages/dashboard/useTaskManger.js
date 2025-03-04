import { ref, onMounted } from "vue";
import { getTask, getStatusTask, updateTaskStatus, addColumn, getUsers } from "@/api/tasks";
import axios from "axios";

const API_URL_TASK = "http://127.0.0.1:8000/tasks/tasks";
const API_URL_USERS = "http://127.0.0.1:8000/users/users/";
const API_URL_STATUS = "http://127.0.0.1:8000/tasks/status";
// const API_URL_USERS = "http://127.0.0.1:8000/users/users/";
// export default {
//   data() {
//     return {
//       tasks: [
//         { name: "", description: "", start_date: "", end_date: "", approved: false, user: null, priority: null },
//         { name: "", description: "", start_date: "", end_date: "", approved: false, user: null, priority: null }
//       ],
//       showTaskForm: {}
//     };
//   },
//   methods: {
//     toggleTaskForm(index) {
//       this.$set(this.showTaskForm, index, !this.showTaskForm[index]);
//     }
//   }
// }; 
//Добавление Задач

export default {
    data() {
      return {
        showTaskForm: false,
        task: {
          name: "",
          description: "",
          file: null,
          deadline: "",
          agreed_with_managers: false,
          assignedUser: null,
          priority: null,
        },
        users: [
          { id: 1, first_name: "John" },
          { id: 2, first_name: "Jane" },
        ],
        priority: [
          { name: "low", priority_name: "Низкий" },
          { name: "medium", priority_name: "Средний" },
          { name: "high", priority_name: "Высокий" },
        ],
      };
    },
    methods: {
      handleFileUpload(event) {
        this.task.file = event.target.files[0];
      },
      addTask() {
        console.log("Добавляем задачу:", this.task);
        // Здесь можно отправить данные на сервер через API
        this.showTaskForm = false;
      },
    },
  };

export function useTaskManager() {
    const tasks = ref([]);
    const statuses = ref([]);
    const users = ref([]);
    const newStatus = ref({ status_name: "", user: null });
    const newTask = ref({
        task_name: "",projects:"",description:"",documents:null,end_date:"",
        agreed_with_managers: false,assigned:null,status:2,priority: 3,department: 1
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

    function ondragstart(e, task) {
        e.dataTransfer.dropEffect = "move";
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("taskID", task.id.toString());
        console.log("Начало перетаскивания:", task);
    }

    async function onDrop(e, statusId) {
        e.preventDefault();
        const taskID = parseInt(e.dataTransfer.getData("taskID"));

        try {
            await updateTaskStatus(taskID, statusId);
            const task = tasks.value.find(t => t.id === taskID);
            if (task) {
                task.status = statusId;
            }
        } catch (error) {
            console.error("Ошибка при обновлении задачи:", error);
        }
    }
//Формат дата именено от django формат даты на день месяц и время
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString("ru-RU", { day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" });
    }

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


    onMounted(async () => {
        tasks.value = await getTask();
        statuses.value = await getStatusTask();
        users.value = await getUsers();
        console.log("Данные загружены", statuses.value);
    });

    return {
        tasks,
        statuses,
        users,
        newStatus,
        priority,
        handleClick,
        handleClickTask,
        ondragstart,
        onDrop,
        formatDate,
        submitColumn,
    };
}


