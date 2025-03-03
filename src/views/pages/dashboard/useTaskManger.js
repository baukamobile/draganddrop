import axios from "axios";

const API_URL = "http://127.0.0.1:8000/tasks";

export async function getTask() {
  const response = await axios.get(`${API_URL}/tasks/`);
  return response.data;
}

export async function getStatusTask() {
  const response = await axios.get(`${API_URL}/status/`);
  return response.data;
}

export async function deleteTask(taskID) {
  await axios.delete(`${API_URL}/tasks/${taskID}/`);
}

export async function deleteStatus(statusId) {
  await axios.delete(`${API_URL}/status/${statusId}/`);
}

export async function updateTaskStatus(taskID, statusId) {
  await axios.patch(`${API_URL}/tasks/${taskID}/`, { status: statusId });
}
