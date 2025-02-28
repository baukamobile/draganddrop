// import { ref, onMounted } from "vue";
// // import { fetchTasks, fetchStatuses, updateTaskStatus } from "@/api/taskApi";
// import { fetchTasks,fetchStatuses,updateTaskStatus } from "@/api/tasks";

// export function useTaskManager() {
//   const tasks = ref([]);
//   const statuses = ref([]);

//   onMounted(async () => {
//     tasks.value = await fetchTasks();
//     statuses.value = await fetchStatuses();
//   });

//   function ondragstart(e, task) {
//     e.dataTransfer.effectAllowed = "move";
//     e.dataTransfer.setData("taskID", task.id.toString());
//   }

//   async function onDrop(e, statusId) {
//     e.preventDefault();
//     const taskID = parseInt(e.dataTransfer.getData("taskID"));

//     try {
//       await updateTaskStatus(taskID, statusId);
//       const task = tasks.value.find((t) => t.id === taskID);
//       if (task) task.status = statusId;
//     } catch (error) {
//       console.error("Ошибка обновления задачи:", error);
//     }
//   }

//   return { tasks, statuses, ondragstart, onDrop };
// }
