<script setup>
import DeleteButton from "./DeleteButton.vue";
import { deleteTask } from "@/api/tasks";

const props = defineProps(["task"]);
const emit = defineEmits(["deleteTask"]);

const handleDeleteTask = async () => {
  await deleteTask(props.task.id);
  emit("deleteTask", props.task.id);
};

const priority = {
  1: { priority_name: "НИЗКИЙ", color: "green" },
  2: { priority_name: "СРЕДНИЙ", color: "blue" },
  3: { priority_name: "ВЫСОКИЙ", color: "orange" },
  4: { priority_name: "КРИТИЧЕСКИЙ", color: "red" },
};
</script>

<template>
  <div class="draggable">
    <p>
      {{ task.task_name }}
      <span :style="{ color: priority[task.priority]?.color }">
        ({{ priority[task.priority]?.priority_name || "Неизвестный" }})
      </span>
    </p>
    <DeleteButton @click="handleDeleteTask" text="Удалить" />
  </div>
</template>

<style scoped>
/* @import "/styles/task-item.css"; */
@import url('/src/views/pages/dashboard/styles/task-item.css');
</style>
