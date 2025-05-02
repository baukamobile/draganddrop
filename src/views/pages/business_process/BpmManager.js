import { ref, onMounted } from "vue";
import { getTask, getStatusTask, updateTaskStatus, addColumn,addTask } from "@/api/tasks";
import {getUsers} from "@/api/users";
import axios from "axios";
import { reactive } from "vue";
import { getBpmTask, getProcess, getProcessStage } from "@/api/bpm_data";
const API_URL_DEPARTMENT = import.meta.env.VITE_API_DEPARTMENT;
const API_BPM_PROCESS = import.meta.env.VITE_API_PROCESS;
const API_BPM_DASHBOARD_WIDGET = import.meta.env.VITE_API_DASHBOARD;
const API_BPM_DASHBOARDS = import.meta.env.API_BPM_DASHBOARDS;
const API_BPM_ATTACHMENT = import.meta.env.VITE_API_ATTACHMENT;
const API_BPM_PROCESS_STAGE =import.meta.env.VITE_API_PROCESS_STAGE
const API_BPM_TASK =import.meta.env.VITE_API_BPM_TASK
const API_BPMNXML_PROCESS = import.meta.env.VITE_API_BPMNXML_PROCESS;
export const getProject = async () => {
    try {
        const response = await axios.get(`${API_BPM_PROCESS}`);
        console.log('Загрука процессов')
        return response.data;
    } catch (error) {
        console.error(`Ошибка при получении процессов:`, error);
        return null;
    }
};
export const getDepartment = async () => {
    try{
        const response = await axios.get(`${API_URL_DEPARTMENT}/`);
        console.log('Полученные отделы:', response.data);

        return response.data;
    }catch(e){
        console.error('Ошибка при получении отделов:', e);
        return null;
    }
}
export function useTaskManager() {
    const bpm_tasks = ref([]);
    const processes = ref({
        id: null,
        name: "",
        description: "",
        created_at: "",
        updated_at: "",
        is_completed: false,
        is_recurring: false,
        recurring_interval: null,
        template: null,
        owner: null,
        department: null,
        // bpmn_xml: null,
    });
    const department = ref([]);
    const users = ref([]);
    const newProcessStage = ref({ 
    // id: 2,
    name: "",
    description: "",
    order: null,
    is_required: true,
    completion_criteria: "",
    sla_hours: null,
    is_custom: false,
    is_key_stage: false,
    process: null,
    template_stage: null
});
const process_stages = ref([]);
    const newTask = reactive({
            // "id": 1,
            title: "",
            description: "",
            status: 1,
            priority: 1,
            due_date: null,
            created_at: "",
            updated_at: "",
            process: 1,
            current_stage: 1,
            assigned_to: 17,
            created_by: null,
            parent_task: null,
            // bpmn_xml: null,
    });
    
    const handleClick = async (process_stage_id) => {
        try {
            await axios.delete(`${API_BPM_PROCESS_STAGE}${process_stage_id}/`);
            console.log('Удаление колонок')
            process_stages.value = process_stages.value.filter(process_stage => process_stage.id !== process_stage_id);
        } catch (error) {
            console.error("Ошибка удаления колонки", error);
        }
    };
//Удаление Задач
    const handleClickTask = async (bpm_taskID) => {
        try {
            await axios.delete(`${API_BPM_TASK}${taskID}`);
            bpm_tasks.value = bpm_tasks.value.filter(bpm_task => bpm_task.id !== bpm_taskID);
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

    function ondragstart(e, bpm_task) {
        console.log('Перетаскивание задач')
        e.dataTransfer.dropEffect = "move"; //Визуальный эффект перетаскивании
        e.dataTransfer.effectAllowed = "move"; // разрешено только перемещение
        e.dataTransfer.setData("taskID", bpm_task.id.toString()); // Передаем ID задачи.
        // console.log("Начало перетаскивания:", task);
    }
    /**
 * Обработчик события "drop" — обновляет статус задачи при перетаскивании.
 *
 * @param {DragEvent} e - Объект события перетаскивания.
 * @param {number} process_stage_id - ID нового статуса, в который перетащили задачу.
 */
    async function onDrop(e, process_stage_id) {
        e.preventDefault(); // Отменяем стандартное поведение браузера.
        const bpm_taskID = parseInt(e.dataTransfer.getData("taskID")); // Получаем ID задачи.
        try {
            await updateTaskStatus(bpm_taskID, process_stage_id); // Обновляем статус задачи на сервере.
            const task = bpm_tasks.value.find(t => t.id === bpm_taskID); // Находим задачу в локальном списке.
            if (task) {
                task.process_stage = process_stage_id; // Обновляем статус у клиента.
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
// console.log(" Тип end_date:", typeof newTask.created_at);
            if (!newProcessStage.value.process) {
                newProcessStage.value.process = 1;
                console.error("Ошибка: process не выбран!",newProcessStage.value.process);
                return;
            }
            await addColumn(newProcessStage.value);
            newProcessStage.value.status_name = "";
            newProcessStage.value.process = null;
            process_stages.value = await getProcessStage();
        } catch (error) {
            console.error("Ошибка при добавлении колонки", error);
        }
    };
    const submitTask = async () => {
        try {
            console.log("Перед отправкой:", JSON.stringify(newTask, null, 2));
            newTask.due_date = formatDateForBackend(newTask.due_date);
    
            if (!newTask || !newTask.title?.trim()) {
                console.error("Ошибка: Задание должно быть заполненным");
                return;
            }
            if (!newTask.process) {
                alert("Выберите процесс");
                return;
            }
            console.log("Попытка отправки запроса...", JSON.stringify(newTask, null, 2));
            // Отправляем данные
            // const response = await axios.post(`${API_URL}/`, newTask);
            // console.log("Ответ сервера:", response.data);
    
            // Обновляем список задач
            bpm_tasks.value.length = 0; 
            bpm_tasks.value.push(...await getBpmTask());
    
            console.log("НОВАЯ ЗАДАЧА", bpm_tasks.value);
    
            // Очищаем форму после успешной отправки
            Object.assign(newTask, {
                title: "",
    description: "",
    status: "",
    priority: "",
    due_date: "",
    created_at: "",
    updated_at: "",
    process: null,
    current_stage: null,
    assigned_to: null,
    created_by: null,
    parent_task: null,
    bpmn_xml: null,
            });
    
        } catch (error) {
            console.error("Ошибка при добавлении задания", error);
        }
    };
    const editTask = (task) =>{
        newTask.value = {...task}; //скопируем весь объект
        newTask.title = task.title;
        newTask.description = task.description;
        newTask.status = task.status;
        newTask.priority = task.priority;
        newTask.due_date = task.due_date;
        newTask.created_at = task.created_at;
        newTask.updated_at = task.updated_at;
        newTask.process = task.process;
        newTask.current_stage = task.current_stage;
        newTask.assigned_to = task.assigned_to;
        newTask.created_by = task.created_by;
        newTask.parent_task = task.parent_task;
        // newTask.bpmn_xml = task.bpm_task;

        showTaskForm.value = {...showTaskForm.value,[task.current_stage]: true};

    };
    const updateTask = async() => {
        try {
            if (!newTask.value.id) {
                console.error("Нет ID задачи для обновления");
                return;
            }
            console.log("Отправка обновления задачи:", JSON.stringify(newTask.value, null, 2));
            const response = await axios.patch(`${API_URL}/${newTask.value.id}/`, newTask.value);
            console.log("Ответ сервера:", response.data);
            // Обновляем список задач после обновления
            tasks.value = await getTask();
            showTaskForm.value = {...showTaskForm.value,[task.status]: true};
    
        } catch (error) {
            console.error("Ошибка при обновлении задачи", error);
        }
    } 
function onColumnDrag(e, status){
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("statusID",status.id.toString());
    console.log('Перетаскивание колонок: ', status);
}
//обработчик дроп события для колонок
const onColumnDrop = (event, targetStatus) => {
    const draggedStatusId = event.dataTransfer.getData('statusId');
    
    if (draggedStatusId && draggedStatusId !== targetStatus.id) {
        // Логика для перестановки колонок
        const draggedIndex = statuses.findIndex(s => s.id == draggedStatusId);
        const targetIndex = statuses.findIndex(s => s.id == targetStatus.id);

        if (draggedIndex !== -1 && targetIndex !== -1) {
            const draggedStatus = statuses[draggedIndex];
            statuses.splice(draggedIndex, 1);
            statuses.splice(targetIndex, 0, draggedStatus);
        }
    }
};
function onColumnDragOver(e){//размешаем сбрасываьт колонку
    e.preventDefault();
}
// onmounted грузит три запроса подряд  завернули в Promise.all(), чтобы грузилось параллельно:
onMounted(async () => { //Код внутри выполняется, когда компонент уже вставлен в DOM.
    try {
        const [taskData, ProcessStageData, userData, processData,departmentData] = await Promise.allSettled([ //Мы используем Promise.allSettled() вместо Promise.all().
            //Разница: Promise.allSettled() не прерывает выполнение при ошибке, а возвращает массив с объектами-результатами каждого запроса.
            getBpmTask(),
            getProcessStage(),
            getUsers(),
            getProcess(),
            getDepartment(),
        ]);

        if (taskData.status === "fulfilled") bpm_tasks.value = taskData.value;
        if (ProcessStageData.status === "fulfilled") process_stages.value = ProcessStageData.value;
        if (userData.status === "fulfilled") users.value = userData.value;
        if (processData.status === "fulfilled") processes.value = processData.value;
        if (departmentData.status === "fulfilled") department.value = departmentData.value;
        console.log("Данные загружены:", { tasks: bpm_tasks.value, process_stages: process_stages.value, users: users.value, processes: processes.value });

    } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
    }
});
    return {
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
    };
}

