import axios from "axios";


const API_URL_USERS = "http://127.0.0.1:8000/users/users";
// const API_REGISTER = "http://127.0.0.1:8000/users/register";
// const API_LOGIN = "http://127.0.0.1:8000/users/login";
// const API_LOGOUT = "http://127.0.0.1:8000/users/logout";

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