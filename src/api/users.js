import axios from "axios";


const API_URL_USERS = import.meta.env.VITE_API_URL_USERS;

export const getTask = async()=>{
    const response = await axios.get(`${API_URL_USERS}/`)
    return response.data
};
export const getUsers = async()=>{
    const response = await axios.get(`${API_URL_USERS}/`); 
    return response.data;
}

export async function updateTaskStatus(taskId, statusId) {
    const response = await axios.patch(`${API_URL_TASK}/${taskId}/`, { status: statusId }); // 👈 Меняем `statusesId` на `status`
    return response.data;
}

export async function addUser(userData) {
    // try {
    //     const response = await axios.post(`${API_URL_TASK}/`, taskData, {
    //         headers: {
    //             "Content-Type": "application/json"
    //         }
    //     });
    //     return response.data;
    // } catch (error) {
    //     console.error("Ошибка при отправке задачи:", error.response ? error.response.data : error.message);
    // }
    const response = await axios.post(`${API_URL_USERS}/`,userData);
    return response.data;
}