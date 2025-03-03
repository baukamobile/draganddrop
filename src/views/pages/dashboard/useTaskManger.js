import { ref, onMounted } from "vue";
import { getTask, getStatusTask, updateTaskStatus, addColumn, getUsers } from "@/api/tasks";
import axios from "axios";


export default {
  data() {
    return {
      tasks: [
        { name: "", description: "", start_date: "", end_date: "", approved: false, user: null, priority: null },
        { name: "", description: "", start_date: "", end_date: "", approved: false, user: null, priority: null }
      ],
      showTaskForm: {}
    };
  },
  methods: {
    toggleTaskForm(index) {
      this.$set(this.showTaskForm, index, !this.showTaskForm[index]);
    }
  }
}; 

export function useTaskManager() {
    const tasks = ref([]);
    const statuses = ref([]);
    const users = ref([]);
    const newStatus = ref({ status_name: "", user: null });
    

    const priority = {
        1: { priority_name: "НИЗКИЙ", color: "green" },
        2: { priority_name: "СРЕДНИЙ", color: "blue" },
        3: { priority_name: "ВЫСОКИЙ", color: "orange" },
        4: { priority_name: "КРИТИЧЕСКИЙ", color: "red" },
    };

    const handleClick = async (statusId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/tasks/status/${statusId}/`);
            statuses.value = statuses.value.filter(status => status.id !== statusId);
        } catch (error) {
            console.error("Ошибка удаления колонки", error);
        }
    };

    const handleClickTask = async (taskID) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/tasks/tasks/${taskID}/`);
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


