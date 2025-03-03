<script setup>
import { ref } from "vue";
import TaskItem from "./TaskItem.vue";
import DeleteButton from "./DeleteButton.vue";
import { deleteStatus } from "@/api/tasks";

const props = defineProps(["status", "tasks"]);
const emit = defineEmits(["updateTasks"]);

const handleDeleteStatus = async () => {
  await deleteStatus(props.status.id);
  emit("updateTasks", props.tasks.filter(task => task.status !== props.status.id));
};
</script>

<template>
  <div class="droppable">
    <div class="status">
      <h1 class="status-name">{{ status.status_name }}</h1>
      <DeleteButton @click="handleDeleteStatus" text="Удалить колонку" />
    </div>

    <TaskItem
      v-for="task in tasks"
      :key="task.id"
      :task="task"
      @deleteTask="(id) => emit('updateTasks', tasks.filter(t => t.id !== id))"
    />

    <div class="add-task-container">
      <a href="#" class="add-task">Добавить Задачу</a>
    </div>
  </div>
</template>

<style scoped>

@import url('/src/views/pages/dashboard/styles/task-column.css');

</style>
